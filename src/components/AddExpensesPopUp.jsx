// Import necessary libraries and components
// - React for building the component and managing state
// - BsUpload for the upload icon
// - Axios for making HTTP requests
// - toast for notifications
// - ReactLoading for displaying a loading spinner
import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

// AddExpensesPopup Component
// This component is a modal form that allows users to enter income expense details,
// including activity name, amount, tax amount, and upload supporting documents.
const AddExpensesPopup = ({ isOpen, onClose }) => {
  // State variables for managing form data and popup behavior
  const [selectedDate, setSelectedDate] = useState(""); // Stores the selected date
  const [activityName, setActivityName] = useState(""); // Stores the activity name
  const [amount, setAmount] = useState(""); // Stores the amount of expenses
  const [taxAmount, setTaxAmount] = useState(""); // Stores the tax amount
  const [documentEvidence, setDocumentEvidence] = useState(null); // Stores the document file for upload
  const [imageEvidence, setImageEvidence] = useState(null); // Stores the image file for upload
  const [animatePopup, setAnimatePopup] = useState(false); // Controls the popup animation state
  const [isLoading, setIsLoading] = useState(false); // Indicates if the form submission is in progress

  // Get authentication token from local storage
  const authToken = localStorage.getItem("token");

  // Handle opening and closing the popup with outside click detection
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("overlay")) {
        closePopup(); // Close popup if the user clicks outside the modal
      }
    };

    // Add event listener when the popup is open
    if (isOpen) {
      setAnimatePopup(true); // Start popup opening animation
      window.addEventListener("click", handleOutsideClick); // Listen for outside clicks
    }

    // Clean up the event listener when the popup is closed or component unmounts
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  // Function to close the popup with an animation
  const closePopup = () => {
    setAnimatePopup(false); // Start closing animation
    setTimeout(onClose, 200); // Call the onClose function after animation completes
  };

  // Function to format long file names for better display
  const formatFileName = (name, maxLength = 20) => {
    if (name.length > maxLength) {
      const ext = name.split(".").pop(); // Get file extension
      const shortName = `${name.slice(0, 8)}...${name.slice(-8)}`; // Shorten file name
      return `${shortName}.${ext}`; // Return formatted file name with extension
    }
    return name; // Return original file name if it's within the max length
  };

  // Handle form submission (saving expense details)
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
      toast.error("Pastikan semua field terisi dengan benar."); // Show error message if validation fails
      return;
    }

    // Validate document file type (must be PDF or Excel)
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (documentEvidence && !allowedFileTypes.includes(documentEvidence.type)) {
      toast.error("File keuangan harus dalam format PDF atau Excel."); // Show error message if file type is invalid
      return;
    }

    // Create FormData to send the form data along with files
    const formData = new FormData();
    formData.append("activity_name", activityName); // Add activity name to form data
    formData.append("transaction_type", "expense"); // Set transaction type to "expense"
    formData.append("amount", amount); // Add amount to form data
    formData.append("tax_amount", taxAmount); // Add tax amount to form data
    formData.append("document_evidence", documentEvidence); // Add document file to form data
    formData.append("image_evidence", imageEvidence); // Add image file to form data
    formData.append("date", selectedDate); // Add selected date to form data

    try {
      setIsLoading(true); // Set loading state to true during the request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/finance`, // API endpoint for submitting the form data
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Include auth token in the request header
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      toast.success("Data berhasil disimpan!"); // Show success message on successful submission
      closePopup(); // Close the popup after submission
    } catch (error) {
      console.error("Error submitting form data:", error.response || error);
      toast.error("Gagal mengirim data, pastikan semua field terisi dengan benar."); // Show error message if the request fails
    } finally {
      setIsLoading(false); // Set loading state to false after request completes
    }
  };

  // Trigger the file input click to open the file selection dialog
  const triggerFileUpload = (id) => {
    document.getElementById(id).click(); // Trigger file input element's click event
  };

  // If the popup is not open, return null to avoid rendering it
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overlay">
      {/* Popup container */}
      <div
        className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto sm:max-h-[75vh]`}
      >
        <h2 className="mb-4 text-lg font-semibold text-center">Add Expenses</h2>

        {/* Form for expense details */}
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
                    ? formatFileName(documentEvidence.name)
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

            {/* Image evidence upload */}
            <div className="w-full">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("imageEvidence")} // Trigger image file upload on click
              >
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  {imageEvidence
                    ? formatFileName(imageEvidence.name)
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

export default AddExpensesPopup;
