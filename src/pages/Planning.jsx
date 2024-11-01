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
      case "approved":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "denied":
        return "bg-red-100 text-red-600";
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
              className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#8E1F22] shadow-md"
              onClick={() => setIsPlanPopUpOpen(true)}
            >
              <FaPlus className="mr-2" /> Tambah Rencana Baru
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
                    className="p-6 bg-white border rounded-lg shadow-sm flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(
                          plan.status
                        )}`}
                      >
                        {plan.status.charAt(0).toUpperCase() +
                          plan.status.slice(1)}
                      </span>
                      <h2 className="text-xl font-bold text-gray-800 mt-2">
                        {plan.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Total Netto:{" "}
                        <span className="text-[#B4252A] font-semibold">
                          Rp.
                          {plan.item_sum_netto_amount
                            ? parseInt(
                                plan.item_sum_netto_amount
                              ).toLocaleString("id-ID")
                            : 0}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {plan.item_count} Item
                      </p>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Start Date */}
                      <div className="text-center">
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          Start
                        </span>
                        <div className="rounded-lg border border-gray-200 p-4 shadow-inner">
                          <span className="block text-lg font-semibold text-gray-500">
                            {new Date(plan.start_date).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                          <span className="block text-3xl font-bold bg-white px-3 py-2 rounded-md shadow">
                            {new Date(plan.start_date).getDate()}
                          </span>
                        </div>
                      </div>

                      {/* End Date */}
                      <div className="text-center">
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          End
                        </span>
                        <div className="rounded-lg border border-gray-200 p-4 shadow-inner bg-gray-50">
                          <span className="block text-lg font-semibold text-gray-500">
                            {new Date(plan.end_date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="block text-3xl font-bold bg-white px-3 py-2 rounded-md shadow">
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
