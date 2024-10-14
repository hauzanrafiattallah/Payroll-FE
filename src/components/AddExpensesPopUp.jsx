import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddExpensesPopup = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activityName, setActivityName] = useState("");
  const [amount, setAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [documentEvidence, setDocumentEvidence] = useState(null);
  const [imageEvidence, setImageEvidence] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [animatePopup, setAnimatePopup] = useState(false);

  const authToken = localStorage.getItem("token"); // token dari localStorage

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

  // Fungsi untuk membatasi panjang nama file
  const formatFileName = (name, maxLength = 20) => {
    if (name.length > maxLength) {
      const ext = name.split(".").pop(); // Dapatkan ekstensi file
      const shortName = `${name.slice(0, 8)}...${name.slice(-8)}`;
      return `${shortName}.${ext}`;
    }
    return name;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
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

    // Validasi tipe file documentEvidence (harus PDF atau XLSX)
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (documentEvidence && !allowedFileTypes.includes(documentEvidence.type)) {
      toast.error("File keuangan harus dalam format PDF atau Excel.");
      return;
    }

    // Buat FormData untuk mengirim file bersama dengan field lainnya
    const formData = new FormData();
    formData.append("activity_name", activityName);
    formData.append("transaction_type", "expense"); // Ubah sesuai kebutuhan "income" atau "expense"
    formData.append("amount", amount);
    formData.append("tax_amount", taxAmount);
    formData.append("document_evidence", documentEvidence);
    formData.append("image_evidence", imageEvidence);
    formData.append(
      "transaction_date",
      selectedDate.toISOString().split("T")[0]
    ); // Mengubah format tanggal jadi YYYY-MM-DD

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/finance`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Gunakan token dari localStorage
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Data berhasil disimpan!"); // Tampilkan pesan sukses
      closePopup(); // Tutup popup setelah submit berhasil
    } catch (error) {
      console.error("Error submitting form data:", error.response || error);
      toast.error(
        "Gagal mengirim data, pastikan semua field terisi dengan benar."
      );
    }
  };

  // Fungsi untuk memicu klik pada input file yang disembunyikan
  const triggerFileUpload = (id) => {
    document.getElementById(id).click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overlay">
      <div
        className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          animatePopup ? "translate-y-0" : "-translate-y-full"
        } relative z-10 w-[90%] max-w-2xl mx-auto`}
      >
        <h2 className="mb-4 text-lg font-semibold text-center">Add Expenses</h2>

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
              required
            />
            {showDatePicker && (
              <div className="absolute z-50 mt-2 bg-white shadow-lg">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                onClickOutside={() => setShowDatePicker(false)}
                inline
              />
              </div>
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
                    ? formatFileName(documentEvidence.name)
                    : "Upload File Keuangan (PDF/XLSX)"}
                </span>
              </div>
              <input
                type="file"
                id="documentEvidence"
                accept=".pdf, .xlsx" // Menerima file PDF dan EXCEL
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
                    ? formatFileName(imageEvidence.name)
                    : "Upload File Bukti (PNG/JPG/JPEG)"}
                </span>
              </div>
              <input
                type="file"
                id="imageEvidence"
                accept="image/png, image/jpeg" // PNG/JPG untuk bukti
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

export default AddExpensesPopup;
