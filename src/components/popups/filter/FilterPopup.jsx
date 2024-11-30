// Import React and required hooks
// - React for building the component
// - useState for managing component state
// - useEffect for handling lifecycle events
import React, { useState, useEffect } from "react";

// FilterPopup Component
// A modal popup component that allows users to apply filters such as type (income, expense, or all) and date range.
// Includes animations for opening and closing, as well as input handling for the filters.
const FilterPopup = ({ isOpen, onClose, applyFilter }) => {
  // State variables
  const [filterType, setFilterType] = useState("All"); // Stores the selected filter type
  const [startDate, setStartDate] = useState(""); // Stores the start date for the filter
  const [endDate, setEndDate] = useState(""); // Stores the end date for the filter
  const [animatePopup, setAnimatePopup] = useState(false); // Controls popup animations

  // Effect to handle click events outside the popup and trigger close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "popup-background") {
        closePopup();
      }
    };

    // Add event listener when the popup is open
    if (isOpen) {
      setAnimatePopup(true);
      window.addEventListener("click", handleOutsideClick);
    }

    // Cleanup event listener when the popup is closed
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  // Function to close the popup with animation
  const closePopup = () => {
    setAnimatePopup(false); // Start closing animation
    setTimeout(onClose, 100); // Trigger the onClose callback after animation
  };

  // Function to apply the selected filters
  const handleApply = () => {
    applyFilter({ type: filterType, startDate, endDate }); // Pass filter data to parent component
    closePopup(); // Close the popup after applying filters
  };

  // Prevent event propagation to avoid closing the popup when clicking inside
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    // Popup container
    <div
      id="popup-background"
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Popup content */}
      <div
        className={`bg-white p-6 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-lg sm:max-w-xl mx-auto`}
        onClick={stopPropagation} // Prevent click event propagation
      >
        {/* Popup header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Apply Filter</h2>
        </div>

        {/* Filter type selection */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Type</h3>
          <div className="flex justify-around mb-6">
            {/* Button for "All" filter */}
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
            {/* Button for "Income" filter */}
            <button
              className={`w-1/3 py-2 mx-2 rounded-md font-semibold ${
                filterType === "income"
                  ? "bg-[#B4252A] text-white"
                  : "border border-[#B4252A] text-[#B4252A]"
              }`}
              onClick={() => setFilterType("income")}
            >
              Income
            </button>
            {/* Button for "Expense" filter */}
            <button
              className={`w-1/3 py-2 rounded-md font-semibold ${
                filterType === "expense"
                  ? "bg-[#B4252A] text-white"
                  : "border border-[#B4252A] text-[#B4252A]"
              }`}
              onClick={() => setFilterType("expense")}
            >
              Expense
            </button>
          </div>

          {/* Date range selection */}
          <h3 className="mb-4 text-lg font-semibold">Date Range</h3>
          <div className="flex flex-col items-center justify-between mb-6 sm:flex-row">
            {/* Input for start date */}
            <div className="relative w-full mb-4 sm:w-1/2 sm:mr-2 sm:mb-0">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg focus:border-[#B4252A] focus:ring-2 focus:ring-[#B4252A] focus:outline-none"
                placeholder="Start Date"
              />
            </div>
            {/* "TO" text between date inputs */}
            <span className="mx-2 mr-4 lg:mb-2 md:mb-2 mb-3 text-gray-600">
              TO
            </span>
            {/* Input for end date */}
            <div className="relative w-full sm:w-1/2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg focus:border-[#B4252A] focus:ring-2 focus:ring-[#B4252A] focus:outline-none"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Buttons for actions */}
          <div className="flex justify-end space-x-2">
            {/* Cancel button */}
            <button
              className="px-6 py-2 text-red-500 transition duration-200 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={closePopup} // Close the popup
            >
              Cancel
            </button>
            {/* Apply button */}
            <button
              className="px-6 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition duration-200"
              onClick={handleApply} // Apply filters and close the popup
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
