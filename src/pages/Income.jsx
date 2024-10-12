import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]); // State untuk menyimpan data income
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fetch data dari API
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/income`,
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

        // Update state dengan array data income yang berada di dalam response.data.data
        setIncomeData(response.data.data.data); // Ambil array data dari dalam nested `data`
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
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
            Income
          </h1>

          {/* Tabel */}
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">No Agenda</th>
                  <th className="px-4 py-2 text-center">Kegiatan</th>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">Pemasukan</th>
                  <th className="px-4 py-2 text-center">Pajak</th>
                  <th className="px-4 py-2 text-center">Upload</th>
                  <th className="px-4 py-2 text-center">Evidence</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {incomeData.length > 0 ? (
                  incomeData.map((income, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {income.no_agenda || index + 1}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {income.kegiatan}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {income.tanggal}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        Rp. {income.pemasukan}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        Rp. {income.pajak}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <a href={income.upload}>Laporan.Pdf</a>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <a href={income.evidence}>Bukti.Pdf</a>
                      </td>
                      <td
                        className={`px-4 py-2 text-center ${
                          income.status === "approve"
                            ? "text-green-600"
                            : income.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-600"
                        }`}
                      >
                        {income.status}
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

export default Income;
