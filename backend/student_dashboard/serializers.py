from rest_framework import serializers
from django.contrib.auth import get_user_model
from enrollments.models import CourseEnrollment

User = get_user_model()


class StudentProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "bio",
            "profile_image",
            "profile_image_url",
        ]
        read_only_fields = ["id"]

    def get_profile_image_url(self, obj):
        request = self.context.get("request")

        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url

        return None


class StudentOverviewSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "bio",
            "profile_image_url",
            "courses_count",
        ]

    def get_profile_image_url(self, obj):
        request = self.context.get("request")

        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url

        return None

    def get_courses_count(self, obj):
        return CourseEnrollment.objects.filter(
            student=obj,
            is_active=True,
        ).count()