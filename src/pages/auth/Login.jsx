import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Email dan password tidak boleh kosong!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true); // Tampilkan loading spinner segera

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: trimmedEmail,
          password: trimmedPassword,
        }
      );

      setLoading(false); // Hentikan loading spinner setelah request selesai

      console.log(response.data);

      if (response.data.status) {
        // Simpan token dan status login ke localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAuthenticated", "true");

        toast.success("Login berhasil!", {
          position: "top-center",
          autoClose: 2000,
        });

        // Navigasi setelah login sukses
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        toast.error(
          response.data.message ||
            "Login gagal, periksa kembali email dan password!",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      setLoading(false); // Hentikan loading spinner jika terjadi error
      console.error(error.response);

      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message ||
          "Terjadi kesalahan, silakan coba lagi.";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <>
      {/* Loading di tengah halaman */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-white relative">
        <div
          className="bg-white p-6 md:p-8 lg:p-12 rounded-lg shadow-lg w-[90%] sm:w-[24rem] md:w-[28rem] relative z-10"
          style={{ boxShadow: "0 0 15px 3px rgba(180, 37, 42, 0.15)" }}
        >
          <div className="relative z-10 flex justify-center mb-8">
            <img
              src="/header.png"
              alt="Humic Payroll"
              className="h-16 sm:h-18 lg:h-20"
            />
          </div>

          <div className="relative z-10 mb-5 text-2xl font-semibold text-left text-gray-800">
            Login
          </div>

          <form className="relative z-10 space-y-4">
            <div className="relative mb-3">
              <div className="flex items-center border border-gray-400 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-red-500">
                <span className="px-3 text-gray-400">
                  <FaUser />
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

            <div className="relative mb-5">
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
                />
                <span
                  className="px-3 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 rounded-md focus:outline-none focus:shadow-outline w-full mt-4 h-12"
                type="button"
                onClick={handleLogin}
              >
                Log In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <Link
                to="/register"
                className="font-semibold text-red-600 hover:text-red-800"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Background Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="bg-red-300 rounded-full w-[450px] h-[450px] md:w-[650px] md:h-[650px] lg:w-[800px] lg:h-[800px] opacity-35 blur-[120px]"></div>
        </div>
      </div>
    </>
  );
};

export default Login;
