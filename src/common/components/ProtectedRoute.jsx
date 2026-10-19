import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, isAuthenticated, loading, profileStatus } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/company")) {
      return (
        <Navigate to="/company/login" state={{ from: location }} replace />
      );
    } else if (location.pathname.startsWith("/agent")) {
      return <Navigate to="/agent/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/worker")) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // else {
    //   return <Navigate to="/login" state={{ from: location }} replace />;
    // }
  }

  // if (role === "worker" && profileStatus === "pending") {
  //   // Avoid redirect loop if already on the register page
  //   if (location.pathname !== "/worker/register") {
  //     return <Navigate to="/worker/register" replace />;
  //   }
  // }

  if (role === "agent" && profileStatus === "pending") {
    // Avoid redirect loop if already on the register page
    if (location.pathname !== "/agent/register") {
      return <Navigate to="/agent/register" replace />;
    }
  }
  // if (role === "company" && profileStatus === "pending") {
  //   // Avoid redirect loop if already on the register page
  //   if (location.pathname !== "/company/register") {
  //     return <Navigate to="/company/register" replace />;
  //   }
  // }

  // NEW: Check if user is trying to access wrong module
  const currentModule = location.pathname.split("/")[1] || ""; // 'admin', 'company', or ''

  // Map roles to their expected modules
  const roleModuleMap = {
    admin: "admin",
    admin_staff: "admin",
    company: "company",
    worker: "worker",
    agent: "agent",
  };

  // Get expected module for user's role
  const expectedModule = roleModuleMap[role] || "";

  // If user is in wrong module, redirect them
  if (currentModule !== expectedModule) {
    if (role === "admin" || role === "admin_staff") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "company") {
      return <Navigate to="/company/dashboard" replace />;
    } else if (role === "agent") {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Original role-based check (optional, but keep for additional security)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "admin" || role === "admin_staff") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "company") {
      return <Navigate to="/company/dashboard" replace />;
    } else if (role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    } else if (role === "agent") {
      return <Navigate to="/agent/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
