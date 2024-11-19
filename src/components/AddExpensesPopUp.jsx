// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

// Component for the popup to add expenses
const AddExpensesPopup = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [activityName, setActivityName] = useState("");
  const [amount, setAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [documentEvidence, setDocumentEvidence] = useState(null);
  const [imageEvidence, setImageEvidence] = useState(null);
  const [animatePopup, setAnimatePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get authentication token from local storage
  const authToken = localStorage.getItem("token");

  // Handle popup animation and closing on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("overlay")) {
        closePopup();
      }
    };

    if (isOpen) {
      setAnimatePopup(true);
      window.addEventListener("click", handleOutsideClick);
    }

    // Cleanup event listener when the component is unmounted or `isOpen` changes
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  // Function to close the popup with a delay for animation
  const closePopup = () => {
    setAnimatePopup(false);
    setTimeout(onClose, 200);
  };

  // Formats long file names for better display
  const formatFileName = (name, maxLength = 20) => {
    if (name.length > maxLength) {
      const ext = name.split(".").pop();
      const shortName = `${name.slice(0, 8)}...${name.slice(-8)}`;
      return `${shortName}.${ext}`;
    }
    return name;
  };

  // Handles form submission to send data to the backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !activityName ||
      !selectedDate ||
      !amount ||
      !taxAmount ||
      !documentEvidence ||
      !imageEvidence
    ) {
      toast.error("Pastikan semua field terisi dengan benar.");
      return;
    }

    // Validate document file type
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (documentEvidence && !allowedFileTypes.includes(documentEvidence.type)) {
      toast.error("File keuangan harus dalam format PDF atau Excel.");
      return;
    }

    // Prepare form data for the API request
    const formData = new FormData();
    formData.append("activity_name", activityName);
    formData.append("transaction_type", "expense");
    formData.append("amount", amount);
    formData.append("tax_amount", taxAmount);
    formData.append("document_evidence", documentEvidence);
    formData.append("image_evidence", imageEvidence);
    formData.append("date", selectedDate);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/finance`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Data berhasil disimpan!");
      closePopup();
    } catch (error) {
      console.error("Error submitting form data:", error.response || error);
      toast.error(
        "Gagal mengirim data, pastikan semua field terisi dengan benar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Triggers file input dialog
  const triggerFileUpload = (id) => {
    document.getElementById(id).click();
  };

  // Render nothing if the popup is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overlay">
      {/* Popup container */}
      <div
        className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-2xl mx-auto 
    max-h-[90vh] overflow-y-auto sm:max-h-[75vh]`}
      >
        <h2 className="mb-4 text-lg font-semibold text-center">Add Expenses</h2>

        {/* Form for expense details */}
        <form onSubmit={handleFormSubmit}>
          <label className="block mb-2 font-semibold">Nama Kegiatan</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan nama kegiatan..."
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Tanggal</label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <label className="block mb-2 font-semibold">Jumlah</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pengeluaran..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Pajak</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pajak..."
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.target.value)}
            required
          />

          {/* File upload sections */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Document evidence upload */}
            <div className="w-full">
              <label className="block mb-2 font-semibold">Upload</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("documentEvidence")}
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
                accept=".pdf, .xlsx"
                className="hidden"
                onChange={(e) => setDocumentEvidence(e.target.files[0])}
                required
              />
            </div>

            {/* Image evidence upload */}
            <div className="w-full">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("imageEvidence")}
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
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => setImageEvidence(e.target.files[0])}
                required
              />
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-6 py-2 text-red-600 transition-colors bg-red-100 rounded-md hover:bg-red-200 "
              onClick={closePopup}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] transition-colors"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Loading spinner overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </div>
  );
};

export default AddExpensesPopup;
