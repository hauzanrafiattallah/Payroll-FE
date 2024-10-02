import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaFileExcel, FaCalendarAlt } from "react-icons/fa";

const Export = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col lg:flex-row mt-20">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full lg:max-w-full p-8 mx-auto mt-2 lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">Export</h1>

          {/* Container untuk Export Options */}
          <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Export As */}
              <div className="flex items-center justify-between p-4 md:p-6 border rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <FaFileExcel className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-lg md:text-xl font-bold">Excel (.Xlsx)</h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div> {/* Arrow symbol */}
              </div>

              {/* Select Date Range */}
              <div className="flex items-center justify-between p-4 md:p-6 border rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Select Date Range</p>
                    <h2 className="text-lg md:text-xl font-bold">Last Month</h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div> {/* Arrow symbol */}
              </div>

              {/* Export Button */}
              <div className="flex justify-end col-span-1 md:col-span-2">
                <button className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 md:py-3 px-8 md:px-16 rounded-md mt-6 md:mt-9">
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
