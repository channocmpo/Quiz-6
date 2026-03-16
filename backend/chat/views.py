import json
import os
from urllib import error, parse, request

from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class AIChatbotView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request_data):
		question = request_data.data.get("question", "").strip()
		if not question:
			return Response({"detail": "question is required."}, status=status.HTTP_400_BAD_REQUEST)

		api_key = settings.GEMINI_API_KEY or os.getenv("REACT_APP_GEMINI_API_KEY")
		if not api_key:
			return Response(
				{"detail": "Gemini API key is not configured on server."},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)

		prompt = (
			"You are an assistant for a Car Wash & Detailing Services platform. "
			"Only answer questions about this project domain: users, sellers, services, orders, "
			"PayPal transactions, and platform workflows. "
			"If out-of-scope, reply exactly: I can only answer questions related to this Car Wash & Detailing Services platform.\n\n"
			f"User question: {question}"
		)

		payload = {
			"contents": [{"parts": [{"text": prompt}]}],
		}

		url = (
			"https://generativelanguage.googleapis.com/v1beta/models/"
			"gemini-1.5-flash:generateContent"
		)
		full_url = f"{url}?key={parse.quote(api_key)}"

		req = request.Request(
			full_url,
			data=json.dumps(payload).encode("utf-8"),
			headers={"Content-Type": "application/json"},
			method="POST",
		)

		try:
			with request.urlopen(req, timeout=30) as response:
				response_json = json.loads(response.read().decode("utf-8"))
		except error.URLError as exc:
			return Response({"detail": f"Failed to call Gemini API: {exc}"}, status=502)

		candidates = response_json.get("candidates", [])
		answer = "No response from Gemini."
		if candidates:
			parts = candidates[0].get("content", {}).get("parts", [])
			if parts and "text" in parts[0]:
				answer = parts[0]["text"]

		return Response({"answer": answer}, status=200)
