from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
	queryset = Service.objects.select_related("seller").all().order_by("id")
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class ServiceDetailView(generics.RetrieveAPIView):
	queryset = Service.objects.select_related("seller").all()
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class SellerServiceManageView(generics.ListCreateAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.role not in ["Seller", "Admin"]:
			return Service.objects.none()
		if self.request.user.role == "Admin":
			return Service.objects.select_related("seller").all().order_by("id")
		return Service.objects.select_related("seller").filter(seller=self.request.user).order_by("id")

	def perform_create(self, serializer):
		if self.request.user.role not in ["Seller", "Admin"]:
			raise PermissionDenied("Seller or Admin access required.")
		serializer.save(seller=self.request.user)


class SellerServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.role not in ["Seller", "Admin"]:
			return Service.objects.none()
		if self.request.user.role == "Admin":
			return Service.objects.select_related("seller").all()
		return Service.objects.select_related("seller").filter(seller=self.request.user)
