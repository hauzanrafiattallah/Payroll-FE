import React, { useState } from "react";
import { FaTh, FaClipboardList, FaSignOutAlt, FaUpload } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Tombol panah untuk membuka sidebar hanya di layar kecil */}
      <div className="fixed top-4 left-0 z-50 lg:hidden mt-16">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-[#B4252A] pl-1"
        >
          <FaCircleArrowRight />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`p-6 ml-6 bg-white rounded-lg shadow-lg w-64 min-h-[75vh] max-h-[80vh] mt-9 fixed lg:static transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50 flex flex-col justify-between`}
      >
        <ul className="flex-1">
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
          className="flex justify-center items-center text-[#B4252A] p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3 text-lg" /> {/* Ikon Log Out */}
          <span>Log Out</span>
        </Link>
      </div>

      {/* Overlay untuk layar kecil ketika sidebar terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
