import pytest
from django.contrib.auth.models import User

class TestUserModel:
    @pytest.mark.django_db
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass123'
        )
        assert user.username == 'testuser'
        assert user.email == 'testuser@example.com'
        assert user.check_password('testpass123')
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser