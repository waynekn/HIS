from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from . import models
from . import serializers


class HealthProgramRetrieveView(generics.ListAPIView):
    """
    API view for retrieving a list of health programs owned by the authenticated user.

    This view allows authenticated users to retrieve all health programs that they own.
    It uses the `HealthProgramRetrievalSerializer` to serialize the data and ensures 
    that only the logged-in user's programs are returned.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.HealthProgramRetrievalSerializer

    def get_queryset(self):
        user: User = self.request.user
        programs = models.HealthProgram.objects.filter(owner=user)
        return programs
