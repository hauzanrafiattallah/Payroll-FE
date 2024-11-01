import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaSlidersH } from "react-icons/fa";
import FilterPopup from "../components/FilterPopup";
import TransactionPopUp from "../components/TransactionPopUp";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTransactionPopupOpen, setIsTransactionPopupOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [filter, setFilter] = useState({
    type: "All",
    startDate: "",
    endDate: "",
  });

  const [dashboardData, setDashboardData] = useState({
    ballance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyIncomeExpenseData: [],
    pieChart: { planningData: [], realizationData: [] },
    transactionList: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("token");

  // Tambahkan fungsi getBackgroundColor di sini
  const getBackgroundColor = (section) => {
    if (filter.type === "income" && section === "income") {
      return "bg-[#B4252A] text-white";
    } else if (filter.type === "expense" && section === "expense") {
      return "bg-[#B4252A] text-white";
    } else if (filter.type === "All" && section === "balance") {
      return "bg-[#B4252A] text-white";
    } else {
      return "bg-white text-black";
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            params: {
              transaction_type: filter.type === "All" ? "" : filter.type,
              start_date: filter.startDate,
              end_date: filter.endDate,
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
          ballance: response.data.data.balance,
          monthlyIncome: response.data.data.monthlyIncome,
          monthlyExpense: response.data.data.monthlyExpense,
          monthlyIncomeExpenseData: response.data.data.monthlyIncomeExpenseData,
          pieChart: response.data.data.pieChart,
          transactionList: response.data.data.transactionList.data,
        });

        setCurrentPage(response.data.data.transactionList.current_page);
        setLastPage(response.data.data.transactionList.last_page);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter, currentPage, authToken]);

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsTransactionPopupOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2;

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
            <Skeleton count={5} />
          ) : (
            <>
              {/* Balance, Monthly Income, and Monthly Expense */}
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "balance"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Balance</h2>
                  <p className="text-2xl font-bold">
                    Rp. {dashboardData.ballance.toLocaleString("id-ID")}
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

              {/* Monthly Income & Expenses Bar Chart */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Monthly Income & Expenses
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.monthlyIncomeExpenseData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="expense" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Planning and Realization Pie Charts */}
              <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
                <div className="p-6 rounded-lg shadow-lg bg-white">
                  <h2 className="text-lg font-semibold mb-4">Planning</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.pieChart.planningData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {dashboardData.pieChart.planningData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-6 rounded-lg shadow-lg bg-white">
                  <h2 className="text-lg font-semibold mb-4">Realization</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.pieChart.realizationData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {dashboardData.pieChart.realizationData.map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transaction List */}
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
                        onClick={() => handleTransactionClick(item.id)}
                      >
                        <td className="px-4 py-2 text-center">
                          {item.activity_name || "Unknown"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(item.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-2 text-center">
                          Rp. {item.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`font-semibold ${
                              item.transaction_type === "income"
                                ? "text-green-600"
                                : item.transaction_type === "expense"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {item.transaction_type || "N/A"}
                          </span>
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
                  {renderPagination()}
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
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

      {selectedTransactionId && (
        <TransactionPopUp
          isOpen={isTransactionPopupOpen}
          onClose={() => setIsTransactionPopupOpen(false)}
          transactionId={selectedTransactionId}
        />
      )}
    </>
  );
};

export default Dashboard;
