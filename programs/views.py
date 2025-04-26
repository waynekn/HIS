from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from . import models
from . import serializers
from clients.models import Client
from clients.serializers import ClientRetrievalSerializer


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


class HealthProgramCreateView(generics.CreateAPIView):
    """
    API view for creating a new health program.

    This view allows authenticated users to create a new health program. 
    The `HealthProgramCreateSerializer` is used to validate and save the input data. 
    Additionally, the response includes serialized data of the newly created health program 
    using the `HealthProgramRetrievalSerializer`.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.HealthProgramCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            program = serializer.save()
            retrieval_serializer = serializers.HealthProgramRetrievalSerializer(
                program)
            return Response(retrieval_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HealthProgramDetail(generics.ListAPIView):
    """
    API view to retrieve a list of clients enrolled in a specific health program.

    This view takes a program ID as a URL parameter and returns a JSON response
    containing the program's name and a list of enrolled clients.
    """

    def get(self, request: Request, *args, **kwargs) -> Response:
        program_id = kwargs.get('id')

        health_program = get_object_or_404(models.HealthProgram, id=program_id)

        clients = Client.objects.filter(
            programenrollment__program=health_program)

        # Serialize client data
        serialized_clients = ClientRetrievalSerializer(clients, many=True)

        return Response({
            'name': health_program.name,
            'clients': serialized_clients.data,
        }, status=status.HTTP_200_OK)


class DoctorProgramsNotEnrolledView(generics.ListAPIView):
    """
    Returns a list of health programs created by the client's doctor
    that the client has not enrolled in.

    Only the doctor associated with the client is authorized
    to access this data.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, *args, **kwargs) -> Response:
        client_id = self.kwargs.get('id')

        client = get_object_or_404(Client, id=client_id)

        if request.user != client.doctor:
            return Response({'detail': 'You dont have the necessary permissions to perform this action'},
                            status=status.HTTP_403_FORBIDDEN)

        doctor_programs = models.HealthProgram.objects.filter(
            owner=request.user)

        # Get programs the client is already enrolled in
        enrolled_programs = models.ProgramEnrollment.objects.filter(
            client=client).values_list('program', flat=True)

        # Filter out enrolled programs
        non_enrolled_programs = doctor_programs.exclude(
            id__in=enrolled_programs)

        # Serialize the data
        serialized_programs = serializers.HealthProgramRetrievalSerializer(
            non_enrolled_programs, many=True)

        return Response(
            serialized_programs.data, status=status.HTTP_200_OK)


class ProgramEnrollmentCreateView(generics.CreateAPIView):
    """
    Enrolls a client in one or more health programs specified by their IDs.

    Only the doctor who enrolled the client is allowed to perform this action.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ProgramEnrollmentSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        client_id = self.kwargs.get('id')
        programs: list[int] = request.data.get('programs')

        if not programs or type(programs) != list:
            return Response({'data': 'Bad request.Provide a list of program ids to enroll the user to'})

        client = get_object_or_404(Client, id=client_id)

        if request.user != client.doctor:
            return Response({'detail': 'You dont have the necessary permissions to perform this action'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data, context={
                                         'request': request, 'client': client})
        if serializer.is_valid():
            serializer.save()

            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
