from django.db import models

from courses.models import Course


class CourseAIKnowledge(models.Model):
    course = models.OneToOneField(
        Course,
        on_delete=models.CASCADE,
        related_name="ai_knowledge",
    )

    content = models.TextField()

    instructions = models.TextField(
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Knowledge - {self.course.title}"




class AIUsageLog(models.Model):
    ACTION_CHOICES = [
        ("ask", "Ask"),
        ("quiz", "Quiz"),
        ("examples", "Examples"),
        ("exercises", "Exercises"),
    ]

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="ai_usage_logs",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="ai_usage_logs",
    )

    action = models.CharField(
        max_length=30,
        choices=ACTION_CHOICES,
    )

    prompt_tokens = models.IntegerField(default=0)

    completion_tokens = models.IntegerField(default=0)

    total_tokens = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.action}"
class CourseAIKnowledgeFile(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="ai_knowledge_files",
    )

    knowledge = models.ForeignKey(
        CourseAIKnowledge,
        on_delete=models.CASCADE,
        related_name="files",
    )

    file = models.FileField(upload_to="ai_knowledge_files/")

    original_filename = models.CharField(max_length=255)

    extracted_text = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_ai_knowledge_files",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.original_filename
# Create your models here.
