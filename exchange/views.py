import os

import requests
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from dotenv import load_dotenv

from exchange.models import SUBACTIVITIES, Order, Response, User, Tags

load_dotenv()


def sent_notifications(chat_id, text):
    data = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    requests.get(f"https://api.telegram.org/bot{os.getenv('BOT_TOKEN')}/sendMessage", params=data)


# Create your views here.
def orders_list(request):
    orders = Order.objects.all().select_related("user").prefetch_related("tags").order_by("-created_at")
    subactivities = SUBACTIVITIES  # Данные для фильтрации

    context = {
        "orders": orders,
        "subactivities": subactivities,
    }
    return render(request, "exchange/orders.html", context)


def show_orders(request, id):
    id = int(id)
    order = Order.objects.get(id=id)
    order.views += 1
    order.save(update_fields=["views"])
    context = {
        "order": order,
    }
    return render(request, "exchange/show_orders.html", context)



def save_response(request, id):
    id = int(id)
    order = Order.objects.get(id=id)
    response_message = request.POST.get("response_message")
    tg_id = int(request.POST.get("user_id"))
    user = User.objects.get(tg_id=tg_id)
    response = Response(order=order, user=user, message=response_message)
    response.save()
    text = (f"Вы получили новый отклик к заказу <b>{order.name}<b> от <a href='tg://user?id={user.tg_id}>{user.first_name} {user.last_name}</a> с сообщением\n\n"
            f"<i>{response_message}</i>")
    sent_notifications(order.user.tg_id, text)
    return redirect("show_orders", id=id)



@ensure_csrf_cookie
def create_office(request):
    return render(request, "exchange/office.html")


def user_orders(request, tg_id):
    user = get_object_or_404(User, tg_id=tg_id)
    orders = Order.objects.filter(user=user).annotate(response_count=Count("response")).prefetch_related(
        "tags").order_by("-created_at")
    orders_data = [
        {
            "id": order.id,
            "name": order.name,
            "price": order.price,
            "description": order.description,
            "created_at": order.created_at.strftime("%d.%m.%Y %H:%M"),
            "response_count": order.response_count,
            "tags": list(order.tags.values_list("name", flat=True)),
        }
        for order in orders
    ]
    return JsonResponse({"orders": orders_data}, safe=False)


def create_order(request):
    if request.method == "GET":
        tags = Tags.objects.all()

        context = {
            "tags": tags,
        }
        return render(request, "exchange/create_order.html", context)
    if request.method == "POST":
        tg_id = int(request.POST.get("user_id"))
        user = get_object_or_404(User, tg_id=tg_id)
        name = request.POST.get("name")
        price = float(request.POST.get("price"))
        description = request.POST.get("description")
        activity = request.POST.get("activity")
        subactivity = request.POST.get("subactivity")
        tags = request.POST.get("tags").split(",")
        print(tags)

        order = Order(name=name, price=price, description=description, user=user, activity=activity,
                      subactivity=subactivity)
        order.save()
        for tag_name in tags:
            tag = get_object_or_404(Tags, name=tag_name)
            order.tags.add(tag)
        order.save()

        return render(request, "exchange/office.html")


def delete_order(request, order_id):
    if request.method == "DELETE":
        order = Order.objects.get(id=order_id)
        order.delete()
        return JsonResponse({"result": "Заказ удален"}, safe=False)


def order_activities(request):
    data = {}
    for activity, subactivities in SUBACTIVITIES.items():
        data[activity] = {
            "name": activity,
            "subactivities": [{"label": subactivity[0], "name": subactivity[1]} for subactivity in subactivities],
        }
    return JsonResponse(data, safe=False)


def edit_order(request, order_id):
    order = Order.objects.get(id=order_id)
    if request.method == "GET":
        tags = Tags.objects.all()
        return render(request, "exchange/edit_order.html", {"order": order, "tags": tags})

    if request.method == "POST":
        name = request.POST.get("name")
        price = float(request.POST.get("price"))
        description = request.POST.get("description")
        activity = request.POST.get("activity")
        subactivity = request.POST.get("subactivity")
        tags = request.POST.get("tags").split(",")

        order.name = name
        order.price = price
        order.description = description
        order.activity = activity
        order.subactivity = subactivity
        order.save()

        order.tags.clear()
        for tag_name in tags:
            tag = get_object_or_404(Tags, name=tag_name)
            order.tags.add(tag)
        order.save()

        return redirect("create_office")
