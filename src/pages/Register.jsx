import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    if (password.length < 8) {
      toast.error("Password harus minimal 8 karakter!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://payroll.humicprototyping.com/api/register",
        {
          name: username,
          email,
          password,
          password_confirmation: confirmPassword,
        }
      );

      setLoading(false);

      if (response.status === 201 || response.data.success) {
        toast.success("Register berhasil!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Register gagal, coba lagi!");
      }
    } catch (error) {
      setLoading(false);

      console.error(error.response);

      if (error.response && error.response.status === 422) {
        const serverErrors = error.response.data.errors;
        if (serverErrors) {
          const firstErrorKey = Object.keys(serverErrors)[0];
          toast.error(serverErrors[firstErrorKey][0]);
        } else {
          toast.error("Register gagal, coba lagi!");
        }
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi.");
      }
    }
  };

  return (
    <>
      {/* Loading di tengah halaman */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

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

          {/* Teks Sign UP */}
          <div className="relative z-10 mb-5 text-2xl font-semibold text-left text-gray-800">
            Sign UP
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
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="relative mb-3">
              {/* Input Email dengan ikon */}
              <div className="flex items-center border border-gray-400 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-500">
                <span className="px-3 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white focus:outline-none"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
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
                onClick={handleRegister}
                disabled={loading}
              >
                Sign Up
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

      {/* Komponen Toast untuk pemberitahuan */}
      <ToastContainer
        position="top-center"
        limit={3}
        autoClose={2000}
        style={{
          width: "auto",
          maxWidth: "600px", // Perpanjang ukuran maksimal toast
          padding: "5px",
          left: "50%", // Posisi horizontal
          transform: "translateX(-50%)", // Pastikan toast selalu di tengah
          top: "10px", // Jarak dari atas
        }}
        toastClassName="text-center text-sm"
      />
    </>
  );
};

export default Register;
