from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserModel(AbstractUser):
	ROLE_CHOICES = (
		("Admin", "Admin"),
		("Seller", "Seller"),
		("User", "User"),
	)

	GENDER_CHOICES = (
		("male", "Male"),
		("female", "Female"),
		("other", "Other"),
		("prefer_not_to_say", "Prefer not to say"),
	)

	email = models.EmailField(unique=True)
	phone_number = models.CharField(max_length=20)
	location = models.CharField(max_length=255)
	gender = models.CharField(max_length=32, choices=GENDER_CHOICES)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="User")
	merchant_id = models.CharField(max_length=128, blank=True, null=True)

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = ["username"]

	def __str__(self):
		return f"{self.email} ({self.role})"
