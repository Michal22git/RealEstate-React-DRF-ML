import pytest
from django.contrib.auth.models import User
from property.models import Property
from property.filters import PropertyFilter
from unittest.mock import patch


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


@pytest.mark.django_db
class TestPropertyFilter:
    @pytest.fixture
    def properties(self, user):
        with patch('property.models.get_coordinates') as mock_coordinates, \
                patch('property.models.distance_from_city_center') as mock_distance, \
                patch('property.models.count_specific_pois') as mock_count_pois:
            mock_coordinates.return_value = (52.2297, 21.0122)
            mock_distance.return_value = 5.0
            mock_count_pois.return_value = 10

            Property.objects.create(
                owner=user,
                title='Apartment 1',
                street='Main St',
                city='Warsaw',
                type='blockOfFlats',
                square_meters=50,
                rooms=2,
                price=200000,
                floor=3,
                floor_count=5,
                build_year=2000,
                latitude=52.2297,
                longitude=21.0122
            )
            Property.objects.create(
                owner=user,
                title='House 1',
                street='Oak St',
                city='Krakow',
                type='apartmentBuilding',
                square_meters=100,
                rooms=4,
                price=400000,
                floor=2,
                floor_count=2,
                build_year=1990,
                latitude=50.0647,
                longitude=19.9450
            )
        return Property.objects.all()

    def test_filter_by_city(self, properties):
        f = PropertyFilter({'city': 'Warsaw'}, queryset=properties)
        assert f.qs.count() == 1
        assert f.qs.first().city == 'Warsaw'

    def test_filter_by_type(self, properties):
        f = PropertyFilter({'type': 'apartmentBuilding'}, queryset=properties)
        assert f.qs.count() == 1
        assert f.qs.first().type == 'apartmentBuilding'

    def test_filter_by_price_range(self, properties):
        f = PropertyFilter({'min_price': 300000, 'max_price': 500000}, queryset=properties)
        assert f.qs.count() == 1
        assert 300000 <= f.qs.first().price <= 500000

    def test_filter_by_rooms(self, properties):
        f = PropertyFilter({'min_rooms': 4}, queryset=properties)
        assert f.qs.count() == 1
        assert f.qs.first().rooms >= 4

    def test_filter_by_square_meters_range(self, properties):
        f = PropertyFilter({'min_square_meters': 80, 'max_square_meters': 120}, queryset=properties)
        assert f.qs.count() == 1
        assert 80 <= f.qs.first().square_meters <= 120

    def test_multiple_filters(self, properties):
        f = PropertyFilter({
            'city': 'Warsaw',
            'type': 'blockOfFlats',
            'max_price': 250000
        }, queryset=properties)
        assert f.qs.count() == 1
        assert f.qs.first().title == 'Apartment 1'

    def test_no_results(self, properties):
        f = PropertyFilter({'city': 'Berlin'}, queryset=properties)
        assert f.qs.count() == 0