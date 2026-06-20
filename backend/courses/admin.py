from django.contrib import admin
from .models import Course, CourseResource


class CourseResourceInline(admin.TabularInline):
    model = CourseResource
    extra = 1
    fields = ["title", "file", "description", "uploaded_by"]
    readonly_fields = []


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "subject",
        "teacher",
        "price",
        "is_published",
        "created_at",
    ]

    list_filter = [
        "subject",
        "teacher",
        "is_published",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "teacher__username",
        "teacher__first_name",
        "teacher__last_name",
    ]

    fields = [
        "subject",
        "teacher",
        "created_by",
        "title",
        "description",
        "image",
        "price",
        "is_published",
    ]

    readonly_fields = ["created_by"]

    inlines = [CourseResourceInline]

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user

        super().save_model(request, obj, form, change)


@admin.register(CourseResource)
class CourseResourceAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "course",
        "uploaded_by",
        "created_at",
    ]

    list_filter = [
        "course",
        "uploaded_by",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "course__title",
    ]

    def save_model(self, request, obj, form, change):
        if not obj.uploaded_by:
            obj.uploaded_by = request.user

        super().save_model(request, obj, form, change)
# Register your models here.
