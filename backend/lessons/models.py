from django.db import models
from django.conf import settings
from courses.models import Course


class Lesson(models.Model):

    VIDEO_PROVIDERS = (
        ("mux", "Mux"),
        ("bunny", "Bunny"),
        ("youtube", "YouTube"),
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True,
    )

    video_provider = models.CharField(
        max_length=50,
        choices=VIDEO_PROVIDERS,
        default="mux",
    )

    video_asset_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    video_playback_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    # DRM Ready Fields
    # الآن هذه الحقول فقط للتجهيز، وعندما تفعل DRM لاحقًا سنستخدمها مباشرة.
    is_drm_protected = models.BooleanField(default=False)

    drm_configuration_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    drm_license_type = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    thumbnail = models.ImageField(
        upload_to="lesson_thumbnails/",
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(default=1)

    duration = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    is_preview = models.BooleanField(default=False)

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "order")

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class LessonResource(models.Model):

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="resources",
    )

    title = models.CharField(max_length=255)

    file = models.FileField(
        upload_to="lesson_resources/",
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title