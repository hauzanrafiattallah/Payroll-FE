import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Expenses = () => {
  const [expenseData, setExpenseData] = useState([]); // State untuk menyimpan data expenses
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fetch data dari API
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/expense`, // Sesuaikan dengan endpoint expense
          {
            params: {
              page: 1,
              limit: 10, // Sesuaikan limit sesuai kebutuhan
            },
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`, // Gunakan token yang sesuai
            },
          }
        );

        console.log(response.data); // Debugging untuk melihat response yang diterima

        // Update state dengan array data expense yang berada di dalam response.data.data
        setExpenseData(response.data.data.data); // Ambil array data dari dalam nested `data`
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    fetchExpenseData();
  }, [authToken]);

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Expenses
          </h1>

          {/* Tabel */}
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">No Agenda</th>
                  <th className="px-4 py-2 text-center">Kegiatan</th>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">Pengeluaran</th>
                  <th className="px-4 py-2 text-center">Pajak</th>
                  <th className="px-4 py-2 text-center">Upload</th>
                  <th className="px-4 py-2 text-center">Evidence</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.length > 0 ? (
                  expenseData.map((expense, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {expense.no_agenda || index + 1}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {expense.kegiatan}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {expense.tanggal}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        Rp. {expense.pengeluaran}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        Rp. {expense.pajak}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <a href={expense.upload}>Laporan.Pdf</a>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <a href={expense.evidence}>Bukti.Pdf</a>
                      </td>
                      <td
                        className={`px-4 py-2 text-center ${
                          expense.status === "approve"
                            ? "text-green-600"
                            : expense.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-600"
                        }`}
                      >
                        {expense.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-2 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expenses;
