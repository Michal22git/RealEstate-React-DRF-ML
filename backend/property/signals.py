import os

from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import Property


@receiver(pre_delete, sender=Property)
def delete_property_images(sender, instance, **kwargs):
    for image in instance.images.all():
        if os.path.isfile(image.image.path):
            os.remove(image.image.path)
        image.delete()
