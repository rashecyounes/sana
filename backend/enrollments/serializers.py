from rest_framework import serializers
from .models import CourseEnrollment


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    course_description = serializers.CharField(
        source="course.description",
        read_only=True,
    )

    course_image = serializers.ImageField(
        source="course.image",
        read_only=True,
    )

    course_price = serializers.DecimalField(
        source="course.price",
        max_digits=8,
        decimal_places=2,
        read_only=True,
    )

    subject_name = serializers.CharField(
        source="course.subject.name",
        read_only=True,
    )

    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = CourseEnrollment
        fields = [
            "id",
            "course",
            "course_title",
            "course_description",
            "course_image",
            "course_price",
            "subject_name",
            "teacher_name",
            "source",
            "is_active",
            "created_at",
        ]

    def get_teacher_name(self, obj):
        teacher = obj.course.teacher
        full_name = f"{teacher.first_name} {teacher.last_name}".strip()
        return full_name or teacher.username