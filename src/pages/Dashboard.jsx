import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaSlidersH } from "react-icons/fa";
import FilterPopup from "../components/FilterPopup";
import TransaksiPopup from "../components/TransaksiPopUp";
import ReactLoading from "react-loading";

const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTransactionPopupOpen, setIsTransactionPopupOpen] = useState(false); // State untuk popup transaksi
  const [selectedTransactionId, setSelectedTransactionId] = useState(null); // State untuk menyimpan ID transaksi yang dipilih
  const [filter, setFilter] = useState({
    type: "All",
    startDate: "",
    endDate: "",
  });

  const [dashboardData, setDashboardData] = useState({
    ballance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    transactionList: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("token");

  // Function to determine background color
  const getBackgroundColor = (section) => {
    if (filter.type === "income" && section === "income") {
      return "bg-[#B4252A] text-white";
    } else if (filter.type === "expense" && section === "expense") {
      return "bg-[#B4252A] text-white";
    } else if (filter.type === "All" && section === "balance") {
      return "bg-[#B4252A] text-white";
    } else {
      return "bg-white text-black"; // Default color
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Log parameter yang dikirim ke API
        console.log("Sending request with params:", {
          transaction_type: filter.type === "All" ? "" : filter.type,
          start_date: filter.startDate, // Rentang waktu lebih luas
          end_date: filter.endDate, // Rentang waktu lebih luas
          page: currentPage,
          limit: 10,
        });

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            params: {
              transaction_type: filter.type === "All" ? "" : filter.type,
              start_date: filter.startDate, // Rentang waktu lebih luas
              end_date: filter.endDate, // Rentang waktu lebih luas
              page: currentPage,
              limit: 10,
            },
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDashboardData({
          ballance: response.data.data.ballance,
          monthlyIncome: response.data.data.monthlyIncome,
          monthlyExpense: response.data.data.monthlyExpense,
          transactionList: response.data.data.transactionList.data,
        });

        setCurrentPage(response.data.data.transactionList.current_page);
        setLastPage(response.data.data.transactionList.last_page);
        setNextPageUrl(response.data.data.transactionList.next_page_url);
        setPrevPageUrl(response.data.data.transactionList.prev_page_url);

        // Log response dari API untuk memastikan jumlah data
        console.log("API Response: ", response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter, currentPage, authToken]);

  const handlePageChange = (newPage) => {
    console.log("Page change requested: ", newPage);
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(transactionId); // Set ID transaksi yang dipilih
    setIsTransactionPopupOpen(true); // Tampilkan popup
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2;

    console.log("Rendering pagination...");
    console.log("Next Page URL: ", nextPageUrl);
    console.log("Prev Page URL: ", prevPageUrl);

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      pageNumbers.push(<span key="dots-before">...</span>);
    }

    for (
      let i = Math.max(1, currentPage - maxPagesToShow);
      i <= Math.min(lastPage, currentPage + maxPagesToShow);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-full ${
            i === currentPage
              ? "text-white bg-[#B4252A]"
              : "text-gray-600 bg-white hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage - maxPagesToShow) {
      pageNumbers.push(<span key="dots-after">...</span>);
      pageNumbers.push(
        <button
          key={lastPage}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(lastPage)}
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Dashboard
          </h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <ReactLoading
                type="spin"
                color="#B4252A"
                height={50}
                width={50}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "balance"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Balance</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.ballance.toLocaleString("id-ID")}{" "}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "income"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Monthly Income</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.monthlyIncome.toLocaleString("id-ID")}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "expense"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Monthly Expense</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.monthlyExpense.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
                  Transaction List
                </h1>
                <button
                  className="flex items-center px-4 py-2 text-black bg-white rounded-lg shadow hover:bg-gray-200"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <FaSlidersH className="mr-2" />
                  Filter
                </button>
              </div>

              <div className="p-6 mb-6 overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full text-left table-auto min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-center">Name</th>
                      <th className="px-4 py-2 text-center">Date</th>
                      <th className="px-4 py-2 text-center">Amount</th>
                      <th className="px-4 py-2 text-center">Type</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.transactionList.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b cursor-pointer hover:bg-gray-100"
                        onClick={() => handleTransactionClick(item.id)} // Saat baris diklik, tampilkan popup
                      >
                        <td className="px-4 py-2 text-center">
                          {item.activity_name || "Unknown"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : "Unknown"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          Rp. {item.amount.toLocaleString("id-ID") || 0}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {item.transaction_type || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-block w-[100px] px-2 py-1 text-sm font-semibold rounded-md text-center ${
                              item.status === "approve"
                                ? "bg-green-100 text-green-600"
                                : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!prevPageUrl}
                  >
                    &lt;
                  </button>
                  {renderPagination()}
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!nextPageUrl}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        applyFilter={setFilter}
      />

      {/* Tambahkan komponen TransactionPopup */}
      {selectedTransactionId && (
        <TransaksiPopup
          isOpen={isTransactionPopupOpen}
          onClose={() => setIsTransactionPopupOpen(false)}
          transactionId={selectedTransactionId} // Kirim ID transaksi yang dipilih
        />
      )}
    </>
  );
};

export default Dashboard;
