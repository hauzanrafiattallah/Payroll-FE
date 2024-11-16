import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

const EditRealization = () => {
  const { id: realizationId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("Realization Title");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempItem, setTempItem] = useState(null);
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [editModeItemId, setEditModeItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRealization = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/realization/${realizationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          const realizationData = response.data.data;
          setTitle(realizationData.title);
          setStartDate(realizationData.start_date);
          setEndDate(realizationData.end_date);
          setItems(realizationData.item);
        }
      } catch (error) {
        console.error("Error fetching realization:", error);
        toast.error("Failed to fetch realization.");
      } finally {
        setIsLoading(false); // Set isLoading ke false setelah fetch selesai
      }
    };

    if (realizationId) {
      fetchRealization();
    }
  }, [realizationId]);

  const totalBruto = items.reduce((sum, item) => sum + item.bruto_amount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax_amount, 0);
  const totalNetto = items.reduce((sum, item) => sum + item.netto_amount, 0);

  const addItem = () => {
    setTempItem({
      date: "",
      information: "",
      bruto_amount: 0,
      tax_amount: 0,
      netto_amount: 0,
      category: "internal",
      isAddition: 1,
    });
    setIsAddItemMode(true);
    setEditModeItemId(null);
  };

  const formatCurrency = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleTempItemChange = (field, value) => {
    const formattedValue =
      field === "bruto_amount" ||
      field === "tax_amount" ||
      field === "netto_amount"
        ? formatCurrency(value)
        : value;
    setTempItem((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleSave = async () => {
    if (tempItem) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/item`,
          {
            planning_id: realizationId,
            date: tempItem.date,
            information: tempItem.information,
            bruto_amount:
              parseInt(tempItem.bruto_amount.replace(/\./g, "")) || 0,
            tax_amount: parseInt(tempItem.tax_amount.replace(/\./g, "")) || 0,
            netto_amount:
              parseInt(tempItem.netto_amount.replace(/\./g, "")) || 0,
            category: tempItem.category,
            isAddition: tempItem.isAddition,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          toast.success("Item added successfully!");
          setItems([...items, response.data.planning]);
        }
      } catch (error) {
        console.error("Error adding item:", error);
        toast.error("Failed to add item. Please try again.");
      } finally {
        setIsLoading(false); // Set isLoading ke false setelah POST selesai
      }
    }
    setTempItem(null);
    setIsAddItemMode(false);
  };

  const handleEditMode = async (itemId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setTempItem(response.data.data);
        setEditModeItemId(itemId);
        console.log("Edit mode item:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast.error("Failed to fetch item data.");
    } finally {
      setIsLoading(false); // Set isLoading ke false setelah proses selesai
    }
  };

  const handleSaveEdit = async () => {
    if (tempItem && editModeItemId) {
      setIsLoading(true);
      const originalItem = items.find((item) => item.id === editModeItemId);

      // Buat payload dengan semua field yang diharapkan server
      const payload = {
        planning_id: realizationId,
        date: tempItem.date || originalItem.date,
        information: tempItem.information || originalItem.information,
        bruto_amount:
          tempItem.bruto_amount != null
            ? typeof tempItem.bruto_amount === "string"
              ? parseInt(tempItem.bruto_amount.replace(/\./g, ""))
              : tempItem.bruto_amount
            : originalItem.bruto_amount,
        tax_amount:
          tempItem.tax_amount != null
            ? typeof tempItem.tax_amount === "string"
              ? parseInt(tempItem.tax_amount.replace(/\./g, ""))
              : tempItem.tax_amount
            : originalItem.tax_amount,
        netto_amount:
          tempItem.netto_amount != null
            ? typeof tempItem.netto_amount === "string"
              ? parseInt(tempItem.netto_amount.replace(/\./g, ""))
              : tempItem.netto_amount
            : originalItem.netto_amount,
        category: tempItem.category || originalItem.category,
        isAddition: 1,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/item/${editModeItemId}`, // Pastikan ID disertakan dalam URL
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          toast.success("Item updated successfully!");

          // Update item dalam state tanpa mengganti ID
          setItems(
            items.map((item) =>
              item.id === editModeItemId
                ? { ...item, ...response.data.planning }
                : item
            )
          );

          setEditModeItemId(null);
          setTempItem(null);
        }
      } catch (error) {
        console.error("Error updating item:", error);
        console.error(
          "Response data:",
          error.response?.data?.message || error.response?.data
        );
        toast.error(
          `Error: ${error.response?.data?.message || "Gagal memperbarui item."}`
        );
      } finally {
        setIsLoading(false); // Set isLoading ke false setelah update selesai
      }
    }
  };

  const handleCloseAddItemMode = () => {
    setTempItem(null);
    setIsAddItemMode(false);
    setEditModeItemId(null);
  };

  const removeItem = async (itemId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.success("Item deleted successfully!");
        setItems(items.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false); // Set isLoading ke false setelah delete selesai
    }
    d;
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
            <h1 className="text-2xl font-bold text-center mb-6">
              Edit Realization
            </h1>

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
                  {startDate
                    ? new Date(startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Tanggal tidak valid"}
                </h2>
              </div>
              <div className="text-left">
                <p className="text-gray-500 font-semibold">End Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">
                  {endDate
                    ? new Date(endDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Tanggal tidak valid"}
                </h2>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Items</h3>
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
                <table
                  className="w-full text-left border-separate"
                  style={{ borderSpacing: "0 8px" }}
                >
                  <thead>
                    <tr className="text-gray-700">
                      <th className="py-2 px-4">Tanggal</th>
                      <th className="py-2 px-4">Keterangan</th>
                      <th className="py-2 px-4">Nilai Bruto</th>
                      <th className="py-2 px-4">Nilai Pajak</th>
                      <th className="py-2 px-4">Nilai Netto</th>
                      <th className="py-2 px-4">Kategori</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && !isAddItemMode ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center text-gray-500 py-4"
                        >
                          No items added yet.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {items.map((item) => (
                          <tr
                            key={item.id}
                            className="text-gray-900 bg-white border rounded-lg shadow-md"
                          >
                            {editModeItemId === item.id ? (
                              <>
                                <td className="py-2 px-4">
                                  <input
                                    type="date"
                                    value={tempItem?.date || ""}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "date",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="text"
                                    value={tempItem?.information || ""}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "information",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="text"
                                    value={tempItem?.bruto_amount || ""}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "bruto_amount",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                    placeholder="Rp"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="text"
                                    value={tempItem?.tax_amount || ""}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "tax_amount",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                    placeholder="Rp"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="text"
                                    value={tempItem?.netto_amount || ""}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "netto_amount",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                    placeholder="Rp"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <select
                                    value={tempItem?.category || "internal"}
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "category",
                                        e.target.value
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                  >
                                    <option value="internal">Internal</option>
                                    <option value="eksternal">Eksternal</option>
                                    <option value="rka">RKA</option>
                                  </select>
                                </td>
                                <td className="py-2 px-4 text-right flex space-x-2">
                                  {/* Tombol Close (Silang) */}
                                  <button
                                    onClick={() => handleCloseAddItemMode()}
                                    className="bg-red-500 text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-md"
                                  >
                                    <FaTimes />
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="bg-green-500 text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-green-600 shadow-md"
                                  >
                                    <FaSave />
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-4">{item.date}</td>
                                <td className="py-2 px-4">
                                  {item.information}
                                </td>
                                <td className="py-2 px-4">
                                  Rp.{item.bruto_amount.toLocaleString("id-ID")}
                                </td>
                                <td className="py-2 px-4">
                                  Rp.{item.tax_amount.toLocaleString("id-ID")}
                                </td>
                                <td className="py-2 px-4">
                                  Rp.{item.netto_amount.toLocaleString("id-ID")}
                                </td>
                                <td className="py-2 px-4">{item.category}</td>
                                <td className="py-2 px-4 text-right flex space-x-2">
                                  {!isAddItemMode && (
                                    <>
                                      <button
                                        onClick={() => handleEditMode(item.id)}
                                        className="bg-[#F5C6C7] text-[#B4252A] rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-[#F1B0B1] shadow-md"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() => removeItem(item.id)}
                                        className="bg-[#B4252A] text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-[#8E1F22] shadow-md"
                                      >
                                        <FaTrash />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {isAddItemMode && (
                          <tr className="text-gray-900 bg-white border rounded-lg shadow-md">
                            <td className="py-2 px-4">
                              <input
                                type="date"
                                value={tempItem?.date || ""}
                                onChange={(e) =>
                                  handleTempItemChange("date", e.target.value)
                                }
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={tempItem?.information || ""}
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "information",
                                    e.target.value
                                  )
                                }
                                className="border rounded p-1 w-full"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={tempItem?.bruto_amount || ""}
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "bruto_amount",
                                    e.target.value
                                  )
                                }
                                className="border rounded p-1 w-full"
                                placeholder="Rp"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={tempItem?.tax_amount || ""}
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "tax_amount",
                                    e.target.value
                                  )
                                }
                                className="border rounded p-1 w-full"
                                placeholder="Rp"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={tempItem?.netto_amount || ""}
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "netto_amount",
                                    e.target.value
                                  )
                                }
                                className="border rounded p-1 w-full"
                                placeholder="Rp"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <select
                                value={tempItem?.category || "internal"}
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "category",
                                    e.target.value
                                  )
                                }
                                className="border rounded p-1 w-full"
                              >
                                <option value="internal">Internal</option>
                                <option value="eksternal">Eksternal</option>
                                <option value="rka">RKA</option>
                              </select>
                            </td>
                          </tr>
                        )}
                        <tr className="font-semibold text-red-600">
                          <td colSpan="2" className="py-2 px-4 text-left">
                            Total
                          </td>
                          <td className="py-2 px-4">
                            Rp.{totalBruto.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-4">
                            Rp.{totalTax.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-4">
                            Rp.{totalNetto.toLocaleString("id-ID")}
                          </td>
                          <td colSpan="2"></td>
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

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 ml-52">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default EditRealization;
