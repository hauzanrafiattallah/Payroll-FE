import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Planning = () => {
  return (
    <>
      <Topbar />
      <div className="flex mt-20">
        {/* Sidebar */}
        <Sidebar />
        {/* Konten */}
        <div className="w-full lg:max-w-full p-8 mx-auto mt-2 lg:ml-72">
          <h1 className="mb-6 text-2xl font-bold text-center lg:text-left">
            Planning
          </h1>
        </div>
      </div>
    </>
  );
};

export default Planning;
