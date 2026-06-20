from django.contrib import admin
from .models import Lesson, LessonResource


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "course",
        "order",
        "is_preview",
        "is_published",
        "created_at",
    )

    list_filter = (
        "is_preview",
        "is_published",
        "video_provider",
    )

    search_fields = (
        "title",
        "course__title",
    )

    ordering = ("course", "order")


@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "lesson",
        "uploaded_by",
        "created_at",
    )

    search_fields = (
        "title",
        "lesson__title",
    )
# Register your models here.
