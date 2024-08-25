from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from simple_history.models import HistoricalRecords

from .utils import get_coordinates, count_specific_pois, distance_from_city_center


class Property(models.Model):
    BUILDING_TYPE_CHOICES = [
        ('blockOfFlats', 'Block of Flats'),
        ('apartmentBuilding', 'Apartment Building'),
        ('tenement', 'Tenement')
    ]

    OWNERSHIP_CHOICES = [
        ('condominium', 'Condominium'),
        ('share', 'Share'),
        ('cooperative', 'Cooperative')
    ]

    CONDITION_CHOICES = [
        ('premium', 'Premium'),
        ('low', 'Low')
    ]

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    street = models.CharField(max_length=255)
    house_number = models.CharField(max_length=50, blank=True, null=True)
    apartment_number = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    type = models.CharField(max_length=100, choices=BUILDING_TYPE_CHOICES)
    square_meters = models.DecimalField(max_digits=10, decimal_places=2)
    rooms = models.IntegerField()
    floor = models.IntegerField()
    floor_count = models.IntegerField()
    build_year = models.IntegerField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=False)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=False)
    centre_distance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=False)
    poi_count = models.IntegerField(blank=True, null=False)
    ownership = models.CharField(max_length=100, choices=OWNERSHIP_CHOICES)
    condition = models.CharField(max_length=100, choices=CONDITION_CHOICES)
    has_parking_space = models.BooleanField(default=False)
    has_balcony = models.BooleanField(default=False)
    has_elevator = models.BooleanField(default=False)
    has_security = models.BooleanField(default=False)
    has_storage_room = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    suggested_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    images = models.ManyToManyField('PropertyImage', blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        address = f"{self.street} {self.house_number}, {self.city}"
        if self.city:
            try:
                self.latitude, self.longitude = get_coordinates(address)
            except ValueError as e:
                raise ValueError(f"Failed to retrieve coordinates: {str(e)}")

            try:
                self.centre_distance = distance_from_city_center(address, self.city)
            except ValueError as e:
                raise ValueError(f"Failed to calculate distance from city center: {str(e)}")

            if self.latitude and self.longitude:
                self.poi_count = count_specific_pois(self.latitude, self.longitude)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title or 'Property'}, {self.city}"

    class Meta:
        ordering = ['-created_at']


class PropertyImage(models.Model):
    image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return f"Image {self.id}"


class FavoriteProperty(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_properties')
    properties = models.ManyToManyField(Property, related_name='favorited_by')

    def __str__(self):
        return f"{self.user.username}'s Favorite Properties"
