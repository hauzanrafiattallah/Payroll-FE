import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Realization = () => {
  const [realizations, setRealizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    2026, 2025, 2024, 2023
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const fetchRealizations = async (page = 1) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/realization?page=${page}&limit=5&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setRealizations(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
      }
    } catch (error) {
      console.error("Error fetching realization data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealizations(currentPage);
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

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

  const getStatusClass = () => {
    return "bg-[#48B12129] text-[#48B121]";
  };

  const handleCardClick = (realizationId) => {
    if (!isEditMode) {
      navigate(`/realization/${realizationId}`);
    }
  };

  const handleCardEdit = (e, realizationId) => {
    e.stopPropagation();
    navigate(`/realization/edit/${realizationId}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset ke halaman pertama setiap kali tahun diubah
    setIsDropdownOpen(false);
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Realization
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
                onClick={toggleEditMode}
                className={`flex items-center justify-center space-x-1 font-medium py-2 px-5 rounded-lg shadow-sm transition-colors ${
                  isEditMode
                    ? "bg-red-700 text-white border border-red-700"
                    : "bg-[#B4252A] text-white"
                }`}
              >
                {isEditMode ? (
                  <>Close</>
                ) : (
                  <>
                    <TbEdit className="mr-1" /> Edit
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                    style={{ boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)" }}
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
                  </div>
                ))
              : realizations.map((realization) => (
                  <div
                    key={realization.id}
                    onClick={() => handleCardClick(realization.id)}
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
                              realization.status
                            )}`}
                          >
                            {realization.status.charAt(0).toUpperCase() +
                              realization.status.slice(1)}
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                            {realization.item_count} Items
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                            {new Date(realization.start_date).getFullYear()}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mt-2">
                          {realization.title}
                        </h2>
                        <p className="text-md text-gray-500">
                          <span className="text-[#B4252A] font-semibold">
                            Total Netto: Rp.
                            {realization.item_sum_netto_amount
                              ? parseInt(
                                  realization.item_sum_netto_amount
                                ).toLocaleString("id-ID")
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Date or Edit Button Section */}
                    <div className="flex space-x-4 mt-4 md:mt-0 justify-center w-full md:w-auto">
                      {isEditMode ? (
                        <button
                          onClick={(e) => handleCardEdit(e, realization.id)}
                          className="bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-md hover:bg-red-200 flex items-center space-x-1 border border-red-300"
                        >
                          <TbEdit className="mr-1" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <>
                          {/* Start Date */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-xs font-medium text-gray-700 mb-1">
                              Start
                            </span>
                            <div className="rounded-lg border border-gray-200 p-3 shadow-inner">
                              <span className="block text-sm font-semibold text-gray-500">
                                {new Date(
                                  realization.start_date
                                ).toLocaleString("default", {
                                  month: "short",
                                })}
                              </span>
                              <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                                {new Date(realization.start_date).getDate()}
                              </span>
                            </div>
                          </div>

                          {/* End Date */}
                          <div className="flex flex-col items-center text-center">
                            <span className="text-xs font-medium text-gray-700 mb-1">
                              End
                            </span>
                            <div className="rounded-lg border border-gray-200 p-3 shadow-inner bg-gray-50">
                              <span className="block text-sm font-semibold text-gray-500">
                                {new Date(realization.end_date).toLocaleString(
                                  "default",
                                  {
                                    month: "short",
                                  }
                                )}
                              </span>
                              <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                                {new Date(realization.end_date).getDate()}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
          </div>

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
    </>
  );
};

export default Realization;
