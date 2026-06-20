from django.db import models
from django.conf import settings
from courses.models import Course


class CourseEnrollment(models.Model):
    class Source(models.TextChoices):
        ACCESS_CODE = "access_code", "Access Code"
        PURCHASE = "purchase", "Purchase"
        ADMIN_GRANT = "admin_grant", "Admin Grant"
        FREE = "free", "Free"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_enrollments",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_enrollment",
            )
        ]

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"
# Create your models here.
