import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReactLoading from "react-loading";

const Profile = () => {
  const [userData, setUserData] = useState(null); // State untuk menyimpan data user
  const [loading, setLoading] = useState(true); // State untuk loading

  // Ambil token dari localStorage
  const authToken = localStorage.getItem("token");

  // Fetch data user saat komponen pertama kali dirender
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`, // Sertakan token di header
          },
        });
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

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Konten */}
        <div className="w-full p-4 sm:p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Profile
          </h1>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
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
              <div className="relative flex flex-col items-center px-4 sm:px-8 -mt-16 lg:flex-row lg:justify-start lg:px-16">
                <div className="relative flex items-center space-x-4 sm:space-x-6">
                  {/* Lingkaran background di belakang profile */}
                  <div className="absolute inset-0 w-28 sm:w-40 h-28 sm:h-40 bg-white rounded-full -z-10" />

                  {/* Gambar Profile */}
                  <img
                    src={userData?.profile_picture || "/image_placeholder.png"} // Gambar dari API atau placeholder
                    alt="Profile"
                    className="relative z-10 border-4 border-white rounded-full w-20 h-20 sm:w-28 sm:h-28"
                  />
                </div>

                {/* Nama dan Jabatan */}
                <div className="flex flex-col items-center mt-4 text-center lg:mt-0 lg:ml-6 lg:items-start lg:text-left">
                  <p className="mt-3 lg:mt-20 text-lg sm:text-xl text-gray-600">
                    {userData?.role || "Role"} {/* Jabatan dari API */}
                  </p>

                  <h2 className="mt-1 text-2xl sm:text-3xl font-bold">
                    {userData?.name || "User"} {/* Nama dari API */}
                  </h2>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="p-4 sm:p-8 lg:px-16 lg:py-12">
                {/* Garis Atas */}
                <hr className="border-t-2 border-gray-300 mb-6" />

                {/* Title and Form */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between lg:space-x-4">
                  <h3 className="text-xl font-semibold text-center lg:text-left whitespace-nowrap w-full lg:w-1/4 mb-4 lg:mb-0">
                    Change Password
                  </h3>
                  <div className="flex flex-col space-y-4 w-full lg:w-3/4">
                    <input
                      type="password"
                      placeholder="Enter your old password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="Reenter your new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Garis Bawah */}
                <hr className="border-t-2 border-gray-300 mt-8" />

                {/* Bottom Buttons */}
                <div className="flex justify-end mt-8 space-x-4">
                  <button className="px-6 py-2 font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Cancel
                  </button>
                  <button className="px-6 py-2 font-semibold text-white bg-[#B4252A] rounded-lg hover:bg-red-800">
                    Save
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
