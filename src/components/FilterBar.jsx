import React from 'react';

const FILTERS = ['all', 'active', 'completed'];

function FilterBar({ filter, onChange }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          disabled={filter === f}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
