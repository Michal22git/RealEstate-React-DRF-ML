import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faBed, faRuler, faBuilding, faCar, faUmbrella, faArrowsAltV, faShieldAlt, faBox, faUser } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/utils';
import Modal from 'react-modal';
import UpdatePropertyModal from './UpdateProeprtyModal';
import DeletePropertyModal from './DeletePropertyModal';

const PropertyCard = ({ property, isAuthenticated, onFavoriteToggle, onUpdateProperty, onDeleteProperty, userData }) => {
  const [isFavorite, setIsFavorite] = useState(property.is_favorite);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  console.log('userData:', userData);
  console.log('property:', property);
  console.log('isAuthenticated:', isAuthenticated);

  const isOwner = isAuthenticated && userData && property && property.owner &&
    (userData.user_id === property.owner.id);
  
  console.log('isOwner:', isOwner);

  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;

    try {
      let response;
      if (isFavorite) {
        response = await fetch(`${API_URL}/api/property/favorites/remove/${property.slug}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      } else {
        response = await fetch(`${API_URL}/api/property/favorites/add/${property.slug}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      }

      if (response.ok) {
        setIsFavorite(!isFavorite);
        onFavoriteToggle(property.id, !isFavorite);
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const openModal = async () => {
    try {
      const response = await fetch(`${API_URL}/api/property/${property.slug}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data = await response.json();
      setPropertyDetails(data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % propertyDetails.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + propertyDetails.images.length) % propertyDetails.images.length
    );
  };

  const handleUpdateProperty = (updatedProperty) => {
    onUpdateProperty(updatedProperty);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteProperty = () => {
    onDeleteProperty(property.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="property-card">
      <div className="image-container">
        <img src={property.images[0].image} alt={property.title} />
        <button 
          className={`favorite-button ${isAuthenticated ? '' : 'disabled'}`} 
          onClick={toggleFavorite}
        >
          <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} color={isFavorite ? 'gold' : 'gray'} />
        </button>
      </div>
      <div className="property-info">
        <h3>{property.title}</h3>
        <p className="price">{parseFloat(property.price).toLocaleString()} PLN</p>
        <p className="suggested-price">Suggested: {parseFloat(property.suggested_price).toLocaleString()} PLN</p>
        <p>{property.rooms} rooms, {property.square_meters} m²</p>
        <p>Floor: {property.floor}</p>
        <p>{property.street} {property.house_number}, {property.city}</p>
        <button onClick={openModal}>View Details</button>
        {isOwner && (
          <div className="property-actions">
            <button onClick={handleUpdateClick} className="update-button">
              <FontAwesomeIcon icon={faPencilAlt} /> Edytuj
            </button>
            <button onClick={handleDeleteClick} className="delete-button">
              <FontAwesomeIcon icon={faTrash} /> Usuń
            </button>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Property Sale Information"
        className="property-modal"
        overlayClassName="property-modal-overlay"
      >
        {propertyDetails && (
          <div className="property-details">
            <button onClick={closeModal} className="close-button">&times;</button>
            <h2>{propertyDetails.title}</h2>
            
            <div className="image-gallery">
              <button onClick={prevImage} className="gallery-nav prev">&lt;</button>
              <img src={propertyDetails.images[currentImageIndex].image} alt={`Property ${currentImageIndex + 1}`} />
              <button onClick={nextImage} className="gallery-nav next">&gt;</button>
              <div className="image-indicators">
                {propertyDetails.images.map((_, index) => (
                  <span key={index} className={index === currentImageIndex ? 'active' : ''}></span>
                ))}
              </div>
            </div>
            
            <div className="price-section">
              <h3>{parseFloat(propertyDetails.price).toLocaleString()} PLN</h3>
              <span className="status">For Sale</span>
            </div>
            
            <p className="address">{propertyDetails.street} {propertyDetails.house_number}, {propertyDetails.apartment_number}, {propertyDetails.city}, {propertyDetails.zip_code}</p>
            
            <div className="property-features">
              <div className="feature"><FontAwesomeIcon icon={faBed} /> {propertyDetails.rooms} Rooms</div>
              <div className="feature"><FontAwesomeIcon icon={faRuler} /> {propertyDetails.square_meters} m²</div>
              <div className="feature"><FontAwesomeIcon icon={faBuilding} /> Floor {propertyDetails.floor}/{propertyDetails.floor_count}</div>
            </div>
            
            <div className="property-details-grid">
              <div className="detail-item"><strong>Building Type:</strong> {propertyDetails.type}</div>
              <div className="detail-item"><strong>Year Built:</strong> {propertyDetails.build_year}</div>
              <div className="detail-item"><strong>Distance from Center:</strong> {propertyDetails.centre_distance} km</div>
              <div className="detail-item"><strong>Number of POIs:</strong> {propertyDetails.poi_count}</div>
              <div className="detail-item"><strong>Ownership:</strong> {propertyDetails.ownership}</div>
              <div className="detail-item"><strong>Condition:</strong> {propertyDetails.condition}</div>
              <div className="detail-item"><strong>Suggested Price:</strong> {parseFloat(propertyDetails.suggested_price).toLocaleString()} PLN</div>
            </div>
            
            <div className="property-amenities">
              <h4>Amenities:</h4>
              <ul>
                {propertyDetails.has_parking_space && <li><FontAwesomeIcon icon={faCar} /> Parking Space</li>}
                {propertyDetails.has_balcony && <li><FontAwesomeIcon icon={faUmbrella} /> Balcony</li>}
                {propertyDetails.has_elevator && <li><FontAwesomeIcon icon={faArrowsAltV} /> Elevator</li>}
                {propertyDetails.has_security && <li><FontAwesomeIcon icon={faShieldAlt} /> Security</li>}
                {propertyDetails.has_storage_room && <li><FontAwesomeIcon icon={faBox} /> Storage Room</li>}
              </ul>
            </div>
            
            <h4>Description:</h4>
            <p className="description">{propertyDetails.description}</p>
            
            <div className="price-history">
              <h4>Price History:</h4>
              <ul>
                {propertyDetails.history.map((item, index) => (
                  <li key={index}>{item.history_date}: {parseFloat(item.price).toLocaleString()} PLN</li>
                ))}
              </ul>
            </div>
            
            <div className="agent-info">
              <FontAwesomeIcon icon={faUser} className="agent-icon" />
              <div>
                <h4>{propertyDetails.owner.username}</h4>
                <p>{propertyDetails.owner.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <UpdatePropertyModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        property={property}
        onPropertyUpdated={handleUpdateProperty}
      />
      <DeletePropertyModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProperty}
        propertyTitle={property.title}
        propertySlug={property.slug}
      />
    </div>
  );
};

export default PropertyCard;