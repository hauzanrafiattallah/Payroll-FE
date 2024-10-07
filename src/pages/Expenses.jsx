import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Expenses = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col mt-20 lg:flex-row">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto mt-2 lg:max-w-full lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Expenses
          </h1>

          {/* Tabel */}
          <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center">No Agenda</th>
                  <th className="px-4 py-2 text-center">Kegiatan</th>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">Pengeluaran</th>
                  <th className="px-4 py-2 text-center">Pajak</th>
                  <th className="px-4 py-2 text-center">Upload</th>
                  <th className="px-4 py-2 text-center">Evidence</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      Conference
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      03 Okt 2024
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      Rp. 600.000.000
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      Rp. 60.000.000
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <a href="#">Laporan.Pdf</a>
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <a href="#">Bukti.Pdf</a>
                    </td>
                    <td className="px-4 py-2 text-center text-green-600">
                      Approved
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expenses;
