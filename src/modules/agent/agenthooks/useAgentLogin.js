import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as agentAuthApi from "../../../api/agent/agentAuthAPI";
import { useAuth } from "../../../common/hooks/useAuth";
import Cookies from "js-cookie";

export const useAgentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
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

      // API call
      const response = await agentAuthApi.loginAgent({ email, password });

      if (response.status === 200) {
        const { data } = response;

        // Extract user data and token
        // const { token, ...agentData } = data;
        // const userRole = 'agent';

        // login(agentData, token, userRole);

        // Swal.fire({
        //   icon: 'success',
        //   title: 'Login Successful!',
        //   text: 'Welcome to your agent dashboard.',
        //   timer: 1500,
        //   showConfirmButton: false,
        // }).then(() => {
        //   navigate('/agent/dashboard', { replace: true });
        // });
        const { token, profile_status, agent } = data;
        // localStorage.setItem("agent_token", token);
        const userRole = "agent";

        // Save login
        login(agent, token, userRole, profile_status);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // 🔥 MAIN LOGIC
          if (profile_status === "pending") {
            // 👉 Store step (since only step 1 is done)
            // localStorage.setItem("resume_step", "2");

            navigate("/agent/register", { replace: true });
          } else {
            navigate("/agent/dashboard", { replace: true });
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
        // Handle cases where API returns non-200 status but with response
        const errorMessage =
          response?.message ||
          response?.detail ||
          "Login failed. Please try again.";
        setError(errorMessage);

        // If temporary token is provided (e.g., for 2FA or terms acceptance)
        if (response.data?.temp_token) {
          Cookies.set("agent_temp_token", response.data.temp_token);
          navigate(`/agent/terms&conditions/${response.data.temp_token}`);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        }
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
