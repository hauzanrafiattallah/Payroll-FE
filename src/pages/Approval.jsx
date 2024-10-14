import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TransaksiPopup from "../components/TransaksiPopUp";
import { PiHandWithdrawBold, PiHandDepositBold } from "react-icons/pi"; // Import icons
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Approval = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTransactionPopupOpen, setIsTransactionPopupOpen] = useState(false);

  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fetch data approval dari API
  useEffect(() => {
    const fetchApprovalData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pending`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Sertakan token di header
              Accept: "application/json",
            },
          }
        );
        setApprovalData(response.data.data.data); // Menyimpan data approval ke state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching approval data:", error);
        toast.error("Gagal mengambil data approval.");
        setLoading(false);
      }
    };

    fetchApprovalData();
  }, [authToken]);

  const handleConfirmClick = (type, transaction) => {
    console.log("Action type:", type); // Logging action type (approve atau decline)
    console.log("Selected transaction:", transaction); // Pastikan transaksi terpilih

    setSelectedTransaction(transaction); // Set data transaksi yang dipilih
    setActionType(type); // Set action type (approve atau decline)
    setIsConfirmPopupOpen(true); // Buka confirm popup
  };

  const handleCloseConfirmPopup = () => {
    setIsConfirmPopupOpen(false); // Tutup confirm popup
  };

  // Fungsi untuk approve atau decline transaksi
  const handleAction = async () => {
    if (!selectedTransaction) {
      toast.error("Tidak ada transaksi yang dipilih!");
      return;
    }

    const status = actionType.toLowerCase();
    const endpoint = `${import.meta.env.VITE_API_URL}/finance/${
      selectedTransaction.id
    }`;

    try {
      const response = await axios.post(
        endpoint,
        { status },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status) {
        toast.success(`Transaksi berhasil di${status}`);

        // Update UI: Hapus transaksi yang sudah di-approve atau di-decline dari state
        setApprovalData((prevData) =>
          prevData.filter((item) => item.id !== selectedTransaction.id)
        );

        // Reset selected transaction setelah selesai
        setSelectedTransaction(null);
      } else {
        toast.error(`Gagal ${status} transaksi`);
      }
    } catch (error) {
      toast.error(`Gagal ${status} transaksi`);
    }

    handleCloseConfirmPopup();
  };

  // Handle outside click to close confirm popup
  const handleOutsideClick = (e) => {
    if (e.target.id === "confirm-popup-background") {
      setIsConfirmPopupOpen(false); // Close confirm popup if clicking outside
    }
  };

  // Fungsi untuk menampilkan popup detail transaksi
  const handleTransactionClick = (transaction) => {
    if (transaction && transaction.id) {
      setSelectedTransaction(transaction); // Simpan transaksi yang dipilih
      setIsTransactionPopupOpen(true); // Buka TransactionPopup
    } else {
      toast.error("Transaksi tidak valid");
    }
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Content */}
        <div className="w-full p-4 mx-auto mt-2 sm:p-8 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-xl font-bold text-center sm:text-2xl lg:text-left">
            Approval
          </h1>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <ReactLoading
                type="spin"
                color="#B4252A"
                height={50}
                width={50}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {approvalData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm cursor-pointer md:flex-row"
                  style={{
                    boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)",
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 15px 3px rgba(180, 37, 42, 0.15)")
                  }
                  onMouseLeave={
                    (e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 8px 2px rgba(0, 0, 0, 0.05)") // Kembali ke shadow default saat tidak di-hover
                  }
                  onClick={() => handleTransactionClick(item)} // Ketika item diklik, tampilkan detail transaksi
                >
                  {/* Type and Transaction Details */}
                  <div className="flex items-center mb-4 space-x-4 md:mb-0">
                    {/* Type Icon */}
                    <div className="flex items-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        {item.transaction_type === "income" ? (
                          <PiHandWithdrawBold
                            className="text-[#48B121]"
                            size={24}
                          />
                        ) : (
                          <PiHandDepositBold
                            className="text-[#B4252A]"
                            size={24}
                          />
                        )}
                        <span className="mt-1 text-sm font-semibold text-[#B4252A]">
                          {item.transaction_type}
                        </span>
                      </div>
                    </div>
                    {/* Transaction Details */}
                    <div>
                      <p className="text-sm font-semibold text-[#B4252A]">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <h3 className="text-lg font-bold">
                        {item.activity_name}
                      </h3>
                      <p className="text-lg text-gray-600 sm:text-xl">
                        Rp. {item.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      className="w-24 h-10 px-4 py-1 text-[#B4252A] transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200 sm:w-36 sm:h-12 sm:px-6 sm:py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmClick("Decline", item);
                      }}
                    >
                      Decline
                    </button>
                    <button
                      className="w-24 h-10 px-4 py-1 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition-colors duration-200 sm:w-36 sm:h-12 sm:px-6 sm:py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmClick("Approve", item);
                      }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Popup */}
      {selectedTransaction && (
        <TransaksiPopup
          isOpen={isTransactionPopupOpen}
          onClose={() => setIsTransactionPopupOpen(false)}
          transactionId={selectedTransaction.id} // Kirim ID transaksi ke TransactionPopup
        />
      )}

      {/* Confirm Popup */}
      {isConfirmPopupOpen && (
        <div
          id="confirm-popup-background"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          onClick={handleOutsideClick} // Close on outside click
        >
          <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg sm:max-w-sm md:max-w-md">
            <h2 className="mb-8 text-xl font-semibold text-center">
              {actionType === "Approve"
                ? "Approve Confirmation"
                : "Decline Confirmation"}
            </h2>
            <p className="mb-12 text-center text-gray-600">
              Apakah anda yakin {actionType.toLowerCase()} laporan keuangan ini?
            </p>
            <div className="flex justify-between">
              <button
                className="w-32 h-10 px-4 py-2 text-[#B4252A] transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200"
                onClick={handleCloseConfirmPopup}
              >
                Cancel
              </button>
              <button
                className="w-32 h-10 px-4 py-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition-colors duration-200"
                onClick={handleAction} // Call handleAction saat confirm
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Approval;
