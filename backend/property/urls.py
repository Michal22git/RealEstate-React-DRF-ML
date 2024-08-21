from django.urls import path

from .views import (PropertyListView, SinglePropertyView, FavoritesList, FavoritesAdd, FavoritesRemove,
                    AddProperty, RemoveProperty, UpdateProperty, UserProperties)

urlpatterns = [
    path('', PropertyListView.as_view(), name='property_list'),

    path('my/', UserProperties.as_view(), name='user_properties'),
    path('add/', AddProperty.as_view(), name='add_property'),
    path('update/<slug:slug>/', UpdateProperty.as_view(), name='update_property'),
    path('remove/<slug:slug>/', RemoveProperty.as_view(), name='remove_property'),

    path('favorites/', FavoritesList.as_view(), name='favorites_list'),
    path('favorites/add/<slug:slug>/', FavoritesAdd.as_view(), name='favorites_add'),
    path('favorites/remove/<slug:slug>/', FavoritesRemove.as_view(), name='favorites_remove'),

    path('<slug:slug>/', SinglePropertyView.as_view(), name='single_property'),
]