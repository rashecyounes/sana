from django.db import transaction
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from enrollments.models import CourseEnrollment
from courses.models import Course

from .models import AccessCode
from .serializers import (
    AccessCodeSerializer,
    GenerateAccessCodesSerializer,
    RedeemAccessCodeSerializer,
)


class IsAdminUserRole(IsAuthenticated):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class AccessCodesListView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        access_codes = AccessCode.objects.select_related(
            "course",
            "used_by",
            "created_by",
        ).all()

        search = request.query_params.get("search")
        course_id = request.query_params.get("course")
        is_used = request.query_params.get("is_used")
        is_active = request.query_params.get("is_active")

        if search:
            access_codes = access_codes.filter(code__icontains=search)

        if course_id:
            access_codes = access_codes.filter(course_id=course_id)

        if is_used in ["true", "false"]:
            access_codes = access_codes.filter(is_used=is_used == "true")

        if is_active in ["true", "false"]:
            access_codes = access_codes.filter(is_active=is_active == "true")

        serializer = AccessCodeSerializer(access_codes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ToggleAccessCodeActiveView(APIView):
    permission_classes = [IsAdminUserRole]

    def patch(self, request, pk):
        try:
            access_code = AccessCode.objects.get(pk=pk)
        except AccessCode.DoesNotExist:
            return Response(
                {"error": "Access code not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        access_code.is_active = not access_code.is_active
        access_code.save(update_fields=["is_active"])

        serializer = AccessCodeSerializer(access_code)

        return Response(
            {
                "message": "Access code status updated successfully.",
                "access_code": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class GenerateAccessCodesView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request):
        serializer = GenerateAccessCodesSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        course_id = serializer.validated_data["course_id"]
        count = serializer.validated_data["count"]
        expires_at = serializer.validated_data.get("expires_at")

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        created_codes = []

        with transaction.atomic():
            for _ in range(count):
                access_code = AccessCode.objects.create(
                    course=course,
                    created_by=request.user,
                    expires_at=expires_at,
                )
                created_codes.append(access_code)

        output_serializer = AccessCodeSerializer(created_codes, many=True)

        return Response(
            {
                "message": f"{count} access codes generated successfully.",
                "codes": output_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class RedeemAccessCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RedeemAccessCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data["code"].upper()

        try:
            access_code = AccessCode.objects.select_related("course").get(code=code)
        except AccessCode.DoesNotExist:
            return Response(
                {"error": "Invalid access code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not access_code.is_active:
            return Response(
                {"error": "This access code is disabled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if access_code.is_used:
            return Response(
                {"error": "This access code has already been used."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if access_code.expires_at and access_code.expires_at < timezone.now():
            return Response(
                {"error": "This access code has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if CourseEnrollment.objects.filter(
            student=request.user,
            course=access_code.course,
            is_active=True,
        ).exists():
            return Response(
                {"error": "You already have access to this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            enrollment = CourseEnrollment.objects.create(
                student=request.user,
                course=access_code.course,
                source=CourseEnrollment.Source.ACCESS_CODE,
                is_active=True,
            )

            access_code.is_used = True
            access_code.used_by = request.user
            access_code.used_at = timezone.now()
            access_code.save(update_fields=["is_used", "used_by", "used_at"])

        return Response(
            {
                "message": "Course unlocked successfully.",
                "course_id": access_code.course.id,
                "course_title": access_code.course.title,
                "enrollment_id": enrollment.id,
            },
            status=status.HTTP_200_OK,
        )