from django.contrib import admin
from django.urls import path, include

from exchange.views import orders_list, show_orders, save_response, create_office, user_orders, create_order, \
    delete_order, order_activities, edit_order, user_response

urlpatterns = [
    path('orders/', orders_list, name='orders_list'),
    path('order/<int:id>/', show_orders, name='show_orders'),
    path('order/<int:id>/response/', save_response, name='save_response'),
    path('office/', create_office, name='create_office'),
    path('user/orders/<int:tg_id>/', user_orders, name='user_orders'),
    path('order/create/', create_order, name='create_order'),
    path('user/orders/delete/<int:order_id>/', delete_order, name='delete_order'),
    path('order/activities/', order_activities, name='order_activities'),
    path('order/edit/<int:order_id>/', edit_order, name='edit_order'),
    path('user/responses/<int:tg_id>/', user_response, name='user_response')

]
