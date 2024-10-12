import React from "react";

const TransactionPopup = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null; // Jangan tampilkan apa-apa jika popup tidak dibuka

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Transaction Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">No Kegiatan</span>
            <span>{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Kegiatan</span>
            <span>{transaction.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tanggal</span>
            <span>{transaction.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Pemasukan</span>
            <span>{transaction.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Pajak</span>
            <span>Rp.600.000.000</span> {/* Contoh pajak */}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Upload</span>
            <a href="#" className="text-blue-500">Laporan.Xlsx</a>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Evidence</span>
            <a href="#" className="text-blue-500">Bukti.Pdf</a>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="mt-6 w-full bg-[#B4252A] text-white rounded-lg p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionPopup;
