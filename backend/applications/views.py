from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import CustomUserModel

from .models import SellerApplication
from .serializers import SellerApplicationSerializer


class SubmitApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		pending_exists = SellerApplication.objects.filter(
			user=request.user,
			status="Pending",
		).exists()
		if pending_exists:
			return Response(
				{"detail": "You already have a pending application."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		application = SellerApplication.objects.create(user=request.user)
		serializer = SellerApplicationSerializer(application)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListApplicationView(ListAPIView):
	serializer_class = SellerApplicationSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.role == "Admin":
			return SellerApplication.objects.select_related("user").order_by("-created_at")
		return SellerApplication.objects.filter(user=self.request.user).order_by("-created_at")


class ApproveApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, pk):
		if request.user.role != "Admin":
			return Response({"detail": "Admin access required."}, status=403)

		application = SellerApplication.objects.select_related("user").filter(pk=pk).first()
		if not application:
			return Response({"detail": "Application not found."}, status=404)

		merchant_id = request.data.get("merchant_id")
		if not merchant_id:
			return Response({"detail": "merchant_id is required."}, status=400)

		application.status = "Approved"
		application.decline_reason = ""
		application.save()

		user = CustomUserModel.objects.get(pk=application.user_id)
		user.role = "Seller"
		user.merchant_id = merchant_id
		user.save()

		serializer = SellerApplicationSerializer(application)
		return Response(serializer.data)


class DeclineApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, pk):
		if request.user.role != "Admin":
			return Response({"detail": "Admin access required."}, status=403)

		application = SellerApplication.objects.filter(pk=pk).first()
		if not application:
			return Response({"detail": "Application not found."}, status=404)

		decline_reason = request.data.get("decline_reason", "")
		if not decline_reason:
			return Response({"detail": "decline_reason is required."}, status=400)

		application.status = "Declined"
		application.decline_reason = decline_reason
		application.save()

		serializer = SellerApplicationSerializer(application)
		return Response(serializer.data)
