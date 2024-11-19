import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const Compare = () => {
  const [compares, setCompares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    2026, 2025, 2024, 2023, 2022, 2021, 2020,
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchCompares = async (page = 1) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/planning-compare?page=${page}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setCompares(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
      }
    } catch (error) {
      console.error("Error fetching compare data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompares(currentPage);
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Compare
          </h1>

          <div className="flex justify-end items-center mb-6 space-x-4">
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
          </div>

          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border rounded-lg shadow-sm flex justify-between items-center"
                    style={{
                      boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Skeleton width={100} height={24} />
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
              : compares.map((compare) => (
                  <div
                    key={compare.id}
                    className="p-5 bg-white border rounded-lg shadow-sm flex justify-between items-center transition-shadow cursor-pointer transform hover:-translate-y-1"
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
                    onClick={() => navigate(`/compare/${compare.id}`)} // Navigate on click
                  >
                    <h2 className="text-xl font-bold text-gray-800">
                      {compare.title}
                    </h2>
                    <div className="flex space-x-4">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          Start
                        </span>
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner">
                          <span className="block text-sm font-semibold text-gray-500">
                            {new Date(compare.start_date).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                          <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                            {new Date(compare.start_date).getDate()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          End
                        </span>
                        <div className="rounded-lg border border-gray-200 p-3 shadow-inner bg-gray-50">
                          <span className="block text-sm font-semibold text-gray-500">
                            {new Date(compare.end_date).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                          <span className="block text-2xl font-bold bg-white px-3 py-1 rounded-md shadow">
                            {new Date(compare.end_date).getDate()}
                          </span>
                        </div>
                      </div>
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

export default Compare;
