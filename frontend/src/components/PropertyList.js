import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, isAuthenticated, onFavoriteToggle, onUpdateProperty, onDeleteProperty, userData }) => {
  return (
    <div className="property-list">
      {properties.length > 0 ? (
        properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            isAuthenticated={isAuthenticated}
            onFavoriteToggle={onFavoriteToggle}
            onUpdateProperty={onUpdateProperty}
            onDeleteProperty={onDeleteProperty}
            userData={userData}
          />
        ))
      ) : (
        <p>Brak nieruchomości spełniających kryteria wyszukiwania.</p>
      )}
    </div>
  );
};

export default PropertyList;