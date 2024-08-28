import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')

class TestUserRegister:
    @pytest.mark.django_db
    def test_user_registration_success(self, api_client):
        url = reverse('user_register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'username' in response.data
        assert User.objects.filter(username='newuser').exists()

    @pytest.mark.django_db
    def test_user_registration_duplicate_username(self, api_client, user):
        url = reverse('user_register')
        data = {
            'username': 'testuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in response.data

class TestLoginView:
    @pytest.mark.django_db
    def test_user_login_success(self, api_client, user):
        url = reverse('token_obtain_pair')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    @pytest.mark.django_db
    def test_user_login_invalid_credentials(self, api_client):
        url = reverse('token_obtain_pair')
        data = {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED