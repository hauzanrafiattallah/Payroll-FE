import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaBullseye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PlanPopUp from "../components/PlanPopUp";
import PlanPopUpEdit from "../components/PlanPopUpEdit";
import { toast } from "react-toastify";
import "../App.css";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanPopUpOpen, setIsPlanPopUpOpen] = useState(false);
  const [isPlanPopUpEditOpen, setIsPlanPopUpEditOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch data from the API
  const fetchPlans = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/plannings?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setPlans(response.data.data.data);
        setCurrentBalance(response.data.current_balance);
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

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Open delete modal
  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/planning/${selectedPlan.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Rencana berhasil dihapus.");
      fetchPlans(); // Refresh the plan list after deletion
      closeDeleteModal();
    } catch (error) {
      toast.error("Gagal menghapus rencana.");
      console.error("Error deleting plan:", error);
    }
  };

  // Close modal for adding new plan
  const closeNewPlanModal = () => {
    setIsPlanPopUpOpen(false);
  };

  // Open edit modal for a specific plan
  const openPlanEditModal = (plan) => {
    setSelectedPlan(plan); // Set the plan to edit
    setIsPlanPopUpEditOpen(true); // Open the edit modal
  };

  // Close the edit modal
  const closePlanEditModal = () => {
    setIsPlanPopUpEditOpen(false);
    setSelectedPlan(null);
  };

  // Navigate to the detail page of a plan
  const handleNavigateToDetail = (id) => {
    navigate(`/planning/${id}`);
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            {isEditMode ? "Edit Planning" : "Planning"}
          </h1>

          {/* Current Balance and Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <span className="text-xl text-center sm:text-cen font-semibold text-red-500 mb-4 sm:mb-0">
              {isLoading ? (
                <Skeleton width={150} />
              ) : (
                `Current Balance: Rp.${currentBalance.toLocaleString()}`
              )}
            </span>

            {/* Action buttons */}
            {isEditMode ? (
              <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
                <button
                  className="bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#cfa8a8] w-full sm:w-auto"
                  onClick={toggleEditMode}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
                <button
                  className="flex items-center justify-center bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#cfa8a8] w-full sm:w-auto"
                  onClick={toggleEditMode}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#8E1F22] w-full sm:w-auto"
                  onClick={() => setIsPlanPopUpOpen(true)} // Open modal to create new plan
                >
                  <FaPlus className="mr-2" /> New Plan
                </button>
              </div>
            )}
          </div>

          {/* Plan List */}
          <div className="space-y-4">
            {isLoading
              ? [1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 transition-all duration-200 bg-white border rounded-lg shadow-sm cursor-pointer"
                  >
                    <div className="flex items-start mb-4 space-x-4 sm:mb-0">
                      <Skeleton width={50} height={50} />
                      <div className="ml-4 flex flex-col justify-center">
                        <Skeleton width={200} height={20} />
                        <Skeleton width={300} height={15} />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 sm:mt-0">
                      <Skeleton width={80} height={30} />
                    </div>
                  </div>
                ))
              : plans.map((plan) => {
                  const percentage = Math.min(
                    (currentBalance / plan.target_amount) * 100,
                    100
                  );
                  const isCompleted = percentage === 100;

                  return (
                    <div
                      key={plan.id}
                      className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 transition-all duration-200 bg-white border rounded-lg shadow-sm cursor-pointer"
                      style={{
                        boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.05)",
                        transition: "box-shadow 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 0 15px 3px rgba(180, 37, 42, 0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 0 8px 2px rgba(0, 0, 0, 0.05)")
                      }
                      onClick={() => handleNavigateToDetail(plan.id)} // Navigate to detail when clicking the card
                    >
                      <div className="flex items-start mb-4 space-x-4 sm:mb-0">
                        {/* Date Icon */}
                        <div className="flex items-center">
                          <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg">
                            <div className="text-lg font-semibold text-gray-500">
                              {new Date(plan.deadline).toLocaleString(
                                "default",
                                {
                                  month: "short",
                                }
                              )}
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              {new Date(plan.deadline).getDate()}
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col justify-center">
                          <div className="flex items-center mb-1">
                            <h3 className="text-xl font-bold">{plan.title}</h3>
                          </div>
                          <div
                            className="text-gray-600 mb-6 text-justify"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3, // Batas maksimal baris
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxHeight: "4.5em", // Sesuaikan tinggi dengan baris yang diinginkan
                            }}
                            dangerouslySetInnerHTML={{ __html: plan.content }} // Menampilkan deskripsi dari API (rich text)
                          ></div>
                        </div>
                      </div>

                      {/* Achieved & Amount + Target Icon */}
                      {!isEditMode && (
                        <div className="flex items-center justify-end space-x-2 sm:mt-0">
                          <div className="text-right mr-2">
                            <p
                              className={`text-lg font-semibold ${
                                isCompleted
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {percentage.toFixed(2)}% Achieved
                            </p>
                            <p className="text-lg font-semibold">
                              Rp.{plan.target_amount.toLocaleString()}
                            </p>
                          </div>
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                              isCompleted ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <FaBullseye className="text-white" size={20} />
                          </div>
                        </div>
                      )}

                      {/* Edit & Delete Buttons */}
                      {isEditMode && (
                        <div className="flex space-x-2">
                          <button
                            className="bg-[#E4C3C3] text-[#B4252A] font-semibold p-4 rounded-lg hover:bg-[#cfa8a8] w-12 h-12 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent navigation to detail page
                              openPlanEditModal(plan); // Open edit modal
                            }}
                          >
                            <FaEdit size={20} />
                          </button>
                          <button
                            className="bg-[#B4252A] text-white font-semibold p-4 rounded-lg hover:bg-[#8E1F22] w-12 h-12 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent navigation to detail page
                              openDeleteModal(plan); // Open delete modal
                            }}
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Pop-up Modal for adding new plan */}
      {isPlanPopUpOpen && (
        <PlanPopUp isOpen={isPlanPopUpOpen} onClose={closeNewPlanModal} />
      )}

      {/* Pop-up Modal for editing plan */}
      {isPlanPopUpEditOpen && (
        <PlanPopUpEdit
          isOpen={isPlanPopUpEditOpen}
          onClose={closePlanEditModal}
          planId={selectedPlan?.id} // Pass the selected plan ID to edit
        />
      )}

      {/* Modal for delete confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4 text-center">
              Delete Confirmation
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Apakah anda yakin untuk menghapus rencana keuangan ini?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-6 rounded-lg hover:bg-[#cfa8a8]"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-[#B4252A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Planning;
