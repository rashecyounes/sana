from rest_framework import serializers
from subjects.models import Subject
from users.models import User
from courses.models import Course
from lessons.models import Lesson
from purchases.models import Purchase
from enrollments.models import CourseEnrollment
from security.models import Device, UserSession, VideoSession
class AdminSubjectOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "slug",
            "image",
        ]


class AdminTeacherOptionSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
        ]

    def get_full_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.username
class AdminCourseOptionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
            "is_published",
        ]

    def get_teacher_name(self, obj):
        if not obj.teacher:
            return None

        full_name = f"{obj.teacher.first_name} {obj.teacher.last_name}".strip()
        return full_name or obj.teacher.username


class AdminLessonSerializer(serializers.ModelSerializer):
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
            "is_drm_protected",
            "drm_configuration_id",
            "drm_license_type",
            "thumbnail",
            "order",
            "duration",
            "is_preview",
            "is_published",
            "created_at",
            "updated_at",
        ]
class AdminPurchaseSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(source="student.email", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "student",
            "student_name",
            "student_email",
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

    def get_student_name(self, obj):
        full_name = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full_name or obj.student.username
class AdminEnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(source="student.email", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    source_display = serializers.CharField(source="get_source_display", read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = [
            "id",
            "student",
            "student_name",
            "student_email",
            "course",
            "course_title",
            "source",
            "source_display",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        full_name = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full_name or obj.student.username
class AdminStudentOptionSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
        ]

    def get_full_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.username
class AdminCreateEnrollmentSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    course_id = serializers.IntegerField()
    source = serializers.ChoiceField(
        choices=[
            CourseEnrollment.Source.ADMIN_GRANT,
            CourseEnrollment.Source.FREE,
        ]
    )
class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "profile_image",
            "bio",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.username


class AdminUpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "bio",
            "is_active",
        ]

    def validate_role(self, value):
        allowed_roles = ["student", "teacher", "admin"]

        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid user role.")

        return value
class AdminDeviceSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = Device
        fields = [
            "id",
            "user",
            "user_name",
            "user_email",
            "user_role",
            "device_id",
            "device_name",
            "ip_address",
            "user_agent",
            "is_active",
            "created_at",
            "last_login_at",
        ]

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.username


class AdminUserSessionSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source="user.email", read_only=True)
    device_name = serializers.CharField(source="device.device_name", read_only=True)
    device_identifier = serializers.CharField(source="device.device_id", read_only=True)

    class Meta:
        model = UserSession
        fields = [
            "id",
            "user",
            "user_name",
            "user_email",
            "device",
            "device_name",
            "device_identifier",
            "ip_address",
            "user_agent",
            "is_active",
            "created_at",
            "last_seen_at",
        ]

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.username


class AdminVideoSessionSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source="user.email", read_only=True)
    device_name = serializers.CharField(source="device.device_name", read_only=True)
    device_identifier = serializers.CharField(source="device.device_id", read_only=True)

    class Meta:
        model = VideoSession
        fields = [
            "id",
            "user",
            "user_name",
            "user_email",
            "device",
            "device_name",
            "device_identifier",
            "course_id",
            "lesson_id",
            "is_active",
            "started_at",
            "last_seen_at",
        ]

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.username