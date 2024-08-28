import React, { useState } from 'react';
import Modal from 'react-modal';
import { API_URL } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faCar, faUmbrella, faElevator, faShield, faBox } from '@fortawesome/free-solid-svg-icons';

const AddPropertyModal = ({ isOpen, onRequestClose, onPropertyAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    street: '',
    house_number: '',
    apartment_number: '',
    city: '',
    zip_code: '',
    type: '',
    square_meters: '',
    rooms: '',
    floor: '',
    floor_count: '',
    build_year: '',
    ownership: '',
    condition: '',
    has_parking_space: false,
    has_balcony: false,
    has_elevator: false,
    has_security: false,
    has_storage_room: false,
    price: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData[key].forEach((image, index) => {
          data.append(`images`, image);
        });
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/property/add/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }

      const result = await response.json();
      console.log('Property added successfully:', result);
      onRequestClose();
      if (onPropertyAdded) {
        onPropertyAdded(result);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setError(error.message || 'An error occurred while adding the property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="add-property-modal"
      overlayClassName="add-property-modal-overlay"
    >
      <h2 className="modal-title">Add New Property</h2>
      <button onClick={onRequestClose} className="close-button">
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <form onSubmit={handleSubmit} className="add-property-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        </div>

        <div className="form-section">
          <h3>Location</h3>
          <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" required />
          <input type="text" name="house_number" value={formData.house_number} onChange={handleChange} placeholder="House Number" required />
          <input type="text" name="apartment_number" value={formData.apartment_number} onChange={handleChange} placeholder="Apartment Number" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
          <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="ZIP Code" required />
        </div>

        <div className="form-section">
          <h3>Property Details</h3>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="apartmentBuilding">Apartment Building</option>
            <option value="tenement">Tenement</option>
            <option value="blockOfFlats">Block of Flats</option>
          </select>
          <input type="number" name="square_meters" value={formData.square_meters} onChange={handleChange} placeholder="Square Meters" required />
          <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} placeholder="Number of Rooms" required />
          <input type="number" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
          <input type="number" name="floor_count" value={formData.floor_count} onChange={handleChange} placeholder="Total Floors" />
          <input type="number" name="build_year" value={formData.build_year} onChange={handleChange} placeholder="Build Year" required />
          <select name="ownership" value={formData.ownership} onChange={handleChange} required>
            <option value="">Select Ownership</option>
            <option value="condominium">Condominium</option>
            <option value="cooperative">Cooperative</option>
            <option value="share">Share</option>
          </select>
          <select name="condition" value={formData.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            <option value="premium">Premium</option>
            <option value="low">Low Standard</option>
          </select>
        </div>

        <div className="form-section">
          <h3>Amenities</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="has_parking_space" checked={formData.has_parking_space} onChange={handleChange} />
              <FontAwesomeIcon icon={faCar} /> Parking Space
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="has_balcony" checked={formData.has_balcony} onChange={handleChange} />
              <FontAwesomeIcon icon={faUmbrella} /> Balcony
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="has_elevator" checked={formData.has_elevator} onChange={handleChange} />
              <FontAwesomeIcon icon={faElevator} /> Elevator
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="has_security" checked={formData.has_security} onChange={handleChange} />
              <FontAwesomeIcon icon={faShield} /> Security
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="has_storage_room" checked={formData.has_storage_room} onChange={handleChange} />
              <FontAwesomeIcon icon={faBox} /> Storage Room
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Price and Images</h3>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
          <div className="image-upload">
            <label htmlFor="images">
              <FontAwesomeIcon icon={faUpload} /> Add Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />
            <span>{formData.images.length} images selected</span>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Property'}
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </form>
    </Modal>
  );
};

export default AddPropertyModal;
