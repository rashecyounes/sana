from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from courses.models import Course
from enrollments.models import CourseEnrollment
from courses.services.mux_signed_token import create_mux_video_token

from .models import Lesson, LessonResource
from .serializers import LessonSerializer, LessonResourceSerializer


def user_has_course_access(user, course):
    if not user or not user.is_authenticated:
        return False

    if user.is_staff or getattr(user, "role", None) == "admin":
        return True

    if getattr(user, "role", None) == "teacher" and course.teacher_id == user.id:
        return True

    return CourseEnrollment.objects.filter(
        student=user,
        course=course,
        is_active=True,
    ).exists()


class PreviewLessonsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        lessons = Lesson.objects.filter(
            course=course,
            is_preview=True,
            is_published=True,
        ).order_by("order")

        serializer = LessonSerializer(
            lessons,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseLessonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user_has_course_access(request.user, course):
            return Response(
                {"error": "You do not have access to this course."},
                status=status.HTTP_403_FORBIDDEN,
            )

        lessons = Lesson.objects.filter(
            course=course,
            is_published=True,
        ).order_by("order")

        serializer = LessonSerializer(
            lessons,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, lesson_id):
        try:
            lesson = Lesson.objects.select_related("course").get(
                id=lesson_id,
                is_published=True,
            )
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not lesson.is_preview:
            if not user_has_course_access(request.user, lesson.course):
                return Response(
                    {"error": "You do not have access to this lesson."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer = LessonSerializer(
            lesson,
            context={"request": request},
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user

        is_admin = user.is_staff or getattr(user, "role", None) == "admin"
        is_teacher = course.teacher_id == user.id

        if not (is_admin or is_teacher):
            return Response(
                {"error": "You are not allowed to create lessons for this course."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = LessonSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, lesson_id):
        try:
            lesson = Lesson.objects.select_related("course").get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_admin = user.is_staff or getattr(user, "role", None) == "admin"
        is_teacher = lesson.course.teacher_id == user.id

        if not (is_admin or is_teacher):
            return Response(
                {"error": "You are not allowed to update this lesson."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = LessonSerializer(
            lesson,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, lesson_id):
        try:
            lesson = Lesson.objects.select_related("course").get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_admin = user.is_staff or getattr(user, "role", None) == "admin"
        is_teacher = lesson.course.teacher_id == user.id

        if not (is_admin or is_teacher):
            return Response(
                {"error": "You are not allowed to delete this lesson."},
                status=status.HTTP_403_FORBIDDEN,
            )

        lesson.delete()

        return Response(
            {"message": "Lesson deleted successfully."},
            status=status.HTTP_200_OK,
        )


class LessonResourcesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            lesson = Lesson.objects.select_related("course").get(
                id=lesson_id,
                is_published=True,
            )
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not lesson.is_preview:
            if not user_has_course_access(request.user, lesson.course):
                return Response(
                    {"error": "You do not have access to these resources."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        resources = lesson.resources.all().order_by("-created_at")

        serializer = LessonResourceSerializer(
            resources,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.select_related("course").get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_admin = user.is_staff or getattr(user, "role", None) == "admin"
        is_teacher = lesson.course.teacher_id == user.id

        if not (is_admin or is_teacher):
            return Response(
                {"error": "You are not allowed to add resources to this lesson."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = LessonResourceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                lesson=lesson,
                uploaded_by=request.user,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteLessonResourceView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, resource_id):
        try:
            resource = LessonResource.objects.select_related(
                "lesson",
                "lesson__course",
            ).get(id=resource_id)
        except LessonResource.DoesNotExist:
            return Response(
                {"error": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_admin = user.is_staff or getattr(user, "role", None) == "admin"
        is_teacher = resource.lesson.course.teacher_id == user.id

        if not (is_admin or is_teacher):
            return Response(
                {"error": "You are not allowed to delete this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        resource.delete()

        return Response(
            {"message": "Resource deleted successfully."},
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mux_lesson_token(request, lesson_id):
    try:
        lesson = Lesson.objects.select_related("course").get(
            id=lesson_id,
            is_published=True,
        )
    except Lesson.DoesNotExist:
        return Response(
            {"error": "Lesson not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not lesson.video_playback_id:
        return Response(
            {"error": "This lesson does not have a Mux video."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user_has_course_access(request.user, lesson.course):
        return Response(
            {"error": "You do not have access to this lesson."},
            status=status.HTTP_403_FORBIDDEN,
        )

    token = create_mux_video_token(
        playback_id=lesson.video_playback_id,
        expires_in_minutes=10,
    )

    return Response(
        {
        "playback_id": lesson.video_playback_id,
        "token": token,
        "expires_in_minutes": 10,
        "is_drm_protected": lesson.is_drm_protected,
        "drm_license_type": lesson.drm_license_type,
        "watermark": {
            "username": request.user.username,
            "email": request.user.email,
            "device_id": request.headers.get("x-device-id", "unknown"),
        },
    },
        status=status.HTTP_200_OK,
    )