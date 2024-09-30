import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full p-8 mx-auto max-w-7xl">
          {" "}
          {/* Tambahkan max-w dan margin */}
          <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
          {/* Section untuk Balance, Income, dan Expenses */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Balance */}
            <div className="p-6 bg-[#B4252A] text-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Balance</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Income */}
            <div className="p-6 text-black bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Monthly Income</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
            {/* Monthly Expenses */}
            <div className="p-6 text-black bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Monthly Expenses</h2>
              <p className="text-2xl font-bold">Rp. 60.000.000</p>
            </div>
          </div>
          {/* Section untuk History */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">History</h2>
            <div className="flex space-x-4">
              <button className="bg-[#B4252A] text-white px-4 py-2 rounded-lg">
                All
              </button>
              <button className="px-4 py-2 text-black bg-gray-100 rounded-lg">
                Income
              </button>
              <button className="px-4 py-2 text-black bg-gray-100 rounded-lg">
                Expenses
              </button>
            </div>
          </div>
          <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-2 w-1/4">Name</th>
                  <th className="py-2 w-1/4">Amount</th>
                  <th className="py-2 w-1/4">Type</th>
                  <th className="py-2 w-1/4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Pemasukan1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">Income</td>
                  <td className="py-2">23 Sept 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Pemasukan1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">Income</td>
                  <td className="py-2">23 Sept 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Expenses1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">Expenses</td>
                  <td className="py-2">23 Sept 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Section untuk Approval List */}
          <h2 className="mb-4 text-xl font-bold">Approval List</h2>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-2 w-1/4">Name</th>
                  <th className="py-2 w-1/4">Amount</th>
                  <th className="py-2 w-1/4">Date</th>
                  <th className="py-2 w-1/4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Pemasukan1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">23 Sept 2024</td>
                  <td className="py-2 text-green-600 ">Approved</td>{" "}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Pemasukan1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">23 Sept 2024</td>
                  <td className="py-2 text-red-600">Denied</td>{" "}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Pemasukan1</td>
                  <td className="py-2">Rp. 60.000.000</td>
                  <td className="py-2">23 Sept 2024</td>
                  <td className="py-2 text-green-600">Approved</td>{" "}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
