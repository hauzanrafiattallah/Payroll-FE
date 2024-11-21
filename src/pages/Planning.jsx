import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import AddPlanningPopUp from "../components/AddPlanningPopUp";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    2026, 2025, 2024, 2023,
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!role) {
        try {
          const authToken = localStorage.getItem("token");
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
          setRole(userRole);
          localStorage.setItem("role", userRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [role]);

  const fetchPlans = async (page = 1) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/planning?page=${page}&limit=5&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setPlans(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error mengambil data rencana:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    setDeletingPlanId(planId);
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/planning/${planId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
        toast.success("Plan berhasil dihapus!");
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      toast.error("Gagal menghapus plan. Coba lagi nanti.");
    } finally {
      setIsDeleting(false);
      setSelectedPlanId(null);
      setIsDeletePopupOpen(false); // Close popup after deletion
    }
  };

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage, selectedYear]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 1;

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
          disabled={isLoading} // Disable jika sedang loading
        >
          1
        </button>
      );
      pageNumbers.push(<span key="dots-before">...</span>);
    }

    for (
      let i = Math.max(1, currentPage - maxPagesToShow);
      i <= Math.min(lastPage, currentPage + maxPagesToShow);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-full ${
            i === currentPage
              ? "text-white bg-[#B4252A]"
              : "text-gray-600 bg-white hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
          disabled={isLoading} // Disable jika sedang loading
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage - maxPagesToShow) {
      pageNumbers.push(<span key="dots-after">...</span>);
      pageNumbers.push(
        <button
          key={lastPage}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(lastPage)}
          disabled={isLoading} // Disable jika sedang loading
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approve":
        return "bg-[#48B12129] text-[#48B121]";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "decline":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleCardClick = (planId) => {
    navigate(`/planning/${planId}`);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset ke halaman pertama setiap kali tahun diubah
    setIsDropdownOpen(false);
  };

  const openDeletePopup = (planId) => {
    setSelectedPlanId(planId);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setSelectedPlanId(null);
    setIsDeletePopupOpen(false);
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning
          </h1>

          <div className="flex justify-end items-center mb-6 space-x-4">
            {/* Filter Tahun */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center bg-white border rounded-lg px-4 py-2 text-gray-700 shadow-md"
                onClick={toggleDropdown}
              >
                <FaCalendarAlt className="mr-2" />
                <span>{selectedYear}</span>
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full shadow-lg">
                  {availableYears.map((year) => (
                    <li
                      key={year}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        year === selectedYear ? "font-bold text-[#B4252A]" : ""
                      }`}
                      onClick={() => handleYearChange(year)}
                    >
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {role !== "superAdmin" && (
              <button
                onClick={openPopup}
                className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#8E1F22] shadow-md text-base sm:text-sm md:text-base lg:text-md h-10 w-36 sm:w-32 md:w-36 lg:w-40"
              >
                <FaPlus className="mr-2" /> New Plan
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                    style={{
                      boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between w-full">
                      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center space-x-2 md:justify-start">
                          <Skeleton width={80} height={24} />
                          <Skeleton width={60} height={24} />
                        </div>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={150} height={20} />
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0 justify-center w-full md:w-auto">
                      <div className="flex flex-col items-center text-center">
                        <Skeleton width={50} height={15} />
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner">
                          <Skeleton width={30} height={20} />
                          <Skeleton width={40} height={30} />
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <Skeleton width={50} height={15} />
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner bg-gray-50">
                          <Skeleton width={30} height={20} />
                          <Skeleton width={40} height={30} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleCardClick(plan.id)}
                    className="p-5 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center transition-shadow cursor-pointer transform hover:-translate-y-1"
                    style={{
                      boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 15px 5px rgba(180, 37, 42, 0.15)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 8px 2px rgba(0, 0, 0, 0.05)")
                    }
                  >
                    <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between w-full">
                      <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center justify-center space-x-2 md:justify-start">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                              plan.status
                            )}`}
                          >
                            {plan.status.charAt(0).toUpperCase() +
                              plan.status.slice(1)}
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                            {plan.item_count} Items
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                            {new Date(plan.start_date).getFullYear()}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mt-2">
                          {plan.title}
                        </h2>
                        <p className="text-md text-gray-500">
                          <span className="text-[#B4252A] font-semibold">
                            Total Netto: Rp.
                            {plan.item_sum_netto_amount
                              ? parseInt(
                                  plan.item_sum_netto_amount
                                ).toLocaleString("id-ID")
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                      {/* Start Section */}
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          Start
                        </span>
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner">
                          <span className="block text-sm font-semibold text-gray-500">
                            {new Date(plan.start_date).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                          <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                            {new Date(plan.start_date).getDate()}
                          </span>
                        </div>
                      </div>

                      {/* End Section */}
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          End
                        </span>
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner bg-gray-50">
                          <span className="block text-sm font-semibold text-gray-500">
                            {new Date(plan.end_date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                            {new Date(plan.end_date).getDate()}
                          </span>
                        </div>
                      </div>

                      {/* Trash Button */}
                      {role === "superAdmin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation
                            openDeletePopup(plan.id); // Open delete confirmation popup
                          }}
                          className="bg-[#B4252A] hover:bg-red-800 text-white w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition ml-2"
                          title="Delete"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          {isDeletePopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg popup-content w-[90%] max-w-md min-h-[200px]">
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-xl font-bold">Delete Confirmation</h2>
                  <p className="text-center text-gray-500">
                    Apakah anda yakin untuk menghapus Planning ini?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32"
                      onClick={closeDeletePopup}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32"
                      onClick={() => handleDelete(selectedPlanId)}
                      disabled={isDeleting}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                &lt;
              </button>
              {renderPagination()}
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage || isLoading}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Loading */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      {showPopup && (
        <AddPlanningPopUp isOpen={showPopup} onClose={closePopup} />
      )}
    </>
  );
};

export default Planning;
