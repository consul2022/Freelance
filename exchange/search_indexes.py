from django_elasticsearch_dsl import fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import Document


@registry.register_document
class OrderDocument(Document):
    tags = fields.NestedField(
        properties={
            'name': fields.KeywordField(),
        }
    )
    class Index:
        name = 'orders'
        settings = {
            'number_of_shards': 3,
            'number_of_replicas': 1
        }

    class Django:
        model = 'exchange.Order'
        fields = ['name', 'description', 'price', 'activity', 'subactivity']
        search_fields = ['name', 'description']
        related_models = ['exchange.Tags']
