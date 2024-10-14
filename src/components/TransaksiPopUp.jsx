import React, { useState, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa"; 
import axios from "axios";

const TransaksiPopup = ({ isOpen, onClose, transactionId }) => {
  const [transaction, setTransaction] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Base URL for accessing storage files
  const baseURL = "https://payroll.humicprototyping.com/storage/app/public/";

  // Fetch data transaksi dari API berdasarkan transactionId
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/finance/${transactionId}`, // Sesuaikan endpoint API
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`, // Sertakan token di header
            },
          }
        );
        setTransaction(response.data.data); // Simpan data transaksi ke state
        setLoading(false); // Hentikan loading
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setLoading(false); // Hentikan loading jika terjadi error
      }
    };

    if (transactionId) {
      fetchTransactionData(); // Panggil fungsi fetch jika transactionId tersedia
    }
  }, [transactionId, authToken]);

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

        {/* Loading State */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : transaction ? (
          <div className="space-y-4 sm:space-y-5">
            {/* Status */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Status</span>
              <span className="text-gray-800">{transaction.status}</span>
            </div>
            {/* No Kegiatan */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">No Kegiatan</span>
              <span className="text-gray-800">{transaction.id || "N/A"}</span>
            </div>
            {/* Kegiatan */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Kegiatan</span>
              <span className="text-gray-800">{transaction.activity_name || "N/A"}</span>
            </div>
            {/* Tanggal */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Tanggal</span>
              <span>
                {transaction.created_at
                  ? new Date(transaction.created_at).toLocaleDateString("id-ID")
                  : "N/A"}
              </span>
            </div>
            {/* Pemasukan */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Pemasukan</span>
              <span className="text-gray-800">
                Rp. {transaction.amount ? transaction.amount.toLocaleString("id-ID") : 0}
              </span>
            </div>
            {/* Pajak */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Pajak</span>
              <span className="text-gray-800">
                Rp. {transaction.tax_amount ? transaction.tax_amount.toLocaleString("id-ID") : 0}
              </span>
            </div>
            {/* Upload */}
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
                  {`Laporan.${transaction.document_evidence.split('.').pop()}`}
                </a>
              </div>
            )}
            {/* Evidence */}
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
                  {`Bukti.${transaction.image_evidence.split('.').pop()}`}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">Data not available.</div>
        )}

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

export default TransaksiPopup;
