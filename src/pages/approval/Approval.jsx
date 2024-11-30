import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaCheckCircle } from "react-icons/fa";
import ReactLoading from "react-loading";
import ItemDetailPopUp from "../../components/popups/details/ItemDetailPopUp";
import { LiaTimesCircle } from "react-icons/lia";

const Approval = () => {
  const [activeTab, setActiveTab] = useState("planning");
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlanningId, setSelectedPlanningId] = useState(null);
  const authToken = localStorage.getItem("token");
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isDeclinePopupOpen, setIsDeclinePopupOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);

  useEffect(() => {
    fetchApprovalData(currentPage);
  }, [currentPage, activeTab]);

  const fetchApprovalData = async (page = 1) => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "planning"
          ? `${
              import.meta.env.VITE_API_URL
            }/planning-approve?page=${page}&limit=5`
          : `${import.meta.env.VITE_API_URL}/pending?page=${page}&limit=5`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      setApprovalData(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
    } catch (error) {
      console.error("Error fetching approval data:", error);
      toast.error("Failed to fetch approval data.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (loading) return; // Jangan ganti tab jika sedang loading
    setActiveTab(tab);
    setApprovalData([]); // Reset data sebelumnya
    setCurrentPage(1);
  };

  const handleApprove = async (id) => {
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "planning"
          ? `${import.meta.env.VITE_API_URL}/planning/update-status/${id}`
          : `${import.meta.env.VITE_API_URL}/finance/${id}`;

      const response = await axios.post(
        endpoint,
        { status: "approve" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Item approved successfully!");
        fetchApprovalData(currentPage);
        closeApprovePopup(); // Tambahkan ini untuk menutup pop-up setelah berhasil
      }
    } catch (error) {
      console.error("Error approving item:", error);
      toast.error("Failed to approve item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "planning"
          ? `${import.meta.env.VITE_API_URL}/planning/update-status/${id}`
          : `${import.meta.env.VITE_API_URL}/finance/${id}`;

      const response = await axios.post(
        endpoint,
        { status: "decline" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Item rejected successfully!");
        fetchApprovalData(currentPage);
        closeDeclinePopup(); // Tambahkan ini untuk menutup pop-up setelah berhasil
      }
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast.error("Failed to reject item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (planningId) => {
    setSelectedPlanningId(planningId);
    setShowPopup(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      fetchApprovalData(page);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 1;

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
          disabled={isLoading || loading}
        >
          1
        </button>
      );
      pageNumbers.push(<span key="dots-before">...</span>);
    }

    for (
      let i = Math.max(1, currentPage - maxPagesToShow);
      i <= Math.min(lastPage, currentPage + maxPagesToShow);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-full ${
            i === currentPage
              ? "text-white bg-[#B4252A]"
              : "text-gray-600 bg-white hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
          disabled={isLoading || loading}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage - maxPagesToShow) {
      pageNumbers.push(<span key="dots-after">...</span>);
      pageNumbers.push(
        <button
          key={lastPage}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(lastPage)}
          disabled={isLoading || loading}
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  const openApprovePopup = (id) => {
    setSelectedApprovalId(id);
    setIsApprovePopupOpen(true);
  };

  const closeApprovePopup = () => {
    setSelectedApprovalId(null);
    setIsApprovePopupOpen(false);
  };

  const openDeclinePopup = (id) => {
    setSelectedApprovalId(id);
    setIsDeclinePopupOpen(true);
  };

  const closeDeclinePopup = () => {
    setSelectedApprovalId(null);
    setIsDeclinePopupOpen(false);
  };

  const renderSkeleton = () => (
    <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-center">
              <Skeleton width={100} height={20} />
            </th>
            <th className="px-4 py-2 text-center">
              <Skeleton width={100} height={20} />
            </th>
            <th className="px-4 py-2 text-center">
              <Skeleton width={100} height={20} />
            </th>
            <th className="px-4 py-2 text-center">
              <Skeleton width={100} height={20} />
            </th>
            <th className="px-4 py-2 text-center">
              <Skeleton width={100} height={20} />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 text-center">
                <Skeleton width={50} height={20} />
              </td>
              <td className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </td>
              <td className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </td>
              <td className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </td>
              <td className="px-4 py-2 text-center">
                <Skeleton width={100} height={20} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Approval
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-end space-x-2 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "planning"
                  ? "bg-[#B4252A] text-white"
                  : "bg-[#F3F3F3] text-black"
              }`}
              disabled={loading}
              onClick={() => handleTabClick("planning")}
            >
              Planning
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "transaction"
                  ? "bg-[#B4252A] text-white"
                  : "bg-[#F3F3F3] text-black"
              }`}
              disabled={loading}
              onClick={() => handleTabClick("transaction")}
            >
              Transaction
            </button>
          </div>

          {/* Content */}
          {loading ? (
            renderSkeleton()
          ) : activeTab === "planning" ? (
            <div className="p-6 mb-6 overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="w-full text-left table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-center">Planning</th>
                    <th className="px-4 py-2 text-center">Start</th>
                    <th className="px-4 py-2 text-center">End</th>
                    <th className="px-4 py-2 text-center">Item</th>
                    <th className="px-4 py-2 text-center">Total Bruto</th>
                    <th className="px-4 py-2 text-center">Total Pajak</th>
                    <th className="px-4 py-2 text-center">Total Netto</th>
                    <th className="px-4 py-2 text-center">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalData.map((plan) => (
                    <tr key={plan.id} className="border-b">
                      <td className="px-4 py-2 text-center">{plan.title}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(plan.start_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {new Date(plan.end_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleItemClick(plan.id)}
                          className="hover:underline"
                        >
                          Item Details
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {parseInt(
                          plan.item_sum_bruto_amount || 0
                        ).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {parseInt(plan.item_sum_tax_amount || 0).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {parseInt(
                          plan.item_sum_netto_amount || 0
                        ).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                        {/* Tombol Reject */}
                        <button
                          onClick={() => openDeclinePopup(plan.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <LiaTimesCircle size={36} />
                        </button>
                        {/* Tombol Approve */}
                        <button
                          onClick={() => openApprovePopup(plan.id)}
                          className="text-[#B4252A] hover:text-red-600"
                        >
                          <FaCheckCircle size={30} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 mb-6 overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="w-full text-left table-auto min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-center">Kegiatan</th>
                    <th className="px-4 py-2 text-center">Tipe</th>
                    <th className="px-4 py-2 text-center">Tanggal</th>
                    <th className="px-4 py-2 text-center">Jumlah</th>
                    <th className="px-4 py-2 text-center">Pajak</th>
                    <th className="px-4 py-2 text-center">Upload</th>
                    <th className="px-4 py-2 text-center">Evidence</th>
                    <th className="px-4 py-2 text-center">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2 text-center">
                        {item.activity_name}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`font-semibold ${
                            item.transaction_type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.transaction_type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {item.amount
                          ? item.amount.toLocaleString("id-ID")
                          : "0"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {item.tax_amount
                          ? item.tax_amount.toLocaleString("id-ID")
                          : "0"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${
                            item.document_evidence
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.document_evidence
                            ? `Laporan.${item.document_evidence
                                .split(".")
                                .pop()}`
                            : "No Document"}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${
                            item.image_evidence
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.image_evidence
                            ? `Bukti.${item.image_evidence.split(".").pop()}`
                            : "No Evidence"}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openDeclinePopup(item.id)} // Pastikan `item.id` benar
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <LiaTimesCircle size={36} />
                        </button>
                        <button
                          onClick={() => openApprovePopup(item.id)} // Pastikan `item.id` benar
                          className="text-[#B4252A] hover:text-red-600"
                        >
                          <FaCheckCircle size={30} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isApprovePopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg popup-content w-[90%] max-w-md min-h-[200px]">
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-xl font-bold">
                    {activeTab === "planning"
                      ? "Approve Planning Confirmation"
                      : "Approve Transaction Confirmation"}
                  </h2>
                  <p className="text-center text-gray-500">
                    Apakah anda yakin menyetujui{" "}
                    {activeTab === "planning"
                      ? "planning ini"
                      : "transaction ini"}
                    ?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32"
                      onClick={closeApprovePopup}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32"
                      onClick={() => handleApprove(selectedApprovalId)}
                      disabled={isLoading}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isDeclinePopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg popup-content w-[90%] max-w-md min-h-[200px]">
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-xl font-bold">
                    {activeTab === "planning"
                      ? "Decline Planning Confirmation"
                      : "Decline Transaction Confirmation"}
                  </h2>
                  <p className="text-center text-gray-500">
                    Apakah anda yakin menolak{" "}
                    {activeTab === "planning"
                      ? "planning ini"
                      : "transaction ini"}
                    ?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="px-6 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 w-32"
                      onClick={closeDeclinePopup}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 text-white bg-[#B4252A] rounded-md hover:bg-[#8E1F22] w-32"
                      onClick={() => handleReject(selectedApprovalId)}
                      disabled={isLoading}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overlay Loading */}
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

          {/* Pagination */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading || loading}
              >
                &lt;
              </button>
              {renderPagination()}
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage || isLoading || loading}
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Item Detail Popup */}
          {showPopup && (
            <ItemDetailPopUp
              planningId={selectedPlanningId}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Approval;
