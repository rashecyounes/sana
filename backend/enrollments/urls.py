from django.urls import path
from .views import MyCoursesView

urlpatterns = [
    path("my-courses/", MyCoursesView.as_view(), name="my-courses"),
]