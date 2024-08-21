# Generated by Django 5.1 on 2024-08-21 17:11

import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='property_images/')),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalProperty',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255)),
                ('slug', models.SlugField(blank=True, max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('street', models.CharField(max_length=255)),
                ('house_number', models.CharField(blank=True, max_length=50, null=True)),
                ('apartment_number', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(max_length=100)),
                ('zip_code', models.CharField(max_length=20)),
                ('type', models.CharField(choices=[('blockOfFlats', 'Block of Flats'), ('apartmentBuilding', 'Apartment Building'), ('tenement', 'Tenement')], max_length=100)),
                ('square_meters', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rooms', models.IntegerField()),
                ('floor', models.IntegerField()),
                ('floor_count', models.IntegerField()),
                ('build_year', models.IntegerField()),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9)),
                ('centre_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10)),
                ('poi_count', models.IntegerField(blank=True)),
                ('school_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('clinic_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('post_office_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('kindergarten_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('restaurant_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('college_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('pharmacy_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('ownership', models.CharField(choices=[('condominium', 'Condominium'), ('share', 'Share'), ('cooperative', 'Cooperative')], max_length=100)),
                ('condition', models.CharField(choices=[('premium', 'Premium'), ('low', 'Low')], max_length=100)),
                ('has_parking_space', models.BooleanField(default=False)),
                ('has_balcony', models.BooleanField(default=False)),
                ('has_elevator', models.BooleanField(default=False)),
                ('has_security', models.BooleanField(default=False)),
                ('has_storage_room', models.BooleanField(default=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('suggested_price', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical property',
                'verbose_name_plural': 'historical propertys',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('street', models.CharField(max_length=255)),
                ('house_number', models.CharField(blank=True, max_length=50, null=True)),
                ('apartment_number', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(max_length=100)),
                ('zip_code', models.CharField(max_length=20)),
                ('type', models.CharField(choices=[('blockOfFlats', 'Block of Flats'), ('apartmentBuilding', 'Apartment Building'), ('tenement', 'Tenement')], max_length=100)),
                ('square_meters', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rooms', models.IntegerField()),
                ('floor', models.IntegerField()),
                ('floor_count', models.IntegerField()),
                ('build_year', models.IntegerField()),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9)),
                ('centre_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10)),
                ('poi_count', models.IntegerField(blank=True)),
                ('school_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('clinic_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('post_office_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('kindergarten_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('restaurant_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('college_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('pharmacy_distance', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('ownership', models.CharField(choices=[('condominium', 'Condominium'), ('share', 'Share'), ('cooperative', 'Cooperative')], max_length=100)),
                ('condition', models.CharField(choices=[('premium', 'Premium'), ('low', 'Low')], max_length=100)),
                ('has_parking_space', models.BooleanField(default=False)),
                ('has_balcony', models.BooleanField(default=False)),
                ('has_elevator', models.BooleanField(default=False)),
                ('has_security', models.BooleanField(default=False)),
                ('has_storage_room', models.BooleanField(default=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('suggested_price', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('images', models.ManyToManyField(blank=True, to='property.propertyimage')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='FavoriteProperty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorite_properties', to=settings.AUTH_USER_MODEL)),
                ('properties', models.ManyToManyField(related_name='favorited_by', to='property.property')),
            ],
        ),
    ]
