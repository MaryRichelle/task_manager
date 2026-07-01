import React, { useEffect, useState } from 'react';

function SearchBox({ onSearch }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setTimeout(() => {
      onSearch(value);
    }, 300);
  }, [value, onSearch]);

  return (
    <input
      type="search"
      placeholder="Search tasks…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="search-box"
    />
  );
}

export default SearchBox;
