import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReactLoading from "react-loading";

const CompareDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("token");

  const fetchCompareData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning-compare/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.data.status) {
        setCompareData(response.data.data);
      } else {
        console.error("Error: No data found.");
      }
    } catch (error) {
      console.error("Error fetching compare details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompareData();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
        <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
      </div>
    );
  }

  if (!compareData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-bold text-red-500">
          No comparison data found.
        </h2>
      </div>
    );
  }

  const { planning, realization } = compareData;

  const formatCurrency = (value) =>
    `Rp.${parseInt(value).toLocaleString("id-ID")}`;

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-4 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-4 text-2xl font-bold text-center lg:text-left">
            Compare / {planning.title}
          </h1>

          <div className="grid grid-cols-6 gap-4 items-start">
            {/* Labels Column */}
            <div className="col-span-1 flex flex-col space-y-3 text-gray-700 font-semibold mt-16">
              <p>Start Date</p>
              <p>End Date</p>
              <p>Total Bruto</p>
              <p>Total Pajak</p>
              <p>Total Netto</p>
              <p>Items</p>
            </div>

            {/* Planning Section */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Planning</h2>
              <div className="text-gray-700 mb-6 space-y-3">
                <p>{new Date(planning.start_date).toLocaleDateString("id-ID")}</p>
                <p>{new Date(planning.end_date).toLocaleDateString("id-ID")}</p>
                <p>{formatCurrency(planning.item_sum_bruto_amount)}</p>
                <p>{formatCurrency(planning.item_sum_tax_amount)}</p>
                <p>{formatCurrency(planning.item_sum_netto_amount)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600 font-semibold">
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Keterangan</th>
                      <th className="py-2 px-3">Nilai Bruto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planning.item.map((item) => (
                      <tr key={item.id} className="text-gray-900">
                        <td className="py-3 px-3">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                        <td className="py-3 px-3">{item.information}</td>
                        <td className="py-3 px-3">{formatCurrency(item.bruto_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Realization Section */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Realization</h2>
              <div className="text-gray-700 mb-6 space-y-3">
                <p>{new Date(realization.start_date).toLocaleDateString("id-ID")}</p>
                <p>{new Date(realization.end_date).toLocaleDateString("id-ID")}</p>
                <p>{formatCurrency(realization.item_sum_bruto_amount)}</p>
                <p>{formatCurrency(realization.item_sum_tax_amount)}</p>
                <p>{formatCurrency(realization.item_sum_netto_amount)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600 font-semibold">
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Keterangan</th>
                      <th className="py-2 px-3">Nilai Bruto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realization.item.map((item) => (
                      <tr key={item.id} className="text-gray-900">
                        <td className="py-3 px-3">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                        <td className="py-3 px-3">{item.information}</td>
                        <td className="py-3 px-3">{formatCurrency(item.bruto_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#B4252A] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
              onClick={() => navigate(-1)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareDetail;
