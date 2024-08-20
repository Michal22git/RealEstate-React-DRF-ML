from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import FavoriteProperty
from .models import Property
from .serializers import PropertyListSerializer, PropertySerializer


class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]


class SinglePropertyView(generics.RetrieveAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        slug = self.kwargs.get('slug')
        return get_object_or_404(Property, slug=slug)


class FavoritesList(generics.ListAPIView):
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FavoriteProperty.objects.filter(user=user)


class FavoritesAdd(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertySerializer

    def perform_create(self, serializer):
        slug = self.kwargs.get('slug')
        property_instance = get_object_or_404(Property, slug=slug)
        favorite_property, created = FavoriteProperty.objects.get_or_create(user=self.request.user)

        if property_instance not in favorite_property.properties.all():
            favorite_property.properties.add(property_instance)
            return Response({"message": "Property added to favorites."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Property is already in favorites."}, status=status.HTTP_208_ALREADY_REPORTED)


class FavoritesRemove(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertySerializer

    def delete(self, request, *args, **kwargs):
        slug = self.kwargs.get('slug')
        property_instance = get_object_or_404(Property, slug=slug)
        favorite_property = get_object_or_404(FavoriteProperty, user=request.user)

        if property_instance in favorite_property.properties.all():
            favorite_property.properties.remove(property_instance)
            return Response({"message": "Property removed from favorites."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Property not found in favorites."}, status=status.HTTP_404_NOT_FOUND)
