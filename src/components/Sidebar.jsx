import React from "react";
import { FaTh, FaClipboardList, FaSignOutAlt, FaUpload } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="p-6 ml-6 bg-white rounded-lg shadow-lg w-64 h-1/2 mt-9">
      <ul>
        {/* Dashboard */}
        <Link to="/">
          <li
            className={`flex items-center rounded-lg p-2 transition-colors duration-200 ${
              location.pathname === "/"
                ? "text-[#B4252A]"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
            }`}
          >
            <FaTh className="mr-3 text-lg" />
            <span className="font-semibold">Dashboard</span>
          </li>
        </Link>

        {/* Planning */}
        <Link to="/planning">
          <li
            className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
              location.pathname === "/planning"
                ? "text-[#B4252A]"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
            }`}
          >
            <FaClipboardList className="mr-3 text-lg" />
            <span>Planning</span>
          </li>
        </Link>

        {/* Export */}
        <Link to="/export">
          <li
            className={`flex items-center rounded-lg p-2 transition-colors duration-200 mt-4 ${
              location.pathname === "/export"
                ? "text-[#B4252A]"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#B4252A]"
            }`}
          >
            <FaUpload className="mr-3 text-lg" />
            <span>Export</span>
          </li>
        </Link>
      </ul>

      {/* Log Out */}
      <Link
        to="/login"
        className="mt-96 flex justify-center items-center text-[#B4252A] p-2 hover:bg-red-200 rounded-lg cursor-pointer transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-3 text-lg" /> {/* Ikon Log Out */}
        <span>Log Out</span>
      </Link>
    </div>
  );
};

export default Sidebar;
