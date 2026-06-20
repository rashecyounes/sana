from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CourseViewSet,
    upload_lesson_video,
)


router = DefaultRouter()
router.register("", CourseViewSet, basename="courses")


urlpatterns = [
    
    path(
        "upload-video/",
        upload_lesson_video,
        name="upload_lesson_video",
    ),
    path("", include(router.urls)),
]