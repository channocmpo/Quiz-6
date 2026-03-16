from rest_framework import generics, permissions

from .models import Order
from .serializers import OrderSerializer


class CreateOrderView(generics.CreateAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_create(self, serializer):
		serializer.save(buyer=self.request.user)


class UserOrderHistoryView(generics.ListAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.role == "Admin":
			return Order.objects.select_related("buyer", "service").all().order_by("-date_purchased")
		return Order.objects.select_related("buyer", "service").filter(
			buyer=self.request.user
		).order_by("-date_purchased")
