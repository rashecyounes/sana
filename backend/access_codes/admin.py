from django.contrib import admin
from .models import AccessCode


@admin.register(AccessCode)
class AccessCodeAdmin(admin.ModelAdmin):
    list_display = [
        "code",
        "course",
        "is_used",
        "is_active",
        "used_by",
        "created_by",
        "used_at",
        "expires_at",
        "created_at",
    ]

    list_filter = [
        "course",
        "is_used",
        "is_active",
        "created_at",
        "expires_at",
    ]

    search_fields = [
        "code",
        "course__title",
        "used_by__username",
        "created_by__username",
    ]

    readonly_fields = [
        "code",
        "used_by",
        "used_at",
        "created_at",
    ]
# Register your models here.
