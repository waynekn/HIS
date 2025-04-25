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
