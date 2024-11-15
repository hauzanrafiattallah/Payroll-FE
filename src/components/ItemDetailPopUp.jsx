import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemDetailPopUp = ({ planningId, onClose }) => {
  const [items, setItems] = useState([]);
  const [totalBruto, setTotalBruto] = useState(0);
  const [totalPajak, setTotalPajak] = useState(0);
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem('token');
  
  useEffect(() => {
    fetchItems();
  }, [planningId]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/planning/${planningId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (response.data.status) {
        const itemData = response.data.data.item;
        setItems(itemData);
        setTotalBruto(
          itemData.reduce((acc, item) => acc + parseInt(item.bruto_amount), 0)
        );
        setTotalPajak(
          itemData.reduce((acc, item) => acc + parseInt(item.tax_amount), 0)
        );
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    `Rp.${parseInt(value).toLocaleString('id-ID')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Detail Items</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-700 font-semibold">
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Keterangan</th>
                  <th className="py-2 px-4">Nilai Bruto</th>
                  <th className="py-2 px-4">Nilai Pajak</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="text-gray-900">
                    <td className="py-2 px-4">
                      {new Date(item.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-2 px-4">{item.information}</td>
                    <td className="py-2 px-4">{formatCurrency(item.bruto_amount)}</td>
                    <td className="py-2 px-4">{formatCurrency(item.tax_amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-red-600">
                  <td colSpan="2" className="py-2 px-4 text-left">
                    Total
                  </td>
                  <td className="py-2 px-4">{formatCurrency(totalBruto)}</td>
                  <td className="py-2 px-4">{formatCurrency(totalPajak)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

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
