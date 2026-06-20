from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CourseEnrollment
from .serializers import CourseEnrollmentSerializer


class MyCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = (
            CourseEnrollment.objects
            .filter(
                student=request.user,
                is_active=True,
            )
            .select_related(
                "course",
                "course__subject",
                "course__teacher",
            )
        )

        serializer = CourseEnrollmentSerializer(
            enrollments,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)
# Create your views here.
