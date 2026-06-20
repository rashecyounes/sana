from django.contrib import admin
from .models import CourseEnrollment


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "course",
        "source",
        "is_active",
        "created_at",
    ]

    list_filter = [
        "source",
        "is_active",
        "created_at",
    ]

    search_fields = [
        "student__username",
        "student__email",
        "course__title",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]
# Register your models here.
