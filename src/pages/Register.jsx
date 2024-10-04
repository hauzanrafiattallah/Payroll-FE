import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div
          className="bg-white p-6 md:p-8 lg:p-12 rounded-lg shadow-lg w-[90%] sm:w-[24rem] md:w-[28rem] relative"
          style={{
            boxShadow: "0 0 15px 3px rgba(180, 37, 42, 0.15)",
          }}
        >
          {/* Logo */}
          <div className="relative z-10 flex justify-center mb-8">
            <img
              src="/header.png"
              alt="Humic Payroll"
              className="h-16 sm:h-18 lg:h-20"
            />
          </div>

          {/* Teks Register di sebelah kiri */}
          <div className="relative z-10 mb-5 text-2xl font-semibold text-left text-gray-800">
            Register
          </div>

          {/* Form */}
          <form className="relative z-10 space-y-4">
            <div className="relative mb-3">
              {/* Input Username dengan ikon */}
              <div className="flex items-center border border-gray-400 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-500">
                <span className="px-3 text-gray-400">
                  <FaUser />
                </span>
                <input
                  className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white focus:outline-none"
                  type="text"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="relative mb-3">
              {/* Input Password dengan ikon mata */}
              <div className="flex items-center border border-gray-400 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-500">
                <span className="px-3 text-gray-400">
                  <FaLock />
                </span>
                <input
                  className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <span
                  className="px-3 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
            </div>

            <div className="relative mb-5">
              {/* Input Retype Password dengan ikon mata */}
              <div className="flex items-center border border-gray-400 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-500">
                <span className="px-3 text-gray-400">
                  <FaLock />
                </span>
                <input
                  className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white focus:outline-none"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Retype Password"
                />
                <span
                  className="px-3 text-gray-400 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
            </div>

            {/* Tombol Register */}
            <div className="flex items-center justify-center">
              <button
                className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 rounded-md focus:outline-none focus:shadow-outline w-full mt-4 h-12"
                type="button"
              >
                Register
              </button>
            </div>
          </form>

          {/* Bagian Log In */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-600 hover:text-red-800"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
