from rest_framework import serializers
from .models import Course, CourseResource


class CourseResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = CourseResource
        fields = [
            "id",
            "title",
            "file",
            "description",
            "uploaded_by",
            "uploaded_by_name",
            "created_at",
        ]

        read_only_fields = [
            "uploaded_by",
            "uploaded_by_name",
            "created_at",
        ]

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return obj.uploaded_by.username

        return None


class CourseSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )

    teacher_name = serializers.SerializerMethodField()

    has_access = serializers.SerializerMethodField()

    resources = CourseResourceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
            "created_by",
            "title",
            "description",
            "image",
            "price",
            "is_published",
            "resources",
            "created_at",
            "updated_at",
            "has_access",
        ]

        read_only_fields = [
            "created_by",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}".strip()
    
    def get_has_access(self, obj):
        request = self.context.get("request")

        if not request:
            return False

        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.role in ["admin", "teacher"]:
            return True

        return obj.enrollments.filter(
            student=user,
            is_active=True,
        ).exists()