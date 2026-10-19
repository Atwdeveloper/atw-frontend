// src/modules/admin/hooks/useAdminOtpVerify.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyAdminOtpAPI,
  resendAdminOtpAPI,
} from "../../../api/admin/adminAuthAPI";
import { useAuth } from "../../../common/hooks/useAuth";
import Swal from "sweetalert2";

const RESEND_COOLDOWN_SECONDS = 60;

export const useAdminOtpVerify = (username) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Countdown for the "resend OTP" button
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const verifyOtp = useCallback(
    async (otp) => {
      if (!username) {
        setError("Session expired. Please login again.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await verifyAdminOtpAPI(username, otp);

        if (response?.data?.token && response?.data?.user) {
          const { user, token, role } = response.data;
          const userRole = role || "admin";

          login(user, token, userRole);

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Redirecting to dashboard...",
            timer: 1200,
            showConfirmButton: false,
          }).then(() => {
            navigate("/admin/dashboard", { replace: true });
          });
        } else {
          const errorMessage =
            response?.message || response?.detail || "Invalid OTP. Please try again.";
          setError(errorMessage);
        }
      } catch (err) {
        console.error("OTP verify error:", err);

        let errorMessage = "Invalid or expired OTP. Please try again.";
        if (err.response?.data) {
          errorMessage =
            err.response.data.message ||
            err.response.data.detail ||
            err.response.data.error ||
            errorMessage;
        } else if (err.request) {
          errorMessage = "Network error: Unable to connect to server";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [username, login, navigate]
  );

  const resendOtp = useCallback(async () => {
    if (!username || cooldown > 0) return;
    setResending(true);
    setError("");
    try {
      const response = await resendAdminOtpAPI(username);
      if (response?.data?.success) {
        setCooldown(RESEND_COOLDOWN_SECONDS);
        Swal.fire({
          icon: "success",
          title: "OTP Resent",
          text: "A new OTP has been sent to your email",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setError(response?.message || "Could not resend OTP. Try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not resend OTP. Try again."
      );
    } finally {
      setResending(false);
    }
  }, [username, cooldown]);

  return { verifyOtp, resendOtp, loading, resending, error, cooldown };
};