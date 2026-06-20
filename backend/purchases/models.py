from django.db import models
from django.conf import settings
from courses.models import Course


class Purchase(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="purchases",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="purchases",
    )

    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    provider = models.CharField(
        max_length=50,
        default="internal",
    )

    provider_reference = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["student", "course"]),
            models.Index(fields=["status"]),
            models.Index(fields=["provider_reference"]),
        ]

    def __str__(self):
        return f"{self.student.username} - {self.course.title} - {self.status}"
# Create your models here.
