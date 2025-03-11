from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Tags, Order, Response, Activity, SUBACTIVITIES


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "tg_id", "first_name", "last_name")
    search_fields = ("username", "tg_id")
    ordering = ("id",)



@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("id",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "user",
        "price",
        "activity",
        "subactivity",
        "views",
        "tag_list",
    )
    search_fields = ("name", "description", "user__username")
    list_filter = ("activity", "subactivity")
    ordering = ("-created_at",)

    def tag_list(self, obj):
        return ", ".join(tag.name for tag in obj.tags.all())
    tag_list.short_description = "Теги"

    fieldsets = (
        ("Основная информация", {"fields": ("name", "description", "user", "tags")}),
        ("Детали заказа", {"fields": ("price", "activity", "subactivity")}),
        ("Статистика", {"fields": ("views",)}),
    )
    readonly_fieldsets = ("created_at",)

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "user", "message", "create_date")
    search_fields = ("order__name", "user__username", "message")
    list_filter = ("create_date",)
    ordering = ("-create_date",)

    fieldsets = (
        ("Основные данные", {"fields": ("order", "user", "message")}),
        ("Дополнительная информация", {"fields": ("create_date",)}),
    )


# Автоматическое добавление подкатегорий при выборе категории
class OrderAdminForm(admin.ModelAdmin):
    def formfield_for_choice_field(self, db_field, request, **kwargs):
        if db_field.name == "subactivity":
            activity = request.GET.get("activity")
            if activity in SUBACTIVITIES:
                kwargs["choices"] = SUBACTIVITIES[activity]
        return super().formfield_for_choice_field(db_field, request, **kwargs)


# Регистрация моделей в админке Django
admin.site.site_header = "Администрирование Биржи"
admin.site.site_title = "Биржа Фриланса"
admin.site.index_title = "Панель управления"
