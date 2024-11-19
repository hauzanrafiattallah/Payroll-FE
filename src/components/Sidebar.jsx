import React, { useState, useEffect } from "react";
import {
  FaTh,
  FaClipboardList,
  FaUpload,
  FaBars,
} from "react-icons/fa"; // Ikon dari react-icons
import { MdTask } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { BiGitCompare } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom"; // Navigasi internal
import axios from "axios"; // HTTP request
import { toast } from "react-toastify"; // Untuk notifikasi
import "react-toastify/dist/ReactToastify.css"; // Style notifikasi
import ReactLoading from "react-loading"; // Komponen loading

// Komponen Sidebar - Navigasi utama aplikasi
const Sidebar = () => {
  const location = useLocation(); // Mendapatkan path saat ini
  const [isOpen, setIsOpen] = useState(false); // State untuk toggle sidebar (mobile)
  const [loading, setLoading] = useState(false); // State untuk loading
  const [role, setRole] = useState(localStorage.getItem("role")); // Menyimpan peran pengguna

  // Fetch role pengguna dari API jika belum tersedia di localStorage
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!role) {
        try {
          const authToken = localStorage.getItem("token"); // Ambil token autentikasi

          // Request data pengguna dari API
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
              },
            }
          );

          const userRole = response.data.role;
          setRole(userRole); // Simpan role ke state
          localStorage.setItem("role", userRole); // Cache role di localStorage
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Gagal mendapatkan data pengguna."); // Notifikasi error
        }
      }
    };

    fetchUserRole();
  }, [role]);

  // Toggle sidebar untuk mobile view
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Komponen loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      {/* Tombol hamburger untuk toggle sidebar */}
      <div className="fixed left-0 z-50 top-24 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="bg-[#B4252A] text-white w-10 h-10 rounded-r-full flex items-center justify-center"
        >
          <FaBars className="text-lg rotate-180" />
        </button>
      </div>

      {/* Sidebar utama */}
      <div
        className={`p-6 bg-white rounded-lg shadow-lg w-64 min-h-[75vh] max-h-[80vh] mt-20 fixed lg:fixed transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50 lg:z-10 flex flex-col justify-between lg:ml-6`}
      >
        {/* Menu navigasi */}
        <ul className="flex-1">
          {/* Dashboard */}
          <Link to="/">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 ${
                location.pathname === "/"
                  ? "bg-[#FDE8E8] text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <FaTh className="mr-3 text-lg" />
              <span className="font-semibold">Dashboard</span>
            </li>
          </Link>

          {/* Planning */}
          <Link to="/planning">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/planning"
                  ? "bg-[#FDE8E8] text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <FaClipboardList className="mr-3 text-xl" />
              <span>Planning</span>
            </li>
          </Link>

          {/* Realization */}
          <Link to="/realization">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/realization"
                  ? "bg-[#FDE8E8] text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <MdTask className="mr-3 text-2xl" />
              <span>Realization</span>
            </li>
          </Link>

          {/* Export */}
          <Link to="/export">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/export"
                  ? "bg-[#FDE8E8] text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <FaUpload className="mr-3 text-lg" />
              <span>Export</span>
            </li>
          </Link>

          {/* Compare */}
          <Link to="/compare">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/compare"
                  ? "bg-[#FDE8E8] text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <BiGitCompare className="mr-3 text-2xl" />
              <span>Compare</span>
            </li>
          </Link>

          {/* Approval hanya untuk superAdmin */}
          {role === "superAdmin" && (
            <Link to="/approval">
              <li
                className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                  location.pathname === "/approval"
                    ? "bg-[#FDE8E8] text-[#B4252A]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
                }`}
              >
                <AiOutlineFileDone className="mr-3 text-2xl" />
                <span>Approval</span>
              </li>
            </Link>
          )}
        </ul>

        {/* Copyright */}
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>Copyright © {new Date().getFullYear()} HUMIC Engineering</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
