import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios"; // Mengimpor axios untuk fetching data
import ReactLoading from "react-loading"; // Menggunakan ReactLoading untuk spinner
import { toast } from "react-toastify"; // Menggunakan toast untuk notifikasi

const PlanPopUpEdit = ({ isOpen, onClose, planId }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [animatePopup, setAnimatePopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("overlay")) {
        closePopup();
      }
    };

    if (isOpen) {
      setAnimatePopup(true);
      window.addEventListener("click", handleOutsideClick);
      fetchPlanDetails(); // Panggil fungsi untuk mengambil data plan saat modal dibuka
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const closePopup = () => {
    setAnimatePopup(false);
    setTimeout(onClose, 200); // Tunggu animasi sebelum benar-benar menutup
  };

  // Fungsi untuk mengambil data rencana yang akan di-edit berdasarkan planId
  const fetchPlanDetails = async () => {
    const token = localStorage.getItem("token"); // Mengambil token dari localStorage
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        const plan = response.data.data;
        setTitle(plan.title);
        setDeadline(plan.deadline);
        setTargetAmount(plan.target_amount);
        setEditorContent(plan.content);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data rencana.");
      console.error("Error fetching plan details:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true); // Set loading true saat proses mulai
    const token = localStorage.getItem("token"); // Mengambil token dari localStorage

    const updatedPlanData = {
      title: title,
      deadline: deadline,
      target_amount: parseInt(targetAmount), // Pastikan target amount dalam bentuk angka
      content: editorContent, // Mengirimkan konten yang disimpan di ReactQuill
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/planning/${planId}`, // Perubahan sesuai dengan rute update plan
        updatedPlanData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Rencana berhasil diperbarui!"); // Pesan sukses dalam bahasa Indonesia
        setIsLoading(false); // Set loading false setelah proses selesai
        onClose(); // Tutup pop-up setelah menyimpan
      } else {
        toast.error("Gagal memperbarui rencana."); // Pesan gagal dalam bahasa Indonesia
        console.error("Failed to update plan:", response.data.message);
        setIsLoading(false); // Set loading false setelah proses selesai
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui rencana. Silakan coba lagi."); // Pesan error dalam bahasa Indonesia
      console.error("Error updating plan:", error);
      setIsLoading(false); // Set loading false setelah proses selesai
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overlay">
          <div
            className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out 
            ${
              animatePopup ? "translate-y-0" : "-translate-y-full"
            } relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 max-h-[90vh] overflow-y-auto`} // Membatasi tinggi popup dan menambahkan scroll
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              Edit Rencana
            </h2>

            {/* Form */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Nama Kegiatan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // Mengambil input dari user
                placeholder="Masukkan nama kegiatan..."
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)} // Mengambil input deadline
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Target
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)} // Mengambil input target amount
                placeholder="Masukkan target permintaan/penggunaan..."
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Deskripsi
              </label>
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent} // Mengambil input dari ReactQuill (konten rich text)
                className="bg-white rounded-lg"
                placeholder="Masukkan Deskripsi..."
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-6 rounded-lg hover:bg-[#cfa8a8]"
                onClick={closePopup}
                disabled={isLoading} // Nonaktifkan tombol jika loading
              >
                Batal
              </button>
              <button
                className="bg-[#B4252A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
                onClick={handleSave}
                disabled={isLoading} // Nonaktifkan tombol jika loading
              >
                Simpan
              </button>
            </div>
          </div>

          {/* overlay loading */}
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
      )}
    </>
  );
};

export default PlanPopUpEdit;
