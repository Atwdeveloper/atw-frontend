import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { changeAgentPassword } from "../../../api/agent/agentProfileAPI";

export const useAgentChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (
    currentPassword,
    newPassword,
    confirmPassword,
  ) => {
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await changeAgentPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      // ✅ Match pattern from useAgentLogin
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          text: "Your password has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/agent/profile");
        });
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to change password");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "An error occurred";
      setError(message);
      Swal.fire({
        icon: "error",
        title: "Change Failed",
        text: message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleChangePassword,
    loading,
    error,
    clearError: () => setError(null),
  };
};
