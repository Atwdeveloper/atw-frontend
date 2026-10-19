import axiosInstance from "../axiosInstance";

/**
 * Company Authentication API Service
 * Centralized API calls for all company auth operations
 */

// ==================== INDUSTRIES API ====================
export const getIndustriesAPI = async (params = {}) => {
  const response = await axiosInstance.get("/get-industries", { params });
  return response.data;
};

// ==================== GST VERIFICATION API ====================
export const verifyGstNumberAPI = async (gstin) => {
  const response = await axiosInstance.post("/company/gst-verify", { gstin });
  return response.data; // { success, message, data: { company_name, gst_number, pan_number, state, ... } }
};

// ==================== AUTHENTICATION API ====================

// Login company
export const loginCompanyAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post("/company/login", credentials);
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoCompanyLoginFunc(credentials.email, credentials.password);
    }
    throw error;
  }
};

export const acceptCompanyTermsAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post(
      "/company/accept-terms",
      credentials,
    );
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoCompanyLoginFunc(credentials.email, credentials.password);
    }
    throw error;
  }
};

// Register new company
export const registerCompanyAPI = async (companyData) => {
  try {
    const response = await axiosInstance.post("/company/register", companyData);
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoCompanyRegisterFunc(companyData);
    }
    throw error;
  }
};

// Request password reset - Send email
export const requestPasswordResetAPI = async (email) => {
  try {
    const response = await axiosInstance.post("/company/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoRequestPasswordResetFunc(email);
    }
    throw error;
  }
};

// Reset password with token
export const resetPasswordAPI = async ({
  token,
  email,
  password,
  confirm_password,
}) => {
  try {
    const response = await axiosInstance.post("/company/reset-password", {
      token,
      email, // Include email
      password: password,
      password_confirmation: confirm_password,
    });
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoResetPasswordFunc(token, email, password, confirm_password); // Update demo function too
    }
    throw error;
  }
};

// Verify company token (for account activation)
export const verifyCompanyTokenAPI = async (token) => {
  try {
    const response = await axiosInstance.get("/company/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get company profile
export const getCompanyProfileAPI = async (token) => {
  try {
    const response = await axiosInstance.get("/company/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Activate account with token
export const activateAccountAPI = async (token) => {
  try {
    const response = await axiosInstance.post(
      `/company-owner/verify-email/${token}`,
      {},
    );
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoActivateAccountFunc(token);
    }
    throw error;
  }
};

// Refresh token
export const refreshTokenAPI = async (refreshToken) => {
  try {
    const response = await axiosInstance.post("/company/auth/refresh-token", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutCompanyAPI = async (token) => {
  try {
    const response = await axiosInstance.post(
      "/company/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== DEMO FUNCTIONS ====================

// Demo login fallback function
const demoCompanyLoginFunc = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const demoCompanies = {
        "techsolutions@demo.com": {
          success: true,
          data: {
            token: "demo-token-123",
            refresh_token: "demo-refresh-123",
            company: {
              id: 1,
              email: "techsolutions@demo.com",
              name: "Tech Solutions Inc.",
              is_approved: true,
              is_active: true,
              has_accepted_terms: false,
              industry: "Information Technology",
              contact_person: "John Doe",
              phone: "+1 (555) 123-4567",
              address: "123 Tech Street, Silicon Valley, CA",
            },
          },
        },
        "buildright@demo.com": {
          success: true,
          data: {
            token: "demo-token-456",
            refresh_token: "demo-refresh-456",
            company: {
              id: 3,
              email: "buildright@demo.com",
              name: "BuildRight Constructions",
              is_approved: true,
              is_active: true,
              has_accepted_terms: true,
              industry: "Construction",
              contact_person: "Sarah Smith",
              phone: "+1 (555) 987-6543",
              address: "456 Construction Ave, New York, NY",
            },
          },
        },
      };

      const result = demoCompanies[email];

      if (result && password === "demo123") {
        resolve(result);
      } else {
        reject({
          response: {
            data: {
              message: "Incorrect email address or password",
            },
          },
        });
      }
    }, 1000);
  });
};

// Demo registration fallback function
const demoCompanyRegisterFunc = async (companyData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingEmails = ["existing@demo.com"];
      if (existingEmails.includes(companyData.email)) {
        reject({
          response: {
            data: {
              message: "Email already registered",
            },
          },
        });
      } else {
        const uniqueCode = "COMP" + Date.now().toString().slice(-8);

        resolve({
          success: true,
          data: {
            message:
              "Registration successful. Please check your email for activation link.",
            unique_code: uniqueCode,
            company_id: Date.now(),
            activation_token: "demo-token-" + Date.now(),
          },
        });
      }
    }, 1500);
  });
};

// Demo account activation function
const demoActivateAccountFunc = async (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token && token.startsWith("demo-token-")) {
        resolve({
          success: true,
          data: {
            message: "Account activated successfully",
            is_active: true,
            activated_at: new Date().toISOString(),
          },
        });
      } else {
        reject({
          response: {
            data: {
              message: "Invalid or expired activation token",
            },
          },
        });
      }
    }, 1000);
  });
};

