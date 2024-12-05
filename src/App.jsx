import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Planning from "./pages/planning/Planning";
import PlanningDetails from "./pages/planning/PlanningDetails";
import AddPlanning from "./pages/planning/AddPlanning";
import Approval from "./pages/approval/Approval";
import Realization from "./pages/realization/Realization";
import RealizationDetails from "./pages/realization/RealizationDetails";
import EditRealization from "./pages/realization/EditRealization";
import Compare from "./pages/compare/Compare";
import CompareDetail from "./pages/compare/CompareDetail";
import Export from "./pages/export/Export";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/error/NotFound";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// Utilities
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          path="/addPlanning/:id"
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
          path="/realization/edit/:id"
          element={
            <ProtectedRoute>
              <EditRealization />
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
