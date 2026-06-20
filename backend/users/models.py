from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        TEACHER = "teacher", "Teacher"
        ADMIN = "admin", "Admin"

    # ✅ إعادة تعريف email بشكل صحيح
    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )

    phone = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
    )

    profile_image = models.ImageField(
        upload_to="profiles/",
        null=True,
        blank=True,
    )

    bio = models.TextField(
        null=True,
        blank=True,
    )

    city = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )

    school_name = models.CharField(
        max_length=150,
        null=True,
        blank=True,
    )

    parent_phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.role == self.Role.ADMIN:
            self.is_staff = True
            self.is_superuser = True

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} - {self.role}"