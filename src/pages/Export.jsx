import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaCalendarAlt } from "react-icons/fa";
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
  const [exportType, setExportType] = useState("excel"); // Format default: Excel (.xlsx)
  const [showDatePicker, setShowDatePicker] = useState(false); // Untuk menampilkan date picker
  const [showExportTypeDropdown, setShowExportTypeDropdown] = useState(false); // Untuk dropdown export type
  const datePickerRef = useRef(null); // Ref untuk date picker
  const exportTypeRef = useRef(null); // Ref untuk dropdown export type
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  const handleFormSubmit = async () => {
    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    if (!startDate || !endDate) {
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
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/export?type=${exportType}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob", // Agar menerima file sebagai blob
        }
      );

      console.log(response.data.size); // Cek ukuran data yang diterima

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `export_${format(startDate, "yyyyMMdd")}_${format(
          endDate,
          "yyyyMMdd"
        )}.${exportType === "excel" ? "xlsx" : exportType}` // Penyesuaian ekstensi file
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
        toast.error("Gagal mengekspor data, silakan coba lagi.", {
          toastId: "toast-error",
        });
      }
      setLoading(false);
    }
  };

  const getDisplayDateRange = (start, end) => {
    if (start && end) {
      return `${format(new Date(start), "dd MMM", { locale: id })} - ${format(
        new Date(end),
        "dd MMM yyyy",
        { locale: id }
      )}`;
    }
    return "Pilih Tanggal";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      if (
        exportTypeRef.current &&
        !exportTypeRef.current.contains(event.target)
      ) {
        setShowExportTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef, exportTypeRef]);

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
            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {/* Dropdown untuk pilihan Export Type */}
              <div
                className="relative flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6"
                onClick={() =>
                  setShowExportTypeDropdown(!showExportTypeDropdown)
                }
              >
                <div className="flex items-center">
                  <div className="truncate max-w-[200px]">
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      {exportType === "excel" ? "Excel (.Xlsx)" : "PDF (.Pdf)"}
                    </h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>
              </div>

              {showExportTypeDropdown && (
                <div
                  ref={exportTypeRef}
                  className="absolute right-0 z-50 p-4 mt-32 bg-white border rounded-lg shadow-lg w-72 md:mr-64 md:left-0"
                >
                  <div>
                    <label className="block mb-1 text-sm font-semibold">
                      Select Export Type
                    </label>
                    <select
                      value={exportType}
                      onChange={(e) => {
                        setExportType(e.target.value);
                        setShowExportTypeDropdown(false); // Tutup dropdown setelah tipe dipilih
                      }}
                      className="block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                    >
                      <option value="excel">Excel (.Xlsx)</option>
                      <option value="pdf">PDF (.Pdf)</option>
                    </select>
                  </div>
                </div>
              )}

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

              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="absolute right-0 z-50 p-4 mt-32 bg-white border rounded-lg shadow-lg w-72 md:mr-64 md:right-0"
                >
                  <div>
                    <label className="block mb-1 text-sm font-semibold">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate || ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-semibold">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate || ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Export Button */}
              <div className="flex justify-end col-span-1 md:col-span-2">
                <button
                  className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 md:py-3 px-8 md:px-16 rounded-md mt-6 md:mt-9"
                  onClick={handleFormSubmit}
                  disabled={loading} // Disable button saat loading
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tambahkan overlay loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default Export;
