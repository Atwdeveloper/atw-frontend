import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

import {
  workerLoginAPI,
  verifyWorkerOtpAPI,
  resendWorkerOtpAPI,
} from "../../../api/worker/workerAuthAPI";

import { useAuth } from "../../../common/hooks/useAuth";

export const useWorkerLogin = () => {
  const [otpSending, setOtpSending] = useState(false);
  const [otpResending, setOtpResending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // SEND OTP
  const sendOtp = async (mobileNumber) => {
    const digitsOnly = mobileNumber?.replace(/\D/g, "");

    if (!digitsOnly || digitsOnly.length !== 10) {
      const msg = "Valid 10-digit mobile number is required";

      setError(msg);

      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }

    setOtpSending(true);
    setError(null);

    try {
      const response = await workerLoginAPI(digitsOnly);

      if (response?.success === false || response?.data?.success === false) {
        const errorMsg = response.message || "Failed to send OTP.";

        setError(errorMsg);

        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errorMsg,
        });

        return {
          success: false,
          message: errorMsg,
        };
      }

      const successMsg = response?.message || "OTP sent successfully!";

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: successMsg,
        timer: 2000,
        showConfirmButton: false,
      });

      return {
        success: true,
        message: successMsg,
      };
    } catch (err) {
      console.error("Send OTP error:", err);

      let errorMsg = "Failed to send OTP. Please try again.";

      if (err.response) {
        const status = err.response.status;

        if (status === 404) {
          errorMsg = "Worker account not found.";
        } else if (status === 400) {
          errorMsg = err.response.data?.message || "Invalid request.";
        } else {
          errorMsg = err.response.data?.message || errorMsg;
        }
      } else if (err.request) {
        errorMsg = "Network error. Check your connection.";
      }

      setError(errorMsg);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMsg,
      });

      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setOtpSending(false);
    }
  };

  // RESEND OTP
  const resendOtp = async (mobileNumber) => {
    const digitsOnly = mobileNumber?.replace(/\D/g, "");

    if (!digitsOnly || digitsOnly.length !== 10) {
      const msg = "Valid 10-digit mobile number is required";
      setError(msg);
      return { success: false, message: msg };
    }

    setOtpResending(true);
    setError(null);

    try {
      const response = await resendWorkerOtpAPI(digitsOnly);

      if (response?.success === false || response?.data?.success === false) {
        const errorMsg = response.message || "Failed to resend OTP.";
        setError(errorMsg);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errorMsg,
        });
        return { success: false, message: errorMsg };
      }

      const successMsg = response?.message || "OTP resent successfully!";
      Swal.fire({
        icon: "success",
        title: "OTP Resent",
        text: successMsg,
        timer: 2000,
        showConfirmButton: false,
      });
      return { success: true, message: successMsg };
    } catch (err) {
      console.error("Resend OTP error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (err.request ? "Network error. Check your connection." : "Failed to resend OTP. Please try again.");
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMsg,
      });
      return { success: false, message: errorMsg };
    } finally {
      setOtpResending(false);
    }
  };

  // VERIFY OTP + LOGIN
//   const verifyOtp = async (mobileNumber, otp) => {
//     const digitsOnly = mobileNumber?.replace(/\D/g, "");

//     if (!digitsOnly || digitsOnly.length !== 10) {
//       const msg = "Invalid mobile number";

//       setError(msg);

//       return {
//         success: false,
//         message: msg,
//       };
//     }

//     if (!otp || otp.length !== 6) {
//       const msg = "OTP must be 6 digits";

//       setError(msg);

//       return {
//         success: false,
//         message: msg,
//       };
//     }

//     setOtpVerifying(true);
//     setError(null);

//     try {
//       const data = await verifyWorkerOtpAPI(digitsOnly, otp);
//       if (data?.data?.success === false) {
//         const errorMsg = data?.message || "Invalid OTP";

//         setError(errorMsg);

//         Swal.fire({
//           icon: "error",
//           title: "Verification Failed",
//           text: errorMsg,
//         });

//         return {
//           success: false,
//           message: errorMsg,
//         };
//       }

//       // const { worker, token, profile_status } = data?.data || {};

//       // if (!worker || !token) {
//       //   throw new Error("Invalid server response");
//       // }
//       const payload = data?.data;
//       if (payload?.next_step === "aadhaar_verification") {
//   // Remove any old mobile number first
//   Cookies.remove("verified_mobile");

//   // Save the newly verified mobile
//   Cookies.set("verified_mobile", digitsOnly, cookieOptions);

//   navigate("/worker/register", {
//     replace: true,
//   });

//   return {
//     success: true,
//   };
// }
// const {
//   worker,
//   token,
//   profile_status,
// } = payload;

// if (!worker || !token) {
//   throw new Error("Invalid server response");
// }

