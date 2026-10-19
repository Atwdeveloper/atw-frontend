import axiosInstance from "../axiosInstance";

export const adminLoginAPI = async (username, password, recaptchaToken) => {
  const response = await axiosInstance.post("/admin/login", {
    username,
    password,
    recaptcha_token: recaptchaToken,
  });
  return response.data;
};
// ==================== OTP VERIFICATION ====================
 
// Verify OTP after login step (returns token + user on success)
export const verifyAdminOtpAPI = async (username, otp) => {
  const response = await axiosInstance.post("/admin/verify-otp", {
    username,
    otp,
  });
  return response.data;
};
 
// Resend OTP if user didn't receive it / it expired
export const resendAdminOtpAPI = async (username) => {
  const response = await axiosInstance.post("/admin/resend-otp", {
    username,
  });
  return response.data;
};

// ==================== FORGOT / RESET PASSWORD ====================

// Request password reset (send email)
export const requestPasswordResetAPI = async (email) => {
  try {
    const response = await axiosInstance.post("/admin/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    if (process.env.REACT_APP_USE_DEMO === "true" || !navigator.onLine) {
      return demoRequestPasswordReset(email);
    }
    throw error;
  }
};

export const resetPassword = async ({ token, email, password }) => {
  const response = await axiosInstance.post("/admin/reset-password", {
    token,
    email,
    password,
  });

  return response.data;
};

const demoAdmins = ["admin@demo.com", "superadmin@demo.com"];

const demoRequestPasswordReset = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demoAdmins.includes(email)) {
        const resetToken = "demo-admin-reset-token-" + Date.now();
        sessionStorage.setItem(`demo_admin_reset_${email}`, resetToken);
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
              message: "No admin account found with this email address",
            },
          },
        });
      }
    }, 1000);
  });
};

const demoResetPassword = async (token, email, password, confirm_password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        reject({
          response: {
            data: {
              message: "Password must contain uppercase, lowercase and numbers",
            },
          },
        });
        return;
      }

      let foundEmail = null;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith("demo_admin_reset_")) {
          const storedToken = sessionStorage.getItem(key);
          if (storedToken === token) {
            foundEmail = key.replace("demo_admin_reset_", "");
            break;
          }
        }
      }

      if (foundEmail && foundEmail === email) {
        sessionStorage.removeItem(`demo_admin_reset_${foundEmail}`);
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

// ==================== BACKWARD COMPATIBILITY EXPORTS ====================
export { requestPasswordResetAPI as requestPasswordReset };
// export { resetPasswordAPI as resetPassword };
export { demoRequestPasswordReset, demoResetPassword };
