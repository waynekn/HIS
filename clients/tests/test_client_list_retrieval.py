from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from clients import models


class TestClientRetrieval(APITestCase):
    """
    Tests for creating a client.
    """

    def setUp(self):
        """
        Create a user.
        """
        self.user = User.objects.create_user(
            username='testuser', email='testmail@test.com', password='securepassword123'
        )
        self.client = APIClient()
        client = {
            'name': 'test client'
        }
        # create clients
        self.client.force_authenticate(user=self.user)
        self.client_res = self.client.post(
            reverse('register_client'), data=client)
        self.url = reverse('client_list')

    def test_client_list_is_retrieved(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(response.data[0]['id'], self.client_res.data['id'])
