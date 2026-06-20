from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "phone",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
        ]

    def validate(self, data):
        # ✅ Password match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "password": "Passwords do not match"
            })

        # ✅ Email unique
        email = data.get("email")
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "هذا البريد الإلكتروني مستخدم مسبقاً"
            })

        # ✅ Phone unique
        phone = data.get("phone")
        if phone and User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({
                "phone": "رقم الهاتف مستخدم مسبقاً"
            })

        # ✅ Username unique (زيادة أمان)
        username = data.get("username")
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                "username": "اسم المستخدم مستخدم مسبقاً"
            })

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User(
            username=validated_data["username"],
            email=validated_data.get("email"),
            phone=validated_data.get("phone"),
            first_name=validated_data.get("first_name"),
            last_name=validated_data.get("last_name"),
        )

        user.set_password(validated_data["password"])
        user.role = User.Role.STUDENT

        user.save()
        return user