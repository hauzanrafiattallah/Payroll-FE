import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const FilterPopup = ({ isOpen, onClose, applyFilter }) => {
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    applyFilter({ type: filterType, startDate, endDate });
    onClose();
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-background") {
      onClose();
    }
  };

  return (
    <div
      id="popup-background"
      onClick={handleOutsideClick}
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Apply filter</h2>
        </div>
        <div>
          {/* Filter Type */}
          <h3 className="mb-4 text-lg font-semibold">Type</h3>
          <div className="flex justify-around mb-6">
            <button
              className={`w-1/3 py-2 rounded-md font-semibold ${
                filterType === "All"
                  ? "bg-[#B4252A] text-white"
                  : "border border-[#B4252A] text-[#B4252A]"
              }`}
              onClick={() => setFilterType("All")}
            >
              All
            </button>
            <button
              className={`w-1/3 py-2 mx-2 rounded-md font-semibold ${
                filterType === "Income"
                  ? "bg-[#B4252A] text-white"
                  : "border border-[#B4252A] text-[#B4252A]"
              }`}
              onClick={() => setFilterType("Income")}
            >
              Income
            </button>
            <button
              className={`w-1/3 py-2 rounded-md font-semibold ${
                filterType === "Expenses"
                  ? "bg-[#B4252A] text-white"
                  : "border border-[#B4252A] text-[#B4252A]"
              }`}
              onClick={() => setFilterType("Expenses")}
            >
              Expenses
            </button>
          </div>

          {/* Date Range */}
          <h3 className="mb-4 text-lg font-semibold">Date Range</h3>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-1/2 mr-2">
              <FaCalendarAlt className="absolute text-gray-400 left-3 top-3" />
              <input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg"
              />
            </div>
            <span className="mx-2 text-gray-600">To</span>
            <div className="relative w-1/2">
              <FaCalendarAlt className="absolute text-gray-400 left-3 top-3" />
              <input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              className="px-6 py-2 text-red-500 transition duration-300 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition duration-300"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
