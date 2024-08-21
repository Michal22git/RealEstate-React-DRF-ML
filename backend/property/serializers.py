from rest_framework import serializers

from .models import Property, PropertyImage, FavoriteProperty


class PropertyHistorySerializer(serializers.ModelSerializer):
    history_date = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Property.history.model
        fields = ['history_date', 'price']


class PropertyImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PropertyImage
        fields = '__all__'


class PropertyListSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['title', 'slug', 'street', 'house_number', 'apartment_number', 'city', 'square_meters', 'rooms',
                  'floor', 'price', 'suggested_price', 'images']


class PropertySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=False, required=False)
    owner = serializers.ReadOnlyField(source='owner.username')
    history = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('images')
        property_instance = Property.objects.create(**validated_data)

        for image_data in images_data:
            image_instance = PropertyImage.objects.create(image=image_data)
            property_instance.images.add(image_instance)

        return property_instance

    def get_history(self, obj):
        return PropertyHistorySerializer(obj.history.all(), many=True).data


class FavoritePropertySerializer(serializers.ModelSerializer):
    properties = PropertyListSerializer(many=True, read_only=True)

    class Meta:
        model = FavoriteProperty
        fields = ['properties']
