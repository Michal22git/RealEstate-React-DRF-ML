import django_filters

from .models import Property


class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    zip_code = django_filters.CharFilter(field_name='zip_code', lookup_expr='icontains')
    type = django_filters.ChoiceFilter(field_name='type', choices=Property.BUILDING_TYPE_CHOICES)
    ownership = django_filters.ChoiceFilter(field_name='ownership', choices=Property.OWNERSHIP_CHOICES)
    condition = django_filters.ChoiceFilter(field_name='condition', choices=Property.CONDITION_CHOICES)
    min_square_meters = django_filters.NumberFilter(field_name='square_meters', lookup_expr='gte')
    max_square_meters = django_filters.NumberFilter(field_name='square_meters', lookup_expr='lte')
    min_rooms = django_filters.NumberFilter(field_name='rooms', lookup_expr='gte')
    max_rooms = django_filters.NumberFilter(field_name='rooms', lookup_expr='lte')
    min_floor = django_filters.NumberFilter(field_name='floor', lookup_expr='gte')
    max_floor = django_filters.NumberFilter(field_name='floor', lookup_expr='lte')
    min_build_year = django_filters.NumberFilter(field_name='build_year', lookup_expr='gte')
    max_build_year = django_filters.NumberFilter(field_name='build_year', lookup_expr='lte')
    min_centre_distance = django_filters.NumberFilter(field_name='centre_distance', lookup_expr='gte')
    max_centre_distance = django_filters.NumberFilter(field_name='centre_distance', lookup_expr='lte')
    has_parking_space = django_filters.BooleanFilter(field_name='has_parking_space')
    has_balcony = django_filters.BooleanFilter(field_name='has_balcony')
    has_elevator = django_filters.BooleanFilter(field_name='has_elevator')
    has_security = django_filters.BooleanFilter(field_name='has_security')
    has_storage_room = django_filters.BooleanFilter(field_name='has_storage_room')

    class Meta:
        model = Property
        fields = [
            'city', 'zip_code', 'type', 'ownership', 'condition',
            'min_price', 'max_price', 'min_square_meters', 'max_square_meters',
            'min_rooms', 'max_rooms', 'min_floor', 'max_floor',
            'min_build_year', 'max_build_year',
            'min_centre_distance', 'max_centre_distance',
            'has_parking_space', 'has_balcony', 'has_elevator', 'has_security', 'has_storage_room'
        ]