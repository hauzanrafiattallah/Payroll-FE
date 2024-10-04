// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Planning from "./pages/Planning";
import Export from "./pages/Export";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Halaman Home */}
        <Route path="/login" element={<Login />} /> {/* Halaman Login */}
        <Route path="/register" element={<Register />} /> {/* Halaman Sign In */}
        <Route path="/planning" element={<Planning />} />{/* Halaman Planning */}
        <Route path="/export" element={<Export />} /> {/* Halaman Export */}
        <Route path="/income" element={<Income />} /> {/* Halaman Export */}
        <Route path="/expenses" element={<Expenses />} /> {/* Halaman Export */}
      </Routes>
    </Router>
  );
};

export default App;
