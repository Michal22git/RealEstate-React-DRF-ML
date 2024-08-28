import pytest
from django.contrib.auth.models import User
from users.serializers import UserRegisterSerializer, MyTokenObtainPairSerializer

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')

class TestUserRegisterSerializer:
    @pytest.mark.django_db
    def test_user_register_serializer_valid_data(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        serializer = UserRegisterSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        assert isinstance(user, User)
        assert user.username == 'newuser'
        assert user.email == 'newuser@example.com'
        assert user.check_password('newpass123')

    @pytest.mark.django_db
    def test_user_register_serializer_invalid_data(self):
        data = {
            'username': 'newuser',
            'email': 'invalid_email',
            'password': 'short'
        }
        serializer = UserRegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors
        assert 'password' in serializer.errors

class TestMyTokenObtainPairSerializer:
    @pytest.mark.django_db
    def test_token_obtain_pair_serializer(self, user):
        serializer = MyTokenObtainPairSerializer()
        token = serializer.get_token(user)
        assert 'username' in token
        assert 'email' in token