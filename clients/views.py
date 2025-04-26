from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from . import serializers
from . import models
from programs.models import ProgramEnrollment, HealthProgram
from programs.serializers import HealthProgramRetrievalSerializer
# Create your views here.


class ClientRetrievalView(generics.ListAPIView):
    """
    Retrieves a user's clients
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ClientRetrievalSerializer

    def get_queryset(self):
        return models.Client.objects.filter(doctor=self.request.user)


class ClientCreateView(generics.CreateAPIView):
    """
    API view to create a new client associated with the authenticated user (doctor).

    This view allows authenticated users (doctors) to register a new client. The view accepts 
    client data in the request body and, if valid, creates the client. It returns a serialized response 
    with the details of the newly created client.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ClientCreationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            retrieval_serializer = serializers.ClientRetrievalSerializer(
                client)

            return Response(retrieval_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientDetailView(generics.RetrieveAPIView):
    """
    Handles requests to view more info about a client.

    Retrieves their details and the health programs they are enrolled in.
    """
    serializer_class = serializers.ClientCreationSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        id = kwargs.get('id')

        client = get_object_or_404(models.Client, id=id)
        serialized_client = serializers.ClientCreationSerializer(client)

        enrolled_programs = ProgramEnrollment.objects.filter(
            client=client).values_list('program', flat=True)
        programs = HealthProgram.objects.filter(id__in=enrolled_programs)
        serialized_programs = HealthProgramRetrievalSerializer(
            programs, many=True)

        res = {
            'client': serialized_client.data,
            'programs': serialized_programs.data,
            'doctor': client.doctor.username,
        }
        return Response(res, status=status.HTTP_200_OK)


class ClientSearchView(generics.ListAPIView):
    """
    API view to retrieve a list of clients associated with the authenticated user (doctor).

    This view allows for searching clients by their name. If the `name` query parameter is provided, 
    the view will return all clients whose names contain the specified string (case-insensitive).
    If no `name` query parameter is provided, the view will return an empty list.
    """
    serializer_class = serializers.ClientRetrievalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        name = self.request.query_params.get('name')
        if name:
            return models.Client.objects.filter(doctor=self.request.user, name__icontains=name)

        return []
