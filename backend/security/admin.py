from django.contrib import admin
from .models import Device, UserSession


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "device_name",
        "device_id",
        "ip_address",
        "is_active",
        "created_at",
        "last_login_at",
    )

    list_filter = (
        "is_active",
        "created_at",
        "last_login_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "device_id",
        "device_name",
        "ip_address",
    )


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "device",
        "ip_address",
        "is_active",
        "created_at",
        "last_seen_at",
    )

    list_filter = (
        "is_active",
        "created_at",
        "last_seen_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "ip_address",
    )
# Register your models here.
