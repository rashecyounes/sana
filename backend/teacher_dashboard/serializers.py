from rest_framework import serializers
from courses.models import Course
from lessons.models import Lesson
from rest_framework import serializers
from users.models import User
class TeacherCourseSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.username", read_only=True)

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
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "teacher",
            "teacher_name",
            "created_by",
            "created_at",
            "updated_at",
        ]
class TeacherLessonSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "course_title",
            "title",
            "description",
            "video_provider",
            "video_asset_id",
            "video_playback_id",
            "thumbnail",
            "order",
            "duration",
            "is_preview",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "video_asset_id",
            "video_playback_id",
            "created_at",
            "updated_at",
        ]

    def validate_course(self, course):
        request = self.context.get("request")

        if course.teacher != request.user:
            raise serializers.ValidationError(
                "You can only manage lessons for your own courses."
            )

        return course
class TeacherProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "first_name",
            "last_name",
            "profile_image",
            "profile_image_url",
            "bio",
            "city",
            "school_name",
        ]
        read_only_fields = ["id", "username", "profile_image_url"]

    def get_profile_image_url(self, obj):
        request = self.context.get("request")

        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)

        return None


class TeacherChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return data