import { Routes, Route, Navigate } from "react-router-dom";
import WorkerLogin from "../pages/WorkerLogin";
import HomePage from "../pages/HomePage";
import WorkerLayout from "../layout/WorkerLayout";

export default function WorkerRoutes() {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="login" element={<WorkerLogin />} />
      <Route path="wallet" element={<WorkerLogin />} />

      {/* Protected Admin Section */}
      <Route
        path="/"
        element={
          // <ProtectedRoute allowedRoles={["worker"]}>
          <WorkerLayout />
          // </ProtectedRoute>
        }
      >
        {/* Nested Pages under AdminLayout */}
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
