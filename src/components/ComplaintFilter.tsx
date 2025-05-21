"use client";

import { useState } from "react";

// Define the categories available for complaints
const CATEGORIES = [
  "Roads and Infrastructure",
  "Water Supply",
  "Electricity",
  "Waste Management",
  "Public Transport",
  "Healthcare",
  "Education",
  "Public Safety",
  "Environment",
  "Other"
];

// Define the agencies available for routing
const AGENCIES = [
  "Department of Public Works",
  "Water Authority",
  "Electricity Board",
  "Waste Management Department",
  "Transport Authority",
  "Health Department",
  "Education Department",
  "Police Department",
  "Environmental Protection Agency",
  "General Administration"
];

interface FilterOptions {
  status: string;
  category: string;
  agency: string;
  dateRange: string;
  searchQuery: string;
}

interface ComplaintFilterProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const ComplaintFilter: React.FC<ComplaintFilterProps> = ({
  onFilterChange
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    category: "",
    agency: "",
    dateRange: "",
    searchQuery: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange({ [name]: value });
  };

  const handleReset = () => {
    const resetFilters = {
      status: "",
      category: "",
      agency: "",
      dateRange: "",
      searchQuery: ""
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-black">Filter Complaints</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-black mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-black mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="agency"
            className="block text-sm font-medium text-black mb-1"
          >
            Agency
          </label>
          <select
            id="agency"
            name="agency"
            value={filters.agency}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">All Agencies</option>
            {AGENCIES.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="dateRange"
            className="block text-sm font-medium text-black mb-1"
          >
            Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="searchQuery"
          className="block text-sm font-medium text-black mb-1"
        >
          Search
        </label>
        <input
          type="text"
          id="searchQuery"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleChange}
          placeholder="Search by title, description, tracking ID, or location"
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>
    </div>
  );
};

export default ComplaintFilter;
