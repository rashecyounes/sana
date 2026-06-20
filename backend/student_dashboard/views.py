from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from enrollments.models import CourseEnrollment
from courses.serializers import CourseSerializer

from .permissions import IsStudent
from .serializers import StudentProfileSerializer, StudentOverviewSerializer


class StudentOverviewView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        serializer = StudentOverviewSerializer(
            request.user,
            context={"request": request},
        )
        return Response(serializer.data)


class StudentMyCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        enrollments = CourseEnrollment.objects.filter(
            student=request.user,
            is_active=True,
        ).select_related("course", "course__subject", "course__teacher")

        courses = [enrollment.course for enrollment in enrollments]

        serializer = CourseSerializer(
            courses,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        serializer = StudentProfileSerializer(
            request.user,
            context={"request": request},
        )
        return Response(serializer.data)

    def patch(self, request):
        serializer = StudentProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
# Create your views here.
