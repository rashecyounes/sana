from django.shortcuts import render
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from courses.models import Course
from enrollments.models import CourseEnrollment
from .models import Purchase
from .serializers import PurchaseSerializer, CreatePurchaseSerializer


class CreatePurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreatePurchaseSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        course_id = serializer.validated_data["course_id"]

        try:
            course = Course.objects.get(id=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found or not available."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if CourseEnrollment.objects.filter(
            student=request.user,
            course=course,
            is_active=True,
        ).exists():
            return Response(
                {"error": "You already have access to this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            existing_pending_purchase = Purchase.objects.filter(
                student=request.user,
                course=course,
                status=Purchase.Status.PENDING,
            ).first()

            if existing_pending_purchase:
                output_serializer = PurchaseSerializer(existing_pending_purchase)

                return Response(
                    {
                        "message": "You already have a pending purchase for this course.",
                        "purchase": output_serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )

            purchase = Purchase.objects.create(
                student=request.user,
                course=course,
                amount=course.price,
                status=Purchase.Status.PENDING,
                provider="internal",
            )

        output_serializer = PurchaseSerializer(purchase)

        return Response(
            {
                "message": "Purchase created successfully.",
                "purchase": output_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
class CompletePurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, purchase_id):
        try:
            purchase = Purchase.objects.select_related(
                "course",
                "student",
            ).get(
                id=purchase_id,
                student=request.user,
            )
        except Purchase.DoesNotExist:
            return Response(
                {"error": "Purchase not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if purchase.status == Purchase.Status.COMPLETED:
            return Response(
                {"message": "Purchase already completed."},
                status=status.HTTP_200_OK,
            )

        if purchase.status != Purchase.Status.PENDING:
            return Response(
                {"error": "Only pending purchases can be completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            purchase.status = Purchase.Status.COMPLETED
            purchase.completed_at = timezone.now()
            purchase.save(update_fields=["status", "completed_at", "updated_at"])

            enrollment, created = CourseEnrollment.objects.get_or_create(
                student=purchase.student,
                course=purchase.course,
                defaults={
                    "source": CourseEnrollment.Source.PURCHASE,
                    "is_active": True,
                },
            )

            if not enrollment.is_active:
                enrollment.is_active = True
                enrollment.source = CourseEnrollment.Source.PURCHASE
                enrollment.save(update_fields=["is_active", "source", "updated_at"])

        return Response(
            {
                "message": "Purchase completed successfully.",
                "purchase_id": purchase.id,
                "course_id": purchase.course.id,
                "course_title": purchase.course.title,
                "enrollment_id": enrollment.id,
                "enrollment_created": created,
            },
            status=status.HTTP_200_OK,
        )
# Create your views here.
