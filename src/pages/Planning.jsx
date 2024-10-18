import React from "react";
import { FaEdit, FaPlus, FaBullseye } from "react-icons/fa"; // Mengimpor ikon dari react-icons
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const plans = [
  {
    id: 1,
    date: "15",
    month: "Oct",
    title: "Plan For Conference A",
    description: "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
    amount: "Rp.100.000.000",
    achieved: "100%",
    achievedStatus: "green", // Status achieved: green for success, red for partial
    statusColor: "green",
  },
  {
    id: 2,
    date: "16",
    month: "Oct",
    title: "Plan For Conference B",
    description: "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
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
    description: "Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan Kedepannya Jadi Gini..",
    amount: "Rp.500.000.000",
    achieved: "20%",
    achievedStatus: "red",
    statusColor: "red",
  },
];

const Planning = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning
          </h1>

          {/* Current Balance dan Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <span className="text-xl font-semibold text-red-500 mb-4 sm:mb-0">
              Current Balance: Rp.100.000.000
            </span>

            {/* Action buttons */}
            <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button className="flex items-center justify-center bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#cfa8a8] w-full sm:w-auto">
                <FaEdit className="mr-2" /> Edit
              </button>
              <button className="flex items-center justify-center bg-[#B4252A] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-[#8E1F22] w-full sm:w-auto">
                <FaPlus className="mr-2" /> New Plan
              </button>
            </div>
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
                  <div className="text-right mr-2">
                    <p
                      className={`text-sm font-bold ${
                        plan.achievedStatus === "green"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {plan.achieved} Achieved
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
                    <FaBullseye className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Planning;
