import { createBrowserRouter } from "react-router-dom";

/* ===== COMMON ===== */
import ProtectedRoute from "../common/components/ProtectedRoute";
import { PermissionProvider } from "../common/hooks/useAdminPermissions";
import { CompanyPermissionProvider } from "../common/hooks/useCompanyPermissions";

/* ===== ADMIN ===== */
import AdminLayout from "../modules/admin/layout/AdminLayout";
import AdminLogin from "../modules/admin/pages/AdminLogin";
import Dashboard from "../modules/admin/pages/dashboard/Dashboard";
import MyProfile from "../modules/admin/pages/myprofile/MyProfile";
import EditProfile from "../modules/admin/pages/myprofile/EditProfile";
import ChangeUsername from "../modules/admin/pages/configuration/ChangeUsername";
import ChangeEmail from "../modules/admin/pages/configuration/ChangeEmail";
import ChangePassword from "../modules/admin/pages/configuration/ChangePassword";
import SiteSettings from "../modules/admin/pages/configuration/SiteSettings";
import CompanyListing from "../modules/admin/pages/company/CompanyListing";
import AddCompany from "../modules/admin/pages/company/AddCompany";
import EditCompanyPage from "../modules/admin/pages/company/EditCompany";
import JobOpeningsList from "../modules/admin/pages/company/JobOpeningsList";
import WorkerListing from "../modules/admin/pages/worker/WorkerListing";
import FaceEnrollListing from "../modules/admin/pages/attendance/FaceEnrollListing";
import AddWorker from "../modules/admin/pages/worker/AddWorker";
import EditWorkerPage from "../modules/admin/pages/worker/EditWorker";
import StaffListing from "../modules/admin/pages/staff/StaffListing";
import AddStaff from "../modules/admin/pages/staff/AddStaff";
import EditStaff from "../modules/admin/pages/staff/EditStaff";
import RoleListing from "../modules/admin/pages/role-management/RoleListing";
import AddRole from "../modules/admin/pages/role-management/AddRole";
import EditRole from "../modules/admin/pages/role-management/EditRole";
import ManageTeams from "../modules/admin/pages/team/ManageTeams";
import AddTeam from "../modules/admin/pages/team/AddTeam";
import EditTeam from "../modules/admin/pages/team/EditTeam";
import SalaryManagement from "../modules/admin/pages/salary/SalaryManagement";
import AddSalaryConfig from "../modules/admin/pages/salary/AddSalaryConfig";
import EmployeeSalarySetup from "../modules/admin/pages/salary/EmployeeSalaraySetup";
import ManageReports from "../modules/admin/pages/reports/ManageReports";
import PfReports from "../modules/admin/pages/reports/PfReports";
import SalarySheets from "../modules/admin/pages/reports/SalarySheets";
import WorkerWalletTransactionsReport from "../modules/admin/pages/reports/WorkerWalletTransactionsReport";
import WorkerWalletEntriesReport from "../modules/admin/pages/reports/WorkerWalletEntriesReport";
import WorkerPayoutReport from "../modules/admin/pages/reports/WorkerPayoutReport";
import NotificationsPage from "../modules/admin/pages/notification/Notification";
import ManageDressOrders from "../modules/admin/pages/DressOrder/ManageDressOrder";
import AddDressOrder from "../modules/admin/pages/DressOrder/AddDressOrder";
import EditDressOrder from "../modules/admin/pages/DressOrder/EditDressOrder";
import CompanyPaymentDetails from "../modules/admin/pages/company/CompanyPaymentDetails";
import SupportMessage from "../modules/admin/pages/support/SupportMessage";
import AdminWorkerWallet from "../modules/admin/pages/worker/AdminWorkerWallet";
import AdminWorkerHistory from "../modules/admin/pages/worker/AdminWorkerHistory";
import AdminForgotPassword from "../modules/admin/pages/AdminForgotPassword";
import AdminResetPassword from "../modules/admin/pages/AdminResetPassword";
import AdminVerifyOtp from "../modules/admin/pages/AdminOtpVerify";
import AllVacancy from "../modules/admin/pages/all-vacancy/AllVacancy";
import AdminAddVacancy from "../modules/admin/pages/all-vacancy/AddVacancy";
import AdminEditVacancy from "../modules/admin/pages/all-vacancy/EditVacancy";
import AdminViewAppliedWorkers from "../modules/admin/pages/all-vacancy/ViewAppliedWorkers";
import AdminCompanyAllWorkers from "../modules/admin/pages/company/AdminCompanyAllWorkers";

