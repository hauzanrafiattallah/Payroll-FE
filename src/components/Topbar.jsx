import React, { useState, useEffect } from "react";

const Topbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white bg-opacity-80 backdrop-blur-md" : "bg-white"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center cursor-pointer ml-4 lg:ml-14">
        <img
          src="/header2.png"
          alt="Logo"
          className="h-9 sm:h-12 lg:h-12 mr-3"
        />
      </div>

      {/* Tombol Add Transaction */}
      <button className="flex items-center mr-4 lg:mr-14 bg-[#B4252A] text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-3 rounded-md hover:bg-[#8E1F22] cursor-pointer">
        <span className="mr-1 sm:mr-2">+</span>
        <span className="hidden sm:block">Add Transaction</span>
        <span className="block sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default Topbar;
