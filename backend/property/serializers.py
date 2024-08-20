from rest_framework import serializers

from .models import Property, PropertyImage
from simple_history.utils import update_change_reason


class PropertyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property.history.model
        fields = ['history_date', 'price']


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class PropertyListSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['title', 'slug', 'address', 'city', 'square_meters', 'rooms', 'floor', 'images']


class PropertySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    history = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'

    def get_history(self, obj):
        return PropertyHistorySerializer(obj.history.all(), many=True).data