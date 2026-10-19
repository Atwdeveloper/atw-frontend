import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PermissionProvider } from "../../../common/hooks/useAdminPermissions";
import AdminLogin from "../pages/AdminLogin";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ChangeUsername from "../pages/configuration/ChangeUsername";
import ChangePassword from "../pages/configuration/ChangePassword";
import SiteSettings from "../pages/configuration/SiteSettings";
import ProtectedRoute from "../../../common/components/ProtectedRoute";
import CompanyListing from "../pages/company/CompanyListing";
import AddCompany from "../pages/company/AddCompany";
import JobOpeningsList from "../pages/company/JobOpeningsList";
import EditCompanyPage from "../pages/company/EditCompany";
import WorkerListing from "../pages/worker/WorkerListing";
import AddWorker from "../pages/worker/AddWorker";
import EditWorkerPage from "../pages/worker/EditWorker";
import ChangeEmail from "../pages/configuration/ChangeEmail";
import NotificationsPage from "../pages/notification/Notification";
import ManageDressOrders from "../pages/DressOrder/ManageDressOrder";
import AddDressOrder from "../pages/DressOrder/AddDressOrder";
import EditDressOrder from "../pages/DressOrder/EditDressOrder";
import StaffListing from "../pages/staff/StaffListing";
import AddStaff from "../pages/staff/AddStaff";
import EditStaff from "../pages/staff/EditStaff";
import RoleListing from "../pages/role-management/RoleListing";
import EditRole from "../pages/role-management/EditRole";
import AddRole from "../pages/role-management/AddRole";
import ManageTeams from "../pages/team/ManageTeams";
import EditTeam from "../pages/team/EditTeam";
import AddTeam from "../pages/team/AddTeam";
import ManageReports from "../pages/reports/ManageReports";
import SalaryManagement from "../pages/salary/SalaryManagement";
import AddSalaryConfig from "../pages/salary/AddSalaryConfig";
import EmployeeSalarySetup from "../pages/salary/EmployeeSalaraySetup";
import MyProfile from "../pages/myprofile/MyProfile";

import AdminWorkerWallet from "../pages/worker/AdminWorkerWallet";
import ReferralDashboard from "../pages/referrals/ReferralDashboard";
import ManageReferral from "../pages/referrals/ManageReferral";
import ReferralSettings from "../pages/referrals/ReferralSettings";



export default function AdminRoutes() {
  return (
    <PermissionProvider>
      <Routes>
        {/* Login Route */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected Admin Section */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Pages under AdminLayout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="myprofile" element={<MyProfile />} />

          <Route
            path="configuration/change-username"
            element={<ChangeUsername />}
          />
          <Route path="configuration/change-email" element={<ChangeEmail />} />
          <Route
            path="configuration/site-settings"
            element={<SiteSettings />}
          />

          <Route path="company/listing" element={<CompanyListing />} />
          <Route path="company/add" element={<AddCompany />} />
          <Route
            path="company/job-openings/:id"
            element={<JobOpeningsList />}
          />
          <Route path="company/edit/:id" element={<EditCompanyPage />} />

          <Route path="worker/listing" element={<WorkerListing />} />
          <Route path="worker/add" element={<AddWorker />} />
          <Route path="worker/edit/:id" element={<EditWorkerPage />} />
          <Route path="worker/wallet/:id" element={<AdminWorkerWallet />} />

          <Route path="dress-orders" element={<ManageDressOrders />} />
          <Route path="dress-orders/add" element={<AddDressOrder />} />
          <Route path="dress-orders/edit/:id" element={<EditDressOrder />} />

          <Route path="roles" element={<RoleListing />} />
          <Route path="roles/add" element={<AddRole />} />
          <Route path="roles/edit/:id" element={<EditRole />} />

          <Route path="team/listing" element={<ManageTeams />} />
          <Route path="teams/add" element={<AddTeam />} />
          <Route path="teams/edit/:id" element={<EditTeam />} />
          
          <Route path="referrals/dashboard" element={<ReferralDashboard />} />
          <Route path="referrals/manage" element={<ManageReferral />} />
          <Route path="referrals/settings" element={<ReferralSettings />} />
          
          <Route path="salary" element={<SalaryManagement />} />
          <Route path="salary/config/add" element={<AddSalaryConfig />} />
          <Route
            path="salary/employee-setup"
            element={<EmployeeSalarySetup />}
          />

          <Route path="reports" element={<ManageReports />} />

          <Route path="staff/listing" element={<StaffListing />} />
          <Route path="staff/add" element={<AddStaff />} />
          <Route path="staff/edit/:id" element={<EditStaff />} />

          <Route path="settings/change-password" element={<ChangePassword />} />

          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </PermissionProvider>
  );
}
