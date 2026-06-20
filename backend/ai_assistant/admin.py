from django.contrib import admin
from .models import CourseAIKnowledge, AIUsageLog, CourseAIKnowledgeFile


@admin.register(CourseAIKnowledge)
class CourseAIKnowledgeAdmin(admin.ModelAdmin):
    list_display = ("course", "is_active", "created_at", "updated_at")
    search_fields = ("course__title", "content")
    list_filter = ("is_active", "created_at")


@admin.register(CourseAIKnowledgeFile)
class CourseAIKnowledgeFileAdmin(admin.ModelAdmin):
    list_display = ("original_filename", "course", "uploaded_by", "created_at")
    search_fields = ("original_filename", "course__title")
    list_filter = ("created_at",)


@admin.register(AIUsageLog)
class AIUsageLogAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "course",
        "action",
        "prompt_tokens",
        "completion_tokens",
        "total_tokens",
        "created_at",
    )
    search_fields = ("user__username", "course__title")
    list_filter = ("action", "created_at")