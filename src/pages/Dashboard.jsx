import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  // State untuk tombol yang aktif
  const [activeFilter, setActiveFilter] = useState("All");

  // Data untuk ditampilkan berdasarkan filter
  const data = [
    {
      name: "Pemasukan1",
      amount: "Rp. 60.000.000",
      type: "Income",
      date: "23 Sept 2024",
    },
    {
      name: "Pemasukan1",
      amount: "Rp. 60.000.000",
      type: "Income",
      date: "23 Sept 2024",
    },
    {
      name: "Expenses1",
      amount: "Rp. 60.000.000",
      type: "Expenses",
      date: "23 Sept 2024",
    },
  ];

  // Filter data berdasarkan tombol yang aktif
  const filteredData =
    activeFilter === "All"
      ? data
      : data.filter((item) => item.type === activeFilter);

  return (
    <>
      <Topbar />
      <div className="flex flex-col lg:flex-row mt-20">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full lg:max-w-7xl p-8 mx-auto lg:ml-20 mt-2">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Dashboard
          </h1>
          {/* Section untuk Balance, Income, dan Expenses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Balance */}
            <div
              className={`p-6 ${
                activeFilter === "All" ? "bg-[#B4252A] text-white" : "bg-white"
              } rounded-lg shadow-lg`}
            >
              <h2 className="text-lg font-semibold">Balance</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Income */}
            <div
              className={`p-6 ${
                activeFilter === "Income"
                  ? "bg-[#B4252A] text-white"
                  : "bg-white"
              } rounded-lg shadow-lg`}
            >
              <h2 className="text-lg font-semibold">Monthly Income</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Expenses */}
            <div
              className={`p-6 ${
                activeFilter === "Expenses"
                  ? "bg-[#B4252A] text-white"
                  : "bg-white"
              } rounded-lg shadow-lg`}
            >
              <h2 className="text-lg font-semibold">Monthly Expenses</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
          </div>
          {/* Section untuk History */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-center lg:text-left mb-4 md:mb-0">
              History
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === "All"
                    ? "bg-[#B4252A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("Income")}
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === "Income"
                    ? "bg-[#B4252A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setActiveFilter("Expenses")}
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === "Expenses"
                    ? "bg-[#B4252A] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                Expenses
              </button>
            </div>
          </div>
          <div className="p-6 mb-6 bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-center">Name</th>
                  <th className="py-2 px-4 text-center">Amount</th>
                  <th className="py-2 px-4 text-center">Type</th>
                  <th className="py-2 px-4 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      {item.amount}
                    </td>
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Section untuk Approval List */}
          <h2 className="mb-4 text-xl font-bold text-center lg:text-left">
            Approval List
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-center">Name</th>
                  <th className="py-2 px-4 text-center">Amount</th>
                  <th className="py-2 px-4 text-center">Date</th>
                  <th className="py-2 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="py-2 px-4 text-green-600 text-center">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="py-2 px-4 text-red-600 text-center">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="py-2 px-4 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="py-2 px-4 text-green-600 text-center">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
