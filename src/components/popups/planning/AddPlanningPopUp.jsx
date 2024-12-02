// Import necessary dependencies
// - React for managing the component's state and lifecycle
// - Axios for making HTTP requests to interact with the backend
// - useNavigate from react-router-dom for navigation after planning creation
// - toast from react-toastify for user notifications
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

// AddPlanningPopUp Component
// This component is a popup modal for creating a new planning.
// It allows users to enter the planning title, start date, and end date.
// After submission, the data is sent to the server and the user is navigated to a new page to add items.
const AddPlanningPopUp = ({ isOpen, onClose }) => {
  // State variables to manage form inputs and popup animation
  const [animatePopup, setAnimatePopup] = useState(false); // Controls popup animation
  const [title, setTitle] = useState(""); // Planning title input
  const [startDate, setStartDate] = useState(""); // Planning start date input
  const [endDate, setEndDate] = useState(""); // Planning end date input
  const navigate = useNavigate(); // Hook to navigate after successful form submission
  const [loading, setLoading] = useState(false);

  // Effect hook to manage popup behavior and outside click detection
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "popup-background") {
        closePopup(); // Close popup when clicking outside
      }
    };

    if (isOpen) {
      setAnimatePopup(true); // Start popup animation
      window.addEventListener("click", handleOutsideClick); // Add event listener for outside click
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick); // Cleanup event listener on unmount
    };
  }, [isOpen]);

  // Close the popup with animation
  const closePopup = () => {
    setAnimatePopup(false); // Start closing animation
    setTimeout(onClose, 100); // Call onClose callback after animation
  };

  // Handle "Next" button click to submit the planning data
  const handleNext = async () => {
    setLoading(true); // Mulai loading
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/planning`, // Send planning data to the API
        {
          title: title,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        }
      );

      if (response.data.status) {
        toast.success("Planning Created Successfully"); // Show success message
        closePopup(); // Close the popup
        // Navigate to the next page with planning data
        navigate(`/addPlanning/${response.data.planning.id}`, {
          state: {
            planningId: response.data.planning.id,
            title: title,
            startDate: startDate,
            endDate: endDate,
          },
        });
      }
    } catch (error) {
      console.error("Error creating planning:", error); // Log any errors
      toast.error("Failed to create planning. Please try again."); // Show error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {/* Modal background with conditional opacity and event handling */}
      <div
        id="popup-background"
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Modal content */}
        <div
          className={`bg-white p-6 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out ${
            animatePopup ? "translate-y-0" : "-translate-y-full"
          } relative z-10 w-[90%] max-w-lg sm:max-w-xl mx-auto`}
          onClick={(e) => e.stopPropagation()} // Prevent event propagation to close the popup
        >
          {/* Header section */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Add Planning</h2>
            <p className="text-sm text-gray-500">
              Masukan terlebih dahulu nama kegiatan, start date, & end date
              untuk memasukan items
            </p>
          </div>

          {/* Input for planning title */}
          <div className="mb-4 text-left">
            <label className="block text-sm font-semibold mb-1">
              Nama Kegiatan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update title on change
              placeholder="Masukan nama kegiatan.."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Date inputs for start and end date */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 text-left">
              <label className="block text-sm font-semibold mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} // Update start date on change
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#B4252A]"
              />
            </div>
            <div className="flex-1 text-left">
              <label className="block text-sm font-semibold mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} // Update end date on change
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#B4252A]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            {/* Cancel button */}
            <button
              className="px-6 py-2 text-red-500 transition duration-200 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={closePopup} // Close the popup on click
              disabled={loading} // Disable button when loading
            >
              Back
            </button>
            {/* Submit button */}
            <button
              className="px-6 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition duration-200"
              onClick={handleNext} // Call handleNext to submit data and navigate
              disabled={loading} // Disable button when loading
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default AddPlanningPopUp;
