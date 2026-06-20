from django.urls import path

from .views import (
    CourseAIKnowledgeView,
    CourseAIAskView,
    CourseAIQuizView,
    CourseAIExercisesView,
    CourseAIExamplesView,
    CourseAIKnowledgeFileUploadView,
)

urlpatterns = [
    path(
        "courses/<int:course_id>/ai-knowledge/",
        CourseAIKnowledgeView.as_view(),
        name="course-ai-knowledge",
    ),
    path(
        "courses/<int:course_id>/ai/ask/",
        CourseAIAskView.as_view(),
        name="course-ai-ask",
    ),
    path(
        "courses/<int:course_id>/ai/quiz/",
        CourseAIQuizView.as_view(),
        name="course-ai-quiz",
    ),
    path(
        "courses/<int:course_id>/ai/exercises/",
        CourseAIExercisesView.as_view(),
        name="course-ai-exercises",
    ),
    path(
        "courses/<int:course_id>/ai/examples/",
        CourseAIExamplesView.as_view(),
        name="course-ai-examples",
    ),
    path(
    "courses/<int:course_id>/ai-knowledge/upload-file/",
    CourseAIKnowledgeFileUploadView.as_view(),
    name="course-ai-knowledge-upload-file",
    ),
]