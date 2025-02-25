from django.contrib import admin
from django.urls import path, include

from exchange.views import orders_list, show_orders, save_response, create_office

urlpatterns = [
    path('orders/', orders_list,name='orders_list'),
    path('order/<int:id>/', show_orders, name='show_orders'),
    path('order/<int:id>/response/', save_response , name='save_response'),
    path('office/', create_office, name = 'create_office')
]