from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from programs import models


class TestHealthProgramCreation(APITestCase):
    """
    Tests for creating a health program.
    """

    def setUp(self):
        """
        Create a user.
        """
        self.user = User.objects.create_user(
            username='testuser', email='testmail@test.com', password='securepassword123'
        )
        self.client = APIClient()
        self.data = {
            'name': 'HIV'
        }
        self.client.force_authenticate(user=self.user)
        self.url = reverse('create_health_program')

    def test_program_is_created(self):
        response = self.client.post(self.url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(models.HealthProgram.objects.filter(
            name=self.data['name'], owner=self.user).exists())
        self.assertEqual(response.data['name'], self.data['name'])

    def test_name_must_be_provided(self):
        response = self.client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_must_be_unique(self):
        # first create a program with that name
        self.client.post(self.url, data=self.data)

        # re attemt to create it with another name
        response = self.client.post(self.url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
