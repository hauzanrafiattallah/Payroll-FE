import React from "react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      {/* Logo */}
      <div className="flex items-center cursor-pointer ml-14">
        <img src="/header2.png" alt="Logo" className="h-12 mr-3" />
      </div>
      {/* Tombol Add Transaction */}
      <button className="flex items-center mr-14 bg-[#B4252A] text-white font-bold text-sm py-3 px-3 rounded-md hover:bg-[#8E1F22] cursor-pointer">
        <span className="mr-1">+</span> Add Transaction
      </button>
    </div>
  );
};

export default Topbar;
