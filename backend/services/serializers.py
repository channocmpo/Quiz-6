from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    seller_email = serializers.EmailField(source="seller.email", read_only=True)
    seller_merchant_id = serializers.CharField(source="seller.merchant_id", read_only=True)
    name_of_the_expert = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id",
            "seller",
            "seller_email",
            "service_name",
            "description",
            "price",
            "duration_of_service",
            "sample_image",
            "seller_merchant_id",
            "name_of_the_expert",
            "rating",
        ]
        read_only_fields = ["seller"]

    def get_name_of_the_expert(self, obj):
        return f"{obj.seller.first_name} {obj.seller.last_name}".strip() or obj.seller.username

    def get_rating(self, _obj):
        return 5.0
