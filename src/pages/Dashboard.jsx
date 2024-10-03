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
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Dashboard
          </h1>
          {/* Section untuk Balance, Income, dan Expenses */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
            <h2 className="mb-4 text-2xl font-bold text-center lg:text-left md:mb-0">
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
          <div className="p-6 mb-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Type</th>
                  <th className="px-4 py-2 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.amount}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Section untuk Approval List */}
          <h2 className="mb-4 text-2xl font-bold text-center lg:text-left">
            Approval List
          </h2>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
                    Approved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">Denied</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Pemasukan1
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    Rp. 60.000.000
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    23 Sept 2024
                  </td>
                  <td className="px-4 py-2 text-center text-green-600">
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
