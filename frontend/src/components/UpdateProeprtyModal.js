import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBed, faRuler, faBuilding, faRoad, faHome, faDoorOpen, faCity, faTools } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/utils';

const UpdatePropertyModal = ({ isOpen, onRequestClose, property, onPropertyUpdated }) => {
  const [formData, setFormData] = useState({ ...property });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({ ...property });
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const updatedData = { ...formData };
    delete updatedData.images; // Usuwamy pole images z danych do aktualizacji

    try {
      const response = await fetch(`${API_URL}/api/property/update/${property.slug}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      const updatedProperty = await response.json();
      onPropertyUpdated(updatedProperty);
      onRequestClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="update-property-modal"
      overlayClassName="modal-overlay"
    >
      <h2>Update Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            <FontAwesomeIcon icon={faHome} /> Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">
            <FontAwesomeIcon icon={faHome} /> Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rooms">
            <FontAwesomeIcon icon={faBed} /> Number of rooms
          </label>
          <input
            type="number"
            id="rooms"
            name="rooms"
            value={formData.rooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="square_meters">
            <FontAwesomeIcon icon={faRuler} /> Area (m²)
          </label>
          <input
            type="number"
            id="square_meters"
            name="square_meters"
            value={formData.square_meters}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="floor">
            <FontAwesomeIcon icon={faBuilding} /> Floor
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">
            <FontAwesomeIcon icon={faRoad} /> Street
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="house_number">
            <FontAwesomeIcon icon={faHome} /> House number
          </label>
          <input
            type="text"
            id="house_number"
            name="house_number"
            value={formData.house_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apartment_number">
            <FontAwesomeIcon icon={faDoorOpen} /> Apartment number
          </label>
          <input
            type="text"
            id="apartment_number"
            name="apartment_number"
            value={formData.apartment_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">
            <FontAwesomeIcon icon={faCity} /> City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="condition">
            <FontAwesomeIcon icon={faTools} /> Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
          >
            <option value="premium">Premium</option>
            <option value="low">Low Standard</option>
          </select>
        </div>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="has_parking_space"
              checked={formData.has_parking_space}
              onChange={handleCheckboxChange}
            />
            Parking space
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="has_balcony"
              checked={formData.has_balcony}
              onChange={handleCheckboxChange}
            />
            Balcony
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="has_elevator"
              checked={formData.has_elevator}
              onChange={handleCheckboxChange}
            />
            Elevator
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="has_security"
              checked={formData.has_security}
              onChange={handleCheckboxChange}
            />
            Security
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="has_storage_room"
              checked={formData.has_storage_room}
              onChange={handleCheckboxChange}
            />
            Storage room
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update property'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <button onClick={onRequestClose} className="close-button">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </Modal>
  );
};

export default UpdatePropertyModal;