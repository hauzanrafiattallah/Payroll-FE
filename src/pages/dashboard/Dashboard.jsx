import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { FaSlidersH } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import FilterPopup from "../../components/popups/filter/FilterPopup";
import TransactionPopUp from "../../components/popups/transactions/TransactionPopUp";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import ReactLoading from "react-loading";
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
  Legend,
  Rectangle,
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
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("token");
  const [selectedYearBarChart, setSelectedYearBarChart] = useState(
    new Date().getFullYear()
  );
  const [selectedYearPieChart, setSelectedYearPieChart] = useState(
    new Date().getFullYear()
  );
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role")); // Stores the user's role
  const deletePopupRef = useRef(null);

  const [showYearDropdownBarChart, setShowYearDropdownBarChart] =
    useState(false);
  const [showYearDropdownPieChart, setShowYearDropdownPieChart] =
    useState(false);
  const barChartDropdownRef = useRef(null);
  const pieChartDropdownRef = useRef(null);
  const years = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023];

  const handleClickOutside = (e) => {
    if (
      barChartDropdownRef.current &&
      !barChartDropdownRef.current.contains(e.target)
    ) {
      setShowYearDropdownBarChart(false);
    }
    if (
      pieChartDropdownRef.current &&
      !pieChartDropdownRef.current.contains(e.target)
    ) {
      setShowYearDropdownPieChart(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    const fetchUserRole = async () => {
      if (!role) {
        try {
          const authToken = localStorage.getItem("token"); // Retrieve authentication token

          // Request user data from the API
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
              },
            }
          );

          const userRole = response.data.role;
          setRole(userRole); // Store role in state
          localStorage.setItem("role", userRole); // Cache role in localStorage
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Gagal mendapatkan data pengguna."); // Notify user about the error
        }
      }
    };

    fetchUserRole();
  }, [role]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            params: {
              incomeExpenseYear: selectedYearBarChart,
              transaction_type: filter.type === "All" ? "" : filter.type,
            },
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const filteredData = response.data.data.monthlyIncomeExpenseData || [];
        setDashboardData((prevData) => ({
          ...prevData,
          monthlyIncomeExpenseData: filteredData,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching BarChart data:", error);
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedYearBarChart, filter, authToken]);

  const handleYearSelectBarChart = (year) => {
    setSelectedYearBarChart(year);
    setShowYearDropdownBarChart(false);
  };

  const handleYearSelectPieChart = (year) => {
    setSelectedYearPieChart(year);
    setShowYearDropdownPieChart(false);
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
              start_date: filter.startDate || "",
              end_date: filter.endDate || "",
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
        setNextPageUrl(response.data.data.transactionList.next_page_url);
        setPrevPageUrl(response.data.data.transactionList.prev_page_url);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter, currentPage, authToken]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            params: {
              planningRealizationYear: selectedYearPieChart,
            },
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDashboardData((prevData) => ({
          ...prevData,
          pieChart: response.data.data.pieChart,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PieChart data:", error);
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [selectedYearPieChart, authToken]);

  const handleTransactionClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsTransactionPopupOpen(true);
  };

  const openDeletePopup = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedTransactionId(null);
  };

  // Event listener untuk mendeteksi klik di luar pop-up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDeletePopupOpen &&
        deletePopupRef.current &&
        !deletePopupRef.current.contains(event.target)
      ) {
        closeDeletePopup(); // Tutup pop-up jika klik di luar
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDeletePopupOpen]);

  const handleDelete = async (transactionId) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/finance/${transactionId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("Transaction deleted successfully!");
      // Update daftar transaksi
      setDashboardData((prevData) => ({
        ...prevData,
        transactionList: prevData.transactionList.filter(
          (transaction) => transaction.id !== transactionId
        ),
      }));

      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 1;

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
          disabled={loading} // Disable jika sedang loading
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
          disabled={loading} // Disable jika sedang loading
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
          disabled={loading} // Disable jika sedang loading
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  const renderSkeleton = () => (
    <>
      {/* Skeleton for Balance, Income, Expense */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width="80%" />
          <Skeleton height={30} width="60%" className="mt-2" />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width="80%" />
          <Skeleton height={30} width="60%" className="mt-2" />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Skeleton height={20} width="80%" />
          <Skeleton height={30} width="60%" className="mt-2" />
        </div>
      </div>

      {/* Skeleton for Bar Chart */}
      <div className="mb-6">
        <div
          className="relative bg-gray-100 rounded-lg p-4"
          style={{ height: 300 }}
        >
          <div className="absolute inset-0 flex justify-center items-end space-x-2">
            {/* Bar Skeletons */}
            <Skeleton width={40} height={50} className="bg-gray-300" />
            <Skeleton width={40} height={100} className="bg-gray-300" />
            <Skeleton width={40} height={30} className="bg-gray-300" />
            <Skeleton width={40} height={80} className="bg-gray-300" />
            <Skeleton width={40} height={60} className="bg-gray-300" />
            <Skeleton width={40} height={150} className="bg-gray-300" />
            <Skeleton width={40} height={90} className="bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Skeleton for Pie Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Skeleton width={80} height={20} className="mb-4" />{" "}
          {/* Skeleton judul "Planning" */}
          <div className="flex justify-center">
            <Skeleton circle={true} height={200} width={200} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Skeleton width={100} height={20} className="mb-4" />{" "}
          {/* Skeleton judul "Realization" */}
          <div className="flex justify-center">
            <Skeleton circle={true} height={200} width={200} />
          </div>
        </div>
      </div>

      {/* Skeleton for Transaction Table */}
      <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
              <th className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-center">
                  <Skeleton width={50} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton width={100} height={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const COLORS = [
    "#EA9B4D",
    "#48B121",
    "#617BFF",
    "#FF617B",
    "#FFD761",
    "#FF9A8B",
    "#99CCFF",
    "#B9F6CA",
    "#8A2BE2",
    "#00FF00",
    "#D500F9",
    "#FF5722",
    "#FFEB3B",
    "#4CAF50",
    "#00BCD4",
    "#3F51B5",
    "#8BC34A",
    "#FF9800",
    "#F44336",
    "#9C27B0",
    "#607D8B",
    "#795548",
    "#2196F3",
    "#03A9F4",
    "#CDDC39",
    "#8D6E63",
    "#E91E63",
    "#FFC107",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#03A9F4",
    "#FF9800",
    "#8D6E63",
    "#795548",
    "#FF4081",
    "#00E5FF",
    "#8BC34A",
    "#F44336",
    "#FF5722",
    "#607D8B",
    "#9E9E9E",
    "#D32F2F",
    "#0288D1",
    "#388E3C",
    "#F57C00",
    "#8E24AA",
    "#7B1FA2",
    "#00C853",
    "#FF6D00",
    "#FFD600",
    "#2C6CB0",
    "#9E1B32",
    "#00A4A6",
    "#E040FB",
    "#8BC34A",
    "#FFC107",
    "#FF5722",
    "#00BCD4",
    "#B71C1C",
    "#00695C",
    "#5C6BC0",
    "#0288D1",
    "#D32F2F",
    "#1976D2",
    "#388E3C",
    "#FF8A80",
    "#00E5FF",
    "#2196F3",
    "#FF6F00",
    "#FF80AB",
    "#9E9D24",
    "#1976D2",
    "#4CAF50",
    "#64FFDA",
    "#D50000",
    "#673AB7",
    "#FFEB3B",
    "#2196F3",
    "#FF5722",
    "#00C853",
    "#607D8B",
    "#E040FB",
    "#FF9800",
    "#9C27B0",
    "#3F51B5",
    "#607D8B",
    "#4CAF50",
    "#F44336",
    "#9E9E9E",
    "#5C6BC0",
    "#00C853",
    "#03A9F4",
    "#FF4081",
    "#FFEB3B",
    "#8BC34A",
    "#FF5722",
    "#F57C00",
    "#1976D2",
    "#7B1FA2",
    "#0288D1",
    "#FF9800",
    "#8D6E63",
    "#795548",
    "#FF5252",
  ];

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
            renderSkeleton()
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
                    Rp. {(dashboardData.ballance || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "income"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Monthly Income</h2>
                  <p className="text-2xl font-bold">
                    Rp.{" "}
                    {(dashboardData.monthlyIncome || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
                    "expense"
                  )}`}
                >
                  <h2 className="text-lg font-semibold">Monthly Expense</h2>
                  <p className="text-2xl font-bold">
                    Rp.{" "}
                    {(dashboardData.monthlyExpense || 0).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>

              {/* Monthly Income & Expenses Bar Chart */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  Monthly Income & Expenses
                </h1>
                <div className="relative">
                  <button
                    className="flex items-center px-4 py-2 text-sm font-semibold text-black bg-white border rounded-md shadow-sm hover:bg-gray-100 border-gray-300"
                    onClick={() => {
                      setShowYearDropdownBarChart(!showYearDropdownBarChart);
                      setShowYearDropdownPieChart(false);
                    }}
                  >
                    <FaCalendarAlt className="mr-2" /> {selectedYearBarChart}
                  </button>
                  {showYearDropdownBarChart && (
                    <div
                      ref={barChartDropdownRef}
                      className="absolute right-0 z-50 w-32 mt-2 bg-white border rounded-lg shadow-lg"
                    >
                      {years.map((year) => (
                        <div
                          key={year}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                            year === selectedYearBarChart
                              ? "font-bold text-[#B4252A]"
                              : ""
                          }`}
                          onClick={() => handleYearSelectBarChart(year)}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dashboardData.monthlyIncomeExpenseData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${value.toLocaleString("id-ID")}`
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString("id-ID")}`}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: 8,
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      labelStyle={{ color: "#333" }}
                      itemStyle={{ color: "#333", fontWeight: "bold" }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#AFE9B0"
                      radius={[4, 4, 0, 0]}
                      shape={<Rectangle />}
                      activeShape={<Rectangle fill="#B4252A4D" />}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#FD898D"
                      radius={[4, 4, 0, 0]}
                      shape={<Rectangle />}
                      activeShape={<Rectangle fill="#B4252A4D" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Planning Section */}
              <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
                <div>
                  <h1 className="mb-6 text-2xl font-bold text-center lg:text-left mt-10">
                    Planning
                  </h1>
                  <div className="p-6 rounded-lg shadow-lg bg-white">
                    <div className="text-xl font-bold text-gray-700 mb-4">
                      Total
                      <br />
                      Rp.
                      {(
                        dashboardData.pieChart.totalPlanning || 0
                      ).toLocaleString("id-ID")}
                    </div>
                    <ResponsiveContainer
                      width="100%"
                      height={window.innerWidth < 640 ? 250 : 300}
                    >
                      <PieChart>
                        <Pie
                          data={dashboardData.pieChart.planningData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={window.innerWidth < 640 ? 80 : 100}
                        >
                          {dashboardData.pieChart.planningData.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Legend
                          className="cursor-pointer"
                          align="right"
                          verticalAlign="middle"
                          layout="vertical"
                          iconSize={0}
                          wrapperStyle={{
                            maxHeight: "250px", // Batasi tinggi maksimal
                            overflowY: "auto", // Aktifkan scroll ketika melebihi batas
                            paddingRight: "10px", // Tambahkan jarak
                            scrollbarWidth: "none",
                          }}
                          formatter={(value, entry, index) => {
                            const item =
                              dashboardData.pieChart.planningData[index];
                            const color = COLORS[index % COLORS.length];
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    backgroundColor: color,
                                    borderRadius: "2px",
                                    marginRight: 8,
                                  }}
                                ></span>
                                <div style={{ lineHeight: 1.2 }}>
                                  <span
                                    style={{ color: color, fontWeight: "bold" }}
                                  >
                                    {item.name}
                                  </span>
                                  <br />
                                  <span style={{ color: "#888888" }}>
                                    Rp.{item.value.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Realization Section */}
                <div>
                  <div className="flex justify-between items-center mb-6 mt-8">
                    <h1 className="text-2xl font-bold">Realization</h1>
                    <div className="relative">
                      <button
                        className="flex items-center px-4 py-2 text-sm font-semibold text-black bg-white border rounded-md shadow-sm hover:bg-gray-100 border-gray-300"
                        onClick={() => {
                          setShowYearDropdownPieChart(
                            !showYearDropdownPieChart
                          );
                          setShowYearDropdownBarChart(false);
                        }}
                      >
                        <FaCalendarAlt className="mr-2" />{" "}
                        {selectedYearPieChart}
                      </button>
                      {showYearDropdownPieChart && (
                        <div
                          ref={pieChartDropdownRef}
                          className="absolute right-0 z-50 w-32 mt-2 bg-white border rounded-lg shadow-lg"
                        >
                          {years.map((year) => (
                            <div
                              key={year}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                year === selectedYearPieChart
                                  ? "font-bold text-[#B4252A]"
                                  : ""
                              }`}
                              onClick={() => handleYearSelectPieChart(year)}
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 rounded-lg shadow-lg bg-white">
                    <div className="text-xl font-bold text-gray-700 mb-4">
                      Total
                      <br />
                      Rp.
                      {(
                        dashboardData.pieChart.totalRealization || 0
                      ).toLocaleString("id-ID")}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.pieChart.realizationData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={window.innerWidth < 640 ? 80 : 100}
                        >
                          {dashboardData.pieChart.realizationData.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Legend
                          align="right"
                          verticalAlign="middle"
                          layout="vertical"
                          iconSize={0}
                          wrapperStyle={{
                            maxHeight: "250px", // Batasi tinggi maksimal
                            overflowY: "auto", // Aktifkan scroll ketika melebihi batas
                            paddingRight: "10px", // Tambahkan jarak
                            scrollbarWidth: "none",
                          }}
                          formatter={(value, entry, index) => {
                            const item =
                              dashboardData.pieChart.realizationData[index];
                            const color = COLORS[index % COLORS.length];
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    backgroundColor: color,
                                    borderRadius: "2px",
                                    marginRight: 8,
                                  }}
                                ></span>
                                <div style={{ lineHeight: 1.2 }}>
                                  <span
                                    style={{ color: color, fontWeight: "bold" }}
                                  >
                                    {item.name}
                                  </span>
                                  <br />
                                  <span style={{ color: "#888888" }}>
                                    Rp.{item.value.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Compare Event Button */}
              <div className="flex justify-center mt-6">
                <Link
                  to="/compare"
                  className="px-6 py-3 text-white bg-[#B4252A] rounded-full shadow-md hover:bg-[#8E1F22] focus:outline-none"
                >
                  Compare Event
                </Link>
              </div>

              {/* Transaction List */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transaction List</h1>
                <button
                  className="flex items-center px-4 py-2 text-sm font-semibold text-black bg-white border rounded-md shadow-sm hover:bg-gray-100 border-gray-300"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <FaSlidersH className="mr-2" /> Filter
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
                        onClick={() => handleTransactionClick(item.id)}
                      >
                        <td className="px-4 py-2 text-center">
                          {item.activity_name || "Unknown"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(item.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-2 text-center">
                          Rp. {(item.amount || 0).toLocaleString("id-ID")}
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
                            {item.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {role === "admin" && item.status === "approve" ? (
                            <p></p>
                          ) : (
                            <button
                              className="p-2 text-white bg-[#B4252A] rounded-lg hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeletePopup(item.id);
                              }}
                              disabled={
                                isDeleting && selectedTransactionId === item.id // Nonaktifkan tombol saat sedang menghapus
                              }
                            >
                              <FaTrash size={17} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isDeletePopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div
                    ref={deletePopupRef}
                    className="bg-white p-8 rounded-lg shadow-lg popup-content w-[90%] max-w-md min-h-[200px]"
                  >
                    <div className="flex flex-col items-center space-y-6">
                      <h2 className="text-xl font-bold">Delete Confirmation</h2>
                      <p className="text-center text-gray-500">
                        Apakah anda yakin untuk menghapus transaksi ini?
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          className="px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32"
                          onClick={closeDeletePopup}
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32"
                          onClick={() => handleDelete(selectedTransactionId)}
                          disabled={isDeleting}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-end mt-6">
                <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!prevPageUrl || loading}
                  >
                    &lt;
                  </button>
                  {renderPagination()}
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!nextPageUrl || loading}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

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
