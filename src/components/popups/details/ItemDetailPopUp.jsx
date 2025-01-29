// Import necessary libraries
// - React for component management
// - Axios for API requests
import React, { useEffect, useState } from "react";
import axios from "axios";

// ItemDetailPopUp Component
// A modal dialog that displays item details related to a specific planning ID.
// Includes functionality to fetch data from the API, calculate totals, and format currency.
const ItemDetailPopUp = ({ planningId, onClose }) => {
  // State variables
  const [items, setItems] = useState([]); // Stores the list of items
  const [totalBruto, setTotalBruto] = useState(0); // Total bruto amount
  const [totalPajak, setTotalPajak] = useState(0); // Total tax amount
  const [totalNetto, setTotalNetto] = useState(0); // Total netto amount
  const [loading, setLoading] = useState(true); // Loading state

  // Retrieve the auth token from localStorage for API requests
  const authToken = localStorage.getItem("token");

  // Effect to fetch item details when the planning ID changes
  useEffect(() => {
    fetchItems();
  }, [planningId]);

  // Function to fetch item details from the API
  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning/${planningId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include auth token in the headers
          },
        }
      );

      // Check the API response and update state if successful
      if (response.data.status) {
        const itemData = response.data.data.item;
        setItems(itemData); // Set items data
        setTotalBruto(
          itemData.reduce((acc, item) => acc + parseInt(item.bruto_amount), 0)
        ); // Calculate total bruto amount
        setTotalPajak(
          itemData.reduce((acc, item) => acc + parseInt(item.tax_amount), 0)
        ); // Calculate total tax amount
        setTotalNetto(
          itemData.reduce((acc, item) => acc + parseInt(item.netto_amount), 0)
        ); // Calculate total netto amount
      }
    } catch (error) {
      console.error("Error fetching item details:", error); // Log error for debugging
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  // Function to format currency values to Indonesian Rupiah
  const formatCurrency = (value) =>
    `Rp.${parseInt(value).toLocaleString("id-ID")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container */}
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Detail Items</h2>

        {/* Loading state */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Items table */}
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-700 font-semibold">
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Keterangan</th>
                  <th className="py-2 px-4">Nilai Bruto</th>
                  <th className="py-2 px-4">Nilai Pajak</th>
                  <th className="py-2 px-4">Nilai Netto</th>
                  <th className="py-2 px-4">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through items to display each row */}
                {items.map((item) => (
                  <tr key={item.id} className="text-gray-900">
                    <td className="py-2 px-4">
                      {new Date(item.date).toLocaleDateString("id-ID")}{" "}
                      {/* Format date */}
                    </td>
                    <td className="py-2 px-4">{item.information}</td>
                    <td className="py-2 px-4">
                      {formatCurrency(item.bruto_amount)}
                    </td>
                    <td className="py-2 px-4">
                      {formatCurrency(item.tax_amount)}
                    </td>
                    <td className="py-2 px-4">
                      {formatCurrency(item.netto_amount)}
                    </td>
                    <td className="py-2 px-4">{item.category}</td>
                  </tr>
                ))}

                {/* Total row */}
                <tr className="font-semibold text-red-600">
                  <td colSpan="2" className="py-2 px-4 text-left">
                    Total
                  </td>
                  <td className="py-2 px-4">{formatCurrency(totalBruto)}</td>
                  <td className="py-2 px-4">{formatCurrency(totalPajak)}</td>
                  <td className="py-2 px-4">{formatCurrency(totalNetto)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#B4252A] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#8E1F22]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPopUp;
