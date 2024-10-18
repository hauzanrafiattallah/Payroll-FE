import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import style untuk ReactQuill

const PlanPopUp = ({ isOpen, onClose }) => {
  const [editorContent, setEditorContent] = useState('');
  const [animatePopup, setAnimatePopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains('overlay')) {
        closePopup();
      }
    };

    if (isOpen) {
      setAnimatePopup(true);
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const closePopup = () => {
    setAnimatePopup(false);
    setTimeout(onClose, 200); // Tunggu animasi sebelum benar-benar menutup
  };

  const handleSave = () => {
    console.log('Plan Saved:', editorContent);
    onClose(); // Tutup pop-up setelah menyimpan
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overlay">
          <div
            className={`bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out 
            ${animatePopup ? 'translate-y-0' : '-translate-y-full'} relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 max-h-[90vh] overflow-y-auto`} // Membatasi tinggi popup dan menambahkan scroll
          >
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
                onClick={closePopup}
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
