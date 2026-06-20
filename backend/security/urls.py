from django.urls import path

from .views import (
    login,
    logout,
    refresh_access_token,

    my_devices,
    my_sessions,

    deactivate_device,
    deactivate_session,

    start_video,
    stop_video,
    video_status,
)

urlpatterns = [
    path("login/", login),
    path("logout/", logout),
    path("refresh/", refresh_access_token),

    path("devices/", my_devices),
    path("sessions/", my_sessions),

    path("devices/<int:device_id>/deactivate/", deactivate_device),
    path("sessions/<int:session_id>/deactivate/", deactivate_session),

    path("video/start/", start_video),
    path("video/stop/", stop_video),
    path("video/status/", video_status),
]