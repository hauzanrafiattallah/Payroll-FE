import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaFileExcel, FaCalendarAlt } from "react-icons/fa";

const Export = () => {
  return (
    <>
      <Topbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 ">
          <h1 className="mb-6 text-2xl font-bold">Export</h1>

          {/* Container untuk Export Options */}
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* Export As */}
              <div className="flex items-center justify-between p-6 border rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <FaFileExcel className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-xl font-bold">Excel (.Xlsx)</h2>
                  </div>
                </div>
                <div className="text-6xl">&rsaquo;</div> {/* Arrow symbol */}
              </div>

              {/* Select Date Range */}
              <div className="flex items-center justify-between p-6 border rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Select Date Range</p>
                    <h2 className="text-xl font-bold">Last Month</h2>
                  </div>
                </div>
                <div className="text-6xl">&rsaquo;</div> {/* Arrow symbol */}
              </div>

              {/* Export Button */}
              <div className="flex justify-end col-span-2">
                <button className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-3 px-16 rounded-md mt-9">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Export;
