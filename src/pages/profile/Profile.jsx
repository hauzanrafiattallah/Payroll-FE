import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";

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
  const [profileName, setProfileName] = useState(""); // State untuk nama profil (biarkan kosong untuk placeholder)
  const [profileImage, setProfileImage] = useState(null); // State untuk gambar profil
  const [isProfileChanged, setIsProfileChanged] = useState(false); // State untuk perubahan profil
  const [isPasswordChanged, setIsPasswordChanged] = useState(false); // State untuk perubahan password
  const [isLoading, setIsLoading] = useState(false); // State untuk loading UI
  const [imageName, setImageName] = useState(""); // State untuk menyimpan nama file gambar yang diunggah
  const navigate = useNavigate(); // Inisialisasi useNavigate

  // Tambahkan URL dasar dari API untuk gambar
  const baseImageUrl = import.meta.env.VITE_FILE_BASE_URL;

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
      toast.error("New password and confirmation password do not match");
      return;
    }

    setIsSaving(true);
    setIsLoading(true);

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
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordChanged(false);
        toast.success("Password updated successfully!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  // Fungsi untuk meng-handle perubahan profile
  const handleProfileUpdate = async () => {
    const formData = new FormData();

    // Jika profileName tidak diubah, kirim nama dari userData
    formData.append("name", profileName || userData.name);

    // Jika ada perubahan gambar, tambahkan gambar ke formData
    if (profileImage) {
      formData.append("image", profileImage);
    }

    setIsLoading(true); // Tampilkan loading UI

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/update-profile`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setIsProfileChanged(false); // Set ulang perubahan setelah berhasil

        // Update state data user dan gambar secara langsung
        setUserData({
          ...userData,
          name: profileName || userData.name,
          image: response.data.image || userData.image, // Menggunakan image dari response
        });

        if (profileImage && profileName !== userData.name) {
          toast.success("Profile updated successfully!");
        } else if (profileImage) {
          toast.success(`Image uploaded successfully!`);
        } else if (profileName !== userData.name) {
          toast.success("Profile name updated successfully!");
        }

        setProfileImage(null); // Reset gambar
        setImageName(""); // Kosongkan nama file gambar
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      if (error.response && error.response.data) {
        console.error("Validation errors:", error.response.data);
        toast.error(
          `Failed to update image: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        toast.error("Failed to update image. Please try again.");
      }
    } finally {
      setIsLoading(false); // Sembunyikan loading UI setelah selesai
    }
  };

  // Fungsi untuk memicu klik pada input file yang disembunyikan
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImageName(file?.name || "");
    setIsProfileChanged(true);
  };

  const handleSave = () => {
    if (isProfileChanged) {
      handleProfileUpdate();
    }
    if (isPasswordChanged) {
      handleChangePassword();
    }
  };

  const handleProfileNameChange = (e) => {
    setProfileName(e.target.value);
    setIsProfileChanged(true);
  };

  const handlePasswordChange = (field, value) => {
    if (field === "currentPassword") {
      setCurrentPassword(value);
    } else if (field === "newPassword") {
      setNewPassword(value);
    } else if (field === "confirmPassword") {
      setConfirmPassword(value);
    }

    if (currentPassword || newPassword || confirmPassword) {
      setIsPasswordChanged(true);
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
              <div className="relative h-32 sm:h-40">
                <img
                  src="/images/background_profile.jpeg"
                  alt="Profile Background"
                  className="absolute top-0 left-0 object-cover w-full h-full rounded-t-lg"
                />
              </div>
              {/* Profile Info */}
              <div className="relative flex flex-col items-center px-4 -mt-16 sm:px-8 lg:flex-row lg:justify-start lg:px-16">
                <div className="relative flex items-center space-x-4 sm:space-x-6">
                  <div className="absolute inset-0 bg-white rounded-full w-28 sm:w-40 h-28 sm:h-40 -z-10" />
                  <img
                    src={
                      userData?.image
                        ? `${baseImageUrl}${userData.image}` // Menggunakan image dari backend
                        : "/images/image_placeholder.png"
                    }
                    alt="Profile"
                    className="relative z-10 w-20 h-20 border-4 border-white rounded-full sm:w-28 sm:h-28"
                  />
                </div>

                <div className="flex flex-col items-center mt-4 text-center lg:mt-0 lg:ml-6 lg:items-start lg:text-left">
                  <p className="mt-3 text-lg text-gray-600 lg:mt-20 sm:text-xl">
                    {userData?.role === "admin"
                      ? "Keuangan"
                      : userData?.role === "superAdmin"
                      ? "Direktur"
                      : userData?.role || "Role"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {userData?.name || "User"}
                  </h2>
                </div>
              </div>

              {/* Change Profile Section */}
              <div className="p-4 sm:p-8 lg:px-16 lg:py-12">
                <hr className="mb-10 border-t-2 border-gray-300" />
                <div className="flex flex-col justify-between lg:flex-row lg:items-center lg:space-x-4">
                  <h3 className="w-full mb-4 text-xl font-semibold text-center lg:text-left whitespace-nowrap lg:w-1/4 lg:mb-0">
                    Change Profile
                  </h3>
                  <div className="flex flex-col w-full space-y-4 lg:w-3/4">
                    {/* Input Nama */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Change your Name"
                        value={profileName} // Kosongkan ini agar placeholder muncul
                        onChange={handleProfileNameChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Input Gambar dengan UI seperti Password */}
                    <div className="relative">
                      <div
                        className="flex flex-col space-y-4 items-center justify-center w-full h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                        onClick={() =>
                          document.getElementById("profileImageUpload").click()
                        }
                      >
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                          id="profileImageUpload"
                        />

                        <div className="flex flex-col items-center">
                          <FiUpload className="w-10 h-10 text-gray-400" />
                          <span className="mt-2 text-gray-500">
                            {imageName
                              ? `${imageName}`
                              : "Change your Profile Picture (PNG/JPG)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="p-4 sm:p-8 lg:px-16 lg:py-12">
                <hr className="mb-10 border-t-2 border-gray-300" />
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
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
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
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
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
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
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
                <hr className="mt-10 border-t-2 border-gray-300" />
              </div>

              {/* Tombol Cancel dan Save */}
              <div className="flex justify-end mt-4 space-x-4 p-4">
                <button
                  className="px-6 py-2 font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                  onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 font-semibold text-white bg-[#B4252A] rounded-lg hover:bg-red-800 flex items-center justify-center"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
              <ReactLoading
                type="spin"
                color="#B4252A"
                height={50}
                width={50}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
