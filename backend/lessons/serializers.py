from rest_framework import serializers
from .models import Lesson, LessonResource


class LessonResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(
        source="uploaded_by.username",
        read_only=True,
    )

    class Meta:
        model = LessonResource
        fields = [
            "id",
            "lesson",
            "title",
            "file",
            "description",
            "uploaded_by",
            "uploaded_by_name",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "uploaded_by",
            "uploaded_by_name",
            "created_at",
        ]


class LessonSerializer(serializers.ModelSerializer):
    resources = LessonResourceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "title",
            "description",
            "video_provider",
            "video_asset_id",
            "video_playback_id",

            # DRM Ready Fields
            "is_drm_protected",
            "drm_license_type",

            "thumbnail",
            "order",
            "duration",
            "is_preview",
            "is_published",
            "resources",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "course",
            "video_asset_id",
            "video_playback_id",
            "is_drm_protected",
            "drm_license_type",
            "resources",
            "created_at",
            "updated_at",
        ]