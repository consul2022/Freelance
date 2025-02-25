from django.shortcuts import render, redirect

from exchange.models import SUBACTIVITIES, Order, Response, User


# Create your views here.
def orders_list(request):
    orders = Order.objects.all().select_related("user").prefetch_related("tags")
    subactivities = SUBACTIVITIES  # Данные для фильтрации

    context = {
        "orders": orders,
        "subactivities": subactivities,
    }
    return render(request, "exchange/orders.html", context)


def show_orders(request,id):
    id = int(id)
    order = Order.objects.get(id=id)
    order.views +=1
    order.save(update_fields=["views"])
    context = {
        "order": order,
    }
    return render(request, "exchange/show_orders.html", context)

def save_response(request,id):
    id = int(id)
    order = Order.objects.get(id=id)
    response_message = request.POST.get("response_message")
    tg_id = int(request.POST.get("user_id"))
    user = User.objects.get(tg_id = tg_id)
    response = Response(order=order, user=user, message=response_message)
    response.save()
    return redirect("show_orders", id=id)


def create_office(request):
    return render(request, "exchange/office.html")

