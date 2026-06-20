from django.urls import path

from .views import (
    AccessCodesListView,
    ToggleAccessCodeActiveView,
    GenerateAccessCodesView,
    RedeemAccessCodeView,
)

urlpatterns = [
    path("", AccessCodesListView.as_view(), name="access-codes-list"),
    path(
        "<int:pk>/toggle-active/",
        ToggleAccessCodeActiveView.as_view(),
        name="toggle-access-code-active",
    ),
    path("generate/", GenerateAccessCodesView.as_view(), name="generate-access-codes"),
    path("redeem/", RedeemAccessCodeView.as_view(), name="redeem-access-code"),
]