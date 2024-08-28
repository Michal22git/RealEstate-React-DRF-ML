import React, { useState, useEffect } from 'react';
import PropertyFilter from '../components/PropertyFilter';
import PropertyList from '../components/PropertyList';
import SearchBar from '../components/SearchBar';
import SortOptions from '../components/SortOptions';
import AddPropertyModal from '../components/AddPropertyModal';
import { API_URL } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [currentSort, setCurrentSort] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchProperties();
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      setUserData({
        user_id: decodedToken.user_id,
        username: decodedToken.username,
        email: decodedToken.email
      });
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const fetchProperties = async (filters = {}) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/api/property/?${queryString}`, { headers });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched properties:', data);
      setProperties(data);
      setFilteredProperties(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again later.');
      setIsLoading(false);
    }
  };

  const applyFilters = (filters) => {
    setCurrentFilters(filters);
    fetchProperties(filters);
  };

  const handleSort = (sortOption) => {
    setCurrentSort(sortOption);
    const sortedProperties = [...filteredProperties].sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'square_meters_asc':
          return a.square_meters - b.square_meters;
        case 'square_meters_desc':
          return b.square_meters - a.square_meters;
        case 'rooms_asc':
          return a.rooms - b.rooms;
        case 'rooms_desc':
          return b.rooms - a.rooms;
        default:
          return 0;
      }
    });
    setFilteredProperties(sortedProperties);
  };

  const handleSearch = (query) => {
    const searched = properties.filter(property =>
      property.title.toLowerCase().includes(query.toLowerCase()) ||
      property.city.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(searched);
  };

  const handleFavoriteToggle = (propertyId, isFavorite) => {
    const updatedProperties = properties.map(property => 
      property.id === propertyId ? { ...property, is_favorite: isFavorite } : property
    );
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  const handleUpdateProperty = (updatedProperty) => {
    const updatedProperties = properties.map(property =>
      property.id === updatedProperty.id ? updatedProperty : property
    );
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  const handleDeleteProperty = (deletedPropertyId) => {
    const updatedProperties = properties.filter(property => property.id !== deletedPropertyId);
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  if (isLoading) {
    return <div className="loading">Ładowanie...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="sidebar">
        <PropertyFilter onFilter={applyFilters} currentFilters={currentFilters} />
      </div>
      <div className="main-content">
        <div className="top-bar">
          <SearchBar onSearch={handleSearch} />
          <SortOptions onSort={handleSort} currentSort={currentSort} />
        </div>
        <PropertyList 
          properties={filteredProperties} 
          isAuthenticated={isAuthenticated}
          onFavoriteToggle={handleFavoriteToggle}
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
          userData={userData}
        />
      </div>
      <button 
        className="add-property-button"
        onClick={() => setIsAddPropertyModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen}
        onRequestClose={() => setIsAddPropertyModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;