from datetime import timedelta

from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User
from .models import Device, UserSession, VideoSession


MAX_DEVICES_PER_USER = 2
SESSION_IDLE_TIMEOUT_MINUTES = 60


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def get_user_data(user,request=None):
    profile_image_url = None

    if user.profile_image:
        if request:
            profile_image_url = request.build_absolute_uri(
                user.profile_image.url
            )
        else:
            profile_image_url = user.profile_image.url
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "profile_image": profile_image_url,
        "profile_image_url": profile_image_url,
    }


def set_auth_cookies(response, refresh):
    response.set_cookie(
        key="access_token",
        value=str(refresh.access_token),
        httponly=True,
        secure=False,  # True في production مع HTTPS
        samesite="Lax",
        max_age=30 * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False,  # True في production مع HTTPS
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,
    )


def delete_auth_cookies(response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")


def deactivate_expired_sessions(user):
    expired_before = timezone.now() - timedelta(
        minutes=SESSION_IDLE_TIMEOUT_MINUTES
    )

    UserSession.objects.filter(
        user=user,
        is_active=True,
        last_seen_at__lt=expired_before,
    ).update(is_active=False)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    identifier = request.data.get("identifier")
    password = request.data.get("password")

    device_id = request.headers.get("x-device-id")
    device_name = request.headers.get("x-device-name", "Unknown Device")

    if not identifier or not password:
        return Response(
            {"error": "Identifier and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not device_id:
        return Response(
            {"error": "Device ID is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user_obj = User.objects.get(
            Q(username=identifier) | Q(email=identifier) | Q(phone=identifier)
        )
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    user = authenticate(
        request,
        username=user_obj.username,
        password=password,
    )

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_active:
        return Response(
            {"error": "This account is disabled"},
            status=status.HTTP_403_FORBIDDEN,
        )

    deactivate_expired_sessions(user)

    device = Device.objects.filter(user=user, device_id=device_id).first()

    if device:
        device.device_name = device_name
        device.ip_address = get_client_ip(request)
        device.user_agent = request.META.get("HTTP_USER_AGENT", "")
        device.is_active = True
        device.save()
    else:
        active_devices_count = Device.objects.filter(
            user=user,
            is_active=True,
        ).count()

        if active_devices_count >= MAX_DEVICES_PER_USER:
            return Response(
                {"error": "Device limit reached. Max 2 devices allowed."},
                status=status.HTTP_403_FORBIDDEN,
            )

        device = Device.objects.create(
            user=user,
            device_id=device_id,
            device_name=device_name,
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            is_active=True,
        )

    UserSession.objects.filter(
        user=user,
        device=device,
        is_active=True,
    ).update(is_active=False)

    refresh = RefreshToken.for_user(user)

    UserSession.objects.create(
        user=user,
        device=device,
        refresh_token=str(refresh),
        ip_address=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
        is_active=True,
    )

    response = Response(
        {
            "message": "Login successful",
            "user": get_user_data(user),
        }
    )

    set_auth_cookies(response, refresh)

    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_access_token(request):
    refresh_token = request.COOKIES.get("refresh_token")

    if not refresh_token:
        return Response(
            {"error": "Refresh token cookie is missing"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.get("user_id")
        user = User.objects.get(id=user_id)

        response = Response(
            {
                "message": "Token refreshed successfully",
                "user": get_user_data(user),
            }
        )

        set_auth_cookies(response, refresh)

        return response

    except Exception:
        response = Response(
            {"error": "Invalid refresh token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
        delete_auth_cookies(response)
        return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    refresh_token = request.COOKIES.get("refresh_token")

    try:
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

            UserSession.objects.filter(
                user=request.user,
                refresh_token=refresh_token,
                is_active=True,
            ).update(is_active=False)

        response = Response({"message": "Logout successful"})
        delete_auth_cookies(response)
        return response

    except Exception:
        response = Response({"message": "Logout completed"})
        delete_auth_cookies(response)
        return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_devices(request):
    devices = Device.objects.filter(user=request.user).order_by("-last_login_at")

    data = [
        {
            "id": device.id,
            "device_id": device.device_id,
            "device_name": device.device_name,
            "ip_address": device.ip_address,
            "is_active": device.is_active,
            "created_at": device.created_at,
            "last_login_at": device.last_login_at,
        }
        for device in devices
    ]

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions(request):
    deactivate_expired_sessions(request.user)

    sessions = UserSession.objects.filter(user=request.user).order_by("-last_seen_at")

    data = [
        {
            "id": session.id,
            "device_name": session.device.device_name,
            "ip_address": session.ip_address,
            "is_active": session.is_active,
            "created_at": session.created_at,
            "last_seen_at": session.last_seen_at,
        }
        for session in sessions
    ]

    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deactivate_device(request, device_id):
    try:
        device = Device.objects.get(
            id=device_id,
            user=request.user,
        )
    except Device.DoesNotExist:
        return Response(
            {"error": "Device not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    device.is_active = False
    device.save()

    UserSession.objects.filter(
        user=request.user,
        device=device,
        is_active=True,
    ).update(is_active=False)

    return Response({"message": "Device deactivated successfully"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deactivate_session(request, session_id):
    try:
        user_session = UserSession.objects.get(
            id=session_id,
            user=request.user,
        )
    except UserSession.DoesNotExist:
        return Response(
            {"error": "Session not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    user_session.is_active = False
    user_session.save()

    return Response({"message": "Session deactivated successfully"})


def get_current_device(request):
    device_id = request.headers.get("x-device-id")

    if not device_id:
        return None

    try:
        return Device.objects.get(
            user=request.user,
            device_id=device_id,
            is_active=True,
        )
    except Device.DoesNotExist:
        return None


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_video(request):
    course_id = request.data.get("course_id")
    lesson_id = request.data.get("lesson_id")

    if not course_id or not lesson_id:
        return Response(
            {"error": "course_id and lesson_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    device = get_current_device(request)

    if device is None:
        return Response(
            {"error": "Valid device is required"},
            status=status.HTTP_403_FORBIDDEN,
        )

    active_video_on_other_device = VideoSession.objects.filter(
        user=request.user,
        is_active=True,
    ).exclude(device=device).exists()

    if active_video_on_other_device:
        return Response(
            {"error": "A video is already playing on another device."},
            status=status.HTTP_403_FORBIDDEN,
        )

    VideoSession.objects.filter(
        user=request.user,
        device=device,
        is_active=True,
    ).update(is_active=False)

    video_session = VideoSession.objects.create(
        user=request.user,
        device=device,
        course_id=course_id,
        lesson_id=lesson_id,
        is_active=True,
    )

    return Response(
        {
            "message": "Video session started successfully",
            "video_session_id": video_session.id,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def stop_video(request):
    course_id = request.data.get("course_id")
    lesson_id = request.data.get("lesson_id")

    device = get_current_device(request)

    if device is None:
        return Response(
            {"error": "Valid device is required"},
            status=status.HTTP_403_FORBIDDEN,
        )

    video_sessions = VideoSession.objects.filter(
        user=request.user,
        device=device,
        is_active=True,
    )

    if course_id:
        video_sessions = video_sessions.filter(course_id=course_id)

    if lesson_id:
        video_sessions = video_sessions.filter(lesson_id=lesson_id)

    video_sessions.update(is_active=False)

    return Response(
        {"message": "Video session stopped successfully"},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def video_status(request):
    device = get_current_device(request)

    if device is None:
        return Response(
            {"error": "Valid device is required"},
            status=status.HTTP_403_FORBIDDEN,
        )

    active_video = VideoSession.objects.filter(
        user=request.user,
        is_active=True,
    ).first()

    if not active_video:
        return Response(
            {
                "is_watching": False,
                "is_current_device": False,
            }
        )

    return Response(
        {
            "is_watching": True,
            "is_current_device": active_video.device_id == device.id,
            "course_id": active_video.course_id,
            "lesson_id": active_video.lesson_id,
            "started_at": active_video.started_at,
            "last_seen_at": active_video.last_seen_at,
        }
    )