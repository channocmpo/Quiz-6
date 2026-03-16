from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUserModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = [
            "id",
            "email",
            "username",
            "phone_number",
            "first_name",
            "last_name",
            "location",
            "gender",
            "role",
            "merchant_id",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUserModel
        fields = [
            "email",
            "username",
            "phone_number",
            "first_name",
            "last_name",
            "location",
            "gender",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Password and confirm_password must match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        user = CustomUserModel(**validated_data)
        user.role = "User"
        user.set_password(password)
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