//       // SAVE IMPORTANT DATA
//       Cookies.set("user", JSON.stringify(worker), cookieOptions);

//       Cookies.set("token", token, cookieOptions);

//       Cookies.set("profile_status", profile_status, cookieOptions);

//       Cookies.set("role", "worker", cookieOptions);

//       // LOGIN
//       login(worker, token, "worker", profile_status);

//       // SUCCESS ALERT
//       await Swal.fire({
//         icon: "success",
//         title: "Login Successful!",
//         text:
//           profile_status === "pending"
//             ? "Continue your registration."
//             : "Welcome to your worker dashboard.",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       // REDIRECT BASED ON PROFILE STATUS
//       if (profile_status === "pending") {
//         navigate("/worker/register", {
//           replace: true,
//         });
//       } else {
//         navigate("/worker/dashboard", {
//           replace: true,
//         });
//       }

//       return {
//         success: true,
//       };
//     } catch (err) {
//       console.error("Verify OTP error:", err);

//       let errorMsg = "Invalid OTP or login failed.";

//       if (err.response) {
//         const status = err.response.status;

//         if (status === 401 || status === 403) {
//           errorMsg = err.response.data?.message || "Invalid OTP.";
//         } else if (status === 404) {
//           errorMsg = "Worker account not found.";
//         } else {
//           errorMsg = err.response.data?.message || errorMsg;
//         }
//       } else if (err.request) {
//         errorMsg = "Network error. Please check your connection.";
//       } else if (err.message) {
//         errorMsg = err.message;
//       }

//       setError(errorMsg);

//       Swal.fire({
//         icon: "error",
//         title: "Verification Failed",
//         text: errorMsg,
//       });

//       return {
//         success: false,
//         message: errorMsg,
//       };
//     } finally {
//       setOtpVerifying(false);
//     }
//   };

const verifyOtp = async (mobileNumber, otp) => {
  const digitsOnly = mobileNumber?.replace(/\D/g, "");

  if (!digitsOnly || digitsOnly.length !== 10) {
    const msg = "Invalid mobile number";
    setError(msg);
    return { success: false, message: msg };
  }

  if (!otp || otp.length !== 6) {
    const msg = "OTP must be 6 digits";
    setError(msg);
    return { success: false, message: msg };
  }

  setOtpVerifying(true);
  setError(null);

  try {
    const data = await verifyWorkerOtpAPI(digitsOnly, otp);
    const payload = data?.data;

    if (payload?.success === false) {
      const errorMsg = data?.message || "Invalid OTP";
      setError(errorMsg);
      Swal.fire({ icon: "error", title: "Verification Failed", text: errorMsg });
      return { success: false, message: errorMsg };
    }

    const { next_step, worker, token, profile_status, kyc_approved } = payload || {};

    // ============ NEW USER -> Aadhaar verification flow ============
    if (next_step === "aadhaar_verification") {
      Cookies.remove("verified_mobile");
      Cookies.set("verified_mobile", digitsOnly, cookieOptions);
      navigate("/worker/register", { replace: true });
      return { success: true };
    }

    // ============ EXISTING USER -> ALWAYS go to dashboard ============
    if (next_step === "dashboard") {
      if (!worker || !token) {
        throw new Error("Invalid server response");
      }

      Cookies.set("user", JSON.stringify(worker), cookieOptions);
      Cookies.set("token", token, cookieOptions);
      Cookies.set("profile_status", profile_status, cookieOptions);
      Cookies.set("role", "worker", cookieOptions);

      if (kyc_approved !== undefined) {
        Cookies.set("kyc_approved", String(kyc_approved), cookieOptions);
      }

      login(worker, token, "worker", profile_status);

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome to your worker dashboard.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/worker/dashboard", { replace: true });
      return { success: true };
    }

    throw new Error("Unexpected server response");
  } catch (err) {
    console.error("Verify OTP error:", err);

    let errorMsg = "Invalid OTP or login failed.";
    if (err.response) {
      const status = err.response.status;
      if (status === 401 || status === 403) {
        errorMsg = err.response.data?.message || "Invalid OTP.";
      } else if (status === 404) {
        errorMsg = "Worker account not found.";
      } else {
        errorMsg = err.response.data?.message || errorMsg;
      }
    } else if (err.request) {
      errorMsg = "Network error. Please check your connection.";
    } else if (err.message) {
      errorMsg = err.message;
    }

    setError(errorMsg);
    Swal.fire({ icon: "error", title: "Verification Failed", text: errorMsg });
    return { success: false, message: errorMsg };
  } finally {
    setOtpVerifying(false);
  }
};

  const clearError = () => setError(null);

  return {
    sendOtp,
    resendOtp,
    verifyOtp,
    loading: otpSending || otpVerifying,
    otpSending,
    otpResending,
    otpVerifying,
    error,
    clearError,
  };
};
