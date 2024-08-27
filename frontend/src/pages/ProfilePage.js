import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        const token = await authService.getToken();
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserData(decodedToken);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  if (!userData) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h1>Profil użytkownika</h1>
      <p>Nazwa użytkownika: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <p>Data dołączenia: {new Date(userData.date_joined).toLocaleString()}</p>
    </div>
  );
};

export default ProfilePage;