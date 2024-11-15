import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlanning = () => {
  const location = useLocation();
  const planningId = location.state?.planningId;
  const title = location.state?.title || "Planning Title";
  const startDate = location.state?.startDate || "Start Date";
  const endDate = location.state?.endDate || "End Date";
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [tempItem, setTempItem] = useState(null);
  const [isAddItemMode, setIsAddItemMode] = useState(false);

  // Fetch existing items when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/items?planning_id=${planningId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setItems(response.data.data); // Pastikan ini sesuai dengan respons API
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Gagal mengambil items.");
      }
    };
  
    if (planningId) {
      fetchItems();
    }
  }, [planningId]);
  

  const totalBruto = items.reduce((sum, item) => sum + item.bruto, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const totalNetto = items.reduce((sum, item) => sum + item.netto, 0);

  const addItem = () => {
    setTempItem({ date: "", information: "", bruto: 0, tax: 0, netto: 0 });
    setIsAddItemMode(true);
  };

  const handleTempItemChange = (field, value) => {
    const updatedTempItem = {
      ...tempItem,
      [field]: field === "bruto" || field === "tax" ? parseInt(value) || 0 : value,
    };
    if (field === "bruto" || field === "tax") {
      updatedTempItem.netto = updatedTempItem.bruto - updatedTempItem.tax;
    }
    setTempItem(updatedTempItem);
  };

  const handleSave = async () => {
    if (tempItem) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/item`,
          {
            planning_id: planningId,
            date: tempItem.date,
            information: tempItem.information,
            bruto_amount: tempItem.bruto,
            tax_amount: tempItem.tax,
            netto_amount: tempItem.netto,
            category: "internal",
            isAddition: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          toast.success("Item added successfully!");
          setItems([...items, tempItem]);
        }
      } catch (error) {
        console.error("Error adding item:", error);
        toast.error("Failed to add item. Please try again.");
      }
    }
    setTempItem(null);
    setIsAddItemMode(false);
  };

  const handleCloseAddItemMode = () => {
    setTempItem(null);
    setIsAddItemMode(false);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
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
                <h2 className="text-lg font-bold">{title}</h2>
              </div>
              <div className="text-left">
                <p className="text-gray-500 font-semibold">Start Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">
                  {new Date(startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
              </div>
              <div className="text-left">
                <p className="text-gray-500 font-semibold">End Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">
                  {new Date(endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
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
                    {items.length === 0 && !isAddItemMode ? (
                      <tr>
                        <td colSpan="6" className="text-center text-gray-500 py-4">
                          No items added yet.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {items.map((item, index) => (
                          <tr key={index} className="text-gray-900 bg-white border rounded-lg shadow-md">
                            <td className="py-2 px-4">{item.date}</td>
                            <td className="py-2 px-4">{item.information}</td>
                            <td className="py-2 px-4">Rp.{item.bruto.toLocaleString("id-ID")}</td>
                            <td className="py-2 px-4">Rp.{item.tax.toLocaleString("id-ID")}</td>
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
                        {isAddItemMode && (
                          <tr className="text-gray-900 bg-white border rounded-lg shadow-md">
                            <td className="py-2 px-4">
                              <input
                                type="date"
                                value={tempItem?.date || ""}
                                onChange={(e) => handleTempItemChange("date", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={tempItem?.information || ""}
                                onChange={(e) => handleTempItemChange("information", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={tempItem?.bruto || 0}
                                onChange={(e) => handleTempItemChange("bruto", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={tempItem?.tax || 0}
                                onChange={(e) => handleTempItemChange("tax", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">Rp.{(tempItem?.netto || 0).toLocaleString("id-ID")}</td>
                            <td className="py-2 px-4 text-right">
                              <button
                                onClick={handleCloseAddItemMode}
                                className="bg-[#F5C6C7] text-[#B4252A] font-semibold py-2 px-4 rounded-md hover:bg-[#F1B0B1]"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        )}
                        <tr className="font-semibold text-red-600">
                          <td colSpan="2" className="py-2 px-4 text-left">
                            Total
                          </td>
                          <td className="py-2 px-4">Rp.{totalBruto.toLocaleString("id-ID")}</td>
                          <td className="py-2 px-4">Rp.{totalTax.toLocaleString("id-ID")}</td>
                          <td className="py-2 px-4">Rp.{totalNetto.toLocaleString("id-ID")}</td>
                          <td></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              {isAddItemMode ? (
                <>
                  <button
                    onClick={handleCloseAddItemMode}
                    className="bg-[#F5C6C7] text-[#B4252A] font-semibold py-2 px-8 rounded-lg hover:bg-[#F1B0B1]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#B4252A] text-white font-semibold py-2 px-8 rounded-lg hover:bg-[#8E1F22]"
                  >
                    Save
                  </button>
                </>
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