/* ===== COMPANY ===== */
import CompanyLayout from "../modules/company/layout/CompanyLayout";
import CompanyLogin from "../modules/company/pages/CompanyLogin";
import CompanyRegister from "../modules/company/pages/CompanyRegister";
import CompanyRegisterSuccess from "../modules/company/pages/CompanyRegisterSuccess";
import CompanyAccountActivation from "../modules/company/pages/CompanyAccountActivation";
import CompanyTermsAcceptance from "../modules/company/pages/CompanyTermsAcceptance";
import CompanyForgotPassword from "../modules/company/pages/CompanyForgotPassword";
import CompanyResetPassword from "../modules/company/pages/CompanyResetPassword";
import CompanyDashboard from "../modules/company/pages/dashboard/DashBoard";
import ChangeCompanyPassword from "../modules/company/pages/configurations/ChangeCompanyPassword";
import CompanyStaffListing from "../modules/company/pages/staff/StaffListing";
import CompanyAddStaff from "../modules/company/pages/staff/AddStaff";
import CompanyEditStaff from "../modules/company/pages/staff/EditStaff";
import ReportsDashboard from "../modules/company/pages/reports/ReportsDashboard";
import CreateInvoice from "../modules/company/pages/reports/CreateInvoice";

/* ===== WORKER ===== */
import WorkerLayout from "../modules/worker/layout/WorkerLayout";
import WorkerLogin from "../modules/worker/pages/WorkerLogin";
import WorkerSignup from "../modules/worker/pages/WorkerSignup";
import WorkerFaceRegistration from "../modules/worker/pages/WorkerFaceRegistration";
import HomePage from "../modules/worker/pages/HomePage";
import VendorManagement from "../modules/admin/pages/VendorManagement/VendorManagement";
import VendorOrders from "../modules/admin/pages/VendorManagement/VendorOrders";
import EditVendor from "../modules/admin/pages/VendorManagement/EditVendor";
import AddVendor from "../modules/admin/pages/VendorManagement/AddVendor";
import CompanyProfile from "../modules/company/pages/profile/CompanyProfile";
import EditCompanyProfile from "../modules/company/pages/profile/EditCompanyProfile";
import WorkerProfile from "../modules/worker/pages/myprofile/WorkerProfile";
import EditWorkerProfile from "../modules/worker/pages/myprofile/EditWorkerProfile";
import WorkerDashboard from "../modules/worker/pages/WorkerDashboard";
import UserProfile from "../modules/company/pages/configurations/UserProfile";
import EditUserProfile from "../modules/company/pages/configurations/EditUserProfile";
import CompanyRoleListing from "../modules/company/pages/role-management/CompanyRoleListing";
import AddCompanyRole from "../modules/company/pages/role-management/AddCompanyRole";
import EditCompanyRole from "../modules/company/pages/role-management/EditCompanyRole";
import CompanyMessage from "../modules/company/pages/message/CompanyMessage";
import VacancyListing from "../modules/company/pages/vacancy/VacancyListing";
import AddVacancy from "../modules/company/pages/vacancy/AddVacancy";
import EditVacancy from "../modules/company/pages/vacancy/EditVacancy";
import CompanyDocuments from "../modules/company/pages/reports/CompanyDocuments";
import WorkerDocuments from "../modules/worker/pages/documents/WorkerDocuments";
import AppliedJobs from "../modules/worker/pages/appliedjobs/AppliedJobs";
import WorkerDressOrders from "../modules/worker/pages/dressorder/DressOrder";
import WorkerSupport from "../modules/worker/pages/support/WorkerSupport";
// import AddWorkerDressOrders from "../modules/worker/pages/dressorder/AddWorkerDressOrder";
import ViewAppliedWorkers from "../modules/company/pages/vacancy/ViewAppliedWorkers";
import CompanyAllWorkers from "../modules/company/pages/all-workers/CompanyAllWorkers";
import AddWorkerDressOrder from "../modules/worker/pages/dressorder/AddWorkerDressOrder";
import ViewCompanyDocuments from "../modules/admin/pages/company/ViewCompanyDocuments";
import ViewWorkerDocuments from "../modules/admin/pages/worker/ViewWorkerDocuments";
import AgentListing from "../modules/admin/pages/agent/AgentListing";
import AddAgent from "../modules/admin/pages/agent/AddAgent";
import EditAgent from "../modules/admin/pages/agent/EditAgent";
import AgentLogin from "../modules/agent/pages/AgentLogin";
import AgentLayout from "../modules/agent/layout/AgentLayout";
import AgentDashboard from "../modules/agent/pages/dashboard/DashBoard";
import AgentProfile from "../modules/agent/pages/profile/AgentProfile";
import EditAgentProfile from "../modules/agent/pages/profile/EditAgentProfile";
import AgentChangePassword from "../modules/agent/pages/AgentChangePassword";
import AddCompanyByAgent from "../modules/agent/pages/company/AddCompanyByAgent";
import CompanyListByAgent from "../modules/agent/pages/company/CompanyListByAgent";
import EditCompanyAgent from "../modules/agent/pages/company/EditCompanyAgent";
import IndustryListing from "../modules/admin/pages/industry-management/IndustryListing";
import AddIndustry from "../modules/admin/pages/industry-management/AddIndustry";
import EditIndustry from "../modules/admin/pages/industry-management/EditIndustry";
import MinimumWageListing from "../modules/admin/pages/minimum-wage/MinimumWageListing";
import AddMinimumWage from "../modules/admin/pages/minimum-wage/AddMinimumWage";
import EditMinimumWage from "../modules/admin/pages/minimum-wage/EditMinimumWage";
import DesignationListing from "../modules/admin/pages/designation-management/DesignationListing";
import AddDesignationGlobal from "../modules/admin/pages/designation-management/AddDesignation";
import EditDesignationGlobal from "../modules/admin/pages/designation-management/EditDesignation";
import SkillCategoryListing from "../modules/admin/pages/skill-category-management/SkillCategoryListing";
import AddSkillCategory from "../modules/admin/pages/skill-category-management/AddSkillCategory";
import EditSkillCategory from "../modules/admin/pages/skill-category-management/EditSkillCategory";
import DesignationByIndustry from "../modules/admin/pages/industry-management/DesignationByIndustry";
import AddDesignation from "../modules/admin/pages/industry-management/AddDesignation";
import EditDesignation from "../modules/admin/pages/industry-management/EditDesignation";
import WorkerListByAgent from "../modules/agent/pages/worker/WorkerListByAgent";
import AddWorkerByAgent from "../modules/agent/pages/worker/AddWorkerByAgent";
import EditWorkerByAgent from "../modules/agent/pages/worker/EditWorkerByAgent";
import AdminDocuments from "../modules/admin/pages/documents/AdminDocuments";
import AnyTimeWorkDocuments from "../modules/company/pages/reports/AnyTimeWorkDocuments";
import CompanyNotification from "../modules/company/pages/notifcation/CompanyNotification";
import EsicReports from "../modules/admin/pages/reports/EsicReports";
import WorkerNotification from "../modules/worker/pages/notification/WorkerNotification";
import AgentNotification from "../modules/agent/pages/notification/AgentNotification";
import LoginSelect from "../modules/worker/pages/LoginSelect";
import NotFoundPage from "../common/components/NotFoundPage";
import AddAgentDressOrder from "../modules/agent/pages/dressorder/AddAgentDressOrder";
import AgentDressOrders from "../modules/agent/pages/dressorder/DressOrder";
import AgentWallet from "../modules/agent/pages/wallet/AgentWallet";
import WorkerWallet from "../modules/worker/pages/wallet/WorkerWallet";
import DeductionSettings from "../modules/admin/pages/deduction/DeductionSettings";
import WorkerTermsAcceptance from "../modules/worker/pages/WorkerTermsAcceptance";
import AgentTermsAcceptance from "../modules/agent/pages/AgentTermsAcceptance";

