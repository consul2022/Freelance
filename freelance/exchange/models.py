from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    tg_id = models.BigIntegerField(unique=True, null=False)

    def __str__(self):
        return f"{self.username}"


class Tags(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.name}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    create_date = models.DateField(auto_now_add=True)
    views = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tags, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}"


class Response(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1000)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.name} - {self.user.username}"
