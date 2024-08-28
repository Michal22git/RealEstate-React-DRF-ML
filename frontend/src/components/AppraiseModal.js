import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUmbrella, faElevator, faShield, faBox } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/utils';

const AppraiseModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    city: '',
    street: '',
    houseNumber: '',
    type: '',
    squareMeters: '',
    rooms: '',
    floor: '',
    floorCount: '',
    buildYear: '',
    ownership: '',
    condition: '',
    hasParkingSpace: false,
    hasBalcony: false,
    hasElevator: false,
    hasSecurity: false,
    hasStorageRoom: false
  });
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('suggestedPrice has been updated:', suggestedPrice);
  }, [suggestedPrice]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestedPrice(null);
    try {
      const response = await fetch(`${API_URL}/api/property/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Received data:', data);
      if (data.predicted_price) {
        const predictedPrice = parseFloat(data.predicted_price);
        if (!isNaN(predictedPrice)) {
          console.log('Setting suggested price:', predictedPrice);
          setSuggestedPrice(predictedPrice);
        } else {
          throw new Error('Invalid predicted price format');
        }
      } else {
        throw new Error('No predicted price in response');
      }
    } catch (error) {
      console.error('Error predicting price:', error);
      setError('Failed to predict price. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      className="appraise-modal"
    >
      <h2 className="appraise-modal-title">Property Appraisal</h2>
      <form onSubmit={handleSubmit} className="appraise-form">
        <div className="form-section">
          <h3>Location</h3>
          <div className="form-group">
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            <input name="street" value={formData.street} onChange={handleChange} placeholder="Street" required />
            <input name="houseNumber" value={formData.houseNumber} onChange={handleChange} placeholder="House Number" required />
          </div>
        </div>
        <div className="form-section">
          <h3>Property Details</h3>
          <div className="form-group">
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Building Type</option>
              <option value="blockOfFlats">Block of Flats</option>
              <option value="apartmentBuilding">Apartment Building</option>
              <option value="tenement">Tenement</option>
            </select>
            <input name="squareMeters" type="number" value={formData.squareMeters} onChange={handleChange} placeholder="Square Meters" required />
            <input name="rooms" type="number" value={formData.rooms} onChange={handleChange} placeholder="Number of Rooms" required />
          </div>
          <div className="form-group">
            <input name="floor" type="number" value={formData.floor} onChange={handleChange} placeholder="Floor" required />
            <input name="floorCount" type="number" value={formData.floorCount} onChange={handleChange} placeholder="Total Floors" required />
            <input name="buildYear" type="number" value={formData.buildYear} onChange={handleChange} placeholder="Build Year" required />
          </div>
          <div className="form-group">
            <select name="ownership" value={formData.ownership} onChange={handleChange} required>
              <option value="">Ownership</option>
              <option value="condominium">Condominium</option>
              <option value="share">Share</option>
              <option value="cooperative">Cooperative</option>
            </select>
            <select name="condition" value={formData.condition} onChange={handleChange} required>
              <option value="">Condition</option>
              <option value="premium">Premium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="form-section">
          <h3>Amenities</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input name="hasParkingSpace" type="checkbox" checked={formData.hasParkingSpace} onChange={handleChange} />
              <FontAwesomeIcon icon={faCar} /> Parking
            </label>
            <label className="checkbox-label">
              <input name="hasBalcony" type="checkbox" checked={formData.hasBalcony} onChange={handleChange} />
              <FontAwesomeIcon icon={faUmbrella} /> Balcony
            </label>
            <label className="checkbox-label">
              <input name="hasElevator" type="checkbox" checked={formData.hasElevator} onChange={handleChange} />
              <FontAwesomeIcon icon={faElevator} /> Elevator
            </label>
            <label className="checkbox-label">
              <input name="hasSecurity" type="checkbox" checked={formData.hasSecurity} onChange={handleChange} />
              <FontAwesomeIcon icon={faShield} /> Security
            </label>
            <label className="checkbox-label">
              <input name="hasStorageRoom" type="checkbox" checked={formData.hasStorageRoom} onChange={handleChange} />
              <FontAwesomeIcon icon={faBox} /> Storage
            </label>
          </div>
        </div>
        <div className="form-footer">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Appraising...' : 'Appraise'}
          </button>
          {suggestedPrice !== null && (
            <div className="suggested-price">
              <h3>Suggested price: {suggestedPrice.toLocaleString()} PLN</h3>
            </div>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </Modal>
  );
};

export default AppraiseModal;