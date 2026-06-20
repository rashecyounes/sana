from django.shortcuts import render

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from lessons.models import Lesson

from .models import Course
from .permissions import IsAdminOrTeacher
from .serializers import CourseSerializer
from .services.mux_service import create_mux_asset


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Course.objects.select_related(
            "subject",
            "teacher",
        ).prefetch_related(
            "resources",
            "enrollments",
        )

        subject_slug = self.request.query_params.get("subject")

        if subject_slug:
            queryset = queryset.filter(subject__slug=subject_slug)

        # الطلاب والزوار يرون الكورسات المنشورة فقط
        if (
            not self.request.user.is_authenticated
            or self.request.user.role == "student"
        ):
            queryset = queryset.filter(is_published=True)

        return queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAdminOrTeacher()]

    def perform_create(self, serializer):
        user = self.request.user

        # إذا كان مدرس يصبح هو المدرس تلقائيًا
        if user.role == "teacher":
            serializer.save(
                teacher=user,
                created_by=user,
            )

        # الأدمن يستطيع تحديد المدرس
        else:
            serializer.save(
                created_by=user,
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_lesson_video(request):
    lesson_id = request.data.get("lesson_id")
    video_url = request.data.get("video_url")

    if not lesson_id or not video_url:
        return Response(
            {
                "error": "lesson_id and video_url are required"
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        lesson = Lesson.objects.select_related(
            "course",
            "course__teacher",
        ).get(id=lesson_id)

    except Lesson.DoesNotExist:
        return Response(
            {
                "error": "Lesson not found"
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    user = request.user

    is_teacher_owner = (
        user.role == "teacher"
        and lesson.course.teacher_id == user.id
    )

    is_admin = user.role == "admin"

    if not is_teacher_owner and not is_admin:
        return Response(
            {
                "error": "You do not have permission"
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        mux_data = create_mux_asset(video_url)

        lesson.video_provider = "mux"
        lesson.video_asset_id = mux_data["asset_id"]
        lesson.video_playback_id = mux_data["playback_id"]

        # DRM Ready Fields
        lesson.is_drm_protected = mux_data.get("drm_enabled", False)
        lesson.drm_configuration_id = mux_data.get("drm_configuration_id")
        lesson.drm_license_type = "mux_drm" if mux_data.get("drm_enabled") else None

        lesson.save()

        return Response(
            {
                "message": "Video uploaded successfully",
                "lesson_id": lesson.id,
                "video_provider": lesson.video_provider,
                "video_asset_id": lesson.video_asset_id,
                "video_playback_id": lesson.video_playback_id,
                "mux_status": mux_data["status"],
                "is_drm_protected": lesson.is_drm_protected,
                "drm_license_type": lesson.drm_license_type,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as error:
        return Response(
            {
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )