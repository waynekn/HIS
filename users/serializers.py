from django.contrib.auth.models import User
from rest_framework import serializers


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer class for `REST_AUTH`. 

    The fields defined here are what will be returned when
    `dj-rest-auth` retreives a `User` from the database.
    """

    class Meta:
        model = User
        fields = (
            "id", "email", "username"
        )
