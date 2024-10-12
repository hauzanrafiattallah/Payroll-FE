import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import TransactionPopup from "../components/TransactionPopup"; // Import komponen popup
import { PiHandWithdrawBold, PiHandDepositBold } from "react-icons/pi"; // Import icons

const Approval = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State untuk transaksi terpilih
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State untuk mengatur apakah popup terbuka

  // Dummy data for the approval
  const [approvalData, setApprovalData] = useState([
    {
      id: 1,
      name: "Conference 1",
      date: "03 Okt 2024",
      amount: "Rp.600.000.000",
      type: "Income",
    },
    {
      id: 2,
      name: "Conference 2",
      date: "04 Okt 2024",
      amount: "Rp.500.000.000",
      type: "Expenses",
    },
    {
      id: 3,
      name: "Conference 3",
      date: "05 Okt 2024",
      amount: "Rp.600.000.000",
      type: "Income",
    },
    {
      id: 4,
      name: "Conference 4",
      date: "06 Okt 2024",
      amount: "Rp.600.000.000",
      type: "Income",
    },
  ]);

  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction); // Set data transaksi yang dipilih
    setIsPopupOpen(true); // Buka popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Tutup popup
    setSelectedTransaction(null); // Reset transaksi yang dipilih
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

          <div className="space-y-4">
            {approvalData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm cursor-pointer md:flex-row" // Menghapus hover di sini, dan menambahkannya di inline-style
                onClick={() => handleCardClick(item)} // Handle klik card
                style={{
                  boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)", // Default shadow
                  transition: "box-shadow 0.3s ease-in-out", // Animasi saat hover
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 15px 3px rgba(180, 37, 42, 0.15)") // Shadow merah saat hover
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 8px 2px rgba(0, 0, 0, 0.05)") // Kembali ke shadow default saat tidak di-hover
                }
              >
                {/* Type and Transaction Details */}
                <div className="flex items-center mb-4 space-x-4 md:mb-0">
                  {/* Type Icon */}
                  <div className="flex items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      {item.type === "Income" ? (
                        <PiHandWithdrawBold
                          className="text-[#B4252A]"
                          size={24}
                        />
                      ) : (
                        <PiHandDepositBold
                          className="text-[#B4252A]"
                          size={24}
                        />
                      )}
                      <span className="mt-1 text-sm font-semibold text-[#B4252A]">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  {/* Transaction Details */}
                  <div>
                    <p className="text-sm font-semibold text-[#B4252A]">
                      {item.date}
                    </p>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-lg text-gray-600 sm:text-xl">
                      {item.amount}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <button className="w-24 h-10 px-4 py-1 text-[#B4252A] transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200 sm:w-36 sm:h-12 sm:px-6 sm:py-2">
                    Decline
                  </button>
                  <button className="w-24 h-10 px-4 py-1 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 transition-colors duration-200 sm:w-36 sm:h-12 sm:px-6 sm:py-2">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      {selectedTransaction && (
        <TransactionPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default Approval;
