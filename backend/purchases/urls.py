from django.urls import path
from .views import CreatePurchaseView, CompletePurchaseView

urlpatterns = [
    path("create/", CreatePurchaseView.as_view(), name="create-purchase"),
    path(
        "<int:purchase_id>/complete/",
        CompletePurchaseView.as_view(),
        name="complete-purchase",
    ),
]