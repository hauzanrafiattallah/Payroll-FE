import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useParams, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading"; // Pastikan ini diimpor

const PlanningDetails = () => {
  const { id } = useParams(); // Mengambil ID dari parameter URL
  const [planning, setPlanning] = useState(null); // State untuk menyimpan data planning
  const [loading, setLoading] = useState(true); // State untuk loading
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  // Fungsi untuk fetching data dari API berdasarkan ID
  const fetchPlanningById = async () => {
    const token = localStorage.getItem("token"); // Mengambil token dari localStorage
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setPlanning(response.data.data); // Set data planning dari API
        setLoading(false); // Hentikan loading setelah data diambil
      }
    } catch (error) {
      console.error("Error fetching planning details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanningById(); // Fetch data ketika komponen pertama kali dirender
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
        <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
      </div>
    );
  }

  if (!planning) {
    return <div>No planning data found.</div>;
  }

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning Details
          </h1>

          {/* Info Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* Pada versi mobile, grid kolom akan berubah menjadi 1 kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {/* Kolom Kiri: Label */}
              <div className="text-center sm:text-left">
                <p className="text-gray-500 font-semibold">Kegiatan</p>
              </div>
              {/* Kolom Kanan: Konten di kanan */}
              <div className="text-center sm:text-right">
                <h2 className="text-lg font-bold">{planning.title}</h2>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-gray-500 font-semibold">Deadline</p>
              </div>
              <div className="text-center sm:text-right">
                <h2 className="text-lg font-bold">
                  {new Date(planning.deadline).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-gray-500 font-semibold">Target</p>
              </div>
              <div className="text-center sm:text-right">
                <h2 className="text-lg font-bold">
                  Rp.{planning.target_amount.toLocaleString()}
                </h2>
              </div>
            </div>

            {/* Details Card */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-center text-lg font-bold mb-4">
                {planning.title}
              </h3>
              <p
                className="text-gray-600 mb-6 text-justify"
                dangerouslySetInnerHTML={{ __html: planning.content }} // Menampilkan deskripsi dari API (rich text)
              />
              <div className="flex justify-center mb-4">
                <img
                  src="/planning.jpeg" // Ganti dengan path gambar yang sesuai
                  alt="Conference"
                  className="rounded-lg shadow-lg w-full max-w-md"
                />
              </div>
              <p className="text-center text-gray-600 text-sm mb-4">
                Gambar 1.1
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-[#B4252A] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
                onClick={() => navigate(-1)} // Navigasi kembali ke halaman sebelumnya
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanningDetails;
