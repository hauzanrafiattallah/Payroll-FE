import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

const EditRealization = () => {
  const { id: realizationId } = useParams();
  const navigate = useNavigate();
  const deletePopupRef = useRef(null);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("Realization Title");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempItem, setTempItem] = useState(null);
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [editModeItemId, setEditModeItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [oldDocumentEvidence, setOldDocumentEvidence] = useState(null);
  const [oldImageEvidence, setOldImageEvidence] = useState(null);
  const totalBruto = items.reduce((sum, item) => sum + item.bruto_amount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax_amount, 0);
  const totalNetto = items.reduce((sum, item) => sum + item.netto_amount, 0);

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

  const addItem = () => {
    setTempItem({
      date: "",
      information: "",
      bruto_amount: 0,
      tax_amount: 0,
      netto_amount: 0,
      category: "internal",
      document_evidence: "",
      image_evidence: "",
      isAddition: 1,
    });
    setIsAddItemMode(true);
    setEditModeItemId(null);
  };

  const formatCurrency = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Menyimpan file lama ketika item dimuat untuk pertama kali (dalam edit mode)
  useEffect(() => {
    if (editModeItemId) {
      const itemToEdit = items.find((item) => item.id === editModeItemId);
      if (itemToEdit) {
        setTempItem({
          ...itemToEdit,
          // Menyimpan file lama untuk dikirimkan jika tidak ada perubahan
          document_evidence:
            itemToEdit.document_evidence || oldDocumentEvidence,
          image_evidence: itemToEdit.image_evidence || oldImageEvidence,
        });
        setOldDocumentEvidence(itemToEdit.document_evidence);
        setOldImageEvidence(itemToEdit.image_evidence);
      }
    }
  }, [editModeItemId, items, oldDocumentEvidence, oldImageEvidence]);

  const handleTempItemChange = (field, value) => {
    if (field === "document_evidence" || field === "image_evidence") {
      // Jika file diubah, simpan file baru
      setTempItem((prev) => ({ ...prev, [field]: value }));
    } else {
      // Format nilai untuk amount
      const formattedValue =
        field === "bruto_amount" ||
        field === "tax_amount" ||
        field === "netto_amount"
          ? formatCurrency(value)
          : value;
      setTempItem((prev) => ({ ...prev, [field]: formattedValue }));
    }
  };

  const handleSave = async () => {
    // Validasi apakah file sudah diisi dan tipe file valid
    if (!tempItem.document_evidence || !tempItem.image_evidence) {
      toast.error("Dokumen bukti dan gambar bukti harus diisi.");
      return;
    }

    // Validasi jenis file untuk laporan (Excel/PDF) dan bukti (JPG, JPEG, PNG)
    const validDocumentTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (
      tempItem.document_evidence &&
      !validDocumentTypes.includes(tempItem.document_evidence.type)
    ) {
      toast.error(
        "Laporan harus berupa file Excel (.xls, .xlsx) atau PDF (.pdf)."
      );
      return;
    }

    if (
      tempItem.image_evidence &&
      !validImageTypes.includes(tempItem.image_evidence.type)
    ) {
      toast.error("Bukti harus berupa file gambar (JPG, JPEG, PNG).");
      return;
    }

    if (tempItem) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("planning_id", realizationId);
        formData.append("date", tempItem.date);
        formData.append("information", tempItem.information);
        formData.append(
          "bruto_amount",
          parseInt(tempItem.bruto_amount.replace(/\./g, "")) || 0
        );
        formData.append(
          "tax_amount",
          parseInt(tempItem.tax_amount.replace(/\./g, "")) || 0
        );
        formData.append(
          "netto_amount",
          parseInt(tempItem.netto_amount.replace(/\./g, "")) || 0
        );
        formData.append("category", tempItem.category);
        formData.append("isAddition", 1);

        // Kirim file jika ada
        if (tempItem.document_evidence) {
          formData.append("document_evidence", tempItem.document_evidence);
        }
        if (tempItem.image_evidence) {
          formData.append("image_evidence", tempItem.image_evidence);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/item`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          toast.success("Item berhasil ditambahkan!");
          setItems([...items, response.data.planning]);
        }
      } catch (error) {
        console.error("Error adding item:", error);
        toast.error("Gagal menambahkan item. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
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
    // Validasi apakah file sudah diisi dan tipe file valid
    if (!tempItem.document_evidence || !tempItem.image_evidence) {
      toast.error("Dokumen bukti dan gambar bukti harus diisi.");
      return;
    }

    // Validasi jenis file untuk laporan (Excel/PDF) dan bukti (JPG, JPEG, PNG)
    const validDocumentTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (
      tempItem.document_evidence &&
      !validDocumentTypes.includes(tempItem.document_evidence.type)
    ) {
      toast.error(
        "Laporan harus berupa file Excel (.xls, .xlsx) atau PDF (.pdf)."
      );
      return;
    }

    if (
      tempItem.image_evidence &&
      !validImageTypes.includes(tempItem.image_evidence.type)
    ) {
      toast.error("Bukti harus berupa file gambar (JPG, JPEG, PNG).");
      return;
    }

    if (tempItem && editModeItemId) {
      setIsLoading(true);
      const originalItem = items.find((item) => item.id === editModeItemId);

      // Menyusun payload untuk update item
      const payload = new FormData();
      payload.append("planning_id", realizationId);
      payload.append("date", tempItem.date || originalItem.date);
      payload.append(
        "information",
        tempItem.information || originalItem.information
      );
      payload.append(
        "bruto_amount",
        tempItem.bruto_amount != null
          ? typeof tempItem.bruto_amount === "string"
            ? parseInt(tempItem.bruto_amount.replace(/\./g, ""))
            : tempItem.bruto_amount
          : originalItem.bruto_amount
      );
      payload.append(
        "tax_amount",
        tempItem.tax_amount != null
          ? typeof tempItem.tax_amount === "string"
            ? parseInt(tempItem.tax_amount.replace(/\./g, ""))
            : tempItem.tax_amount
          : originalItem.tax_amount
      );
      payload.append(
        "netto_amount",
        tempItem.netto_amount != null
          ? typeof tempItem.netto_amount === "string"
            ? parseInt(tempItem.netto_amount.replace(/\./g, ""))
            : tempItem.netto_amount
          : originalItem.netto_amount
      );
      payload.append("category", tempItem.category || originalItem.category);
      payload.append("isAddition", 1);

      // Kirim file lama jika tidak ada perubahan, atau file baru jika diubah
      if (tempItem.document_evidence) {
        payload.append("document_evidence", tempItem.document_evidence);
      } else if (oldDocumentEvidence) {
        payload.append("document_evidence", oldDocumentEvidence);
      }

      if (tempItem.image_evidence) {
        payload.append("image_evidence", tempItem.image_evidence);
      } else if (oldImageEvidence) {
        payload.append("image_evidence", oldImageEvidence);
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/item/${editModeItemId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          toast.success("Item berhasil diperbarui!");
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
        toast.error("Gagal memperbarui item. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseAddItemMode = () => {
    setTempItem(null);
    setIsAddItemMode(false);
    setEditModeItemId(null);
  };

  const openDeletePopup = (itemId) => {
    setItemToDelete(itemId);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setItemToDelete(null);
    setIsDeletePopupOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      setIsLoadingDelete(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/item/${itemToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          toast.success("Item deleted successfully!");
          setItems(items.filter((item) => item.id !== itemToDelete));
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item. Please try again.");
      } finally {
        setIsLoadingDelete(false);
        closeDeletePopup();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDeletePopupOpen &&
        deletePopupRef.current &&
        !deletePopupRef.current.contains(event.target)
      ) {
        closeDeletePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDeletePopupOpen]);

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
                      <th className="py-2 px-4">Laporan</th>
                      <th className="py-2 px-4">Bukti</th>
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
                                {/* Kolom edit mode */}
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
                                {/* Kolom Laporan */}
                                <td className="py-2 px-4">
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "document_evidence",
                                        e.target.files[0]
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                  />
                                </td>
                                {/* Kolom Bukti */}
                                <td className="py-2 px-4">
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleTempItemChange(
                                        "image_evidence",
                                        e.target.files[0]
                                      )
                                    }
                                    className="border rounded p-1 w-full"
                                  />
                                </td>
                                <td className="py-2 px-4 text-right flex space-x-2">
                                  <button
                                    onClick={() => handleCloseAddItemMode()}
                                    className="bg-red-600 text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-red-700 shadow-md"
                                  >
                                    <FaTimes />
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="bg-green-600 text-white rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-green-700 shadow-md"
                                  >
                                    <FaSave />
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                {/* Tampilan read-only */}
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

                                {/* Kolom Laporan */}
                                <td className="py-2 px-4">
                                  {item.document_evidence ? (
                                    <a
                                      href={`${
                                        import.meta.env.VITE_FILE_BASE_URL
                                      }${item.document_evidence}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className=" hover:underline"
                                    >
                                      Lihat Laporan
                                    </a>
                                  ) : (
                                    <span className="text-gray-500">
                                      Tidak Ada
                                    </span>
                                  )}
                                </td>

                                {/* Kolom Bukti */}
                                <td className="py-2 px-4">
                                  {item.image_evidence ? (
                                    <a
                                      href={`${
                                        import.meta.env.VITE_FILE_BASE_URL
                                      }${item.image_evidence}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className=" hover:underline"
                                    >
                                      Lihat Bukti
                                    </a>
                                  ) : (
                                    <span className="text-gray-500">
                                      Tidak Ada
                                    </span>
                                  )}
                                </td>

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
                                        onClick={() => openDeletePopup(item.id)}
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
                            {/* Kolom Dokumen */}
                            <td className="py-2 px-4">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "document_evidence",
                                    e.target.files[0]
                                  )
                                }
                                className="border rounded p-1 w-full mt-1"
                              />
                            </td>

                            {/* Kolom Gambar */}
                            <td className="py-2 px-4">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleTempItemChange(
                                    "image_evidence",
                                    e.target.files[0]
                                  )
                                }
                                className="border rounded p-1 w-full mt-1"
                              />
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

      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={deletePopupRef}
            className="bg-white p-8 rounded-lg shadow-lg popup-content w-[90%] max-w-md min-h-[200px]"
          >
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-xl font-bold">Delete Confirmation</h2>
              <p className="text-center text-gray-500">
                Are you sure you want to delete this item?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32"
                  onClick={closeDeletePopup}
                  disabled={isLoadingDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32"
                  onClick={handleConfirmDelete}
                  disabled={isLoadingDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 ml-52">
          <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default EditRealization;
