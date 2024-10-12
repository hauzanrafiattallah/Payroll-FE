import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaSlidersH } from "react-icons/fa";
import FilterPopup from "../components/FilterPopup"; // Import komponen FilterPopup

const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    type: "All",
    startDate: "",
    endDate: "",
  });

  const data = [
    {
      name: "Pemasukan 1",
      date: "23 Sept 2024",
      amount: "Rp. 60.000.000",
      type: "Income",
      status: "Approved",
    },
    // ... data lainnya
  ];

  const filteredData = data.filter((item) => {
    if (filter.type !== "All" && item.type !== filter.type) return false;
    if (filter.startDate && new Date(item.date) < new Date(filter.startDate))
      return false;
    if (filter.endDate && new Date(item.date) > new Date(filter.endDate))
      return false;
    return true;
  });

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
            <div className="p-6 bg-[#B4252A] text-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Balance</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Income */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Monthly Income</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Expenses */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Monthly Expenses</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
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
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-center">{item.name}</td>
                    <td className="px-4 py-2 text-center">{item.date}</td>
                    <td className="px-4 py-2 text-center">{item.amount}</td>
                    <td className="px-4 py-2 text-center">{item.type}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-block w-[100px] px-2 py-1 text-sm font-semibold rounded-md text-center ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : item.status === "Pending"
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
              <button className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100">
                &lt;
              </button>
              <button className="px-3 py-1 text-white bg-[#B4252A] rounded-full">
                1
              </button>
              <button className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100">
                3
              </button>
              <span className="px-3 py-1 text-gray-600">...</span>
              <button className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100">
                69
              </button>
              <button className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
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
