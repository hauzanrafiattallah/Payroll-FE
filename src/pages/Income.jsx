import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReactLoading from "react-loading"; // Tambahkan ReactLoading untuk indikator loading
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: untuk styling default skeleton

const Income = () => {
  const [incomeData, setIncomeData] = useState([]); // State untuk menyimpan data income
  const [loading, setLoading] = useState(true); // State untuk loading
  const [currentPage, setCurrentPage] = useState(1); // State untuk menyimpan halaman saat ini
  const [lastPage, setLastPage] = useState(1); // State untuk menyimpan halaman terakhir
  const [nextPageUrl, setNextPageUrl] = useState(null); // URL halaman berikutnya
  const [prevPageUrl, setPrevPageUrl] = useState(null); // URL halaman sebelumnya
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fungsi untuk mendapatkan ekstensi file
  const getFileExtension = (filePath) => {
    return filePath ? filePath.split(".").pop() : ""; // Mengambil ekstensi file setelah titik
  };

  // Fetch data dari API
  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true); // Set loading sebelum mulai mengambil data
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/income`,
          {
            params: {
              page: currentPage, // Halaman saat ini
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
        setCurrentPage(response.data.data.current_page); // Atur halaman saat ini dari response
        setLastPage(response.data.data.last_page); // Atur halaman terakhir dari response
        setNextPageUrl(response.data.data.next_page_url); // Set URL halaman berikutnya
        setPrevPageUrl(response.data.data.prev_page_url); // Set URL halaman sebelumnya
        setLoading(false); // Hentikan loading setelah data berhasil diambil
      } catch (error) {
        console.error("Error fetching income data:", error);
        setLoading(false); // Hentikan loading jika terjadi error
      }
    };

    fetchIncomeData();
  }, [authToken, currentPage]); // Refetch data ketika currentPage berubah

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // Fungsi untuk menampilkan pagination dengan format tertentu
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2; // Jumlah halaman yang ditampilkan sebelum dan sesudah halaman saat ini

    // Menambahkan tombol untuk halaman pertama jika halaman saat ini lebih dari maxPagesToShow
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

    // Menampilkan halaman sekitar halaman saat ini
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

    // Menambahkan tombol untuk halaman terakhir jika halaman saat ini mendekati halaman terakhir
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
        {/* Sidebar */}
        <Sidebar />

        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Income
          </h1>

          {/* Loading State */}
          {loading ? (
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
          ) : (
            <>
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
                            {index + 1} {/* Menampilkan nomor urut */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            {income.activity_name}{" "}
                            {/* Mengambil activity_name */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            {new Date(income.created_at).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            {/* Mengambil created_at dan memformatnya */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            Rp. {Number(income.amount).toLocaleString("id-ID")}{" "}
                            {/* Format amount sebagai Rupiah tanpa ,00 */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            Rp.{" "}
                            {Number(income.tax_amount).toLocaleString("id-ID")}{" "}
                            {/* Format tax_amount sebagai Rupiah tanpa ,00 */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            <a
                              href={`https://payroll.humicprototyping.com/storage/app/public/${income.document_evidence}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`Laporan.${getFileExtension(
                                income.document_evidence
                              )}`}
                            </a>{" "}
                            {/* Tampilkan nama file berdasarkan ekstensi */}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            <a
                              href={`https://payroll.humicprototyping.com/storage/app/public/${income.image_evidence}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`Bukti.${getFileExtension(
                                income.image_evidence
                              )}`}
                            </a>{" "}
                            {/* Tampilkan nama file berdasarkan ekstensi */}
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
                            {income.status} {/* Mengambil status */}
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

              {/* Pagination */}
              <div className="flex justify-end mt-6">
                <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1} // Disable button ketika di halaman pertama
                  >
                    &lt;
                  </button>
                  {renderPagination()} {/* Panggil fungsi renderPagination */}
                  <button
                    className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage} // Disable button ketika di halaman terakhir
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Income;
