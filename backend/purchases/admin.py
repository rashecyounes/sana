from django.contrib import admin
from .models import Purchase


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "course",
        "amount",
        "status",
        "provider",
        "provider_reference",
        "completed_at",
        "created_at",
    ]

    list_filter = [
        "status",
        "provider",
        "created_at",
        "completed_at",
    ]

    search_fields = [
        "student__username",
        "student__email",
        "course__title",
        "provider_reference",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
        "completed_at",
    ]
# Register your models here.
