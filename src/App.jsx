// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Planning from "./pages/Planning";
import Export from "./pages/Export";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Halaman Home */}
        <Route path="/login" element={<Login />} /> {/* Halaman Login */}
        <Route path="/signIn" element={<SignIn />} /> {/* Halaman Sign In */}
        <Route path="/planning" element={<Planning />} />{/* Halaman Planning */}
        <Route path="/export" element={<Export />} /> {/* Halaman Export */}
      </Routes>
    </Router>
  );
};

export default App;
