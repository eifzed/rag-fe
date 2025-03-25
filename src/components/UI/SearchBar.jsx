// src/components/UI/SearchBar.jsx
import React from "react";

const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md">
      <input
        type="text"
        className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="submit"
        className="bg-[#7e58f2] hover:bg-[#6A46D8] text-white px-4 py-2 rounded-r-md transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
