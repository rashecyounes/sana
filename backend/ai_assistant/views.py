from django.shortcuts import render
from courses.models import Course
from enrollments.models import CourseEnrollment

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import CourseAIKnowledge, AIUsageLog, CourseAIKnowledgeFile
from .serializers import (
    CourseAIKnowledgeSerializer,
    CourseAIKnowledgeFileSerializer,
    AIAskSerializer,
    AIGenerateSerializer,
)
from .services.openai_service import generate_course_ai_response
from .services.file_text_extractor import extract_text_from_uploaded_file


def user_can_manage_course_ai(user, course):
    if not user.is_authenticated:
        return False

    if user.role == "admin":
        return True

    if user.role == "teacher" and course.teacher_id == user.id:
        return True

    return False


def user_can_use_course_ai(user, course):
    if not user.is_authenticated:
        return False

    if user.role == "admin":
        return True

    if user.role == "teacher" and course.teacher_id == user.id:
        return True

    return CourseEnrollment.objects.filter(
        student=user,
        course=course,
        is_active=True,
    ).exists()


class CourseAIKnowledgeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user_can_manage_course_ai(request.user, course):
            return Response(
                {"error": "You do not have permission to manage AI material for this course."},
                status=status.HTTP_403_FORBIDDEN,
            )

        knowledge, created = CourseAIKnowledge.objects.get_or_create(
            course=course,
            defaults={
                "content": "",
                "instructions": "",
                "is_active": True,
            },
        )

        serializer = CourseAIKnowledgeSerializer(knowledge)
        return Response(serializer.data)

    def post(self, request, course_id):
        return self._save_or_update(request, course_id)

    def patch(self, request, course_id):
        return self._save_or_update(request, course_id)

    def _save_or_update(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user_can_manage_course_ai(request.user, course):
            return Response(
                {"error": "You do not have permission to manage AI material for this course."},
                status=status.HTTP_403_FORBIDDEN,
            )

        knowledge, created = CourseAIKnowledge.objects.get_or_create(
            course=course,
            defaults={
                "content": "",
                "instructions": "",
                "is_active": True,
            },
        )

        serializer = CourseAIKnowledgeSerializer(
            knowledge,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BaseCourseAIActionView(APIView):
    permission_classes = [IsAuthenticated]
    action = "ask"

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user_can_use_course_ai(request.user, course):
            return Response(
                {"error": "You do not have access to this course AI assistant."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            knowledge = course.ai_knowledge
        except CourseAIKnowledge.DoesNotExist:
            return Response(
                {"error": "AI material is not available for this course."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not knowledge.is_active:
            return Response(
                {"error": "AI assistant is currently disabled for this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not knowledge.content.strip():
            return Response(
                {"error": "AI material is empty for this course."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = self.get_user_message(serializer.validated_data)

        try:
            ai_result = generate_course_ai_response(
                course=course,
                knowledge=knowledge,
                user_message=user_message,
                action=self.action,
            )
        except Exception as error:
            return Response(
                {
                    "error": "Failed to generate AI response.",
                    "details": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        AIUsageLog.objects.create(
            user=request.user,
            course=course,
            action=self.action,
            prompt_tokens=ai_result.get("prompt_tokens", 0),
            completion_tokens=ai_result.get("completion_tokens", 0),
            total_tokens=ai_result.get("total_tokens", 0),
        )

        return Response(
            {
                "result": ai_result["result"],
                "usage": {
                    "prompt_tokens": ai_result.get("prompt_tokens", 0),
                    "completion_tokens": ai_result.get("completion_tokens", 0),
                    "total_tokens": ai_result.get("total_tokens", 0),
                },
            }
        )

    def get_serializer(self, data):
        if self.action == "ask":
            return AIAskSerializer(data=data)

        return AIGenerateSerializer(data=data)

    def get_user_message(self, validated_data):
        if self.action == "ask":
            return validated_data["question"]

        return validated_data.get("prompt") or ""


class CourseAIAskView(BaseCourseAIActionView):
    action = "ask"


class CourseAIQuizView(BaseCourseAIActionView):
    action = "quiz"


class CourseAIExercisesView(BaseCourseAIActionView):
    action = "exercises"


class CourseAIExamplesView(BaseCourseAIActionView):
    action = "examples"
class CourseAIKnowledgeFileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user_can_manage_course_ai(request.user, course):
            return Response(
                {"error": "You do not have permission to upload AI material for this course."},
                status=status.HTTP_403_FORBIDDEN,
            )

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"error": "No file was uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            extracted_text = extract_text_from_uploaded_file(uploaded_file)
        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(
                {"error": "Failed to extract text from file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not extracted_text.strip():
            return Response(
                {"error": "No readable text was found in this file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        knowledge, created = CourseAIKnowledge.objects.get_or_create(
            course=course,
            defaults={
                "content": "",
                "instructions": "",
                "is_active": True,
            },
        )

        knowledge_file = CourseAIKnowledgeFile.objects.create(
            course=course,
            knowledge=knowledge,
            file=uploaded_file,
            original_filename=uploaded_file.name,
            extracted_text=extracted_text,
            uploaded_by=request.user,
        )

        separator = f"\n\n--- Material from file: {uploaded_file.name} ---\n\n"

        if knowledge.content.strip():
            knowledge.content = knowledge.content.rstrip() + separator + extracted_text
        else:
            knowledge.content = f"--- Material from file: {uploaded_file.name} ---\n\n{extracted_text}"

        knowledge.save(update_fields=["content", "updated_at"])

        serializer = CourseAIKnowledgeFileSerializer(knowledge_file)

        return Response(
            {
                "message": "File uploaded and text extracted successfully.",
                "file": serializer.data,
                "knowledge": CourseAIKnowledgeSerializer(knowledge).data,
            },
            status=status.HTTP_201_CREATED,
        )
# Create your views here.
