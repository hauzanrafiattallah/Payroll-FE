import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddPlanning = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      date: "2024-10-21",
      information: "Ini Adalah Keterangan Dari Item 1",
      bruto: 200000000,
      tax: 20000000,
      netto: 180000000,
    },
    {
      date: "2024-10-21",
      information: "Ini Adalah Keterangan Dari Item 2",
      bruto: 200000000,
      tax: 20000000,
      netto: 180000000,
    },
    {
      date: "2024-10-21",
      information: "Ini Adalah Keterangan Dari Item 3",
      bruto: 200000000,
      tax: 20000000,
      netto: 180000000,
    },
  ]);

  const [isAddItemMode, setIsAddItemMode] = useState(false);

  const totalBruto = items.reduce((sum, item) => sum + item.bruto, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const totalNetto = items.reduce((sum, item) => sum + item.netto, 0);

  const addItem = () => {
    setItems([
      ...items,
      { date: "", information: "", bruto: 0, tax: 0, netto: 0 },
    ]);
    setIsAddItemMode(true);
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "bruto" || field === "tax"
        ? parseInt(value) || 0
        : value;
    if (field === "bruto" || field === "tax") {
      newItems[index].netto = newItems[index].bruto - newItems[index].tax;
    }
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSave = () => {
    setIsAddItemMode(false);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <h1 className="text-2xl font-bold text-center mb-6">Add New Plan</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
              <div className="text-left">
                <p className="text-gray-500 font-semibold">Kegiatan</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">Planning For Conference ICYCYTA</h2>
              </div>
              <div className="text-left">
                <p className="text-gray-500 font-semibold">Start Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">15 Okt 2024</h2>
              </div>
              <div className="text-left">
                <p className="text-gray-500 font-semibold">End Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">21 Okt 2024</h2>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Items</h3>
              {!isAddItemMode && (
                <button
                  onClick={addItem}
                  className="bg-[#B4252A] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#8E1F22] flex items-center space-x-2"
                >
                  <FaPlus className="text-white" />
                  <span>New Item</span>
                </button>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate" style={{ borderSpacing: "0 8px" }}>
                  <thead>
                    <tr className="text-gray-700">
                      <th className="py-2 px-4">Tanggal</th>
                      <th className="py-2 px-4">Keterangan</th>
                      <th className="py-2 px-4">Nilai Bruto</th>
                      <th className="py-2 px-4">Nilai Pajak</th>
                      <th className="py-2 px-4">Nilai Netto</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="text-gray-900 bg-white border rounded-lg shadow-md">
                        {isAddItemMode ? (
                          <>
                            <td className="py-2 px-4">
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={item.information}
                                onChange={(e) => handleInputChange(index, "information", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={item.bruto}
                                onChange={(e) => handleInputChange(index, "bruto", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={item.tax}
                                onChange={(e) => handleInputChange(index, "tax", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 px-4">{item.date}</td>
                            <td className="py-2 px-4">{item.information}</td>
                            <td className="py-2 px-4">Rp.{item.bruto.toLocaleString("id-ID")}</td>
                            <td className="py-2 px-4">Rp.{item.tax.toLocaleString("id-ID")}</td>
                          </>
                        )}
                        <td className="py-2 px-4">Rp.{item.netto.toLocaleString("id-ID")}</td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => removeItem(index)}
                            className="bg-[#B4252A] text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-[#8E1F22] shadow-md"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold text-red-600">
                      <td colSpan="2" className="py-2 px-4 text-left">Total</td>
                      <td className="py-2 px-4">Rp.{totalBruto.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-4">Rp.{totalTax.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-4">Rp.{totalNetto.toLocaleString("id-ID")}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              {isAddItemMode ? (
                <button
                  onClick={handleSave}
                  className="bg-[#B4252A] text-white font-semibold py-2 px-8 rounded-lg hover:bg-[#8E1F22]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="bg-[#F5C6C7] text-[#B4252A] font-semibold py-2 px-8 rounded-lg hover:bg-[#F1B0B1]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPlanning;
