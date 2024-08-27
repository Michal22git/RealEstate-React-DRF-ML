import { API_URL } from '../utils/utils';

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login error');
    }
    const data = await response.json();
    if (data.access && data.refresh) {
      setAuthToken(data.access);
      localStorage.setItem('refreshToken', data.refresh);
    } else {
      throw new Error('Login failed. No tokens received.');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('refreshToken');
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const response = await fetch(`${API_URL}/api/users/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Token refresh error');
    }
    const data = await response.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (error) {
    logout();
    throw error;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};

const getToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  if (isTokenExpired(token)) {
    try {
      await refreshToken();
      return localStorage.getItem('token');
    } catch (error) {
      return null;
    }
  }
  return token;
};

export const authService = {
  login,
  logout,
  refreshToken,
  getToken,
  setAuthToken
};