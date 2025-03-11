from django.apps import AppConfig


class ExchangeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'exchange'
    def ready(self):
        from elasticsearch_dsl.connections import connections
        connections.create_connection(hosts=['http://localhost:9200'])




