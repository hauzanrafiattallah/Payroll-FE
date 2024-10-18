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
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false); // State untuk popup logout
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const authToken = localStorage.getItem("token"); // Ambil token dari localStorage
  const baseImageUrl = import.meta.env.VITE_FILE_BASE_URL; // Mengambil base URL untuk gambar dari .env
  const navigate = useNavigate(); // Untuk navigasi ke halaman lain

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
        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data)); // Simpan ke localStorage
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authToken) {
      fetchUserData(); // Panggil API untuk mendapatkan data pengguna terbaru
    }
  }, [authToken]);

  const getFirstName = (name) => {
    if (!name) return "User"; // Fallback ke "User" jika nama tidak ada
    return name.split(" ")[0]; // Ambil nama pertama sebelum spasi
  };

  const handleLogout = async () => {
    try {
      setLoading(true); // Tampilkan loading spinner

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
          navigate("/login");
        }, 1000);
      } else {
        toast.error("Logout gagal, coba lagi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      {/* Logo Humic */}
      <div className="flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300">
        <div className="items-center hidden ml-4 cursor-pointer lg:flex md:flex lg:ml-14">
          <img
            src="/header2.png"
            alt="Logo"
            className="mr-3 h-9 sm:h-12 lg:h-12"
          />
        </div>

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

          <div className="relative dropdown-button ml-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 bg-white rounded-full focus:outline-none"
            >
              <span className="ml-5 mr-3 font-medium text-lg">
                {getFirstName(userData?.name)}
              </span>
              <img
                src={
                  userData?.image
                    ? `${baseImageUrl}${userData.image}` // Gambar dari userData
                    : "/image_placeholder.png"
                }
                alt="User"
                className="w-12 h-12 rounded-full"
              />
            </button>

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
                  onClick={() => setIsLogoutPopupOpen(true)} // Buka popup logout
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

      {isLogoutPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg popup-content w-[90%] max-w-md">
            <div className="flex flex-col items-center space-y-4">
              <img src="/door.gif" alt="Logout" className="w-48 h-48" />
              <p className="text-lg font-semibold text-center">
                Apakah anda yakin untuk Log Out?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className={`px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`} // Tambah efek disable jika loading
                  onClick={() => setIsLogoutPopupOpen(false)} // Tutup popup
                  disabled={loading} // Disable tombol saat loading
                >
                  Back
                </button>
                <div className="relative">
                  <button
                    className={`px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32 flex items-center justify-center ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`} // Tambah efek disable dan loading spinner
                    onClick={handleLogout}
                    disabled={loading} // Disable tombol saat loading
                  >
                    Confirm
                  </button>

                  {loading && ( // Jika loading, tampilkan spinner di luar tombol
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
                      <ReactLoading
                        type="spin"
                        color="#B4252A"
                        height={50}
                        width={50}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddIncomePopUp
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      <AddExpensesPopUp
        isOpen={isAddExpensesOpen}
        onClose={() => setIsAddExpensesOpen(false)}
      />
    </>
  );
};

export default Topbar;
