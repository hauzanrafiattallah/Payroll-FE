import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaFileExcel, FaCalendarAlt } from "react-icons/fa";

const Export = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Export
          </h1>

          {/* Container untuk Export Options */}
          <div className="p-6 bg-white rounded-lg shadow-lg md:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {/* Export As */}
              <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6">
                <div className="flex items-center">
                  <FaFileExcel className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Export As</p>
                    <h2 className="text-lg font-bold md:text-xl">
                      Excel (.Xlsx)
                    </h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>{" "}
                {/* Arrow symbol */}
              </div>

              {/* Select Date Range */}
              <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer md:p-6">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-4 text-2xl text-gray-500" />
                  <div>
                    <p className="text-gray-500">Select Date Range</p>
                    <h2 className="text-lg font-bold md:text-xl">Last Month</h2>
                  </div>
                </div>
                <div className="text-4xl md:text-6xl">&rsaquo;</div>{" "}
                {/* Arrow symbol */}
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
