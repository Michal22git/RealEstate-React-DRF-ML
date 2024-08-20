from django.urls import path

from .views import (PropertyListView, SinglePropertyView, FavoritesList, FavoritesAdd, FavoritesRemove,
                    AddProperty)

urlpatterns = [
    path('', PropertyListView.as_view(), name='property_list'),
    path('favorites/', FavoritesList.as_view(), name='favorites_list'),
    path('favorites/add/<slug:slug>/', FavoritesAdd.as_view(), name='favorites_add'),
    path('favorites/remove/<slug:slug>/', FavoritesRemove.as_view(), name='favorites_remove'),
    path('<slug:slug>/', SinglePropertyView.as_view(), name='single_property'),
    path('add/', AddProperty.as_view(), name='add_property')
]