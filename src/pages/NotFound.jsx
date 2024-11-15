import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-white">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center">
        <div className="text-[#B4252A] text-6xl font-bold">404</div>
        <h1 className="text-2xl font-semibold mt-4">Page Not Found</h1>
        <p className="text-gray-600 mt-2">
          The page you are looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-[#B4252A] text-white py-2 px-4 rounded hover:bg-red-800"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
