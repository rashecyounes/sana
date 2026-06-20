from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from courses.models import Course
from .serializers import TeacherCourseSerializer
from .permissions import IsTeacher
from rest_framework.generics import ListCreateAPIView
from lessons.models import Lesson
from .serializers import TeacherLessonSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from lessons.models import Lesson


from courses.services.mux_direct_upload import create_mux_direct_upload
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser

from courses.models import Course
from lessons.models import Lesson, LessonResource

from lessons.serializers import (
    LessonResourceSerializer,
)

from courses.serializers import CourseSerializer
from lessons.serializers import LessonSerializer


from courses.services.mux_direct_upload import create_mux_direct_upload
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    TeacherProfileSerializer,
    TeacherChangePasswordSerializer,
)
class TeacherCourseListView(ListAPIView):
    serializer_class = TeacherCourseSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        queryset = Course.objects.filter(teacher=self.request.user).select_related(
            "subject",
            "teacher",
            "created_by",
        )

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.order_by("-created_at")


class TeacherCourseDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherCourseSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Course.objects.filter(teacher=self.request.user).select_related(
            "subject",
            "teacher",
            "created_by",
        )
class TeacherLessonListCreateView(ListCreateAPIView):
    serializer_class = TeacherLessonSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        queryset = Lesson.objects.filter(
            course__teacher=self.request.user
        ).select_related("course")

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.order_by("course_id", "order")


class TeacherLessonDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherLessonSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Lesson.objects.filter(
            course__teacher=self.request.user
        ).select_related("course")
class TeacherVideoLessonsView(ListAPIView):
    serializer_class = TeacherLessonSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        queryset = Lesson.objects.filter(
            course__teacher=self.request.user
        ).select_related("course")

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.order_by("course_id", "order")
class TeacherMuxDirectUploadView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        lesson_id = request.data.get("lesson_id")

        if not lesson_id:
            return Response(
                {"error": "lesson_id is required."},
                status=400,
            )

        try:
            lesson = Lesson.objects.select_related("course").get(
                id=lesson_id,
                course__teacher=request.user,
            )
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found or you do not have permission."},
                status=404,
            )

        upload_data = create_mux_direct_upload(lesson.id)

        return Response(upload_data)

        return Response(upload_data, status=status.HTTP_201_CREATED)
class TeacherLessonFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        courses = Course.objects.filter(
            teacher=request.user
        ).order_by("-created_at")

        serializer = CourseSerializer(
            courses,
            many=True,
            context={"request": request},
        )

        return Response({
            "courses": serializer.data
        })
class TeacherLessonResourcesListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    parser_classes = [MultiPartParser, FormParser]

    def get_lesson(self, lesson_id, user):
        return Lesson.objects.get(
            id=lesson_id,
            course__teacher=user,
        )

    def get(self, request, pk):
        try:
            lesson = self.get_lesson(pk, request.user)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=404,
            )

        resources = lesson.resources.all().order_by(
            "-created_at"
        )

        serializer = LessonResourceSerializer(
            resources,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)

    def post(self, request, pk):
        try:
            lesson = self.get_lesson(pk, request.user)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=404,
            )

        serializer = LessonResourceSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save(
                lesson=lesson,
                uploaded_by=request.user,
            )

            return Response(
                serializer.data,
                status=201,
            )

        return Response(
            serializer.errors,
            status=400,
        )
class TeacherLessonResourceDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def delete(self, request, pk):
        try:
            resource = LessonResource.objects.select_related(
                "lesson__course"
            ).get(
                id=pk,
                lesson__course__teacher=request.user,
            )
        except LessonResource.DoesNotExist:
            return Response(
                {"error": "Resource not found."},
                status=404,
            )

        resource.delete()

        return Response(status=204)
class TeacherVideosListView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        lesson_id = request.GET.get("lesson")

        lessons = Lesson.objects.filter(
            course__teacher=request.user
        ).select_related("course")

        if lesson_id:
            lessons = lessons.filter(id=lesson_id)

        serializer = LessonSerializer(
            lessons.order_by("-created_at"),
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)
class TeacherVideoFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        lessons = Lesson.objects.filter(
            course__teacher=request.user
        ).select_related("course")

        serializer = LessonSerializer(
            lessons,
            many=True,
            context={"request": request},
        )

        return Response({
            "lessons": serializer.data
        })
class TeacherUploadVideoView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        return Response(
            {
                "error": (
                    "Direct browser upload is used. "
                    "Use /mux/direct-upload/ endpoint instead."
                )
            },
            status=400,
        )
class TeacherOverviewView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        teacher = request.user

        courses = Course.objects.filter(teacher=teacher)
        lessons = Lesson.objects.filter(course__teacher=teacher)

        total_courses = courses.count()
        published_courses = courses.filter(is_published=True).count()
        hidden_courses = courses.filter(is_published=False).count()

        total_lessons = lessons.count()
        published_lessons = lessons.filter(is_published=True).count()
        hidden_lessons = lessons.filter(is_published=False).count()

        videos_connected = lessons.exclude(video_playback_id__isnull=True).exclude(
            video_playback_id=""
        ).count()

        videos_missing = lessons.filter(
            video_playback_id__isnull=True
        ).count()

        latest_lessons = lessons.select_related("course").order_by("-created_at")[:5]

        latest_lessons_data = [
            {
                "id": lesson.id,
                "title": lesson.title,
                "course_title": lesson.course.title,
                "is_published": lesson.is_published,
                "video_connected": bool(lesson.video_playback_id),
                "created_at": lesson.created_at,
            }
            for lesson in latest_lessons
        ]

        return Response({
            "total_courses": total_courses,
            "published_courses": published_courses,
            "hidden_courses": hidden_courses,

            "total_lessons": total_lessons,
            "published_lessons": published_lessons,
            "hidden_lessons": hidden_lessons,

            "videos_connected": videos_connected,
            "videos_missing": videos_missing,

            "latest_lessons": latest_lessons_data,
        })


class TeacherProfileView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = TeacherProfileSerializer(
            request.user,
            context={"request": request},
        )

        return Response(serializer.data)

    def patch(self, request):
        serializer = TeacherProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()

        return Response(serializer.data)


class TeacherChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        serializer = TeacherChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = request.user

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"old_password": "Old password is incorrect."},
                status=400,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "message": "Password changed successfully."
        })
    # Create your views here.
