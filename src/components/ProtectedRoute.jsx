// Import necessary dependencies
// - React for building the component
// - Navigate from react-router-dom for handling redirections
import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute Component
// A wrapper component to restrict access to certain routes based on authentication status.
// If the user is not authenticated, they are redirected to the login page.
// Otherwise, the child components are rendered.
const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the children (protected content) if the user is authenticated
  return children;
};

export default ProtectedRoute;
