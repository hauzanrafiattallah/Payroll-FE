import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icon untuk mata
import { toast } from "react-toastify"; // Import toast dari react-toastify

const Profile = () => {
  const [userData, setUserData] = useState(null); // State untuk menyimpan data user
  const [loading, setLoading] = useState(true); // State untuk loading fetch data
  const [isSaving, setIsSaving] = useState(false); // State untuk loading save password
  const [currentPassword, setCurrentPassword] = useState(""); // State untuk password saat ini
  const [newPassword, setNewPassword] = useState(""); // State untuk password baru
  const [confirmPassword, setConfirmPassword] = useState(""); // State untuk konfirmasi password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Untuk toggle visibility current password
  const [showNewPassword, setShowNewPassword] = useState(false); // Untuk toggle visibility new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Untuk toggle visibility confirm password
  const [error, setError] = useState(false); // State untuk error handling
  const navigate = useNavigate(); // Inisialisasi useNavigate

  // Ambil token dari localStorage
  const authToken = localStorage.getItem("token");

  // Fetch data user saat komponen pertama kali dirender
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`, // Sertakan token di header
            },
          }
        );
        console.log(response.data); // Debugging untuk melihat respons dari API
        setUserData(response.data); // Simpan data user ke state
        setLoading(false); // Set loading ke false setelah data diambil
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Hentikan loading jika terjadi error
      }
    };

    fetchUserData();
  }, [authToken]);

  // Fungsi untuk meng-handle perubahan password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(true);
      toast.error("New password and confirmation password do not match");
      return;
    }

    setIsSaving(true); // Aktifkan state loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/update-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Sertakan token di header
          },
        }
      );

      if (response.status === 200) {
        // Reset form fields after successful update
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(false);
        toast.success("Password updated successfully!"); // Toast sukses
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError(true);
      toast.error("Failed to update password. Please try again."); // Toast error
    } finally {
      setIsSaving(false); // Matikan state loading setelah selesai
    }
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Konten */}
        <div className="w-full p-4 mx-auto mt-2 sm:p-8 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Profile
          </h1>

          {/* Loading State untuk fetch data user */}
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <ReactLoading
                type="spin"
                color="#B4252A"
                height={50}
                width={50}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg">
              {/* Background Image */}
              <div className="relative h-32 sm:h-40">
                <img
                  src="/background_profile.jpeg"
                  alt="Profile Background"
                  className="absolute top-0 left-0 object-cover w-full h-full rounded-t-lg"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Profile Info */}
              <div className="relative flex flex-col items-center px-4 -mt-16 sm:px-8 lg:flex-row lg:justify-start lg:px-16">
                <div className="relative flex items-center space-x-4 sm:space-x-6">
                  {/* Lingkaran background di belakang profile */}
                  <div className="absolute inset-0 bg-white rounded-full w-28 sm:w-40 h-28 sm:h-40 -z-10" />

                  {/* Gambar Profile */}
                  <img
                    src={userData?.profile_picture || "/image_placeholder.png"} // Gambar dari API atau placeholder
                    alt="Profile"
                    className="relative z-10 w-20 h-20 border-4 border-white rounded-full sm:w-28 sm:h-28"
                  />
                </div>

                {/* Nama dan Jabatan */}
                <div className="flex flex-col items-center mt-4 text-center lg:mt-0 lg:ml-6 lg:items-start lg:text-left">
                  <p className="mt-3 text-lg text-gray-600 lg:mt-20 sm:text-xl">
                    {userData?.role || "Role"} {/* Jabatan dari API */}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {userData?.name || "User"} {/* Nama dari API */}
                  </h2>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="p-4 sm:p-8 lg:px-16 lg:py-12">
                {/* Garis Atas */}
                <hr className="mb-6 border-t-2 border-gray-300" />

                {/* Title and Form */}
                <div className="flex flex-col justify-between lg:flex-row lg:items-center lg:space-x-4">
                  <h3 className="w-full mb-4 text-xl font-semibold text-center lg:text-left whitespace-nowrap lg:w-1/4 lg:mb-0">
                    Change Password
                  </h3>
                  <div className="flex flex-col w-full space-y-4 lg:w-3/4">
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter your old password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 cursor-pointer"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Reenter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Garis Bawah */}
                <hr className="mt-8 border-t-2 border-gray-300" />

                {/* Bottom Buttons */}
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    className="px-6 py-2 font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                    onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 font-semibold text-white bg-[#B4252A] rounded-lg hover:bg-red-800 flex items-center justify-center"
                    onClick={handleChangePassword} // Panggil fungsi handleChangePassword
                    disabled={isSaving} // Disable tombol ketika sedang loading
                  >
                    {isSaving ? (
                      <ReactLoading
                        type="spin"
                        color="#ffffff"
                        height={20}
                        width={20}
                      />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
