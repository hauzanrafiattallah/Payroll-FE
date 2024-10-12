import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaSlidersH } from "react-icons/fa";
import FilterPopup from "../components/FilterPopup";
import ReactLoading from "react-loading"; // Import loading component

const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    type: "All",
    startDate: "",
    endDate: "",
  });

  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    transactionList: [],
  });

  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini
  const [loading, setLoading] = useState(true); // State for loading
  const authToken = localStorage.getItem('token'); // Ambil token dari localStorage

  // Fetch API data when component mounts or filter/page changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`, {
          params: {
            transaction_type: filter.type === "All" ? "" : filter.type,
            start_date: filter.startDate || '2024-10-01', // Default value jika kosong
            end_date: filter.endDate || '2024-10-07', // Default value jika kosong
            page: currentPage, // Gunakan currentPage untuk pagination
            limit: 10, // Sesuaikan limit sesuai kebutuhan
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Gunakan token dari localStorage
          },
        });

        setDashboardData({
          balance: response.data.data.balance,
          monthlyIncome: response.data.data.monthlyIncome,
          monthlyExpense: response.data.data.monthlyExpense,
          transactionList: response.data.data.transactionList.data,
        });
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchDashboardData();
  }, [filter, currentPage, authToken]); // Refetch data saat filter atau halaman berubah

  // Event handler untuk pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Update halaman dan fetch data ulang
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Dashboard
          </h1>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
            </div>
          ) : (
            <>
              {/* Section untuk Balance, Income, dan Expense */}
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Balance */}
                <div className="p-6 bg-[#B4252A] text-white rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold">Balance</h2>
                  <p className="text-2xl font-bold">Rp. {dashboardData.balance}</p>
                </div>
                {/* Monthly Income */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold">Monthly Income</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.monthlyIncome}
                  </p>
                </div>
                {/* Monthly Expense */}
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold">Monthly Expense</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.monthlyExpense}
                  </p>
                </div>
              </div>

              {/* Transaction List */}
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

              {/* Tabel Transaction */}
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
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-center">{item.name || 'Unknown'}</td>
                        <td className="px-4 py-2 text-center">{item.date || 'Unknown'}</td>
                        <td className="px-4 py-2 text-center">{item.amount || 0}</td>
                        <td className="px-4 py-2 text-center">{item.type || 'N/A'}</td>
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

              {/* Pagination */}
              <div className="flex justify-end mt-6">
                <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
                  <button 
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <button className="px-3 py-1 text-white bg-[#B4252A] rounded-full">
                    {currentPage}
                  </button>
                  <button 
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Pop-Up */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        applyFilter={setFilter}
      />
    </>
  );
};

export default Dashboard;
