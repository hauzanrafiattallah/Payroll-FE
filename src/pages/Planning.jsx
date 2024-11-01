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

  const fetchPlans = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setPlans(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

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
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">Planning</h1>

          <div className="flex justify-end items-center mb-6">
            <button
              className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#8E1F22] shadow-md"
              onClick={() => setIsPlanPopUpOpen(true)}
            >
              <FaPlus className="mr-2" /> New Plan
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map((_, index) => (
                <div key={index} className="p-4 bg-white border rounded-lg shadow-sm">
                  <Skeleton height={80} />
                </div>
              ))
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 bg-white border rounded-lg shadow-sm flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col space-y-1">
                    {/* Status Label */}
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(
                        plan.status
                      )}`}
                    >
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                    <h2 className="text-xl font-bold text-gray-800 mt-2">{plan.title}</h2>
                    <p className="text-sm text-gray-500">
                      Total Netto: <span className="text-[#B4252A] font-semibold">Rp.{plan.item_sum_netto_amount ? parseInt(plan.item_sum_netto_amount).toLocaleString("id-ID") : 0}</span>
                    </p>
                    <p className="text-sm text-gray-500">{plan.item_count} Items</p>
                  </div>

                  {/* Start and End Date */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <span className="block text-xs text-gray-500">Start</span>
                      <div className="bg-gray-100 px-4 py-3 rounded-lg shadow-inner">
                        <span className="block text-base font-semibold">
                          {new Date(plan.start_date).toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="block text-xl font-bold">
                          {new Date(plan.start_date).getDate()}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-gray-500">End</span>
                      <div className="bg-gray-100 px-4 py-3 rounded-lg shadow-inner">
                        <span className="block text-base font-semibold">
                          {new Date(plan.end_date).toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="block text-xl font-bold">
                          {new Date(plan.end_date).getDate()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="px-3 py-2 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100">
                &laquo;
              </button>
              {[1, 2, 3, "...", 69].map((page, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border ${
                    page === 1
                      ? "bg-[#B4252A] text-white border-[#B4252A]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100">
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Pop-up Modal for adding new plan */}
      {isPlanPopUpOpen && (
        <PlanPopUp isOpen={isPlanPopUpOpen} onClose={() => setIsPlanPopUpOpen(false)} />
      )}

      {/* Pop-up Modal for editing plan */}
      {isPlanPopUpEditOpen && (
        <PlanPopUpEdit
          isOpen={isPlanPopUpEditOpen}
          onClose={closePlanEditModal}
          planId={selectedPlan?.id} // Pass the selected plan ID to edit
        />
      )}
    </>
  );
};

export default Planning;
