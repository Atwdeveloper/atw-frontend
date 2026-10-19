import { useState } from "react";
import Swal from "sweetalert2";
import {
  changePasswordAPI,
  changeUsernameAPI,
  changeEmailAPI,
} from "../../../api/company/companyProfileAPI";
import { useAuth } from "../../../common/hooks/useAuth";

export const useCompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  const handleChangePassword = async (
    current_password,
    new_password,
    new_password_confirmation,
  ) => {
    setLoading(true);
    setError("");

    try {
      const body = {
        current_password,
        new_password,
        new_password_confirmation,
      };
      const data = await changePasswordAPI(body);

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been updated successfully. You will be logged out for security reasons.",
        confirmButtonText: "OK, Logout",
        allowOutsideClick: false,
      }).then(() => logout());

      return data;
    } catch (err) {
      const message = err.response?.data?.detail || "Unable to change password";
      setError(message);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUsername = async (new_username) => {
    setLoading(true);
    setError("");

    try {
      const body = { new_username };
      const data = await changeUsernameAPI(body);

      Swal.fire({
        icon: "success",
        title: "Username Updated",
        text: "Your username has been updated successfully. You will be logged out for security reasons.",
        confirmButtonText: "OK, Logout",
        allowOutsideClick: false,
      }).then(() => logout());

      return data;
    } catch (err) {
      const message = err.response?.data?.detail || "Unable to update username";
      setError(message);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (new_email) => {
    setLoading(true);
    setError("");

    try {
      const body = { new_email };
      const data = await changeEmailAPI(body);

      Swal.fire({
        icon: "success",
        title: "Email Updated",
        text: "Your email has been updated successfully. You will be logged out for security reasons.",
        confirmButtonText: "OK, Logout",
        allowOutsideClick: false,
      }).then(() => logout());

      return data;
    } catch (err) {
      const message = err.response?.data?.detail || "Unable to update email";
      setError(message);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleChangePassword,
    handleChangeUsername,
    handleChangeEmail,
  };
};
