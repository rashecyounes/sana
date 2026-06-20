from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from subjects.models import Subject
from users.models import User

from .permissions import IsAdminUserRole
from .serializers import (
    AdminSubjectOptionSerializer,
    AdminTeacherOptionSerializer,
    AdminCourseOptionSerializer, 
    AdminLessonSerializer,
    AdminPurchaseSerializer,
    AdminEnrollmentSerializer,
    AdminStudentOptionSerializer,
    AdminCreateEnrollmentSerializer,
    AdminUserSerializer,
    AdminUpdateUserSerializer,
    AdminDeviceSerializer,
    AdminUserSessionSerializer,
    AdminVideoSessionSerializer,
)
from courses.models import Course
from lessons.models import Lesson

from courses.services.mux_direct_upload import create_mux_direct_upload
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils import timezone

from courses.services.mux_webhook import (
    verify_mux_webhook_signature,
    parse_mux_webhook_body,
)
from django.db.models import Q
from purchases.models import Purchase
from enrollments.models import CourseEnrollment
from security.models import Device, UserSession, VideoSession
from access_codes.models import AccessCode
class AdminCourseFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        subjects = Subject.objects.all().order_by("name")

        teachers = User.objects.filter(
            role="teacher",
            is_active=True,
        ).order_by("first_name", "last_name", "username")

        return Response({
            "subjects": AdminSubjectOptionSerializer(
                subjects,
                many=True,
                context={"request": request},
            ).data,
            "teachers": AdminTeacherOptionSerializer(
                teachers,
                many=True,
            ).data,
        })
class AdminLessonFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        courses = Course.objects.all().order_by("title")

        return Response({
            "courses": AdminCourseOptionSerializer(
                courses,
                many=True,
            ).data
        })


class AdminLessonsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        course_id = request.query_params.get("course")

        lessons = Lesson.objects.select_related("course").all()

        if course_id:
            lessons = lessons.filter(course_id=course_id)

        lessons = lessons.order_by("course__title", "order")

        return Response(
            AdminLessonSerializer(
                lessons,
                many=True,
                context={"request": request},
            ).data
        )
class AdminVideoFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        lessons = Lesson.objects.select_related("course").all().order_by(
            "course__title",
            "order",
        )

        return Response({
            "lessons": AdminLessonSerializer(
                lessons,
                many=True,
                context={"request": request},
            ).data
        })


class AdminVideosListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        lesson_id = request.query_params.get("lesson")

        lessons = Lesson.objects.select_related("course").all()

        if lesson_id:
            lessons = lessons.filter(id=lesson_id)

        lessons = lessons.order_by("course__title", "order")

        return Response(
            AdminLessonSerializer(
                lessons,
                many=True,
                context={"request": request},
            ).data
        )
class AdminMuxDirectUploadView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def post(self, request):
        lesson_id = request.data.get("lesson_id")

        if not lesson_id:
            return Response(
                {"error": "lesson_id is required."},
                status=400,
            )

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=404,
            )

        upload_data = create_mux_direct_upload(lesson.id)

        return Response(upload_data)
class MuxWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        if not verify_mux_webhook_signature(request):
            return Response(
                {"error": "Invalid webhook signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = parse_mux_webhook_body(request)

        event_type = payload.get("type")
        data = payload.get("data", {})

        if event_type != "video.asset.ready":
            return Response({"received": True})

        lesson_id = data.get("passthrough")
        asset_id = data.get("id")

        playback_ids = data.get("playback_ids", [])
        playback_id = None

        if playback_ids:
            playback_id = playback_ids[0].get("id")

        if not lesson_id or not asset_id or not playback_id:
            return Response(
                {"error": "Missing required asset data."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        lesson.video_provider = "mux"
        lesson.video_asset_id = asset_id
        lesson.video_playback_id = playback_id

        lesson.is_drm_protected = False
        lesson.drm_configuration_id = None
        lesson.drm_license_type = None

        lesson.save(
            update_fields=[
                "video_provider",
                "video_asset_id",
                "video_playback_id",
                "is_drm_protected",
                "drm_configuration_id",
                "drm_license_type",
                "updated_at",
            ]
        )

        return Response({
            "received": True,
            "lesson_id": lesson.id,
            "asset_id": asset_id,
            "playback_id": playback_id,
        })
class AdminPurchasesListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        purchases = Purchase.objects.select_related(
            "student",
            "course",
        ).all()

        search = request.query_params.get("search")
        status_filter = request.query_params.get("status")

        if search:
            purchases = purchases.filter(
                Q(student__username__icontains=search)
                | Q(student__email__icontains=search)
                | Q(student__first_name__icontains=search)
                | Q(student__last_name__icontains=search)
                | Q(course__title__icontains=search)
            )

        if status_filter:
            purchases = purchases.filter(status=status_filter)

        purchases = purchases.order_by("-created_at")

        serializer = AdminPurchaseSerializer(purchases, many=True)

        return Response(serializer.data)


class AdminPurchaseDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, pk):
        try:
            purchase = Purchase.objects.select_related(
                "student",
                "course",
            ).get(pk=pk)
        except Purchase.DoesNotExist:
            return Response(
                {"error": "Purchase not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminPurchaseSerializer(purchase)
        return Response(serializer.data)
class AdminEnrollmentsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        enrollments = CourseEnrollment.objects.select_related(
            "student",
            "course",
        ).all()

        search = request.query_params.get("search")
        source = request.query_params.get("source")
        is_active = request.query_params.get("is_active")

        if search:
            enrollments = enrollments.filter(
                Q(student__username__icontains=search)
                | Q(student__email__icontains=search)
                | Q(student__first_name__icontains=search)
                | Q(student__last_name__icontains=search)
                | Q(course__title__icontains=search)
            )

        if source:
            enrollments = enrollments.filter(source=source)

        if is_active in ["true", "false"]:
            enrollments = enrollments.filter(is_active=is_active == "true")

        enrollments = enrollments.order_by("-created_at")

        serializer = AdminEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)


class AdminEnrollmentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, pk):
        try:
            enrollment = CourseEnrollment.objects.select_related(
                "student",
                "course",
            ).get(pk=pk)
        except CourseEnrollment.DoesNotExist:
            return Response(
                {"error": "Enrollment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminEnrollmentSerializer(enrollment)
        return Response(serializer.data)


class AdminEnrollmentToggleActiveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            enrollment = CourseEnrollment.objects.get(pk=pk)
        except CourseEnrollment.DoesNotExist:
            return Response(
                {"error": "Enrollment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        enrollment.is_active = not enrollment.is_active
        enrollment.save(update_fields=["is_active", "updated_at"])

        serializer = AdminEnrollmentSerializer(enrollment)

        return Response({
            "message": "Enrollment status updated successfully.",
            "enrollment": serializer.data,
        })
class AdminEnrollmentFormDataView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        students = User.objects.filter(
            role="student",
            is_active=True,
        ).order_by("first_name", "last_name", "username")

        courses = Course.objects.all().order_by("title")

        return Response({
            "students": AdminStudentOptionSerializer(
                students,
                many=True,
            ).data,
            "courses": AdminCourseOptionSerializer(
                courses,
                many=True,
            ).data,
        })


class AdminCreateEnrollmentView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def post(self, request):
        serializer = AdminCreateEnrollmentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        student_id = serializer.validated_data["student_id"]
        course_id = serializer.validated_data["course_id"]
        source = serializer.validated_data["source"]

        try:
            student = User.objects.get(id=student_id, role="student", is_active=True)
        except User.DoesNotExist:
            return Response(
                {"error": "Student not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        enrollment, created = CourseEnrollment.objects.get_or_create(
            student=student,
            course=course,
            defaults={
                "source": source,
                "is_active": True,
            },
        )

        if not created:
            if enrollment.is_active:
                return Response(
                    {"error": "Student already has active access to this course."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            enrollment.source = source
            enrollment.is_active = True
            enrollment.save(update_fields=["source", "is_active", "updated_at"])

        output_serializer = AdminEnrollmentSerializer(enrollment)

        return Response(
            {
                "message": "Enrollment created successfully.",
                "enrollment": output_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
class AdminUsersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        users = User.objects.all()

        search = request.query_params.get("search")
        role = request.query_params.get("role")
        is_active = request.query_params.get("is_active")

        if search:
            users = users.filter(
                Q(username__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        if role:
            users = users.filter(role=role)

        if is_active in ["true", "false"]:
            users = users.filter(is_active=is_active == "true")

        users = users.order_by("-created_at")

        serializer = AdminUserSerializer(
            users,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminUserSerializer(
            user,
            context={"request": request},
        )

        return Response(serializer.data)


class AdminUserUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminUpdateUserSerializer(
            user,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        output_serializer = AdminUserSerializer(
            user,
            context={"request": request},
        )

        return Response({
            "message": "User updated successfully.",
            "user": output_serializer.data,
        })


class AdminUserToggleActiveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.id == request.user.id:
            return Response(
                {"error": "You cannot deactivate your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])

        serializer = AdminUserSerializer(
            user,
            context={"request": request},
        )

        return Response({
            "message": "User status updated successfully.",
            "user": serializer.data,
        })
class AdminSecurityDevicesListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        devices = Device.objects.select_related("user").all()

        search = request.query_params.get("search")
        is_active = request.query_params.get("is_active")

        if search:
            devices = devices.filter(
                Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(device_name__icontains=search)
                | Q(device_id__icontains=search)
                | Q(ip_address__icontains=search)
            )

        if is_active in ["true", "false"]:
            devices = devices.filter(is_active=is_active == "true")

        devices = devices.order_by("-last_login_at")

        serializer = AdminDeviceSerializer(devices, many=True)
        return Response(serializer.data)


class AdminSecurityDeviceToggleActiveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            device = Device.objects.get(pk=pk)
        except Device.DoesNotExist:
            return Response(
                {"error": "Device not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        device.is_active = not device.is_active
        device.save(update_fields=["is_active"])

        if not device.is_active:
            UserSession.objects.filter(
                device=device,
                is_active=True,
            ).update(is_active=False)

            VideoSession.objects.filter(
                device=device,
                is_active=True,
            ).update(is_active=False)

        serializer = AdminDeviceSerializer(device)

        return Response({
            "message": "Device status updated successfully.",
            "device": serializer.data,
        })


class AdminSecuritySessionsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        sessions = UserSession.objects.select_related(
            "user",
            "device",
        ).all()

        search = request.query_params.get("search")
        is_active = request.query_params.get("is_active")

        if search:
            sessions = sessions.filter(
                Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(device__device_name__icontains=search)
                | Q(ip_address__icontains=search)
            )

        if is_active in ["true", "false"]:
            sessions = sessions.filter(is_active=is_active == "true")

        sessions = sessions.order_by("-last_seen_at")

        serializer = AdminUserSessionSerializer(sessions, many=True)
        return Response(serializer.data)


class AdminSecuritySessionDeactivateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            user_session = UserSession.objects.get(pk=pk)
        except UserSession.DoesNotExist:
            return Response(
                {"error": "Session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_session.is_active = False
        user_session.save(update_fields=["is_active"])

        serializer = AdminUserSessionSerializer(user_session)

        return Response({
            "message": "Session deactivated successfully.",
            "session": serializer.data,
        })


class AdminSecurityVideoSessionsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        video_sessions = VideoSession.objects.select_related(
            "user",
            "device",
        ).all()

        search = request.query_params.get("search")
        is_active = request.query_params.get("is_active")

        if search:
            video_sessions = video_sessions.filter(
                Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(device__device_name__icontains=search)
            )

        if is_active in ["true", "false"]:
            video_sessions = video_sessions.filter(is_active=is_active == "true")

        video_sessions = video_sessions.order_by("-last_seen_at")

        serializer = AdminVideoSessionSerializer(video_sessions, many=True)
        return Response(serializer.data)


class AdminSecurityVideoSessionDeactivateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def patch(self, request, pk):
        try:
            video_session = VideoSession.objects.get(pk=pk)
        except VideoSession.DoesNotExist:
            return Response(
                {"error": "Video session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        video_session.is_active = False
        video_session.save(update_fields=["is_active"])

        serializer = AdminVideoSessionSerializer(video_session)

        return Response({
            "message": "Video session deactivated successfully.",
            "video_session": serializer.data,
        })
class AdminOverviewView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        data = {
            "total_users": User.objects.count(),
            "total_students": User.objects.filter(role="student").count(),
            "total_teachers": User.objects.filter(role="teacher").count(),
            "total_admins": User.objects.filter(role="admin").count(),

            "total_subjects": Subject.objects.count(),
            "total_courses": Course.objects.count(),
            "published_courses": Course.objects.filter(is_published=True).count(),
            "unpublished_courses": Course.objects.filter(is_published=False).count(),

            "total_lessons": Lesson.objects.count(),
            "published_lessons": Lesson.objects.filter(is_published=True).count(),
            "unpublished_lessons": Lesson.objects.filter(is_published=False).count(),

            "total_purchases": Purchase.objects.count(),
            "completed_purchases": Purchase.objects.filter(status="completed").count(),
            "pending_purchases": Purchase.objects.filter(status="pending").count(),

            "total_enrollments": CourseEnrollment.objects.count(),
            "active_enrollments": CourseEnrollment.objects.filter(is_active=True).count(),
            "inactive_enrollments": CourseEnrollment.objects.filter(is_active=False).count(),

            "total_access_codes": AccessCode.objects.count(),
            "used_access_codes": AccessCode.objects.filter(is_used=True).count(),
            "unused_access_codes": AccessCode.objects.filter(is_used=False).count(),
            "active_access_codes": AccessCode.objects.filter(is_active=True).count(),

            "active_devices": Device.objects.filter(is_active=True).count(),
            "active_sessions": UserSession.objects.filter(is_active=True).count(),
            "active_video_locks": VideoSession.objects.filter(is_active=True).count(),
        }

        return Response(data)

# Create your views here.
