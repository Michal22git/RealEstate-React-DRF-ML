import React from 'react';

const SortOptions = ({ onSort, currentSort }) => {
  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <div className="sort-options">
      <select onChange={handleSortChange} value={currentSort}>
        <option value="">Sort by</option>
        <option value="price_asc">Price ascending</option>
        <option value="price_desc">Price descending</option>
        <option value="square_meters_asc">Area ascending</option>
        <option value="square_meters_desc">Area descending</option>
        <option value="rooms_asc">Rooms ascending</option>
        <option value="rooms_desc">Rooms descending</option>
      </select>
    </div>
  );
};

export default SortOptions;