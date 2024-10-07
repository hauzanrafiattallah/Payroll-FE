import React, { useState, useEffect } from "react";
import { PiHandDepositBold, PiHandWithdrawBold } from "react-icons/pi";
import AddIncomePopup from "./AddIncomePopup";
import AddExpensesPopup from "./AddExpensesPopup";

const Topbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpensesOpen, setIsAddExpensesOpen] = useState(false);

  // Gunakan efek untuk mendeteksi scrolling dan mengubah state isScrolled
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
    <>
      <div
        className={`flex items-center justify-between p-4 w-full shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white bg-opacity-80 backdrop-blur-md" : "bg-white"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center ml-4 cursor-pointer lg:ml-14">
          <img
            src="/header2.png"
            alt="Logo"
            className="mr-3 h-9 sm:h-12 lg:h-12"
          />
        </div>

        {/* Dua tombol untuk Add Expenses dan Add Income */}
        <div className="flex mr-2 space-x-1 sm:mr-4 sm:space-x-2 lg:space-x-4 lg:mr-14">
          {/* Tombol Add Expenses */}
          <button
            className="flex items-center bg-[#F3DCDC] text-[#B4252A] font-bold text-xs sm:text-sm lg:text-base py-1.5 sm:py-2 lg:py-3 px-2 sm:px-4 lg:px-6 rounded-md hover:bg-[#e4c3c3] cursor-pointer"
            onClick={() => setIsAddExpensesOpen(true)}
          >
            <PiHandDepositBold className="mr-1.5 sm:mr-2 lg:mr-2" />
            <span>Add Expenses</span>
          </button>

          {/* Tombol Add Income */}
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center bg-[#B4252A] text-white font-bold text-xs sm:text-sm lg:text-base py-1.5 sm:py-2 lg:py-3 px-2 sm:px-4 lg:px-6 rounded-md hover:bg-[#8E1F22] cursor-pointer"
          >
            <PiHandWithdrawBold className="mr-1.5 sm:mr-2 lg:mr-2" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Popup untuk Add Income */}
      <AddIncomePopup
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      {/* Popup untuk Add Expenses */}
      <AddExpensesPopup
        isOpen={isAddExpensesOpen}
        onClose={() => setIsAddExpensesOpen(false)}
      />
    </>
  );
};

export default Topbar;
