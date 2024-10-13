import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading"; // Untuk loading state

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [file, setFile] = useState(null); // Untuk menyimpan file yang di-upload
  const [showDatePicker, setShowDatePicker] = useState(false); // Menampilkan date picker
  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Fungsi untuk menangani pengiriman form
  const handleFormSubmit = async () => {
    if (!file || !selectedDate) {
      // Periksa jika sudah ada toast aktif sebelum menampilkan error baru
      if (!toast.isActive("toast-error")) {
        toast.dismiss();
        toast.error("Harap pilih file Excel dan tanggal!", {
          toastId: "toast-error",
        });
      }
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file); // Masukkan file yang di-upload
    formData.append("date", selectedDate.toISOString().split("T")[0]); // Format tanggal jadi YYYY-MM-DD

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/export`, // Endpoint API
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data", // Header untuk mengirim file
          },
        }
      );

      toast.dismiss(); // Menghapus toast yang ada sebelum menampilkan yang baru
      toast.success("Data berhasil diexport!", { toastId: "toast-success" });
      setLoading(false);
    } catch (error) {
      // Periksa jika sudah ada toast aktif sebelum menampilkan error baru
      if (!toast.isActive("toast-error")) {
        toast.dismiss();
        console.error("Error exporting data:", error);
        toast.error("Gagal mengirim data, silakan coba lagi.", {
          toastId: "toast-error",
        });
      }
      setLoading(false);
    }
  };

  // Fungsi untuk memicu klik pada input file yang disembunyikan
  const triggerFileUpload = () => {
    document.getElementById("fileUpload").click();
  };

  // Fungsi untuk menampilkan nama file yang dipotong jika terlalu panjang
  const getDisplayFileName = (fileName) => {
    if (fileName.length > 15) {
      return fileName.slice(0, 10) + "..." + fileName.slice(-5);
    }
    return fileName;
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
            Export
          </h1>

          {/* Container untuk Export Options */}
          <div className="p-6 bg-white rounded-lg shadow-lg md:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 relative">
              {/* Upload Excel */}
              <div
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6"
                onClick={triggerFileUpload}
              >
                <div className="flex items-center">
                  <FaFileExcel className="mr-4 text-2xl text-gray-500" />
                  <div className="truncate max-w-[200px]">
                    {" "}
                    {/* Batasi lebar teks */}
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      {file ? getDisplayFileName(file.name) : "Excel (.Xlsx)"}
                    </h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>{" "}
                {/* Arrow symbol */}
              </div>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".xlsx" // Hanya menerima file dengan format .xlsx
                onChange={(e) => setFile(e.target.files[0])} // Simpan file ke state
              />

              {/* Select Date Range */}
              <div
                className="relative flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6"
                onClick={() => setShowDatePicker(!showDatePicker)} // Toggle date picker visibility
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-4 text-2xl text-gray-500" />
                  <div className="truncate max-w-[200px]">
                    {" "}
                    {/* Batasi lebar teks */}
                    <p className="text-gray-500">Select Date Range</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Pilih Tanggal"}
                    </h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>{" "}
                {/* Arrow symbol */}
                {/* Date Picker */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 z-50 mt-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setShowDatePicker(false); // Tutup picker setelah memilih
                      }}
                      className="block p-2 mt-1 border border-gray-300 rounded-lg shadow-lg"
                      inline // Tampilkan date picker langsung
                    />
                  </div>
                )}
              </div>

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
