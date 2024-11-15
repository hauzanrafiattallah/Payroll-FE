import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlanningPopUp = ({ isOpen, onClose }) => {
  const [animatePopup, setAnimatePopup] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

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
    setTimeout(onClose, 100); // Close the popup after the animation
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/planning`,
        {
          title: title,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status) {
        toast.success("Planning Created Successfully");
        closePopup();
        // Pass planning ID, title, start_date, and end_date when navigating
        navigate("/add-planning", {
          state: {
            planningId: response.data.planning.id,
            title: title,
            startDate: startDate,
            endDate: endDate,
          },
        });
      }
    } catch (error) {
      console.error("Error creating planning:", error);
      toast.error("Failed to create planning. Please try again.");
    }
  };
  

  return (
    <div
      id="popup-background"
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-6 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-lg sm:max-w-xl mx-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Add Planning</h2>
          <p className="text-sm text-gray-500">
            Masukan terlebih dahulu nama kegiatan, start date, & end date untuk memasukan items
          </p>
        </div>

        <div className="mb-4 text-left">
          <label className="block text-sm font-semibold mb-1">Nama Kegiatan</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukan nama kegiatan.."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 text-left">
            <label className="block text-sm font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#B4252A]"
            />
          </div>
          <div className="flex-1 text-left">
            <label className="block text-sm font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#B4252A]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-6 py-2 text-red-500 transition duration-200 bg-red-100 rounded-lg hover:bg-red-200"
            onClick={closePopup}
          >
            Back
          </button>
          <button
            className="px-6 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition duration-200"
            onClick={handleNext} // Call handleNext to submit data and navigate
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlanningPopUp;
