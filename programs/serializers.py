from rest_framework import serializers
from rest_framework.request import Request

from . import models


class HealthProgramRetrievalSerializer(serializers.ModelSerializer):
    """
    Serializer class for retrieving a doctors health programs
    """
    class Meta:
        model = models.HealthProgram
        fields = (
            'id', 'name'
        )


class HealthProgramCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a health program

    This serializer validates and creates a new program if the data
    passes validation.
    """
    class Meta:
        model = models.HealthProgram
        fields = ('name',)

    def validate_name(self, name: str) -> str:
        name = name.strip() if name else None

        if not name:
            raise serializers.ValidationError(
                "Please provide a name for your health program.")

        return name

    def validate(self, attrs):
        name = attrs.get('name')
        request: Request = self.context.get('request')

        if models.HealthProgram.objects.filter(name__iexact=name, owner=request.user).exists():
            raise serializers.ValidationError(
                {'detail': "You already have a program with this name. Names must be unique"}
            )

        return super().validate(attrs)

    def create(self, validated_data):
        name = validated_data.get('name')
        request: Request = self.context.get('request')

        program = models.HealthProgram.objects.create(
            name=name, owner=request.user)

        return program
