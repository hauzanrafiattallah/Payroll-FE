import React from "react";
import Sidebar from "../components/Sidebar"; // Pastikan ini diimpor sesuai dengan struktur proyek Anda
import Topbar from "../components/Topbar"; // Pastikan ini diimpor sesuai dengan struktur proyek Anda

const PlanningDetails = () => {
  return (
    <>
      <Topbar />
      <div className="flex mt-20">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-4 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Planning Details</h1>
          </div>

          {/* Info Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Kolom Kiri: Label */}
              <div className="text-left"> {/* Posisi tetap di kiri, tidak perlu text-right */}
                <p className="text-gray-500 font-semibold">Kegiatan</p>
              </div>
              {/* Kolom Kanan: Konten */}
              <div>
                <h2 className="text-lg font-bold">Planning For Conference A</h2>
              </div>

              <div className="text-left">
                <p className="text-gray-500 font-semibold">Deadline</p>
              </div>
              <div>
                <h2 className="text-lg font-bold">03 Okt 2024</h2>
              </div>

              <div className="text-left">
                <p className="text-gray-500 font-semibold">Target</p>
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Rp.100.000.000 / Rp.100.000.000
                </h2>
              </div>
            </div>

            {/* Details Card */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-center text-lg font-bold mb-4">
                Planning For Conference A
              </h3>
              <p className="text-gray-600 mb-6 text-justify">
                Ini Adalah Deskripsi Dari Rencana Yang Ingin Dilakukan
                Kedepannya Jadi Gini.. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Quis hendrerit dolor magna eget est lorem
                ipsum. Quis hendrerit dolor magna eget est lorem ipsum.
              </p>
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
              <p className="text-gray-600 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                hendrerit dolor magna eget est lorem ipsum. Quis hendrerit dolor
                magna eget est lorem ipsum.
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-[#B4252A] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#8E1F22]">
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
