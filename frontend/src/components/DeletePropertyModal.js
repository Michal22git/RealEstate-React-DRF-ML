import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/utils';

const DeletePropertyModal = ({ isOpen, onRequestClose, onConfirm, propertyTitle, propertySlug }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/property/remove/${propertySlug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się usunąć nieruchomości');
      }

      onConfirm();
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
      className="delete-confirmation-modal"
      overlayClassName="modal-overlay"
    >
      <h2>Potwierdź usunięcie</h2>
      <p>Czy na pewno chcesz usunąć nieruchomość "{propertyTitle}"?</p>
      <div className="modal-actions">
        <button onClick={handleDelete} className="confirm-button" disabled={isLoading}>
          {isLoading ? 'Usuwanie...' : 'Tak, usuń'}
        </button>
        <button onClick={onRequestClose} className="cancel-button" disabled={isLoading}>Anuluj</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={onRequestClose} className="close-button">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </Modal>
  );
};

export default DeletePropertyModal;