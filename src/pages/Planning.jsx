import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PlanPopUp from "../components/PlanPopUp";
import PlanPopUpEdit from "../components/PlanPopUpEdit";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanPopUpOpen, setIsPlanPopUpOpen] = useState(false);
  const [isPlanPopUpEditOpen, setIsPlanPopUpEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async (page = 1) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning?page=${page}&limit=5`,
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

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2;

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
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

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning
          </h1>

          <div className="flex justify-end items-center mb-6">
            <button
              className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#8E1F22] shadow-md text-base sm:text-sm md:text-base lg:text-lg h-10 w-36 sm:w-32 md:w-36 lg:w-40"
              onClick={() => setIsPlanPopUpOpen(true)}
            >
              <FaPlus className="mr-2" /> New Plan
            </button>
          </div>

          <div className="space-y-4">
            {isLoading
              ? [1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border rounded-lg shadow-sm"
                  >
                    <Skeleton height={80} />
                  </div>
                ))
              : plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow cursor-pointer"
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
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mt-2">
                          {plan.title}
                        </h2>
                        <p className="text-sm text-gray-500">
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
                    <div className="flex space-x-4 mt-4 md:mt-0 justify-center w-full md:w-auto">
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
                    </div>
                  </div>
                ))}
          </div>

          <div className="flex justify-end mt-6">
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {renderPagination()}
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPlanPopUpOpen && (
        <PlanPopUp
          isOpen={isPlanPopUpOpen}
          onClose={() => setIsPlanPopUpOpen(false)}
        />
      )}
      {isPlanPopUpEditOpen && (
        <PlanPopUpEdit
          isOpen={isPlanPopUpEditOpen}
          onClose={() => setIsPlanPopUpEditOpen(false)}
          planId={selectedPlan?.id}
        />
      )}
    </>
  );
};

export default Planning;
