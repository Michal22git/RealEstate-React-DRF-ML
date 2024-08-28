import pytest
from django.contrib.auth.models import User
from property.models import Property
from property.serializers import PropertySerializer, PropertyListSerializer
from rest_framework.test import APIRequestFactory
from unittest.mock import patch


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


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
class TestPropertySerializer:
    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_property_serializer_create(self, mock_count_pois, mock_distance, mock_coordinates, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        factory = APIRequestFactory()
        request = factory.post('/fake-url/')
        request.user = user
        serializer = PropertySerializer(data=property_data, context={'request': request})
        assert serializer.is_valid(), serializer.errors
        property = serializer.save(owner=user)
        assert isinstance(property, Property)
        assert property.title == 'Test Property'

    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_property_list_serializer(self, mock_count_pois, mock_distance, mock_coordinates, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        property = Property.objects.create(owner=user, **property_data)
        serializer = PropertyListSerializer(property)
        data = serializer.data
        assert 'id' in data
        assert 'title' in data
        assert 'slug' in data
        assert 'price' in data
        assert 'city' in data