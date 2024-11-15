import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Approval = () => {
  const [activeTab, setActiveTab] = useState("planning");
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    fetchApprovalData(currentPage);
  }, [currentPage, activeTab]);

  const fetchApprovalData = async (page) => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "planning"
          ? `${import.meta.env.VITE_API_URL}/planning-approve?page=${page}`
          : `${import.meta.env.VITE_API_URL}/pending?page=${page}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });
      setApprovalData(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approval data:", error);
      toast.error("Failed to fetch approval data.");
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleApprove = async (id) => {
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
        fetchApprovalData(currentPage); // Refresh the list
      }
    } catch (error) {
      console.error("Error approving item:", error);
      toast.error("Failed to approve item.");
    }
  };

  const handleReject = async (id) => {
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
        fetchApprovalData(currentPage); // Refresh the list
      }
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast.error("Failed to reject item.");
    }
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
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => handleTabClick("planning")}
            >
              Planning
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "transaction"
                  ? "bg-[#B4252A] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
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
                    <th className="px-4 py-2 text-center">Item Count</th>
                    <th className="px-4 py-2 text-center">Total Bruto</th>
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
                        {plan.item_count}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp.{" "}
                        {parseInt(plan.item_sum_bruto_amount || 0).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleReject(plan.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimesCircle size={25} />
                        </button>
                        <button
                          onClick={() => handleApprove(plan.id)}
                          className="text-[#B4252A] hover:text-red-600"
                        >
                          <FaCheckCircle size={25} />
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
                    <th className="px-4 py-2 text-center">Activity</th>
                    <th className="px-4 py-2 text-center">Type</th>
                    <th className="px-4 py-2 text-center">Date</th>
                    <th className="px-4 py-2 text-center">Amount</th>
                    <th className="px-4 py-2 text-center">Tax</th>
                    <th className="px-4 py-2 text-center">Document</th>
                    <th className="px-4 py-2 text-center">Image</th>
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
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${item.document_evidence}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Document
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${item.image_evidence}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Image
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleReject(item.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimesCircle size={25} />
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="text-[#B4252A] hover:text-red-600"
                        >
                          <FaCheckCircle size={25} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Approval;
