import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import PropertyList from '../components/PropertyList';
import { API_URL } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faHome } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites/');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        const token = await authService.getToken();
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserData(decodedToken);
          fetchProperties('favorites/');
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const fetchProperties = async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}/api/property/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(endpoint === 'favorites/' ? data[0].properties : data);
      setActiveTab(endpoint);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleFavoriteToggle = (propertyId, isFavorite) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId ? { ...property, is_favorite: isFavorite } : property
      )
    );
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <FontAwesomeIcon icon={faUser} className="user-avatar" />
        <h2>{userData.username}</h2>
        <p>{userData.email}</p>
      </div>
      
      <div className="user-actions">
        <button 
          className={`action-button ${activeTab === 'favorites/' ? 'active' : ''}`}
          onClick={() => fetchProperties('favorites/')}
        >
          <FontAwesomeIcon icon={faStar} /> Favorites
        </button>
        <button 
          className={`action-button ${activeTab === 'my/' ? 'active' : ''}`}
          onClick={() => fetchProperties('my/')}
        >
          <FontAwesomeIcon icon={faHome} /> My Properties
        </button>
      </div>
      
      {activeTab && (
        <PropertyList 
          properties={properties}
          isAuthenticated={isAuthenticated}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
};

export default ProfilePage;