// Demo forgot password fallback function
const demoRequestPasswordResetFunc = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const demoCompanies = [
        "techsolutions@demo.com",
        "buildright@demo.com",
        "pending@demo.com",
        "inactive@demo.com",
      ];

      if (demoCompanies.includes(email)) {
        const resetToken = "demo-reset-token-" + Date.now();

        // Store in session storage for demo
        sessionStorage.setItem(`demo_reset_${email}`, resetToken);

        resolve({
          success: true,
          data: {
            message: "Password reset link has been sent to your email.",
            email: email,
          },
        });
      } else {
        reject({
          response: {
            data: {
              message: "No account found with this email address",
            },
          },
        });
      }
    }, 1000);
  });
};

// Demo reset password fallback function
const demoResetPasswordFunc = async (token, password, confirm_password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate passwords match
      if (password !== confirm_password) {
        reject({
          response: {
            data: {
              message: "Passwords do not match",
            },
          },
        });
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        reject({
          response: {
            data: {
              message: "Password must be at least 8 characters",
            },
          },
        });
        return;
      }

      // Find email by token in session storage
      let foundEmail = null;

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith("demo_reset_")) {
          const storedToken = sessionStorage.getItem(key);
          if (storedToken === token) {
            foundEmail = key.replace("demo_reset_", "");
            break;
          }
        }
      }

      if (foundEmail) {
        // Clear the reset token
        sessionStorage.removeItem(`demo_reset_${foundEmail}`);

        resolve({
          success: true,
          data: {
            message:
              "Password has been reset successfully. You can now login with your new password.",
            email: foundEmail,
          },
        });
      } else {
        reject({
          response: {
            data: {
              message: "Invalid or expired reset token",
            },
          },
        });
      }
    }, 1000);
  });
};

// ==================== COMMON UTILS ====================

// Set company auth headers
export const setCompanyAuthHeaders = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Remove company auth headers
export const removeCompanyAuthHeaders = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

// Check if company is authenticated
export const isCompanyAuthenticated = () => {
  const token = localStorage.getItem("company_token");
  return !!token;
};

// Get company token
export const getCompanyToken = () => {
  return localStorage.getItem("company_token");
};

// Store company auth data
export const storeCompanyAuthData = (data) => {
  if (data.token) {
    localStorage.setItem("company_token", data.token);
  }
  if (data.refresh_token) {
    localStorage.setItem("company_refresh_token", data.refresh_token);
  }
  if (data.company) {
    localStorage.setItem("company_data", JSON.stringify(data.company));
  }
};

// Clear company auth data
export const clearCompanyAuthData = () => {
  localStorage.removeItem("company_token");
  localStorage.removeItem("company_refresh_token");
  localStorage.removeItem("company_data");
  removeCompanyAuthHeaders();
};

// Get company data
export const getCompanyData = () => {
  const data = localStorage.getItem("company_data");
  return data ? JSON.parse(data) : null;
};

// ==================== BACKWARD COMPATIBILITY EXPORTS ====================

// Export demo functions with original names for backward compatibility
export const demoCompanyLogin = demoCompanyLoginFunc;
export const demoCompanyRegister = demoCompanyRegisterFunc;
export const demoActivateAccount = demoActivateAccountFunc;
export const demoRequestPasswordReset = demoRequestPasswordResetFunc;
export const demoResetPassword = demoResetPasswordFunc;

// Export API functions with and without API suffix for backward compatibility
export const loginCompany = loginCompanyAPI;
export const registerCompany = registerCompanyAPI;
export const requestPasswordReset = requestPasswordResetAPI;
export const resetPassword = resetPasswordAPI;
export const activateAccount = activateAccountAPI;
export const getCompanyProfile = getCompanyProfileAPI;
export const logoutCompany = logoutCompanyAPI;
export const verifyCompanyToken = verifyCompanyTokenAPI;
export const refreshToken = refreshTokenAPI;

export const registerrCompany = async (data) => {
  const response = await axiosInstance.post("/company/register", data);
  return response.data;
};

/**
 * 📥 Get Saved Registration Data (Prefill Form)
 * 👉 Used when user comes back to continue registration
 */

export const getCompanyRegisterData = async () => {
  const response = await axiosInstance.get("/company/edit");
  return response.data;
};

/**
 * 💾 Save Step Data (All Steps)
 * 👉 Works for step 2, 3, 4... (partial updates)
 *
 * Example:
 * updateRegisterData({ middle_name: "K", gender: "male" })
 */
export const updateCompanyData = async (data) => {
  const response = await axiosInstance.post("/company/edit", data);
  return response.data;
};

export const getStatesAPI = async () => {
  const response = await axiosInstance.get("/get-states");
  return response.data;
};
export const getCitiesByStateAPI = async (state_id) => {
  const response = await axiosInstance.post("/get-cities", {
    state_id,
  });

  return response.data;
};
export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const logoutAPI = () => {
  return axiosInstance.get("/company/logout");
};
