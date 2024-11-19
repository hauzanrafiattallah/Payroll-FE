// Import dependencies and required components
// - React for component state management and lifecycle hooks
// - Icons for UI elements
// - Pop-up components for adding income and expenses
// - Axios for API requests
// - Toastify for user notifications
// - ReactLoading for displaying a loading spinner
import React, { useState, useEffect, useRef } from "react";
import { PiHandDepositBold, PiHandWithdrawBold } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";
import AddIncomePopUp from "./AddIncomePopUp";
import AddExpensesPopUp from "./AddExpensesPopUp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";

const Topbar = () => {
  // State variables for managing component behavior
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false); // Controls the Add Income popup
  const [isAddExpensesOpen, setIsAddExpensesOpen] = useState(false); // Controls the Add Expenses popup
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manages the user dropdown visibility
  const [loading, setLoading] = useState(false); // Controls the loading spinner
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false); // Toggles the logout confirmation popup
  const dropdownRef = useRef(null); // Ref for detecting clicks outside the dropdown

  // User data from localStorage or fetch
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const authToken = localStorage.getItem("token"); // Retrieve auth token from localStorage
  const baseImageUrl = import.meta.env.VITE_FILE_BASE_URL; // Base URL for user image
  const navigate = useNavigate(); // Navigation for routing

  // Fetch user data from the API and update local state
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserData(response.data); // Update state with user data
        localStorage.setItem("userData", JSON.stringify(response.data)); // Cache data locally
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authToken) {
      fetchUserData(); // Fetch user data if token is available
    }
  }, [authToken]);

  // Detect clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []);

  // Get the first name of the user for display purposes
  const getFirstName = (name) => {
    if (!name) return "User"; // Default to "User" if name is missing
    return name.split(" ")[0]; // Extract the first name
  };

  // Handle logout functionality
  // - Sends a logout request to the backend
  // - Clears local storage and navigates to the login page
  const handleLogout = async () => {
    try {
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
          navigate("/login"); // Redirect to login page
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
      {/* Loading spinner overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      {/* Topbar header */}
      <div className="flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300">
        {/* Logo Section */}
        <div
          className={`items-center ${
            userData?.role === "superAdmin" ? "flex" : "hidden lg:flex md:flex"
          } ml-2 sm:ml-4 lg:ml-14`}
        >
          <img src="/header2.png" alt="Logo" className="mr-3 h-10 lg:h-12" />
        </div>

        {/* Action Buttons and User Dropdown */}
        <div className="flex items-center justify-between w-full lg:w-auto md:w-auto">
          {/* Add Income and Expenses Buttons (Hidden for superAdmin) */}
          {userData?.role !== "superAdmin" && (
            <div className="flex space-x-1 sm:space-x-2 lg:space-x-4">
              <button
                className="flex items-center bg-[#F3DCDC] text-[#B4252A] font-bold text-[8px] sm:text-[10px] lg:text-base py-2 sm:py-2 lg:py-3 px-2 sm:px-3 lg:px-4 rounded-md hover:bg-[#e4c3c3] cursor-pointer"
                onClick={() => setIsAddExpensesOpen(true)}
              >
                <PiHandDepositBold className="mr-1 text-sm sm:mr-2 lg:mr-2 sm:text-lg" />
                <span>Add Expenses</span>
              </button>
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="flex items-center bg-[#B4252A] text-white font-bold text-[8px] sm:text-[10px] lg:text-base py-2 sm:py-2 lg:py-3 px-2 sm:px-3 lg:px-6 rounded-md hover:bg-[#8E1F22] cursor-pointer"
              >
                <PiHandWithdrawBold className="mr-1 text-sm sm:mr-2 lg:mr-2 sm:text-lg" />
                <span>Add Income</span>
              </button>
            </div>
          )}

          {/* User Dropdown Menu */}
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
                    ? `${baseImageUrl}${userData.image}`
                    : "/image_placeholder.png"
                }
                alt="User"
                className="w-12 h-12 rounded-full"
              />
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                ref={dropdownRef}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <div className="border-t border-gray-200"></div>
                <div
                  onClick={() => setIsLogoutPopupOpen(true)}
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

      {/* Logout Confirmation Popup */}
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
                  }`}
                  onClick={() => setIsLogoutPopupOpen(false)}
                  disabled={loading}
                >
                  Back
                </button>
                <div className="relative">
                  <button
                    className={`px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32 flex items-center justify-center ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    Confirm
                  </button>

                  {loading && (
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

      {/* Popups for Income and Expenses */}
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
