from rest_framework import serializers
from .models import CourseAIKnowledge
from .models import CourseAIKnowledge, CourseAIKnowledgeFile

class CourseAIKnowledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAIKnowledge
        fields = [
            "id",
            "course",
            "content",
            "instructions",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "course", "created_at", "updated_at"]


class AIAskSerializer(serializers.Serializer):
    question = serializers.CharField(
        max_length=1000,
        allow_blank=False,
        trim_whitespace=True,
    )


class AIGenerateSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        max_length=1000,
        required=False,
        allow_blank=True,
        trim_whitespace=True,
    )
class CourseAIKnowledgeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAIKnowledgeFile
        fields = [
            "id",
            "course",
            "knowledge",
            "file",
            "original_filename",
            "extracted_text",
            "uploaded_by",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "knowledge",
            "original_filename",
            "extracted_text",
            "uploaded_by",
            "created_at",
        ]