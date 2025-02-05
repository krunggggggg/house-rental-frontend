import React, { useState } from "react";

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  isActiveFilter,
  setIsActiveFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const [localSearch, setLocalSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(localSearch);
  };

  return (
    <div className="mb-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border p-2 rounded-lg flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <select
        value={isActiveFilter}
        onChange={(e) => setIsActiveFilter(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">All Statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">Sort By</option>
          <option value="full_name">Name</option>
          <option value="created_at">Join Date</option>
          <option value="is_active">Status</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
