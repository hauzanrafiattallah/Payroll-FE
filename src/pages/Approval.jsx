import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { FaCheck, FaTimes } from "react-icons/fa";

const Approval = () => {
  // Dummy data for the table
  const [approvalData, setApprovalData] = useState([
    {
      name: "Conference",
      date: "24 Sept 2024",
      amount: "Rp.60.000.000",
      type: "Income",
      approved: true,
    },
    {
      name: "Conference",
      date: "24 Sept 2024",
      amount: "Rp.60.000.000",
      type: "Income",
      approved: true,
    },
    {
      name: "Conference",
      date: "24 Sept 2024",
      amount: "Rp.60.000.000",
      type: "Income",
      approved: true,
    },
    {
      name: "Conference",
      date: "24 Sept 2024",
      amount: "Rp.60.000.000",
      type: "Income",
      approved: true,
    },
    {
      name: "Conference",
      date: "24 Sept 2024",
      amount: "Rp.60.000.000",
      type: "Income",
      approved: true,
    },
  ]);

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Content */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Approval
          </h1>

          <div className="p-6 mb-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">Kegiatan</th>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">Jumlah</th>
                  <th className="px-4 py-2 text-center">Type</th>
                  <th className="px-4 py-2 text-center">Approve</th>
                </tr>
              </thead>
              <tbody>
                {approvalData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.amount}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="flex items-center justify-center py-2 space-x-2">
                      {/* Check button with restored hover */}
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#B4252A] text-white hover:bg-red-800 `}
                      >
                        <FaCheck />
                      </button>

                      {/* Cross button with hover effect */}
                      <button
                        className={`w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-black hover:text-gray-700 hover:bg-gray-100`}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
