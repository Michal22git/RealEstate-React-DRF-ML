from django.contrib import admin

from .models import PropertyImage, Property, FavoriteProperty

admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(FavoriteProperty)
