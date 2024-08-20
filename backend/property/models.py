from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify


class Property(models.Model):
    BUILDING_TYPE_CHOICES = [
        ('blockOfFlats', 'Block of Flats'),
        ('apartmentBuilding', 'Apartment Building'),
        ('tenement', 'Tenement')
    ]

    OWNERSHIP_CHOICES = [
        ('condominium', 'Condominium'),
        ('udział', 'Udział'),
        ('cooperative', 'Cooperative')
    ]

    CONDITION_CHOICES = [
        ('premium', 'Premium'),
        ('low', 'Low')
    ]

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    type = models.CharField(max_length=100, choices=BUILDING_TYPE_CHOICES)
    square_meters = models.DecimalField(max_digits=10, decimal_places=2)
    rooms = models.IntegerField()
    floor = models.IntegerField()
    floor_count = models.IntegerField()
    build_year = models.IntegerField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    centre_distance = models.DecimalField(max_digits=10, decimal_places=2)
    poi_count = models.IntegerField()
    school_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    clinic_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    post_office_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    kindergarten_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    restaurant_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    college_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pharmacy_distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
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
    images = models.ManyToManyField('PropertyImage', blank=True, related_name='properties')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title or 'Property'}, {self.city}, {self.address}, {self.zip_code or 'No Zip Code'}"

    class Meta:
        ordering = ['-created_at']


class PropertyImage(models.Model):
    image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return f"Image {self.id}"


class FavoriteProperty(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_properties')
    properties = models.ManyToManyField(Property, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Favorite Properties"
