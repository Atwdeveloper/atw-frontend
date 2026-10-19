import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as agentAuthApi from "../../../api/agent/agentAuthAPI";

export const useAgentForgotPassword = () => {
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
        setLoading(false);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      const response = await agentAuthApi.requestPasswordResetAPI(email);

      if (response?.success || response?.status === 200) {
        setSuccess(true);
        toast.success(response.message || "Password reset link sent.");
      } else {
        setError(response?.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error(
        "❌ Agent Forgot password API error:",
        error.response || error,
      );
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

      // --- validations ---
      if (!token) {
        setError("Reset token is required");
        setLoading(false);
        return;
      }
      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      if (!newPassword) {
        setError("New password is required");
        setLoading(false);
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        setError("Password must contain uppercase, lowercase and numbers");
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await agentAuthApi.resetPasswordAPI({
        token,
        email,
        password: newPassword,
      });

      if (response?.success === true || response?.status === 200) {
        toast.success(response.message || "Password reset successful");
        navigate("/agent/login");
      } else {
        setError(response?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("❌ Agent RESET API error:", error.response || error);
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
