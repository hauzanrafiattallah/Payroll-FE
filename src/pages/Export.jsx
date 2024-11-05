import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Export = () => {
  // State untuk loading status
  const [loading, setLoading] = useState(false);

  // State untuk export category data
  const [startDate1, setStartDate1] = useState(null);
  const [endDate1, setEndDate1] = useState(null);
  const [exportType1, setExportType1] = useState("excel");
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showExportTypeDropdown1, setShowExportTypeDropdown1] = useState(false);
  const [showCategoryDropdown1, setShowCategoryDropdown1] = useState(false);
  const [category1, setCategory1] = useState("internal");

  // Refs untuk klik di luar elemen dropdown dan date picker
  const datePickerRef1 = useRef(null);
  const exportTypeRef1 = useRef(null);
  const categoryRef1 = useRef(null);

  // State untuk export transaction data
  const [startDate2, setStartDate2] = useState(null);
  const [endDate2, setEndDate2] = useState(null);
  const [exportType2, setExportType2] = useState("excel");
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [showExportTypeDropdown2, setShowExportTypeDropdown2] = useState(false);

  // Refs untuk klik di luar elemen dropdown dan date picker
  const datePickerRef2 = useRef(null);
  const exportTypeRef2 = useRef(null);

  // Mengambil token autentikasi dari local storage
  const authToken = localStorage.getItem("token");

  // Fungsi untuk menangani submit pada bagian items Data
  const handleFormSubmit1 = async () => {
    if (!startDate1 || !endDate1) {
      toast.error("Harap pilih rentang tanggal untuk Data Perencanaan!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/export-item?type=${exportType1}&startDate=${startDate1}&endDate=${endDate1}&category=${category1}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          responseType: "blob",
        }
      );
      downloadFile(
        response,
        `Item Dari ${startDate1} hingga ${endDate1}.${
          exportType1 === "excel" ? "xlsx" : "pdf"
        }`
      );
    } catch (error) {
      toast.error("Gagal mengekspor item!");
    }
    setLoading(false);
  };

  // Fungsi untuk menangani submit pada bagian Transaction Data
  const handleFormSubmit2 = async () => {
    if (!startDate2 || !endDate2) {
      toast.error("Harap pilih rentang tanggal untuk Data Transaksi!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/export?type=${exportType2}&startDate=${startDate2}&endDate=${endDate2}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          responseType: "blob",
        }
      );
      downloadFile(
        response,
        `Laporan Keuangan dari ${startDate2} hingga ${endDate2}.${
          exportType2 === "excel" ? "xlsx" : "pdf"
        }`
      );
    } catch (error) {
      toast.error("Gagal mengekspor data transaksi!");
    }
    setLoading(false);
  };

  // Fungsi untuk mendownload file hasil export
  const downloadFile = (response, fileName) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  // Efek untuk menutup dropdown atau date picker saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef1.current &&
        !datePickerRef1.current.contains(event.target)
      )
        setShowDatePicker1(false);
      if (
        exportTypeRef1.current &&
        !exportTypeRef1.current.contains(event.target)
      )
        setShowExportTypeDropdown1(false);
      if (categoryRef1.current && !categoryRef1.current.contains(event.target))
        setShowCategoryDropdown1(false);
      if (
        datePickerRef2.current &&
        !datePickerRef2.current.contains(event.target)
      )
        setShowDatePicker2(false);
      if (
        exportTypeRef2.current &&
        !exportTypeRef2.current.contains(event.target)
      )
        setShowExportTypeDropdown2(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fungsi untuk menampilkan rentang tanggal yang dipilih
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

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Export Items
          </h1>

          {/* Bagian untuk Export items */}
          <ExportSection
            exportType={exportType1}
            setExportType={setExportType1}
            startDate={startDate1}
            setStartDate={setStartDate1}
            endDate={endDate1}
            setEndDate={setEndDate1}
            category={category1}
            setCategory={setCategory1}
            showExportTypeDropdown={showExportTypeDropdown1}
            setShowExportTypeDropdown={setShowExportTypeDropdown1}
            showCategoryDropdown={showCategoryDropdown1}
            setShowCategoryDropdown={setShowCategoryDropdown1}
            showDatePicker={showDatePicker1}
            setShowDatePicker={setShowDatePicker1}
            datePickerRef={datePickerRef1}
            exportTypeRef={exportTypeRef1}
            categoryRef={categoryRef1}
            handleFormSubmit={handleFormSubmit1}
            getDisplayDateRange={getDisplayDateRange}
            loading={loading}
          />

          {/* Bagian untuk Export Transaction Data */}
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Export Transaction
          </h1>
          <ExportSection
            exportType={exportType2}
            setExportType={setExportType2}
            startDate={startDate2}
            setStartDate={setStartDate2}
            endDate={endDate2}
            setEndDate={setEndDate2}
            showExportTypeDropdown={showExportTypeDropdown2}
            setShowExportTypeDropdown={setShowExportTypeDropdown2}
            showDatePicker={showDatePicker2}
            setShowDatePicker={setShowDatePicker2}
            datePickerRef={datePickerRef2}
            exportTypeRef={exportTypeRef2}
            handleFormSubmit={handleFormSubmit2}
            getDisplayDateRange={getDisplayDateRange}
            loading={loading}
          />
        </div>
      </div>

      {/* Overlay loading saat proses */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </>
  );
};

