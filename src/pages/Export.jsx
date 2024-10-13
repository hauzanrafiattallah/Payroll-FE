import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaFileExcel, FaFilePdf, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading"; // Untuk loading state
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Import untuk lokal Indonesia

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportType, setExportType] = useState("xlsx"); // Format default: Excel (.xlsx)
  const [showDatePicker, setShowDatePicker] = useState(false); // Untuk menampilkan date picker
  const datePickerRef = useRef(null); // Ref untuk date picker
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fungsi untuk menangani pengiriman form
  const handleFormSubmit = async () => {
    // Debugging tanggal
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Gunakan format tanggal tanpa konversi UTC
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    console.log("Formatted Start Date:", formattedStartDate);
    console.log("Formatted End Date:", formattedEndDate);

    if (!startDate || !endDate) {
      console.error("Tanggal belum dipilih.");
      if (!toast.isActive("toast-error")) {
        toast.dismiss();
        toast.error("Harap pilih rentang tanggal!", {
          toastId: "toast-error",
        });
      }
      return;
    }

    setLoading(true);

    try {
      // Debugging request URL
      console.log(`API Request URL: ${import.meta.env.VITE_API_URL}/export?type=${exportType}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);

      // Mengirim permintaan untuk mengunduh file
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export?type=${exportType}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // Response akan dalam bentuk blob untuk file
        }
      );

      // Pengecekan ukuran file untuk memastikan konten
      console.log("Response size:", response.data.size);

      // Membuat link untuk mengunduh file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `export_${format(startDate, "yyyyMMdd")}_${format(endDate, "yyyyMMdd")}.${exportType}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.dismiss();
      toast.success("Data berhasil diexport!", { toastId: "toast-success" });

      setLoading(false);
    } catch (error) {
      if (!toast.isActive("toast-error")) {
        toast.dismiss();
        console.error("Error exporting data:", error);
        toast.error("Gagal mengekspor data, silakan coba lagi.", {
          toastId: "toast-error",
        });
      }
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan nama file yang dipotong jika terlalu panjang
  const getDisplayFileName = () => {
    return exportType === "xlsx" ? "Excel (.Xlsx)" : "PDF (.Pdf)";
  };

  // Fungsi untuk menampilkan date range dalam format yang singkat
  const getDisplayDateRange = (start, end) => {
    if (start && end) {
      return `${format(start, "dd MMM", { locale: id })} - ${format(
        end,
        "dd MMM yyyy",
        { locale: id }
      )}`;
    }
    return "Pilih Tanggal";
  };

  // Event listener untuk menutup DatePicker saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false); // Sembunyikan DatePicker
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Export
          </h1>

          {/* Container untuk Export Options */}
          <div className="p-6 bg-white rounded-lg shadow-lg md:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 relative">
              {/* Pilihan Format Export */}
              <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6">
                <div className="flex items-center">
                  {exportType === "xlsx" ? (
                    <FaFileExcel className="mr-4 text-2xl text-gray-500" />
                  ) : (
                    <FaFilePdf className="mr-4 text-2xl text-gray-500" />
                  )}
                  <div className="truncate max-w-[200px]">
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      {getDisplayFileName()}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`${
                      exportType === "xlsx"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    } px-4 py-2 rounded-md`}
                    onClick={() => setExportType("xlsx")}
                  >
                    Excel
                  </button>
                  <button
                    className={`${
                      exportType === "pdf"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    } px-4 py-2 rounded-md`}
                    onClick={() => setExportType("pdf")}
                  >
                    PDF
                  </button>
                </div>
              </div>

              {/* Date Range Picker */}
              <div
                className="relative flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6"
                onClick={() => setShowDatePicker(!showDatePicker)} // Toggle picker visibility
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-4 text-2xl text-gray-500" />
                  <div className="truncate max-w-[200px]">
                    <p className="text-gray-500">Select Date Range</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      {getDisplayDateRange(startDate, endDate)}
                    </h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>
              </div>

              {/* DatePicker muncul tanpa auto close */}
              {showDatePicker && (
                <div
                  ref={datePickerRef} // Tambahkan ref ke div yang mengandung DatePicker
                  className="absolute z-50 mt-32 bg-white border rounded-lg shadow-lg p-4 w-72 right-0 md:mr-64 md:right-0"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        console.log("Selected Start Date:", date); // Debug tanggal
                        setStartDate(date);
                      }}
                      className="block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                      placeholderText="Pilih Tanggal Mulai"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">
                      End Date
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        console.log("Selected End Date:", date); // Debug tanggal
                        setEndDate(date);
                      }}
                      className="block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                      placeholderText="Pilih Tanggal Akhir"
                    />
                  </div>
                </div>
              )}

              {/* Export Button */}
              <div className="flex justify-end col-span-1 md:col-span-2">
                <button
                  className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 md:py-3 px-8 md:px-16 rounded-md mt-6 md:mt-9"
                  onClick={handleFormSubmit}
                  disabled={loading} // Nonaktifkan tombol saat sedang loading
                >
                  {loading ? (
                    <ReactLoading
                      type="spin"
                      color="#fff"
                      height={20}
                      width={20}
                    />
                  ) : (
                    "Export"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Export;
