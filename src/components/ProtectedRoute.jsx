import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Cek apakah user sudah login dengan pengecekan nilai

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect ke halaman login jika belum login
  }

  return children; // Tampilkan halaman jika sudah login
};

export default ProtectedRoute;
