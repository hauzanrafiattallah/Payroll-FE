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
        <div className="p-8 ml-16">
          <h1 className="text-2xl font-bold">Planning</h1>
        </div>
      </div>
    </>
  );
};

export default Planning;
