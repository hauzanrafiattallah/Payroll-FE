import React, { useState } from "react";
import { FaEdit, FaPlus, FaBullseye, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PlanPopUp from "../components/PlanPopUp";

const plans = [
  {
    id: 1,
    date: "15",
    month: "Oct",
    title: "Plan For Conference A",
    description:
      "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
    amount: "Rp.100.000.000",
    achieved: "100%",
    achievedStatus: "green",
    statusColor: "green",
  },
  {
    id: 2,
    date: "16",
    month: "Oct",
    title: "Plan For Conference B",
    description:
      "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
    amount: "Rp.300.000.000",
    achieved: "33%",
    achievedStatus: "red",
    statusColor: "red",
  },
  {
    id: 3,
    date: "17",
    month: "Oct",
    title: "Plan For Conference C",
    description:
      "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
    amount: "Rp.500.000.000",
    achieved: "20%",
    achievedStatus: "red",
    statusColor: "red",
  },
];

const Planning = () => {
  // State untuk switch mode edit
  const [isEditMode, setIsEditMode] = useState(false);

  // State untuk membuka modal delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // State untuk membuka modal tambah rencana baru
  const [isPlanPopUpOpen, setIsPlanPopUpOpen] = useState(false);

  // Fungsi untuk switch mode edit
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Fungsi untuk membuka modal delete
  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk menutup modal delete
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  // Fungsi untuk membuka modal New Plan
  const openNewPlanModal = () => {
    setIsPlanPopUpOpen(true);
  };

  // Fungsi untuk menutup modal New Plan
  const closeNewPlanModal = () => {
    setIsPlanPopUpOpen(false);
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

          {/* Current Balance dan Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <span className="text-xl text-center sm:text-center font-semibold text-red-500 mb-4 sm:mb-0">
              Current Balance: Rp.100.000.000
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
                <button className="bg-[#B4252A] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#8E1F22] w-full sm:w-auto">
                  Save
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
                  onClick={openNewPlanModal} // Buka modal
                >
                  <FaPlus className="mr-2" /> New Plan
                </button>
              </div>
            )}
          </div>

          {/* Plan List */}
          <div className="space-y-4">
            {plans.map((plan) => (
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
              >
                {/* Date Section */}
                <div className="flex items-start mb-4 space-x-4 sm:mb-0">
                  <div className="flex items-center">
                    <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg">
                      <div className="text-lg font-semibold text-gray-500">
                        {plan.month}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {plan.date}
                      </div>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="ml-4 flex flex-col justify-center">
                    <div className="flex items-center mb-1">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          plan.achievedStatus === "green"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <h3 className="text-lg font-bold">{plan.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                </div>

                {/* Achieved & Amount + Target Icon */}
                <div className="flex items-center justify-end space-x-2 sm:mt-0">
                  {isEditMode ? (
                    <div className="flex space-x-2">
                      <button className="bg-[#E4C3C3] text-[#B4252A] font-semibold p-4 rounded-lg hover:bg-[#cfa8a8] w-12 h-12 flex items-center justify-center">
                        <FaEdit size={20} />{" "}
                        {/* Ubah ukuran ikon jika diperlukan */}
                      </button>
                      <button
                        className="bg-[#B4252A] text-white font-semibold p-4 rounded-lg hover:bg-[#8E1F22] w-12 h-12 flex items-center justify-center"
                        onClick={() => openDeleteModal(plan)}
                      >
                        <FaTrash size={20} />{" "}
                        {/* Ubah ukuran ikon jika diperlukan */}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Icon Achieved & Amount */}
                      <div className="text-right mr-2">
                        <p
                          className={`text-sm font-bold ${
                            plan.achievedStatus === "green"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {plan.achieved}% Achieved
                        </p>
                        <p className="text-lg font-semibold">{plan.amount}</p>
                      </div>
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                          plan.achievedStatus === "green"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <FaBullseye className="text-white" size={20} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop-up Modal for adding new plan */}
      {isPlanPopUpOpen && (
        <PlanPopUp isOpen={isPlanPopUpOpen} onClose={closeNewPlanModal} />
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