import AddSkill from "../modules/admin/pages/industry-management/AddSkill";
import EditSkill from "../modules/admin/pages/industry-management/EditSkill";
import SkillsByDesignation from "../modules/admin/pages/industry-management/SkillsByDesignation";

import SalaryStructureListing from "../modules/admin/pages/salary-structure/SalaryStructureListing";
import AddSalaryStructure from "../modules/admin/pages/salary-structure/AddSalaryStructure";
import TDSListing from "../modules/admin/pages/tds/TDSListing";
import AddEditTds from "../modules/admin/pages/tds/AddEditTds";
import AgentSignup from "../modules/agent/pages/AgentSignup";
import EditSalaryStructure from "../modules/admin/pages/salary-structure/EditSalaryStructure";
import WorkerHistory from "../modules/worker/pages/wallet/WorkerHistory";
import AgentForgotPassword from "../modules/agent/pages/AgentForgotPassword";
import AgentResetPassword from "../modules/agent/pages/AgentResetPassword";
import CompanySupport from "../modules/company/pages/support/CompanySupport";
// import AddCompanyDocument from "../modules/company/pages/reports/AddCompanyDocument";
import FaceAttendanceScanner from "../modules/attendance/FaceAttendanceScanner";
import FaceAttendanceRegister from "../modules/attendance/FaceAttendanceRegister";
import FaceRegister from "../modules/attendance/FaceAttendanceRegister";
import FaceAuthTestPage from "../modules/attendance/FaceAuthTestPage";
import FaceIdentifyTestPage from "../modules/attendance/FaceIdentifyTestPage";
import PrivacyPolicy from "../modules/admin/pages/SupportLinks/Privacy";
import Terms from "../modules/admin/pages/SupportLinks/Terms";
import CancellationPolicy from "../modules/admin/pages/SupportLinks/CancellationPolicy";
import RefundPolicy from "../modules/admin/pages/SupportLinks/RefundPolicy";
import ReferralDashboard from "../modules/admin/pages/referrals/ReferralDashboard";
// import ManageReferral from "../modules/admin/pages/referrals/ManageReferral";
// import ReferralSettings from "../modules/admin/pages/referrals/ReferralSettings";
import ReferralRules from "../modules/admin/pages/referrals/ReferralRules";

