import random
import string

from django.db import models
from django.conf import settings
from courses.models import Course


def generate_access_code():
    characters = string.ascii_uppercase + string.digits
    return "".join(random.choices(characters, k=8))


class AccessCode(models.Model):
    code = models.CharField(
        max_length=8,
        unique=True,
        db_index=True,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="access_codes",
    )

    is_used = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    used_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="used_access_codes",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_access_codes",
    )

    used_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.code:
            while True:
                new_code = generate_access_code()
                if not AccessCode.objects.filter(code=new_code).exists():
                    self.code = new_code
                    break

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.course.title}"
# Create your models here.
