// Import necessary dependencies
// - React for managing the component's state and lifecycle
// - Axios for making HTTP requests to fetch transaction data
// - FaFileAlt icon from react-icons for displaying file icons in the UI
import React, { useState, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";
import axios from "axios";

// TransactionPopup Component
// This component displays transaction details in a modal popup when a specific transaction is selected.
// It fetches data based on the provided `transactionId` prop and renders the information.
// Includes error handling, loading state, and external link for document/evidence downloads.
const TransactionPopup = ({ isOpen, onClose, transactionId }) => {
  // State variables for managing transaction data, loading state, and animation
  const [transaction, setTransaction] = useState(null); // Stores transaction data
  const [loading, setLoading] = useState(true); // Manages the loading state
  const authToken = localStorage.getItem("token"); // Retrieve auth token from localStorage

  // Base URL for accessing uploaded files (configured in environment variables)
  const baseURL = import.meta.env.VITE_FILE_BASE_URL;

  // Fetch transaction details when `transactionId` changes or the component is mounted
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/finance/${transactionId}`, // API endpoint to fetch transaction details
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`, // Include auth token in the header
            },
          }
        );
        setTransaction(response.data.data); // Set the fetched transaction data in the state
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching transaction data:", error); // Log error if fetching fails
        setLoading(false); // Set loading state to false in case of error
      }
    };

    if (transactionId) {
      fetchTransactionData(); // Call fetch function if `transactionId` is available
    }
  }, [transactionId, authToken]);

  // If the popup is not open, return null to prevent rendering
  if (!isOpen) return null;

  // Close the popup when clicking outside the modal
  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-background") {
      onClose(); // Trigger onClose callback to close the popup
    }
  };

  return (
    // Modal background with opacity and centered positioning
    <div
      id="popup-background"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick} // Close popup if user clicks outside modal
    >
      <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md sm:p-6 lg:p-8 lg:min-h-[50%] xl:min-h-[60%]">
        {/* Popup Header */}
        <h2 className="mb-4 text-lg font-bold text-center sm:text-xl">
          Transaction Details
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center">Loading...</div> // Display loading text while fetching data
        ) : transaction ? (
          // Display transaction details if available
          <div className="space-y-4 sm:space-y-5">
            {/* Display each transaction field in a flex layout */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Status</span>
              <span className="text-gray-800">{transaction.status}</span>
            </div>

            {/* Display transaction ID */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">No Kegiatan</span>
              <span className="text-gray-800">{transaction.id || "N/A"}</span>
            </div>

            {/* Display activity name */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Kegiatan</span>
              <span className="text-gray-800">
                {transaction.activity_name || "N/A"}
              </span>
            </div>

            {/* Display transaction date */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Tanggal</span>
              <span>
                {transaction.created_at
                  ? new Date(transaction.created_at).toLocaleDateString("id-ID")
                  : "N/A"}
              </span>
            </div>

            {/* Display transaction amount */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Pemasukan</span>
              <span className="text-gray-800">
                Rp.{" "}
                {transaction.amount
                  ? transaction.amount.toLocaleString("id-ID")
                  : 0}
              </span>
            </div>

            {/* Display tax amount */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Pajak</span>
              <span className="text-gray-800">
                Rp.{" "}
                {transaction.tax_amount
                  ? transaction.tax_amount.toLocaleString("id-ID")
                  : 0}
              </span>
            </div>

            {/* Display uploaded document link if available */}
            {transaction.document_evidence && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">Upload</span>
                <a
                  href={`${baseURL}${transaction.document_evidence}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <FaFileAlt className="mr-2" />{" "}
                  {`Invoice.${transaction.document_evidence.split(".").pop()}`}
                </a>
              </div>
            )}

            {/* Display uploaded image evidence link if available */}
            {transaction.image_evidence && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">Evidence</span>
                <a
                  href={`${baseURL}${transaction.image_evidence}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <FaFileAlt className="mr-2" />{" "}
                  {`Bukti.${transaction.image_evidence.split(".").pop()}`}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">Data not available.</div> // Display message if transaction data is unavailable
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-16 w-full bg-[#B4252A] text-white font-semibold rounded-lg p-2 sm:p-3 hover:bg-red-800 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionPopup;
