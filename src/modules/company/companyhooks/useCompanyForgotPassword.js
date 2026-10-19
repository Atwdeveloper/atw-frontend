import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as companyAuthApi from "../../../api/company/companyAuthAPI";

export const useCompanyForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate email
      if (!email.trim()) {
        setError("Email address is required");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Try API call first
      try {
        const response = await companyAuthApi.requestPasswordReset(email);

        if (response.status === 200) {
          setSuccess(true);
          setError(null);
          toast.success(
            response.message || "Password reset link has been sent.",
          );
        } else {
          setError(response.message || "Failed to send reset link");
        }
      } catch (apiError) {
        console.warn("API connection failed, using demo reset:", apiError);

        // Demo fallback
        const demoResponse =
          await companyAuthApi.demoRequestPasswordReset(email);

        if (demoResponse.success) {
          setSuccess(true);
          toast.success(
            <div>
              <p className="font-semibold">Demo: Password reset link sent!</p>
              <p className="text-sm mt-1">
                In a real application, you would receive an email.
              </p>
              <p className="text-sm mt-2">
                Demo reset email: {demoResponse.data.email}
              </p>
            </div>,
            { duration: 6000 },
          );
        } else {
          setError(
            demoResponse.response?.data?.message || "Failed to send reset link",
          );
        }
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, email, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!token) {
        setError("Reset token is required");
        return;
      }

      if (!email) {
        setError("Email is required");
        return;
      }

      if (!newPassword) {
        setError("New password is required");
        return;
      }

      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        setError("Password must contain uppercase, lowercase and numbers");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Try API call first
      try {
        const response = await companyAuthApi.resetPassword({
          token,
          email,
          password: newPassword,
          confirm_password: confirmPassword,
        });

        if (response.status === 200) {
          toast.success("Password has been reset successfully!");
          navigate("/company/login");
        } else {
          setError(response.message || "Failed to reset password");
        }
      } catch (apiError) {
        console.warn("API connection failed, using demo reset:", apiError);

        // Demo fallback
        const demoResponse = await companyAuthApi.demoResetPassword({
          token,
          email,
          password: newPassword,
          confirm_password: confirmPassword,
        });

        if (demoResponse.success) {
          toast.success(
            <div>
              <p className="font-semibold">Demo: Password reset successful!</p>
              <p className="text-sm mt-1">
                You can now login with your new password.
              </p>
            </div>,
          );
          navigate("/company/login");
        } else {
          setError(
            demoResponse.response?.data?.message || "Failed to reset password",
          );
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async (token) => {
    try {
      setLoading(true);
      setError(null);

      // Simple validation - in a real app you might want to call an API
      if (token && token.length >= 10) {
        return { isValid: true };
      } else {
        return { isValid: false, message: "Invalid or expired reset token" };
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return { isValid: false, message: "Failed to validate reset token" };
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
