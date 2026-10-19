import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as adminAuthApi from "../../../api/admin/adminAuthAPI";

export const useAdminForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // ==================== FORGOT PASSWORD ====================
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!email.trim()) {
        setError("Email address is required");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      const response = await adminAuthApi.requestPasswordReset(email);

      if (response?.success || response?.status === 200) {
        setSuccess(true);
        toast.success(response.message || "Password reset link sent.");
      } else {
        setError(response?.message || "Failed to send reset link");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== RESET PASSWORD ====================
  const resetPassword = async (token, email, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ validations
      if (!token) return setError("Reset token is required");
      if (!email) return setError("Email is required");
      if (!newPassword) return setError("New password is required");

      if (newPassword.length < 8) {
        return setError("Password must be at least 8 characters");
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        return setError(
          "Password must contain uppercase, lowercase and numbers",
        );
      }

      if (newPassword !== confirmPassword) {
        return setError("Passwords do not match");
      }

      // ✅ ONLY send required fields
      const response = await adminAuthApi.resetPassword({
        token,
        email,
        password: newPassword,
      });

      // ✅ correct success check
      if (response?.success === true || response?.status === 200) {
        toast.success(response.message || "Password reset successful");
        navigate("/admin/login");
      } else {
        setError(response?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("❌ RESET API ERROR:", error.response || error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Reset password failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== TOKEN VALIDATION ====================
  const validateResetToken = async (token) => {
    try {
      setLoading(true);
      setError(null);

      if (token && token.length >= 10) {
        return { isValid: true };
      } else {
        return { isValid: false, message: "Invalid or expired reset token" };
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return { isValid: false, message: "Token validation failed" };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestPasswordReset,
    resetPassword,
    validateResetToken,
    loading,
    error,
    success,
    clearError: () => setError(null),
  };
};
