from django.shortcuts import render

from exchange.models import SUBACTIVITIES, Order


# Create your views here.
def orders_list(request):
    orders = Order.objects.all().select_related("user").prefetch_related("tags")
    subactivities = SUBACTIVITIES  # Данные для фильтрации

    context = {
        "orders": orders,
        "subactivities": subactivities,
    }
    return render(request, "exchange/orders.html", context)
