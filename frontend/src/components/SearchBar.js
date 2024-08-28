import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

const SearchBar = ({ onSearch, resetSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = debounce((term) => {
    onSearch(term);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  useEffect(() => {
    if (resetSearch) {
      setSearchTerm('');
    }
  }, [resetSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search properties..."
      />
    </div>
  );
};

export default SearchBar;