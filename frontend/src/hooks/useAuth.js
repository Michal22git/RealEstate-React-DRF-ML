import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authService.getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      if (data.access && data.refresh) {
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error('Login failed. No tokens received.');
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};