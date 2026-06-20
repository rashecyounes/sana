from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "phone",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
        "created_at",
    )

    list_filter = (
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
    )

    search_fields = (
        "username",
        "email",
        "phone",
        "first_name",
        "last_name",
    )

    ordering = ("-created_at",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "X Platform Profile Info",
            {
                "fields": (
                    "role",
                    "phone",
                    "profile_image",
                    "bio",
                    "city",
                    "school_name",
                    "parent_phone",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "X Platform Profile Info",
            {
                "fields": (
                    "role",
                    "email",
                    "phone",
                    "first_name",
                    "last_name",
                )
            },
        ),
    )
# Register your models here.
