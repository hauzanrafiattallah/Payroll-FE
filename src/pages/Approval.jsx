import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { LiaTimesCircle } from "react-icons/lia";

const Approval = () => {
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    fetchApprovalData(currentPage);
  }, [currentPage]);

  const fetchApprovalData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pending?page=${page}&limit=2`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 2;

    if (currentPage > maxPagesToShow + 1) {
      pageNumbers.push(
        <button
          key={1}
          className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
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
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
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

          {loading ? (
            renderSkeleton()
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
                        Rp. {item.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        Rp. {item.tax_amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${
                            item.document_evidence
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Document
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a
                          href={`${import.meta.env.VITE_FILE_BASE_URL}/${
                            item.image_evidence
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Image
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center flex items-center justify-center space-x-4">
                        <LiaTimesCircle
                          className="text-gray-500 cursor-pointer hover:text-gray-700"
                          size={31}
                        />
                        <FaCheckCircle
                          className="text-[#B4252A] cursor-pointer hover:text-red-600"
                          size={25}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-md">
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {renderPagination()}
              <button
                className="px-3 py-1 text-gray-600 bg-white rounded-full hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
