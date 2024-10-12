import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const FilterPopup = ({ isOpen, onClose, applyFilter }) => {
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [animatePopup, setAnimatePopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "popup-background") {
        closePopup();
      }
    };

    if (isOpen) {
      setAnimatePopup(true);
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const closePopup = () => {
    setAnimatePopup(false);
    setTimeout(onClose, 100);
  };

  const handleApply = () => {
    applyFilter({ type: filterType, startDate, endDate });
    closePopup();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      id="popup-background"
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-6 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-lg sm:max-w-xl mx-auto`}
        onClick={stopPropagation}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Apply filter</h2>
        </div>
        <div>
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

          <h3 className="mb-4 text-lg font-semibold">Date Range</h3>
          <div className="flex flex-col items-center justify-between mb-6 sm:flex-row">
            <div className="relative w-full mb-4 sm:w-1/2 sm:mr-2 sm:mb-0">
              <FaCalendarAlt className="absolute text-gray-400 left-3 top-3" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg"
                placeholder="Start Date"
              />
            </div>
            <span className="mx-2 text-gray-600">To</span>
            <div className="relative w-full sm:w-1/2">
              <FaCalendarAlt className="absolute text-gray-400 left-3 top-3" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 pl-10 placeholder-gray-500 border border-gray-300 rounded-lg"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-6 py-2 text-red-500 transition duration-200 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={closePopup}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition duration-200"
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
