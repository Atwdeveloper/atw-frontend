import React from "react";
import { Routes, Route } from "react-router-dom";
import CompanyLogin from "../pages/CompanyLogin";
import CompanyRegister from "../pages/CompanyRegister";
import CompanyAccountActivation from "../pages/CompanyAccountActivation";
import CompanyRegisterSuccess from "../pages/CompanyRegisterSuccess";
import CompanyTermsAcceptance from "../pages/CompanyTermsAcceptance";
import CompanyForgotPassword from "../pages/CompanyForgotPassword";
import Dashboard from "../pages/dashboard/DashBoard";
// import Dashboard from "../pages/Dashboard";
// import ManageStaff from "../pages/ManageStaff";
import ProtectedRoute from "../../../common/components/ProtectedRoute";
import CompanyLayout from "../layout/CompanyLayout";
import StaffListing from "../pages/staff/StaffListing";
import AddStaff from "../pages/staff/AddStaff";
import EditStaff from "../pages/staff/EditStaff";
import ReportsDashboard from "../pages/reports/ReportsDashboard";
import CreateInvoice from "../pages/reports/CreateInvoice";

export default function CompanyRoutes() {
  return (
    <Routes>
      <Route path="login" element={<CompanyLogin />} />
      <Route path="register" element={<CompanyRegister />} />
      <Route path="register/success" element={<CompanyRegisterSuccess />} />
      <Route path="activate/:token" element={<CompanyAccountActivation />} />
      <Route path="terms" element={<CompanyTermsAcceptance />} />
      <Route path="forgot-password" element={<CompanyForgotPassword />} />
      {/* <Route path="reset-password/:" element={<CompanyResetPassword />}/> */}

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="staff/listing" element={<StaffListing />} />
        <Route path="staff/add" element={<AddStaff />} />
        <Route path="staff/edit/:slug" element={<EditStaff />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="reports/create-invoice" element={<CreateInvoice />} />
        {/* <Route
        path="dashboard"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="manage-staff"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <ManageStaff />
          </ProtectedRoute>
        }
      /> */}
        {/* <Route path="*" element={<Navigate to="/company/login" />} /> */}
      </Route>
    </Routes>
  );
}
