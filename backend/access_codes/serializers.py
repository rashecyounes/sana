from rest_framework import serializers
from .models import AccessCode


class AccessCodeSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    used_by_name = serializers.CharField(
    source="used_by.username",
    read_only=True,
    )

    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True,
    )

    class Meta:
        model = AccessCode
        fields = [
            "id",
            "code",
            "course",
            "course_title",
            "is_used",
            "is_active",
            "used_by",
            "used_by_name",
            "created_by",
            "created_by_name",
            "used_at",
            "expires_at",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "code",
            "is_used",
            "used_by",
            "created_by",
            "created_by_name",
            "used_at",
            "created_at",
        ]


class GenerateAccessCodesSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    count = serializers.IntegerField(
        min_value=1,
        max_value=500,
    )
    expires_at = serializers.DateTimeField(
        required=False,
        allow_null=True,
    )
class RedeemAccessCodeSerializer(serializers.Serializer):
    code = serializers.CharField(
        max_length=8,
        min_length=8,
    )