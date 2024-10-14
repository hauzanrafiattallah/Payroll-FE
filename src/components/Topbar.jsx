import React, { useState, useEffect } from "react";
import { PiHandDepositBold, PiHandWithdrawBold } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";
import AddIncomePopUp from "./AddIncomePopUp";
import AddExpensesPopUp from "./AddExpensesPopUp";
import { Link, useNavigate } from "react-router-dom"; // Import Link dan useNavigate dari react-router-dom
import axios from "axios";
import { toast } from "react-toastify";
import ReactLoading from "react-loading"; // Import ReactLoading

const Topbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpensesOpen, setIsAddExpensesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State untuk loading spinner
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage
  const navigate = useNavigate(); // Untuk navigasi ke halaman lain

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-button")) {
        setIsDropdownOpen(false); // Tutup dropdown jika klik di luar dropdown
      }
    };
  
    // Pasang event listener saat dropdown terbuka
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    // Cleanup event listener saat komponen di-unmount atau dropdown ditutup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
  

  // Fungsi untuk mendapatkan nama depan
  const getFirstName = (name) => {
    if (!name) return "User"; // Fallback ke "User" jika nama tidak ada
    return name.split(" ")[0]; // Ambil nama pertama sebelum spasi
  };

  // Fetch data user saat komponen pertama kali dirender
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`, // Sertakan token di header
            },
          }
        );
        setUserData(response.data); // Simpan data user ke state
        localStorage.setItem("userData", JSON.stringify(response.data)); // Simpan ke localStorage
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authToken) {
      fetchUserData(); // Panggil API untuk mendapatkan data pengguna terbaru
    }
  }, [authToken]);

  const handleLogout = async () => {
    try {
      // Tampilkan loading spinner segera
      setLoading(true);
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200 || response.data.success) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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
      // Hentikan loading spinner setelah proses selesai
      setLoading(false);
    }
  };
  

  return (
    <>
      {/* Loading di tengah halaman jika timeout tercapai */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      <div className="flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300">
        {/* Logo hanya muncul di layar desktop/tablet */}
        <div className="items-center hidden ml-4 cursor-pointer lg:flex md:flex lg:ml-14">
          <img
            src="/header2.png"
            alt="Logo"
            className="mr-3 h-9 sm:h-12 lg:h-12"
          />
        </div>

        {/* Dua tombol untuk Add Expenses dan Add Income */}
        <div className="flex items-center justify-between w-full lg:w-auto md:w-auto">
          {userData?.role !== "superAdmin" && (
            <div className="flex space-x-1 sm:space-x-2 lg:space-x-4">
              <button
                className="flex items-center bg-[#F3DCDC] text-[#B4252A] font-bold text-[10px] sm:text-xs lg:text-base py-3 sm:py-2 lg:py-3 px-2 sm:px-3 lg:px-4 rounded-md hover:bg-[#e4c3c3] cursor-pointer"
                onClick={() => setIsAddExpensesOpen(true)}
              >
                <PiHandDepositBold className="mr-1 text-lg sm:mr-2 lg:mr-2 sm:text-lg" />
                <span>Add Expenses</span>
              </button>
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="flex items-center bg-[#B4252A] text-white font-bold text-[10px] sm:text-xs lg:text-base py-3 sm:py-2 lg:py-3 px-3 sm:px-3 lg:px-6 rounded-md hover:bg-[#8E1F22] cursor-pointer"
              >
                <PiHandWithdrawBold className="mr-1 text-lg sm:mr-2 lg:mr-2 sm:text-lg" />
                <span>Add Income</span>
              </button>
            </div>
          )}

          {/* Tombol User */}
          <div className="relative dropdown-button">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 bg-white rounded-full focus:outline-none"
            >
              {/* Tampilkan nama depan dari state */}
              <span className="ml-5 mr-3 font-medium text-lg">
                {getFirstName(userData?.name)}
              </span>
              <img
                src="/image_placeholder.png"
                alt="User"
                className="w-12 h-12 rounded-full"
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <div className="border-t border-gray-200"></div>
                <div
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-[#B4252A] cursor-pointer hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2 text-lg" />
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup untuk Add Income */}
      <AddIncomePopUp
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      {/* Popup untuk Add Expenses */}
      <AddExpensesPopUp
        isOpen={isAddExpensesOpen}
        onClose={() => setIsAddExpensesOpen(false)}
      />
    </>
  );
};

export default Topbar;
