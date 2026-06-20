import base64
from datetime import datetime, timedelta, timezone

import jwt
from decouple import config


MUX_SIGNING_KEY_ID = config("MUX_SIGNING_KEY_ID")
MUX_PRIVATE_KEY_BASE64 = config("MUX_PRIVATE_KEY")


def get_mux_private_key():
    private_key_bytes = base64.b64decode(MUX_PRIVATE_KEY_BASE64)
    return private_key_bytes.decode("utf-8")


def create_mux_video_token(playback_id: str, expires_in_minutes: int = 10):
    private_key = get_mux_private_key()

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=expires_in_minutes)

    payload = {
        "sub": playback_id,
        "aud": "v",
        "exp": int(expires_at.timestamp()),
    }

    headers = {
        "kid": MUX_SIGNING_KEY_ID,
    }

    token = jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
        headers=headers,
    )

    return token