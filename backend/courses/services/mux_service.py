import mux_python

from decouple import config


MUX_TOKEN_ID = config("MUX_TOKEN_ID")
MUX_TOKEN_SECRET = config("MUX_TOKEN_SECRET")

MUX_DRM_ENABLED = config(
    "MUX_DRM_ENABLED",
    default=False,
    cast=bool,
)

MUX_DRM_CONFIGURATION_ID = config(
    "MUX_DRM_CONFIGURATION_ID",
    default="",
)


configuration = mux_python.Configuration()
configuration.username = MUX_TOKEN_ID
configuration.password = MUX_TOKEN_SECRET

mux_client = mux_python.ApiClient(configuration)
assets_api = mux_python.AssetsApi(mux_client)


def create_mux_asset(video_url: str):
    """
    Create a Mux asset from a video URL.

    Current mode:
    - Signed playback enabled.

    DRM-ready mode:
    - If MUX_DRM_ENABLED=True, the system will attach
      the DRM configuration ID to the asset creation request.
    """

    create_asset_data = {
        "inputs": [
            mux_python.InputSettings(
                url=video_url,
            )
        ],
        "playback_policy": ["signed"],
    }

    if MUX_DRM_ENABLED:
        if not MUX_DRM_CONFIGURATION_ID:
            raise ValueError(
                "MUX_DRM_ENABLED=True but MUX_DRM_CONFIGURATION_ID is missing."
            )

        create_asset_data["drm_configuration_id"] = MUX_DRM_CONFIGURATION_ID

    create_asset_request = mux_python.CreateAssetRequest(
        **create_asset_data
    )

    asset = assets_api.create_asset(create_asset_request)

    return {
        "asset_id": asset.data.id,
        "playback_id": (
            asset.data.playback_ids[0].id
            if asset.data.playback_ids
            else None
        ),
        "status": asset.data.status,
        "drm_enabled": MUX_DRM_ENABLED,
        "drm_configuration_id": (
            MUX_DRM_CONFIGURATION_ID
            if MUX_DRM_ENABLED
            else None
        ),
    }