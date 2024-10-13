import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReactLoading from "react-loading"; // Tambahkan ReactLoading

const Expenses = () => {
  const [expenseData, setExpenseData] = useState([]); // State untuk menyimpan data expenses
  const [loading, setLoading] = useState(true); // State untuk loading
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
        console.log("Document Evidence:", response.data.data.data[0].document_evidence); // Debugging document_evidence
        console.log("Image Evidence:", response.data.data.data[0].image_evidence); // Debugging image_evidence

        // Update state dengan array data expense yang berada di dalam response.data.data
        setExpenseData(response.data.data.data); // Ambil array data dari dalam nested `data`
        setLoading(false); // Hentikan loading setelah data berhasil diambil
      } catch (error) {
        console.error("Error fetching expense data:", error);
        setLoading(false); // Hentikan loading jika terjadi error
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

          {/* Loading State */}
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
            /* Tabel */
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
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          {expense.activity_name}{" "}
                          {/* Menggunakan activity_name */}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          {new Date(expense.created_at).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          {/* Menggunakan created_at */}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          Rp. {Number(expense.amount).toLocaleString("id-ID")}{" "}
                          {/* Menggunakan amount dan format sebagai Rupiah tanpa ,00 */}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          Rp. {Number(expense.tax_amount).toLocaleString("id-ID")}{" "}
                          {/* Menggunakan tax_amount dan format sebagai Rupiah tanpa ,00 */}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          <a
                            href={`https://payroll.humicprototyping.com/storage/app/public/${expense.document_evidence}`} // Tambahkan "/storage/app/public/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Laporan.Pdf
                          </a>
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          <a
                            href={`https://payroll.humicprototyping.com/storage/app/public/${expense.image_evidence}`} // Tambahkan "/storage/app/public/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Bukti.Pdf
                          </a>
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
                          {expense.status} {/* Menggunakan status */}
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
          )}
        </div>
      </div>
    </>
  );
};

export default Expenses;
