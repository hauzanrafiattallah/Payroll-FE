import React, { useState } from "react";
import {
  FaTh,
  FaClipboardList,
  FaSignOutAlt,
  FaUpload,
  FaBars,
} from "react-icons/fa";
import { PiHandWithdrawBold, PiHandDepositBold } from "react-icons/pi";
import { AiOutlineFileDone } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading"; // Import ReactLoading

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Untuk mengarahkan pengguna setelah logout
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading spinner
    try {
      // Panggil API logout
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Menggunakan token dari localStorage
          },
        }
      );

      if (response.status === 200 || response.data.success) {
        localStorage.removeItem("isAuthenticated"); // Hapus status login
        localStorage.removeItem("token"); // Hapus token dari localStorage
        toast.success("Logout berhasil!");
        setTimeout(() => {
          navigate("/login"); // Arahkan ke halaman login setelah logout berhasil
        }, 1000);
      } else {
        toast.error("Logout gagal, coba lagi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat logout.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <>
      {/* Loading di tengah halaman */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      {/* Tombol hamburger */}
      <div className="fixed left-0 z-50 top-24 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="bg-[#B4252A] text-white w-10 h-10 rounded-r-full flex items-center justify-center"
        >
          <FaBars className="text-lg rotate-180" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`p-6 bg-white rounded-lg shadow-lg w-64 min-h-[75vh] max-h-[80vh] mt-20 fixed lg:fixed transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50 lg:z-10 flex flex-col justify-between lg:ml-6`}
      >
        <ul className="flex-1">
          {/* Dashboard */}
          <Link to="/">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 ${
                location.pathname === "/"
                  ? "text-[#B4252A]"
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
                  ? "text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <FaClipboardList className="mr-3 text-lg" />
              <span>Planning</span>
            </li>
          </Link>

          {/* Export */}
          <Link to="/export">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/export"
                  ? "text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <FaUpload className="mr-3 text-lg" />
              <span>Export</span>
            </li>
          </Link>

          {/* Income */}
          <Link to="/income">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/income"
                  ? "text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <PiHandWithdrawBold className="mr-3 text-2xl" />
              <span>Income</span>
            </li>
          </Link>

          {/* Expenses */}
          <Link to="/expenses">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/expenses"
                  ? "text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <PiHandDepositBold className="mr-3 text-2xl" />
              <span>Expenses</span>
            </li>
          </Link>

          {/* Approval */}
          <Link to="/approval">
            <li
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
                location.pathname === "/approval"
                  ? "text-[#B4252A]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
              }`}
            >
              <AiOutlineFileDone className="mr-3 text-2xl" />
              <span>Approval</span>
            </li>
          </Link>
        </ul>

        {/* Tombol Log Out */}
        <div
          onClick={handleLogout}
          className="flex justify-center items-center text-[#B4252A] p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          <span>Log Out</span>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>Copyright © 2024 HUMIC Engineering</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
