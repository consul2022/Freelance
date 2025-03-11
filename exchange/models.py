from django.contrib.auth.models import AbstractUser
from django.db import models


class Activity(models.TextChoices):
    DEVELOPMENT = "development", "Разработка"
    TESTING = "testing", "Тестирование"
    ADMINISTRATION = "administration", "Администрирование"
    DESIGN = "design", "Дизайн"
    CONTENT = "content", "Контент"
    MARKETING = "marketing", "Маркетинг"
    OTHER = "other", "Разное"


SUBACTIVITIES = {
    Activity.DEVELOPMENT: [
        ("development_all_inclusive", "Сайты «под ключ»"),
        ("development_backend", "Бэкенд"),
        ("development_frontend", "Фронтенд"),
        ("development_prototyping", "Прототипирование"),
        ("development_ios", "iOS"),
        ("development_android", "Android"),
        ("development_desktop", "Десктопное ПО"),
        ("development_bots", "Боты и парсинг данных"),
        ("development_games", "Разработка игр"),
        ("development_1c_dev", "1С-программирование"),
        ("development_scripts", "Скрипты и плагины"),
        ("development_voice_interfaces", "Голосовые интерфейсы"),
        ("development_other", "Разное"),
    ],
    Activity.TESTING: [
        ("testing_sites", "Сайты"),
        ("testing_mobile", "Мобайл"),
        ("testing_software", "Софт"),
    ],
    Activity.ADMINISTRATION: [
        ("admin_servers", "Серверы"),
        ("admin_network", "Компьютерные сети"),
        ("admin_databases", "Базы данных"),
        ("admin_security", "Защита ПО и безопасность"),
        ("admin_other", "Разное"),
    ],
    Activity.DESIGN: [
        ("design_sites", "Сайты"),
        ("design_landings", "Лендинги"),
        ("design_logos", "Логотипы"),
        ("design_illustrations", "Рисунки и иллюстрации"),
        ("design_mobile", "Мобильные приложения"),
        ("design_icons", "Иконки"),
        ("design_polygraphy", "Полиграфия"),
        ("design_banners", "Баннеры"),
        ("design_graphics", "Векторная графика"),
        ("design_corporate_identity", "Фирменный стиль"),
        ("design_presentations", "Презентации"),
        ("design_modeling", "3D"),
        ("design_animation", "Анимация"),
        ("design_photo", "Обработка фото"),
        ("design_other", "Разное"),
    ],
    Activity.CONTENT: [
        ("content_copywriting", "Копирайтинг"),
        ("content_rewriting", "Рерайтинг"),
        ("content_audio", "Расшифровка аудио и видео"),
        ("content_article", "Статьи и новости"),
        ("content_scenarios", "Сценарии"),
        ("content_naming", "Нейминг и слоганы"),
        ("content_correction", "Редактура и корректура"),
        ("content_translations", "Переводы"),
        ("content_coursework", "Рефераты, дипломы, курсовые"),
        ("content_specification", "Техническая документация"),
        ("content_management", "Контент-менеджмент"),
        ("content_other", "Разное"),
    ],
    Activity.MARKETING: [
        ("marketing_smm", "SMM"),
        ("marketing_seo", "SEO"),
        ("marketing_context", "Контекстная реклама"),
        ("marketing_email", "E-mail маркетинг"),
        ("marketing_research", "Исследования рынка и опросы"),
        ("marketing_sales", "Продажи и генерация лидов"),
        ("marketing_pr", "PR-менеджмент"),
        ("marketing_other", "Разное"),
    ],
    Activity.OTHER: [
        ("other_audit_analytics", "Аудит и аналитика"),
        ("other_consulting", "Консалтинг"),
        ("other_jurisprudence", "Юриспруденция"),
        ("other_accounting", "Бухгалтерские услуги"),
        ("other_audio", "Аудио"),
        ("other_video", "Видео"),
        ("other_engineering", "Инженерия"),
        ("other_other", "Разное"),
    ],
}


class User(models.Model):
    tg_id = models.BigIntegerField(unique=True, null=False)
    username = models.CharField(max_length=100, null=True)
    first_name = models.CharField(null=True)
    last_name = models.CharField(null=True)

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
    price = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    views = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tags)

    activity = models.CharField(
        max_length=50,
        choices=Activity.choices,
        default=Activity.DEVELOPMENT
    )

    subactivity = models.CharField(
        max_length=50,
        choices=[],
        blank=True
    )
    @property
    def response(self):
        return self.response_set.count()

    def save(self, *args, **kwargs):
        if self.activity in SUBACTIVITIES:
            valid_subactivities = [item[0] for item in SUBACTIVITIES[self.activity]]
            if self.subactivity not in valid_subactivities:
                self.subactivity = valid_subactivities[0]  # выбираем первую доступную
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.activity} - {self.subactivity})"


class Response(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1000)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.name} - {self.user.username}"
