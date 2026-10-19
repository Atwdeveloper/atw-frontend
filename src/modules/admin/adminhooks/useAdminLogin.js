// // src/modules/admin/hooks/useAdminLogin.js
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminLoginAPI } from "../../../api/admin/adminAuthAPI";
// import { useAuth } from "../../../common/hooks/useAuth";
// import Swal from "sweetalert2";

// export const useAdminLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleLogin = async (username, password) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await adminLoginAPI(username, password);
      
//       // If we get here, the API call didn't throw an error
//       // Check if response indicates success
//       if (response.data && response.data.token && response.data.user) {
//         const { user, token, role } = response.data;
//         const userRole = role || 'admin';
        
//         // Call login function
//         login(user, token, userRole);
        
//         Swal.fire({
//           icon: "success",
//           title: "Login Successful",
//           text: "Redirecting to dashboard...",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => {
//           navigate("/admin/dashboard", { replace: true });
//         });
        
//       } else {
//         // Handle cases where API returns 200 but with error in data
//         const errorMessage = response?.message || 
//                            response?.detail || 
//                            "Login failed. Please try again.";
        
//         setError(errorMessage);
//         Swal.fire({
//           icon: "error",
//           title: "Login Failed",
//           text: errorMessage,
//         });
//       }
      
//     } catch (err) {
//       console.error("Login error:", err);
      
//       let errorMessage = "Login failed. Please try again.";
      
//       if (err.response?.data) {
//         errorMessage = err.response.data.message || 
//                       err.response.data.detail || 
//                       err.response.data.error || 
//                       `Error: ${err.response.status}`;
//       } else if (err.request) {
//         errorMessage = "Network error: Unable to connect to server";
//       } else {
//         errorMessage = err.message || "Login failed";
//       }
      
//       setError(errorMessage);
//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: errorMessage,
//       }); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { handleLogin, loading, error };
// };

// src/modules/admin/hooks/useAdminLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginAPI } from "../../../api/admin/adminAuthAPI";
import Swal from "sweetalert2";

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (username, password, recaptchaToken) => {
    setLoading(true);
    setError("");
    try {
      const response = await adminLoginAPI(username, password, recaptchaToken);

      // Login step now only sends an OTP — no token is issued here.
      // response.data is expected to look like: { success: true, email: "..." }
      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: response.message || "Please check your email for the OTP",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/verify-otp", {
            replace: true,
            state: { username },
          });
        });
      } else {
        const errorMessage =
          response?.message || response?.detail || "Login failed. Please try again.";

        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
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

  return { handleLogin, loading, error };
};