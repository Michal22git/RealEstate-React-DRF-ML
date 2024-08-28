import pytest
from django.contrib.auth.models import User
from property.models import Property
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
        'type': 'apartment',
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
class TestPropertyModel:
    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_property_creation(self, mock_count_pois, mock_distance, mock_coordinates, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        property = Property.objects.create(owner=user, **property_data)
        assert isinstance(property, Property)
        assert property.title == 'Test Property'
        assert property.owner == user

    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_property_str_method(self, mock_count_pois, mock_distance, mock_coordinates, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        property = Property.objects.create(owner=user, **property_data)
        assert str(property) == 'Test Property, Test City'

    @patch('property.models.get_coordinates')
    @patch('property.models.distance_from_city_center')
    @patch('property.models.count_specific_pois')
    def test_property_slug_generation(self, mock_count_pois, mock_distance, mock_coordinates, user, property_data):
        mock_coordinates.return_value = (52.2297, 21.0122)
        mock_distance.return_value = 5.0
        mock_count_pois.return_value = 10

        property = Property.objects.create(owner=user, **property_data)
        assert property.slug == 'test-property'