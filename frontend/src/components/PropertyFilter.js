import React, { useState, useEffect } from 'react';

const PropertyFilter = ({ onFilter, currentFilters }) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nonEmptyFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
    onFilter(nonEmptyFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="property-filter">
      <h2>Filters</h2>
      
      <div className="filter-section">
        <h3>Location</h3>
        <input type="text" name="city" value={filters.city || ''} onChange={handleInputChange} placeholder="City" />
        <input type="text" name="zip_code" value={filters.zip_code || ''} onChange={handleInputChange} placeholder="Zip Code" />
      </div>

      <div className="filter-section">
        <h3>Property Details</h3>
        <select name="type" value={filters.type || ''} onChange={handleInputChange}>
          <option value="">Select type</option>
          <option value="blockOfFlats">Block of Flats</option>
          <option value="apartmentBuilding">Apartment Building</option>
          <option value="tenement">Tenement</option>
        </select>
        
        <select name="ownership" value={filters.ownership || ''} onChange={handleInputChange}>
          <option value="">Select ownership</option>
          <option value="condominium">Condominium</option>
          <option value="share">Share</option>
          <option value="cooperative">Cooperative</option>
        </select>
        
        <select name="condition" value={filters.condition || ''} onChange={handleInputChange}>
          <option value="">Select condition</option>
          <option value="premium">Premium</option>
          <option value="low">Low standard</option>
        </select>
      </div>

      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="range-inputs">
          <input type="number" name="min_price" value={filters.min_price || ''} onChange={handleInputChange} placeholder="Min price" />
          <input type="number" name="max_price" value={filters.max_price || ''} onChange={handleInputChange} placeholder="Max price" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Area</h3>
        <div className="range-inputs">
          <input type="number" name="min_square_meters" value={filters.min_square_meters || ''} onChange={handleInputChange} placeholder="Min m²" />
          <input type="number" name="max_square_meters" value={filters.max_square_meters || ''} onChange={handleInputChange} placeholder="Max m²" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Number of Rooms</h3>
        <div className="range-inputs">
          <input type="number" name="min_rooms" value={filters.min_rooms || ''} onChange={handleInputChange} placeholder="Min rooms" />
          <input type="number" name="max_rooms" value={filters.max_rooms || ''} onChange={handleInputChange} placeholder="Max rooms" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Floor</h3>
        <div className="range-inputs">
          <input type="number" name="min_floor" value={filters.min_floor || ''} onChange={handleInputChange} placeholder="Min floor" />
          <input type="number" name="max_floor" value={filters.max_floor || ''} onChange={handleInputChange} placeholder="Max floor" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Year Built</h3>
        <div className="range-inputs">
          <input type="number" name="min_build_year" value={filters.min_build_year || ''} onChange={handleInputChange} placeholder="Min year" />
          <input type="number" name="max_build_year" value={filters.max_build_year || ''} onChange={handleInputChange} placeholder="Max year" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Distance from Center (km)</h3>
        <div className="range-inputs">
          <input type="number" name="min_centre_distance" value={filters.min_centre_distance || ''} onChange={handleInputChange} placeholder="Min distance" />
          <input type="number" name="max_centre_distance" value={filters.max_centre_distance || ''} onChange={handleInputChange} placeholder="Max distance" />
        </div>
      </div>

      <div className="filter-section">
        <h3>Amenities</h3>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="has_parking_space" checked={filters.has_parking_space || false} onChange={handleInputChange} />
            Parking Space
          </label>
          <label>
            <input type="checkbox" name="has_balcony" checked={filters.has_balcony || false} onChange={handleInputChange} />
            Balcony
          </label>
          <label>
            <input type="checkbox" name="has_elevator" checked={filters.has_elevator || false} onChange={handleInputChange} />
            Elevator
          </label>
          <label>
            <input type="checkbox" name="has_security" checked={filters.has_security || false} onChange={handleInputChange} />
            Security
          </label>
          <label>
            <input type="checkbox" name="has_storage_room" checked={filters.has_storage_room || false} onChange={handleInputChange} />
            Storage Room
          </label>
        </div>
      </div>
      
      <div className="filter-button-container">
        <button type="submit" className="apply-filters-btn">Apply Filters</button>
      </div>
    </form>
  );
};

export default PropertyFilter;