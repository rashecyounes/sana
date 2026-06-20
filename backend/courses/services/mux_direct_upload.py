import mux_python
from django.conf import settings


def create_mux_direct_upload(lesson_id):
    configuration = mux_python.Configuration()
    configuration.username = settings.MUX_TOKEN_ID
    configuration.password = settings.MUX_TOKEN_SECRET

    api_client = mux_python.ApiClient(configuration)
    direct_uploads_api = mux_python.DirectUploadsApi(api_client)

    create_asset_request = mux_python.CreateAssetRequest(
        playback_policy=["signed"],
        passthrough=str(lesson_id),
    )

    create_upload_request = mux_python.CreateUploadRequest(
        new_asset_settings=create_asset_request,
        cors_origin="*",
    )

    upload_response = direct_uploads_api.create_direct_upload(
        create_upload_request
    )

    return {
        "upload_id": upload_response.data.id,
        "upload_url": upload_response.data.url,
    }