const router = createBrowserRouter([
  /* ================= ADMIN ================= */
  { path: "/admin/login", element: <AdminLogin /> },
  {path: "/FaceAttendanceRegister",element: <FaceAttendanceRegister companyId="COMP-001" />},
  {path: "/FaceAttendance",element: <FaceAttendanceScanner companyId="COMP-001" />},
  { path: "/test/face-auth", element: <FaceAuthTestPage /> },
  { path: "/test/face-identify", element: <FaceIdentifyTestPage /> },
  { path: "/admin/forgot-password", element: <AdminForgotPassword /> },
  { path: "/admin/reset-password", element: <AdminResetPassword /> },
  { path: "/admin/verify-otp", element: <AdminVerifyOtp /> },
  {
    path: "/admin",
    element: (
      <PermissionProvider>
        <ProtectedRoute allowedRoles={["admin", "admin_staff"]}>
          <AdminLayout />
        </ProtectedRoute>
      </PermissionProvider>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "myprofile", element: <MyProfile /> },
      { path: "myprofile/edit", element: <EditProfile /> },
      { path: "configuration/change-username", element: <ChangeUsername /> },
      { path: "configuration/change-email", element: <ChangeEmail /> },
      { path: "configuration/site-settings", element: <SiteSettings /> },
      { path: "configuration/documents", element: <AdminDocuments /> },
      { path: "settings/change-password", element: <ChangePassword /> },
      { path: "support-messages", element: <SupportMessage /> },

      { path: "company/listing", element: <CompanyListing /> },
      { path: "company/add", element: <AddCompany /> },
      { path: "company/edit/:id", element: <EditCompanyPage /> },
      { path: "company/job-openings/:id", element: <JobOpeningsList /> },
      { path: "company/view-documents/:id", element: <ViewCompanyDocuments /> },
      { path: "company/payment-details", element: <CompanyPaymentDetails /> },

      { path: "vacancy-listing", element: <AllVacancy /> },
      {
        path: "vacancy/applied-workers/:vacancyId",
        element: <AdminViewAppliedWorkers />,
      },
      { path: "all-workers/:companyId", element: <AdminCompanyAllWorkers /> },

      { path: "worker/listing", element: <WorkerListing /> },
      { path: "attendance/face-enroll", element: <FaceEnrollListing /> },
      { path: "worker/add", element: <AddWorker /> },
      { path: "worker/edit/:id", element: <EditWorkerPage /> },
      { path: "worker/view-documents/:id", element: <ViewWorkerDocuments /> },
      { path: "worker/wallet/:id", element: <AdminWorkerWallet /> },
      { path: "worker/wallet/history/:id", element: <AdminWorkerHistory /> },

      { path: "staff/listing", element: <StaffListing /> },
      { path: "staff/add", element: <AddStaff /> },
      { path: "staff/edit/:id", element: <EditStaff /> },

      { path: "agent/listing", element: <AgentListing /> },
      { path: "agent/add", element: <AddAgent /> },
      { path: "agent/edit/:id", element: <EditAgent /> },

      { path: "roles", element: <RoleListing /> },
      { path: "roles/add", element: <AddRole /> },
      { path: "roles/edit/:id", element: <EditRole /> },

      { path: "industries", element: <IndustryListing /> },
      { path: "industries/add", element: <AddIndustry /> },
      { path: "industries/edit/:id", element: <EditIndustry /> },
      {
        path: "industries/designations/:id",
        element: <DesignationByIndustry />,
      },
      { path: "industries/designations/:id/add", element: <AddDesignation /> },
      {
        path: "industries/designations/:id/edit/:designation_id",
        element: <EditDesignation />,
      },
      {
        path: "industries/designations/:designationId/skills",
        element: <SkillsByDesignation />,
      },
      {
        path: "industries/designations/:designationId/skills/add",
        element: <AddSkill />,
      },
      {
        path: "industries/designations/:designationId/skills/edit/:skillId",
        element: <EditSkill />,
      },

      { path: "minimum-wage", element: <MinimumWageListing /> },
      { path: "minimum-wage/add", element: <AddMinimumWage /> },
      { path: "minimum-wage/edit/:id", element: <EditMinimumWage /> },

      { path: "designations", element: <DesignationListing /> },
      { path: "designations/add", element: <AddDesignationGlobal /> },
      { path: "designations/edit/:id", element: <EditDesignationGlobal /> },

      { path: "skill-categories", element: <SkillCategoryListing /> },
      { path: "skill-categories/add", element: <AddSkillCategory /> },
      { path: "skill-categories/edit/:id", element: <EditSkillCategory /> },

      { path: "team/listing", element: <ManageTeams /> },
      { path: "teams/add", element: <AddTeam /> },
      { path: "teams/edit/:id", element: <EditTeam /> },

      { path: "salary", element: <SalaryManagement /> },
      { path: "salary/config/add", element: <AddSalaryConfig /> },
      { path: "salary/employee-setup", element: <EmployeeSalarySetup /> },
      
      { path: "referrals/dashboard", element: <ReferralDashboard /> },
      { path: "referrals/rules", element: <ReferralRules /> },
      // { path: "referrals/manage", element: <ManageReferral /> },
      // { path: "referrals/settings", element: <ReferralSettings /> },

      { path: "dress-orders", element: <ManageDressOrders /> },
      { path: "dress-orders/add", element: <AddDressOrder /> },
      { path: "dress-orders/edit/:id", element: <EditDressOrder /> },

      { path: "vendor/listing", element: <VendorManagement /> },
      { path: "vendor/orders", element: <VendorOrders /> },
      { path: "vendor/add", element: <AddVendor /> },
      { path: "vendor/edit/:id", element: <EditVendor /> },

      { path: "reports", element: <ManageReports /> },
      { path: "reports/pf-reports", element: <PfReports /> },
      { path: "reports/esic-reports", element: <EsicReports /> },
      { path: "company/salary-sheets", element: <SalarySheets /> },
      {
        path: "reports/worker-wallet-transactions",
        element: <WorkerWalletTransactionsReport />,
      },
      {
        path: "reports/worker-wallet-entries",
        element: <WorkerWalletEntriesReport />,
      },
      { path: "reports/worker-payouts", element: <WorkerPayoutReport /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "vacancy/add", element: <AdminAddVacancy /> },
      { path: "vacancy/edit/:id", element: <AdminEditVacancy /> },

      { path: "deductionsettings", element: <DeductionSettings /> },

      { path: "salary-structure", element: <SalaryStructureListing /> },
      { path: "salary-structure/add", element: <AddSalaryStructure /> },
      { path: "salary-structure/edit/:id", element: <EditSalaryStructure /> },
      { path: "tds-settings", element: <TDSListing /> },
      { path: "tds-settings/add", element: <AddEditTds /> },
      { path: "tds-settings/edit/:id", element: <AddEditTds /> },
    ],
  },

  { path: "/company/login", element: <CompanyLogin /> },
  {
    path: "/company/terms&conditions",
    element: <CompanyTermsAcceptance />,
  },
  { path: "/company/register", element: <CompanyRegister /> },
  { path: "/company/register/success", element: <CompanyRegisterSuccess /> },
  { path: "/company/activate/:token", element: <CompanyAccountActivation /> },
  // { path: "/company/terms", element: <CompanyTermsAcceptance /> },
  { path: "/company/forgot-password", element: <CompanyForgotPassword /> },
  { path: "/company/reset-password", element: <CompanyResetPassword /> },

  {
    path: "/company",
    element: (
      <CompanyPermissionProvider>
        <ProtectedRoute allowedRoles={["company"]}>
          <CompanyLayout />
        </ProtectedRoute>
      </CompanyPermissionProvider>
    ),
    children: [
      { path: "dashboard", element: <CompanyDashboard /> },
      {
        path: "configuration/change-password",
        element: <ChangeCompanyPassword />,
      },
      { path: "configuration/user-profile", element: <UserProfile /> },
      { path: "configuration/user-profile/edit", element: <EditUserProfile /> },
      { path: "staff/listing", element: <CompanyStaffListing /> },
      {path:"worker-attendance", element:<FaceAttendanceScanner/>},
      {path:"worker-faceregister", element:<FaceRegister/>},
      { path: "staff/add", element: <CompanyAddStaff /> },
      { path: "staff/edit/:id", element: <CompanyEditStaff /> },
      { path: "reports", element: <ReportsDashboard /> },
      { path: "reports/create-invoice", element: <CreateInvoice /> },
      { path: "company-documents", element: <CompanyDocuments /> },
      {
        path: "company-documents/anytime-work",
        element: <AnyTimeWorkDocuments />,
      },
      // { path: "company-documents/upload", element: <AddCompanyDocument/>},
      { path: "profile", element: <CompanyProfile /> },
      { path: "profile/edit", element: <EditCompanyProfile /> },
      { path: "roles", element: <CompanyRoleListing /> },
      { path: "roles/add", element: <AddCompanyRole /> },
      { path: "roles/edit/:id", element: <EditCompanyRole /> },
      { path: "all-workers", element: <CompanyAllWorkers /> },
      { path: "message", element: <CompanyMessage /> },
      { path: "vacancy/listing", element: <VacancyListing /> },
      { path: "vacancy/add", element: <AddVacancy /> },
      { path: "vacancy/edit/:id", element: <EditVacancy /> },
      {
        path: "vacancy/applied-workers/:vacancyId",
        element: <ViewAppliedWorkers />,
      },
      { path: "notifications", element: <CompanyNotification /> },
      { path: "support", element: <CompanySupport /> },
    ],
  },
  { path: "/agent/login", element: <AgentLogin /> },
  { path: "/agent/register", element: <AgentSignup /> },
  { path: "/agent/forgot-password", element: <AgentForgotPassword /> },
  { path: "/agent/reset-password", element: <AgentResetPassword /> },
  {
    path: "/agent/terms&conditions",
    element: <AgentTermsAcceptance />,
  },

  {
    path: "/agent",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AgentDashboard /> },
      { path: "profile", element: <AgentProfile /> },
      { path: "profile/edit", element: <EditAgentProfile /> },
      { path: "change-password", element: <AgentChangePassword /> },
      { path: "add/company", element: <AddCompanyByAgent /> },
      { path: "company/list", element: <CompanyListByAgent /> },
      { path: "company/edit/:id", element: <EditCompanyAgent /> },
      { path: "worker/list", element: <WorkerListByAgent /> },
      { path: "add/worker", element: <AddWorkerByAgent /> },
      { path: "worker/edit/:id", element: <EditWorkerByAgent /> },
      { path: "dress-orders", element: <AgentDressOrders /> },
      { path: "dress-orders/add", element: <AddAgentDressOrder /> },
      { path: "notifications", element: <AgentNotification /> },
      { path: "wallet", element: <AgentWallet /> },
    ],
  },

  { path: "/login", element: <WorkerLogin /> },
  // axiosInstance redirects here on a 401 for a worker, so it has to resolve.
  { path: "/worker/login", element: <WorkerLogin /> },
  { path: "/login/user-select", element: <LoginSelect /> },
  { path: "/worker/register", element: <WorkerSignup /> },
  { path: "/worker/face-registration", element: <WorkerFaceRegistration /> },
  {
    path: "/worker/terms&conditions",
    element: <WorkerTermsAcceptance />,
  },
  { path: "/", element: <HomePage /> },
  {
    path: "/worker",
    element: (
      <ProtectedRoute allowedRoles={["worker"]}>
        <WorkerLayout />
      </ProtectedRoute>
    ),
    children: [
      // { index: true, element: <HomePage /> },
      { path: "dashboard", element: <WorkerDashboard /> },
      { path: "profile", element: <WorkerProfile /> },
      { path: "profile/edit", element: <EditWorkerProfile /> },
      { path: "documents", element: <WorkerDocuments /> },
      { path: "vacancies", element: <AppliedJobs /> },
      { path: "dress-orders", element: <WorkerDressOrders /> },
      { path: "dress-orders/add", element: <AddWorkerDressOrder /> },
      { path: "notifications", element: <WorkerNotification /> },
      { path: "wallet", element: <WorkerWallet /> },
      { path: "wallet/history", element: <WorkerHistory /> },
      { path: "support", element: <WorkerSupport /> },
    ],
  },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/cancellation-policy", element: <CancellationPolicy /> },
  { path: "/refund-policy", element: <RefundPolicy /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
