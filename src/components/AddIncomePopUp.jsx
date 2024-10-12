import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddIncomePopup = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activityName, setActivityName] = useState("");
  const [amount, setAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [documentEvidence, setDocumentEvidence] = useState(null);
  const [imageEvidence, setImageEvidence] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [animatePopup, setAnimatePopup] = useState(false);

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

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const closePopup = () => {
    setAnimatePopup(false);
    setTimeout(onClose, 200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
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

    // Lakukan sesuatu di sini, misal submit form ke server
    console.log({
      activity_name: activityName,
      date: selectedDate,
      amount,
      tax: taxAmount,
      documentEvidence,
      imageEvidence,
    });

    // Jika berhasil, tampilkan toast success
    toast.success("Data berhasil disimpan!");
    closePopup(); // Tutup popup setelah submit
  };

  const triggerFileUpload = (id) => {
    document.getElementById(id).click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overlay">
      <ToastContainer /> {/* Tempat di mana toast akan ditampilkan */}
      <div
        className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-2xl mx-auto`}
      >
        <h2 className="mb-4 text-lg font-semibold text-center">Add Income</h2>

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
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={
                selectedDate ? selectedDate.toLocaleDateString("id-ID") : ""
              }
              placeholder="DD/MM/YY"
              onClick={() => setShowDatePicker(true)}
              readOnly
            />
            {showDatePicker && (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                onClickOutside={() => setShowDatePicker(false)}
                inline
              />
            )}
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

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="w-full">
              <label className="block mb-2 font-semibold">
                Upload File Keuangan
              </label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("documentEvidence")}
              >
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  {documentEvidence
                    ? documentEvidence.name
                    : "Upload File Keuangan (PDF/xlsx)"}
                </span>
              </div>
              <input
                type="file"
                id="documentEvidence"
                accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={(e) => setDocumentEvidence(e.target.files[0])}
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div
                className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => triggerFileUpload("imageEvidence")}
              >
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  {imageEvidence
                    ? imageEvidence.name
                    : "Upload File Bukti (PNG/JPG/JPEG)"}
                </span>
              </div>
              <input
                type="file"
                id="imageEvidence"
                accept="image/png, image/jpeg, application/pdf"
                className="hidden"
                onChange={(e) => setImageEvidence(e.target.files[0])}
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-6 py-2 text-red-600 transition-colors bg-red-100 rounded-md hover:bg-red-200"
              onClick={closePopup}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomePopup;
