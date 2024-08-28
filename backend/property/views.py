from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import PropertyFilter
from .models import Property, FavoriteProperty
from .serializers import PropertyListSerializer, PropertySerializer, FavoritePropertySerializer
from .utils import get_coordinates, count_specific_pois, distance_from_city_center, predict_price


class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter


class SinglePropertyView(generics.RetrieveAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        slug = self.kwargs.get('slug')
        return get_object_or_404(Property, slug=slug)


class FavoritesList(generics.ListAPIView):
    serializer_class = FavoritePropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteProperty.objects.filter(user=self.request.user)


class FavoritesAdd(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertySerializer

    def post(self, request, *args, **kwargs):
        slug = self.kwargs.get('slug')
        property_instance = get_object_or_404(Property, slug=slug)
        favorite_property, created = FavoriteProperty.objects.get_or_create(user=request.user)

        if property_instance not in favorite_property.properties.all():
            favorite_property.properties.add(property_instance)
            return Response({"message": "Property added to favorites."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Property is already in favorites."}, status=status.HTTP_208_ALREADY_REPORTED)


class FavoritesRemove(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertySerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Property.objects.filter(favorited_by__user=self.request.user)

    def perform_destroy(self, instance):
        favorite_property = get_object_or_404(FavoriteProperty, user=self.request.user)
        favorite_property.properties.remove(instance)


class UserProperties(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


class AddProperty(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UpdateProperty(generics.UpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class RemoveProperty(generics.DestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


class PredictPrice(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            street = request.data.get('street')
            house_number = request.data.get('houseNumber')
            city = request.data.get('city')
            address = f"{street} {house_number}, {city}"

            latitude, longitude = get_coordinates(address)
            centre_distance = distance_from_city_center(address, city)
            poi_count = count_specific_pois(latitude, longitude)

            data = {
                'city': city,
                'type': request.data.get('type'),
                'squareMeters': float(request.data.get('squareMeters')),
                'rooms': float(request.data.get('rooms')),
                'floor': float(request.data.get('floor')),
                'floorCount': float(request.data.get('floorCount')),
                'buildYear': int(request.data.get('buildYear')),
                'latitude': latitude,
                'longitude': longitude,
                'centreDistance': centre_distance,
                'poiCount': poi_count,
                'ownership': request.data.get('ownership'),
                'condition': request.data.get('condition'),
                'hasParkingSpace': int(request.data.get('hasParkingSpace')),
                'hasBalcony': int(request.data.get('hasBalcony')),
                'hasElevator': int(request.data.get('hasElevator')),
                'hasSecurity': int(request.data.get('hasSecurity')),
                'hasStorageRoom': int(request.data.get('hasStorageRoom'))
            }

            predicted_price = predict_price(data)
            return Response({'predicted_price': predicted_price}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
