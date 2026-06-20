import json
import hmac
import hashlib
from django.conf import settings


def verify_mux_webhook_signature(request):
    mux_signature = request.headers.get("Mux-Signature")

    if not mux_signature:
        return False

    webhook_secret = getattr(settings, "MUX_WEBHOOK_SECRET", None)

    if not webhook_secret:
        return False

    raw_body = request.body

    parts = dict(
        item.split("=", 1)
        for item in mux_signature.split(",")
        if "=" in item
    )

    timestamp = parts.get("t")
    received_signature = parts.get("v1")

    if not timestamp or not received_signature:
        return False

    signed_payload = timestamp.encode() + b"." + raw_body

    expected_signature = hmac.new(
        webhook_secret.encode(),
        signed_payload,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_signature, received_signature)


def parse_mux_webhook_body(request):
    return json.loads(request.body.decode("utf-8"))