from rest_framework import serializers
from .models import Purchase


class PurchaseSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "course",
            "course_title",
            "amount",
            "status",
            "provider",
            "provider_reference",
            "completed_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "amount",
            "status",
            "provider",
            "provider_reference",
            "completed_at",
            "created_at",
            "updated_at",
        ]


class CreatePurchaseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()