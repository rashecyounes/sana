from django.urls import path
from .views import (
    StudentOverviewView,
    StudentMyCoursesView,
    StudentProfileView,
)

urlpatterns = [
    path("overview/", StudentOverviewView.as_view(), name="student-overview"),
    path("my-courses/", StudentMyCoursesView.as_view(), name="student-my-courses"),
    path("profile/", StudentProfileView.as_view(), name="student-profile"),
]