from django.db import models
from django.conf import settings


class Device(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="devices",
    )

    device_id = models.CharField(max_length=255)

    device_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    last_login_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "device_id")

    def __str__(self):
        return f"{self.user.username} - {self.device_name or 'Unknown Device'}"


class UserSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="security_sessions",
    )

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name="sessions",
    )

    refresh_token = models.TextField()

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Active: {self.is_active}"
class VideoSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="video_sessions",
    )

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name="video_sessions",
    )

    course_id = models.PositiveIntegerField()
    lesson_id = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)

    started_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Course {self.course_id} - Lesson {self.lesson_id}"
# Create your models here.
