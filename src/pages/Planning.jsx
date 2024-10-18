import React from "react";
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
      <div className="flex mt-20">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning
          </h1>

          {/* Current Balance */}
          <div className="text-right mb-6">
            <span className="text-xl font-semibold text-red-500">
              Current Balance: Rp.100.000.000
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mb-4 space-x-4">
            <button className="bg-[#E4C3C3] text-[#B4252A] font-semibold px-4 py-2 rounded-lg hover:bg-[#cfa8a8]">
              <i className="fa fa-edit mr-2"></i> Edit
            </button>
            <button className="bg-[#B4252A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#8E1F22]">
              <i className="fa fa-plus mr-2"></i> New Plan
            </button>
          </div>

          {/* Plan List */}
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 mb-4 rounded-lg shadow-lg flex items-center">
              {/* Date section */}
              <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 rounded-lg mr-6">
                <div className="text-lg font-semibold text-gray-500">{plan.month}</div>
                <div className="text-2xl font-bold text-gray-900">{plan.date}</div>
              </div>

              {/* Plan Details */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {/* Status Indicator */}
                  <span className={`w-3 h-3 rounded-full mr-2 ${plan.statusColor === "green" ? "bg-green-500" : "bg-red-500"}`}></span>
                  {/* Plan Title */}
                  <h2 className="text-lg font-bold">{plan.title}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
              </div>

              {/* Achieved & Amount */}
              <div className="text-right">
                <p className={`text-sm font-bold ${plan.achievedStatus === "green" ? "text-green-500" : "text-red-500"}`}>
                  {plan.achieved} Achieved
                </p>
                <p className="text-lg font-semibold">{plan.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Planning;
