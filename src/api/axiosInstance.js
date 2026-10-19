import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://anytimework.in/anytimework/public/api/",
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper function to determine redirect URL
const getRedirectUrl = () => {
  const userRole = Cookies.get("role");
  const currentPath = window.location.pathname;

  // Priority 1: Use user role from auth context (most accurate)
  if (userRole === "admin") return "/admin/login";
  if (userRole === "company") return "/company/login";
  if (userRole === "worker") return "/worker/login";

  // Priority 2: Use current path to determine context
  if (currentPath.startsWith("/admin")) return "/admin/login";
  if (currentPath.startsWith("/company")) return "/company/login";
  if (currentPath.startsWith("/worker")) return "/worker/login";

  // Default fallback
  return "/worker/login";
};

// Handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const redirectUrl = getRedirectUrl();

      // Clear all authentication data
      const authItems = ["token", "user", "role"];
      authItems.forEach((item) => {
        Cookies.remove(item);
        localStorage.removeItem(item);
      });

      // Show notification before redirect (except for auth endpoints)
      if (!error.config?.url?.includes("/auth/")) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again to continue.",
          icon: "warning",
          confirmButtonText: "Login",
          timer: 5000,
          showConfirmButton: true,
        }).then((result) => {
          window.location.href = redirectUrl;
        });
      } else {
        // Immediate redirect for auth endpoints
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
