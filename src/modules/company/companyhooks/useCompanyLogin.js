import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as companyAuthApi from "../../../api/company/companyAuthAPI";
import { useAuth } from "../../../common/hooks/useAuth";
import Cookies from "js-cookie";

export const useCompanyLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const handleLogin = async (email, password, recaptchaToken) => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }

      if (!recaptchaToken) {
        setError("Please verify that you are not a robot");
        return;
      }

      // API call
      const response = await companyAuthApi.loginCompany({
        login: email,
        password,
        recaptcha_token: recaptchaToken,
      });

      if (response.status === 200) {
        const { data } = response;

        // Extract token and profile status
        const { token, profile_status, ...companyData } = data;

        const userRole = "company";

        // SAVE IMPORTANT DATA IN COOKIES
        Cookies.set("company", JSON.stringify(data.company), cookieOptions);

        Cookies.set("token", token, cookieOptions);

        Cookies.set("profile_status", profile_status, cookieOptions);

        Cookies.set("industry_id", data.company.industry_id, cookieOptions);

        // LOGIN
        login(companyData, token, userRole, profile_status);

        // SUCCESS ALERT
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text:
            profile_status === "pending"
              ? "Continue your registration."
              : "Welcome to your dashboard.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // IF PROFILE NOT COMPLETE
          if (profile_status === "pending") {
            navigate("/company/register", {
              replace: true,
            });
          } else {
            navigate("/company/dashboard", {
              replace: true,
            });
          }
        });
      } else if (response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message,
          confirmButtonText: "OK",
        });
      } else {
        // Handle non-200 responses
        const errorMessage =
          response?.message ||
          response?.detail ||
          "Login failed. Please try again.";

        setError(errorMessage);

        navigate(`/company/terms&conditions/${response.data.temp_token}`);

        Cookies.set("token", response.data.temp_token, cookieOptions);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please try again.";

      if (err.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.detail ||
          err.response.data.error ||
          `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error: Unable to connect to server";
      } else {
        errorMessage = err.message || "Login failed";
      }

      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
    clearError: () => setError(null),
  };
};
