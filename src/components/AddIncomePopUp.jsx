import React from "react";

const AddIncomePopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Jika popup tidak terbuka, jangan render apapun

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-lg z-50 relative">
        <h2 className="mb-4 text-xl font-bold text-center">Add Income</h2>

        <form className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Nama Kegiatan</label>
            <input
              type="text"
              placeholder="Masukan nama kegiatan.."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4252A]"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Tanggal</label>
            <input
              type="text"
              placeholder="DD/MM/YY"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4252A]"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Jumlah</label>
            <input
              type="text"
              placeholder="Masukan Jumlah Pemasukan.."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4252A]"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Pajak</label>
            <input
              type="text"
              placeholder="Masukan Jumlah Pajak..."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4252A]"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Upload</label>
              <div className="p-4 text-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-gray-500">Upload File Keuangan (PDF/xlsx)</span>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Evidence</label>
              <div className="p-4 text-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-gray-500">Upload File Bukti (PNG/JPG/PDF)</span>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B4252A] text-white rounded-md hover:bg-[#8E1F22]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomePopup;