// Komponen Dropdown
const Dropdown = ({
  label,
  selectedOption,
  options,
  onSelect,
  dropdownVisible,
  toggleDropdown,
  dropdownRef,
}) => (
  <div className="relative">
    <div
      className="relative flex items-center justify-between p-4 border rounded-lg cursor-pointer"
      onClick={toggleDropdown}
    >
      <div>
        <p className="text-gray-500">{label}</p>
        <h2 className="text-lg font-bold">{selectedOption}</h2>
      </div>
      <div className="text-4xl md:text-6xl">&rsaquo;</div>
    </div>
    {dropdownVisible && (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 z-50 p-4 mt-2 bg-white border rounded-lg shadow-lg w-72"
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              toggleDropdown();
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          >
            {option.label}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Komponen untuk setiap bagian Export
const ExportSection = ({
  title,
  exportType,
  setExportType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  category,
  setCategory,
  showExportTypeDropdown,
  setShowExportTypeDropdown,
  showCategoryDropdown,
  setShowCategoryDropdown,
  showDatePicker,
  setShowDatePicker,
  datePickerRef,
  exportTypeRef,
  categoryRef,
  handleFormSubmit,
  getDisplayDateRange,
  loading,
}) => (
  <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
    <h2 className="mb-4 text-xl font-semibold">{title}</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Dropdown untuk tipe export */}
      <Dropdown
        label="Export As"
        selectedOption={exportType === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
        options={[
          { value: "excel", label: "Excel (.xlsx)" },
          { value: "pdf", label: "PDF (.pdf)" },
        ]}
        onSelect={setExportType}
        dropdownVisible={showExportTypeDropdown}
        toggleDropdown={() =>
          setShowExportTypeDropdown(!showExportTypeDropdown)
        }
        dropdownRef={exportTypeRef}
      />

      {/* Pilihan tanggal */}
      <div className="relative">
        <div
          className="relative flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <div className="truncate">
            <p className="text-gray-500">Pilih Rentang Tanggal</p>
            <h2 className="text-lg font-bold">
              {getDisplayDateRange(startDate, endDate)}
            </h2>
          </div>
          <div className="text-4xl md:text-6xl">&rsaquo;</div>
        </div>
        {showDatePicker && (
          <div
            ref={datePickerRef}
            className="absolute top-full left-0 z-50 p-4 mt-2 bg-white border rounded-lg shadow-lg w-72"
          >
            <label className="block mb-1 text-sm font-semibold">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
            <label className="block mt-4 mb-1 text-sm font-semibold">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Dropdown untuk kategori (jika ada) */}
      {category && (
        <Dropdown
          label="Pilih Kategori"
          selectedOption={
            category === "internal"
              ? "Internal"
              : category === "external"
              ? "External"
              : "RKA"
          }
          options={[
            { value: "internal", label: "Internal" },
            { value: "external", label: "External" },
            { value: "rka", label: "RKA" },
          ]}
          onSelect={setCategory}
          dropdownVisible={showCategoryDropdown}
          toggleDropdown={() => setShowCategoryDropdown(!showCategoryDropdown)}
          dropdownRef={categoryRef}
        />
      )}

      {/* Tombol Export */}
      <div className="flex justify-end col-span-1 md:col-span-2">
        <button
          className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 px-8 rounded-md"
          onClick={handleFormSubmit}
          disabled={loading}
        >
          Export
        </button>
      </div>
    </div>
  </div>
);

export default Export;
