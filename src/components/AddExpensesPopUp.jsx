import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddExpensesPopup = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // Untuk mengontrol apakah kalender ditampilkan atau tidak
  const [animatePopup, setAnimatePopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("overlay")) {
        closePopup(); // Gunakan fungsi closePopup saat klik di luar
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
    setAnimatePopup(false); // Animasi slide keluar ke atas
    setTimeout(onClose, 200); // Tutup modal setelah animasi selesai (300ms)
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

        {/* Form Add Expenses */}
        <form>
          <label className="block mb-2 font-semibold">Nama Kegiatan</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan nama kegiatan..."
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
              onClick={() => setShowDatePicker(true)} // Tampilkan kalender saat di klik
              readOnly
            />
            {showDatePicker && (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false); // Sembunyikan kalender setelah memilih tanggal
                }}
                onClickOutside={() => setShowDatePicker(false)} // Tutup kalender jika di-klik di luar
                inline // Menampilkan kalender secara langsung di bawah input
              />
            )}
          </div>

          <label className="block mb-2 font-semibold">Jumlah</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pengeluaran..."
          />

          <label className="block mb-2 font-semibold">Pajak</label>
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Masukkan Jumlah Pajak..."
          />

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="w-full">
              <label className="block mb-2 font-semibold">
                Upload File Keuangan
              </label>
              <div className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer">
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  Upload File Keuangan (PDF/xlsx)
                </span>
                <input type="file" className="hidden" />
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div className="h-32 p-4 text-center border border-gray-300 rounded-lg cursor-pointer">
                <BsUpload className="mx-auto mb-2 text-2xl text-gray-500" />
                <span className="text-gray-500">
                  Upload File Bukti (PNG/JPG/PDF)
                </span>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-6 py-2 text-red-600 transition-colors bg-red-100 rounded-md hover:bg-red-200"
              onClick={closePopup} // Menggunakan closePopup saat tombol Cancel di klik
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
