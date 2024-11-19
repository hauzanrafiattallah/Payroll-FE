// Import necessary dependencies
// - React for managing component state and lifecycle
// - BsUpload for file upload icons
// - Axios for making HTTP requests
// - toast from react-toastify for notifications
// - ReactLoading for displaying a loading spinner
import React, { useState, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

// AddIncomePopup Component
// This component is a modal form for adding income transaction details.
// It includes input fields for activity name, date, amount, tax amount, and file uploads for supporting documents and evidence.
const AddIncomePopup = ({ isOpen, onClose }) => {
  // State variables to manage form inputs and loading state
  const [selectedDate, setSelectedDate] = useState(""); // Stores the selected date
  const [activityName, setActivityName] = useState(""); // Stores the activity name
  const [amount, setAmount] = useState(""); // Stores the amount
  const [taxAmount, setTaxAmount] = useState(""); // Stores the tax amount
  const [documentEvidence, setDocumentEvidence] = useState(null); // Stores the uploaded document file
  const [imageEvidence, setImageEvidence] = useState(null); // Stores the uploaded image file
  const [animatePopup, setAnimatePopup] = useState(false); // Controls the popup animation
  const [isLoading, setIsLoading] = useState(false); // Manages loading state

  const authToken = localStorage.getItem("token"); // Get the auth token from localStorage

  // Effect hook to handle outside clicks for closing the popup
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("overlay")) {
        closePopup(); // Close popup if clicked outside
      }
    };

    if (isOpen) {
      setAnimatePopup(true); // Start animation when popup is open
      window.addEventListener("click", handleOutsideClick); // Add event listener for outside clicks
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick); // Clean up the event listener when the component unmounts
    };
  }, [isOpen]);

  // Function to close the popup with animation
  const closePopup = () => {
    setAnimatePopup(false); // Start closing animation
    setTimeout(onClose, 200); // Call the onClose function after animation delay
  };

  // Function to limit the file name length for display purposes
  const formatFileName = (name, maxLength = 20) => {
    if (name.length > maxLength) {
      const ext = name.split(".").pop(); // Get the file extension
      const shortName = `${name.slice(0, 8)}...${name.slice(-8)}`;
      return `${shortName}.${ext}`; // Format the name to show a short version
    }
    return name; // Return original name if it's short enough
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate that all required fields are filled out
    if (
      !activityName ||
      !selectedDate ||
      !amount ||
      !taxAmount ||
      !documentEvidence ||
      !imageEvidence
    ) {
      toast.error("Pastikan semua field terisi dengan benar.");
      return; // Prevent form submission if any required fields are missing
    }

    // Validate file type for the document evidence (must be PDF or Excel)
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (documentEvidence && !allowedFileTypes.includes(documentEvidence.type)) {
      toast.error("File keuangan harus dalam format PDF atau XLSX.");
      return; // Prevent form submission if file type is invalid
    }

    // Create FormData to send the form data and files
    const formData = new FormData();
    formData.append("activity_name", activityName); // Add activity name to form data
    formData.append("transaction_type", "income"); // Set transaction type to "income"
    formData.append("amount", amount); // Add amount to form data
    formData.append("tax_amount", taxAmount); // Add tax amount to form data
    formData.append("document_evidence", documentEvidence); // Add document evidence to form data
    formData.append("image_evidence", imageEvidence); // Add image evidence to form data
    formData.append("date", selectedDate); // Add selected date to form data

    try {
      setIsLoading(true); // Set loading state to true during the request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/finance`, // API endpoint to submit the form data
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Include auth token in the request header
            "Content-Type": "multipart/form-data", // Specify content type for file uploads
          },
        }
      );

      toast.success("Data berhasil disimpan!"); // Show success message after successful submission
      closePopup(); // Close the popup after successful submission
    } catch (error) {
      console.error("Error submitting form data:", error.response || error);
      toast.error(
        "Gagal mengirim data, pastikan semua field terisi dengan benar." // Show error message if the request fails
      );
    } finally {
      setIsLoading(false); // Set loading state to false after the request completes
    }
  };

  // Trigger file input click programmatically
  const triggerFileUpload = (id) => {
    document.getElementById(id).click(); // Trigger the click event on the hidden file input element
  };

  // If the popup is not open, return null to prevent rendering
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overlay">
      <div
        className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto sm:max-h-[75vh]`} // Add height constraints for responsiveness
      >
        <h2 className="mb-4 text-lg font-semibold text-center">Add Income</h2>

        <form onSubmit={handleFormSubmit}>
          {/* Activity name input */}
          <label className="block mb-2 font-semibold">Nama Kegiatan</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan nama kegiatan..."
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)} // Update activity name on change
            required
          />

          {/* Date input */}
          <label className="block mb-2 font-semibold">Tanggal</label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} // Update selected date on change
              required
            />
          </div>

          {/* Amount input */}
          <label className="block mb-2 font-semibold">Jumlah</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pengeluaran..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // Update amount on change
            required
          />

          {/* Tax amount input */}
          <label className="block mb-2 font-semibold">Pajak</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pajak..."
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.target.value)} // Update tax amount on change
            required
          />

          {/* File upload inputs */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Document upload */}
            <div className="w-full">
              <label className="block mb-2 font-semibold">Upload</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("documentEvidence")} // Trigger file upload on click
              >
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  {documentEvidence
                    ? formatFileName(documentEvidence.name) // Format the file name for display
                    : "Upload File Keuangan (PDF/XLSX)"}
                </span>
              </div>
              <input
                type="file"
                id="documentEvidence"
                accept=".pdf, .xlsx" // Accept only PDF or XLSX files
                className="hidden"
                onChange={(e) => setDocumentEvidence(e.target.files[0])} // Update document file on change
                required
              />
            </div>
            {/* Image upload */}
            <div className="w-full">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("imageEvidence")} // Trigger image file upload on click
              >
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  {imageEvidence
                    ? formatFileName(imageEvidence.name) // Format the image file name for display
                    : "Upload File Bukti (PNG/JPG/JPEG)"}
                </span>
              </div>
              <input
                type="file"
                id="imageEvidence"
                accept="image/png, image/jpeg" // Accept only PNG or JPEG images
                className="hidden"
                onChange={(e) => setImageEvidence(e.target.files[0])} // Update image file on change
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-6 py-2 text-red-600 transition-colors bg-red-100 rounded-md hover:bg-red-200"
              onClick={closePopup} // Close the popup when clicked
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] transition-colors"
              disabled={isLoading} // Disable button during loading state
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Overlay loading spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </div>
  );
};

export default AddIncomePopup;
