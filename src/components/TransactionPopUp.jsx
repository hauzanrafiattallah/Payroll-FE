import React from "react";
import { FaFileAlt } from "react-icons/fa"; // Ikon untuk upload dan evidence

const TransactionPopup = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-background") {
      onClose(); // Menutup popup jika pengguna mengklik di luar
    }
  };

  return (
    <div
      id="popup-background"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md sm:p-6 lg:p-8 lg:min-h-[50%] xl:min-h-[60%]">
        <h2 className="mb-4 text-lg font-bold text-center sm:text-xl">
          Transaction Details
        </h2>
        <div className="space-y-4 sm:space-y-5">
          {/* No Kegiatan */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">No Kegiatan</span>
            <span className="text-gray-800">{transaction.id}</span>
          </div>
          {/* Kegiatan */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Kegiatan</span>
            <span className="text-gray-800">{transaction.name}</span>
          </div>
          {/* Tanggal */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Tanggal</span>
            <span>{transaction.date}</span>
          </div>
          {/* Pemasukan */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Pemasukan</span>
            <span className="text-gray-800">{transaction.amount}</span>
          </div>
          {/* Pajak */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Pajak</span>
            <span className="text-gray-800">Rp.600.000.000</span>
          </div>
          {/* Upload */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Upload</span>
            <a href="#" className="flex items-center hover:underline">
              <FaFileAlt className="mr-2" /> Laporan.Xlsx
            </a>
          </div>
          {/* Evidence */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Evidence</span>
            <a href="#" className="flex items-center hover:underline">
              <FaFileAlt className="mr-2" /> Bukti.Pdf
            </a>
          </div>
        </div>
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#B4252A] text-white font-semibold rounded-lg p-2 sm:p-3 hover:bg-red-700 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionPopup;
