import React, { useState, useEffect } from "react";
import { PiHandDepositBold, PiHandWithdrawBold } from "react-icons/pi";
import AddIncomePopup from "./AddIncomePopup";
import AddExpensesPopup from "./AddExpensesPopup";
import { FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link dari react-router-dom
import axios from "axios";

const Topbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpensesOpen, setIsAddExpensesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(() => {
    // Ambil data user dari localStorage jika tersedia
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage

  // Detect scrolling to apply a background to the top bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch data user saat komponen pertama kali dirender
  useEffect(() => {
    const fetchUserData = async () => {
      // Jika data user tidak ada di state, ambil dari API
      if (!userData) {
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
      }
    };

    fetchUserData();
  }, [authToken, userData]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-button")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener("click", handleOutsideClick);
    } else {
      window.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div
        className={`flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white" : "bg-white"
        }`}
      >
        {/* Logo hanya muncul di layar desktop/tablet */}
        <div className="hidden lg:flex md:flex items-center ml-4 cursor-pointer lg:ml-14">
          <img
            src="/header2.png"
            alt="Logo"
            className="mr-3 h-9 sm:h-12 lg:h-12"
          />
        </div>

        {/* Dua tombol untuk Add Expenses dan Add Income */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <div className="flex space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Tombol Add Expenses */}
            <button
              className="flex items-center bg-[#F3DCDC] text-[#B4252A] font-bold text-[10px] sm:text-xs lg:text-base py-1 sm:py-2 lg:py-3 px-1 sm:px-3 lg:px-6 rounded-md hover:bg-[#e4c3c3] cursor-pointer"
              onClick={() => setIsAddExpensesOpen(true)}
            >
              <PiHandDepositBold className="mr-1 sm:mr-2 lg:mr-2 text-sm sm:text-lg" />
              <span>Add Expenses</span>
            </button>

            {/* Tombol Add Income */}
            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="flex items-center bg-[#B4252A] text-white font-bold text-[10px] sm:text-xs lg:text-base py-1 sm:py-2 lg:py-3 px-1 sm:px-3 lg:px-6 rounded-md hover:bg-[#8E1F22] cursor-pointer"
            >
              <PiHandWithdrawBold className="mr-1 sm:mr-2 lg:mr-2 text-sm sm:text-lg" />
              <span>Add Income</span>
            </button>
          </div>

          {/* Tombol User */}
          <div className="relative dropdown-button">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 bg-white rounded-full focus:outline-none"
            >
              {/* Tampilkan nama dari localStorage atau state */}
              <span className="mr-2 ml-5 text-sm font-medium">
                {userData?.name || "User"}
              </span>
              <img
                src="/image_placeholder.png"
                alt="User"
                className="w-12 h-12 rounded-full" // Perbesar ukuran image user
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup untuk Add Income */}
      <AddIncomePopup
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      {/* Popup untuk Add Expenses */}
      <AddExpensesPopup
        isOpen={isAddExpensesOpen}
        onClose={() => setIsAddExpensesOpen(false)}
      />
    </>
  );
};

export default Topbar;
