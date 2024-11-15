import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Planning from "./pages/Planning";
import Export from "./pages/Export";
import Approval from "./pages/Approval";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlanningDetails from "./pages/PlanningDetails";
import Realization from "./pages/Realization";
import RealizationDetails from "./pages/RealizationDetails";
import Compare from "./pages/Compare";
import AddPlanning from "./pages/AddPlanning";
import CompareDetail from "./pages/CompareDetail";

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        limit={1}
        toastClassName="text-center mx-auto w-80"
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          path="/planning"
          element={
            <ProtectedRoute>
              <Planning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning/:id"
          element={
            <ProtectedRoute>
              <PlanningDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-planning"
          element={
            <ProtectedRoute>
              <AddPlanning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/realization"
          element={
            <ProtectedRoute>
              <Realization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/realization/:id"
          element={
            <ProtectedRoute>
              <RealizationDetails />
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
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <Compare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare/:id"
          element={
            <ProtectedRoute>
              <CompareDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approval"
          element={
            <ProtectedRoute>
              <Approval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
