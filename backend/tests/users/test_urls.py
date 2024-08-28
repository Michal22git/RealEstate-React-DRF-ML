from django.urls import reverse, resolve
from users.views import UserRegister, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

class TestUserUrls:
    def test_register_url(self):
        url = reverse('user_register')
        assert resolve(url).func.view_class == UserRegister

    def test_login_url(self):
        url = reverse('token_obtain_pair')
        assert resolve(url).func.view_class == LoginView

    def test_token_refresh_url(self):
        url = reverse('token_refresh')
        assert resolve(url).func.view_class == TokenRefreshView