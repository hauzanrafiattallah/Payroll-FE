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

  // getBackgroundColor
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

  // Skeleton Loading
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
              <h1 className="mb-10 text-2xl font-bold text-center lg:text-left mt-10">
                Monthly income & Expenses
              </h1>
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

              <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
                {/* Planning Section */}
                <div>
                  <h1 className="mb-6 text-2xl font-bold text-center lg:text-left mt-10">
                    Planning
                  </h1>
                  <div className="p-6 rounded-lg shadow-lg bg-white">
                    <div className="text-xl font-bold text-gray-700 mb-4">
                      Total
                      <br />
                      Rp.
                      {dashboardData.pieChart.totalPlanning.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <ResponsiveContainer
                      width="100%"
                      height={window.innerWidth < 640 ? 250 : 300} // Ukuran lebih kecil untuk mobile
                    >
                      <PieChart>
                        <Pie
                          data={dashboardData.pieChart.planningData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={window.innerWidth < 640 ? 80 : 100} // Ukuran lebih kecil untuk mobile
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
                          align={window.innerWidth < 640 ? "center" : "right"}
                          verticalAlign={
                            window.innerWidth < 640 ? "bottom" : "middle"
                          }
                          layout={
                            window.innerWidth < 640 ? "horizontal" : "vertical"
                          }
                          iconSize={0} // Menghilangkan ikon bawaan
                          wrapperStyle={{
                            display: "flex",
                            flexDirection:
                              window.innerWidth < 640 ? "row" : "column",
                            alignItems:
                              window.innerWidth < 640 ? "center" : "flex-start",
                            marginTop: window.innerWidth < 640 ? "1rem" : "0",
                            gap: window.innerWidth < 640 ? "0.5rem" : "0",
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
                  <h1 className="mb-6 text-2xl font-bold text-center lg:text-left mt-10">
                    Realization
                  </h1>
                  <div className="p-6 rounded-lg shadow-lg bg-white">
                    <div className="text-xl font-bold text-gray-700 mb-4">
                      Total
                      <br />
                      Rp.
                      {dashboardData.pieChart.totalRealization.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.pieChart.realizationData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={window.innerWidth < 640 ? 80 : 100} // Ukuran lebih kecil untuk mobile
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
                          align={window.innerWidth < 640 ? "center" : "right"}
                          verticalAlign={
                            window.innerWidth < 640 ? "bottom" : "middle"
                          }
                          layout={
                            window.innerWidth < 640 ? "horizontal" : "vertical"
                          }
                          iconSize={0}
                          wrapperStyle={{
                            display: "flex",
                            flexDirection:
                              window.innerWidth < 640 ? "row" : "column",
                            alignItems: "center",
                            marginTop: window.innerWidth < 640 ? "1rem" : "0",
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
