from django.contrib import admin
from django.urls import path, include

from exchange.views import orders_list

urlpatterns = [
    path('orders/', orders_list,name='orders_list'),
]