from django.urls import path

from .views import (
    TeacherCourseListView,
    TeacherCourseDetailView,
    TeacherLessonListCreateView,
    TeacherLessonDetailView,
    TeacherVideoLessonsView,
    TeacherMuxDirectUploadView,
    TeacherLessonFormDataView,
    TeacherLessonResourcesListCreateView,
    TeacherLessonResourceDeleteView,
    TeacherVideosListView,
    TeacherVideoFormDataView,
    TeacherUploadVideoView,
    TeacherOverviewView,
    TeacherProfileView,
    TeacherChangePasswordView,
)

urlpatterns = [
    path("courses/", TeacherCourseListView.as_view(), name="teacher-courses"),
    path("courses/<int:pk>/", TeacherCourseDetailView.as_view(), name="teacher-course-detail"),

    path("lessons/", TeacherLessonListCreateView.as_view(), name="teacher-lessons"),
    path("lessons/<int:pk>/", TeacherLessonDetailView.as_view(), name="teacher-lesson-detail"),

    path("lesson-form-data/", TeacherLessonFormDataView.as_view(), name="teacher-lesson-form-data"),

    path("lessons/<int:pk>/resources/", TeacherLessonResourcesListCreateView.as_view(), name="teacher-lesson-resources"),
    path("resources/<int:pk>/delete/", TeacherLessonResourceDeleteView.as_view(), name="teacher-resource-delete"),

    path("videos/", TeacherVideosListView.as_view(), name="teacher-videos"),
    path("videos/lessons/", TeacherVideoLessonsView.as_view(), name="teacher-video-lessons"),
    path("video-form-data/", TeacherVideoFormDataView.as_view(), name="teacher-video-form-data"),
    path("upload-video/", TeacherUploadVideoView.as_view(), name="teacher-upload-video"),
    path("mux/direct-upload/", TeacherMuxDirectUploadView.as_view(), name="teacher-mux-direct-upload"),
    path("overview/", TeacherOverviewView.as_view(), name="teacher-overview"),

    path("profile/", TeacherProfileView.as_view(), name="teacher-profile"),

    path(
        "profile/change-password/",
        TeacherChangePasswordView.as_view(),
        name="teacher-change-password",
    ),
]