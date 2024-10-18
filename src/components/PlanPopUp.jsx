import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import style untuk ReactQuill

const PlanPopUp = ({ isOpen, onClose }) => {
  const [editorContent, setEditorContent] = useState('');

  const handleSave = () => {
    console.log('Plan Saved:', editorContent);
    // Logika untuk menyimpan plan baru bisa ditambahkan di sini
    onClose(); // Tutup pop-up setelah menyimpan
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
            <h2 className="text-lg font-bold mb-4 text-center">Add A New Plan</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nama Kegiatan</label>
              <input
                type="text"
                placeholder="Masukkan nama kegiatan..."
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Deadline</label>
              <input
                type="date"
                placeholder="Masukkan Tanggal Deadline..."
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Target</label>
              <input
                type="text"
                placeholder="Masukkan target permintaan/penggunaan..."
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent}
                className="bg-white rounded-lg"
                placeholder="Masukkan Deskripsi..."
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-[#E4C3C3] text-[#B4252A] font-semibold py-2 px-6 rounded-lg hover:bg-[#cfa8a8]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#B4252A] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanPopUp;
