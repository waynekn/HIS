from rest_framework import serializers
from rest_framework.request import Request

from . import models


class ClientCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = ('name',)

    def validate_name(self, name: str) -> str:
        name = name.strip() if name else None

        if not name:
            raise serializers.ValidationError(
                "Please provide a name for your client.")

        return name

    def validate(self, attrs):
        name = attrs.get('name')
        request: Request = self.context.get('request')

        try:
            models.Client.objects.get(name__iexact=name, doctor=request.user)
            raise serializers.ValidationError(
                {'detail': "You already have a client with this name. Please use a different name to register the client."}
            )
        except models.Client.DoesNotExist:
            pass

        return super().validate(attrs)

    def create(self, validated_data):
        name = validated_data.get('name')
        request: Request = self.context.get('request')

        client = models.Client.objects.create(
            name=name, doctor=request.user)

        return client
