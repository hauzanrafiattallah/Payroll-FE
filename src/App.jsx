import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Planning from "./pages/Planning";
import Export from "./pages/Export";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "./pages/NotFound"; // Halaman NotFound untuk rute tidak dikenal

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Halaman Login */}
        <Route path="/register" element={<Register />} /> {/* Halaman Register */}
        {/* Rute yang dilindungi */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning"
          element={
            <ProtectedRoute>
              <Planning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/export"
          element={
            <ProtectedRoute>
              <Export />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* Halaman jika rute tidak ditemukan */}
      </Routes>
    </Router>
  );
};

export default App;
