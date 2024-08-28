import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from property.models import Property
from unittest.mock import patch


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def property_data():
    return {
        'title': 'Test Property',
        'street': 'Test Street',
        'city': 'Test City',
        'zip_code': '12345',
        'type': 'blockOfFlats',
        'square_meters': 100,
        'rooms': 3,
        'floor': 2,
        'floor_count': 5,
        'build_year': 2000,
        'price': 200000,
        'ownership': 'condominium',
        'condition': 'premium'
    }


@pytest.mark.django_db
class TestPropertyViews:
    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_add_property(self, mock_count_pois, mock_distance, mock_coordinates, api_client, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        api_client.force_authenticate(user=user)
        url = reverse('add_property')
        response = api_client.post(url, property_data)
        assert response.status_code == status.HTTP_201_CREATED, response.content
        assert Property.objects.count() == 1
        assert Property.objects.first().title == 'Test Property'

    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_update_property(self, mock_count_pois, mock_distance, mock_coordinates, api_client, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        api_client.force_authenticate(user=user)
        property = Property.objects.create(owner=user, **property_data)
        url = reverse('update_property', kwargs={'slug': property.slug})
        updated_data = property_data.copy()
        updated_data['title'] = 'Updated Property'
        response = api_client.put(url, updated_data)
        assert response.status_code == status.HTTP_200_OK, response.content
        assert response.data['title'] == 'Updated Property'

    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_remove_property(self, mock_count_pois, mock_distance, mock_coordinates, api_client, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        api_client.force_authenticate(user=user)
        property = Property.objects.create(owner=user, **property_data)
        url = reverse('remove_property', kwargs={'slug': property.slug})
        response = api_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Property.objects.count() == 0