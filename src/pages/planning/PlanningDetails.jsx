import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { useParams, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

const PlanningDetails = () => {
  const { id } = useParams();
  const [planning, setPlanning] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlanningById = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setPlanning(response.data.data);
      } else {
        console.error("Error: No data found.");
      }
    } catch (error) {
      console.error("Error fetching planning details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanningById();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10">
        <ReactLoading type="spin" color="#B4252A" height={50} width={50} />
      </div>
    );
  }

  if (!planning) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-bold text-red-500">
          No planning data found.
        </h2>
      </div>
    );
  }

  // Calculate totals for Bruto, Pajak, and Netto values
  const totalBruto = planning.item.reduce(
    (sum, item) => sum + item.bruto_amount,
    0
  );
  const totalPajak = planning.item.reduce(
    (sum, item) => sum + item.tax_amount,
    0
  );
  const totalNetto = planning.item.reduce(
    (sum, item) => sum + item.netto_amount,
    0
  );

  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        <Sidebar />
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            <span className="text-gray-600">Planning /</span> Planning Details
          </h1>

          {/* Information Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="text-left">
                <p className="text-gray-500 font-semibold">Kegiatan</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">{planning.title}</h2>
              </div>

              <div className="text-left">
                <p className="text-gray-500 font-semibold">Start Date</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">
                  {new Date(planning.start_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
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
                  {new Date(planning.end_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
              </div>
            </div>

            {/* Items Title */}
            <h3 className="text-xl font-bold text-center my-6">Items</h3>

            {/* Items Table */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-700">
                      <th className="py-2 px-4">Tanggal</th>
                      <th className="py-2 px-4">Keterangan</th>
                      <th className="py-2 px-4">Nilai Bruto</th>
                      <th className="py-2 px-4">Nilai Pajak</th>
                      <th className="py-2 px-4">Nilai Netto</th>
                      <th className="py-2 px-4">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planning.item.map((item) => (
                      <tr key={item.id} className="text-gray-900">
                        <td className="py-2 px-4 text-gray-600">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-2 px-4 text-gray-600">
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
                        <td className="py-2 px-4 text-gray-600">
                          {item.category} {/* Menampilkan Kategori */}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold text-red-600">
                      <td colSpan="2" className="py-2 px-4 text-left">
                        Total
                      </td>
                      <td className="py-2 px-4">
                        Rp.{totalBruto.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-4">
                        Rp.{totalPajak.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-4">
                        Rp.{totalNetto.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-[#B4252A] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#8E1F22]"
                onClick={() => navigate(-1)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanningDetails;
