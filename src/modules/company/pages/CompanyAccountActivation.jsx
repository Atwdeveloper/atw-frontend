import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Shield, Mail } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as companyAuthApi from "../../../api/company/companyAuthAPI"; // Adjust the path as needed

const CompanyAccountActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error, expired
  const [loading, setLoading] = useState(true);
  const [activationData, setActivationData] = useState(null);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Call the actual API for account activation
        const response = await companyAuthApi.activateAccountAPI(token);

        if (response.status === 200) {
          // Successful activation
          setActivationData({
            message: response.data.message || "Account activated successfully",
            companyData: response.data.company || null,
            // uniqueCode: response.data.unique_code || generateUniqueCode(),
            activatedAt: response.data.activated_at || new Date().toISOString(),
          });

          setStatus("success");

          // Show success message with SweetAlert
          Swal.fire({
            icon: "success",
            title: "Account Activated Successfully!",
            text: response.message || "Account Activated Successfully",

            confirmButtonText: "Proceed to Login",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          });
        } else {
          // Check if it's an expired token
          if (
            response.message &&
            (response.message.includes("expired") ||
              response.message.includes("Expired"))
          ) {
            setStatus("expired");
            Swal.fire({
              icon: "warning",
              title: "Link Expired",
              text: response.message || "This activation link has expired.",
              confirmButtonText: "Request New Link",
              confirmButtonColor: "#3085d6",
            });
          } else {
            setStatus("error");
            Swal.fire({
              icon: "error",
              title: "Activation Failed",
              text: response.message || "Invalid or used activation link.",
              confirmButtonText: "OK",
              confirmButtonColor: "#d33",
            });
          }
        }
      } catch (error) {
        console.error("Activation error:", error);

        // Extract error message from response
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred during activation";

        // Check for expired token in error message
        if (errorMessage.toLowerCase().includes("expired")) {
          setStatus("expired");
          Swal.fire({
            icon: "warning",
            title: "Link Expired",
            text: errorMessage,
            confirmButtonText: "Request New Link",
            confirmButtonColor: "#3085d6",
          });
        } else {
          setStatus("error");
          Swal.fire({
            icon: "error",
            title: "Activation Failed",
            text: errorMessage,
            confirmButtonText: "OK",
            confirmButtonColor: "#d33",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // For demo mode only - remove this in production
    const demoActivateAccount = () => {
      setTimeout(() => {
        if (token && token.startsWith("demo-activation-token-")) {
          // Find registration in localStorage
          const registrations = JSON.parse(
            localStorage.getItem("demo_company_registrations") || "[]",
          );
          const registration = registrations.find(
            (reg) => reg.activation_token === token,
          );

          if (registration) {
            // Update registration status
            const updatedRegistrations = registrations.map((reg) =>
              reg.activation_token === token
                ? {
                    ...reg,
                    is_active: true,
                    activated_at: new Date().toISOString(),
                  }
                : reg,
            );

            // localStorage.setItem('demo_company_registrations', JSON.stringify(updatedRegistrations));

            setActivationData({
              companyName: registration.company_name,
              email: registration.email,
              // uniqueCode: registration.unique_code,
              message: "Account activated successfully!",
            });

            setStatus("success");
            Swal.fire({
              icon: "success",
              title: "Demo Account Activated!",
              text: "Account activated successfully! (Demo Mode)",
              confirmButtonText: "OK",
              confirmButtonColor: "#3085d6",
            });
          } else {
            setStatus("error");
          }
        } else {
          // Check if token is expired (demo)
          const isExpired = Math.random() > 0.8; // 20% chance of expired for demo
          if (isExpired) {
            setStatus("expired");
            Swal.fire({
              icon: "warning",
              title: "Demo: Link Expired",
              text: "This activation link has expired. (Demo Mode)",
              confirmButtonText: "OK",
              confirmButtonColor: "#3085d6",
            });
          } else {
            setStatus("error");
            Swal.fire({
              icon: "error",
              title: "Demo: Invalid Link",
              text: "Invalid or used activation link. (Demo Mode)",
              confirmButtonText: "OK",
              confirmButtonColor: "#d33",
            });
          }
        }
        setLoading(false);
      }, 2000);
    };

    // Check if we should use demo mode
    // const useDemoMode = process.env.REACT_APP_USE_DEMO === 'true' || !navigator.onLine;

    activateAccount();
  }, [token]);

  const handleResendEmail = async () => {
    try {
      // Check if we have email in activation data
      if (activationData?.email) {
        const response = await companyAuthApi.requestPasswordResetAPI(
          activationData.email,
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Email Resent!",
            text:
              response.data?.message ||
              "Activation email has been resent. Please check your inbox.",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        }
      }
      // else {
      //   // If no email, redirect to resend activation page
      //   navigate('/company/register/resend-activation');
      // }
    } catch (error) {
      console.error("Resend email error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Resend Email",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  // const generateUniqueCode = () => {
  //   const timestamp = Date.now().toString().slice(-6);
  //   const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  //   return `COMP${timestamp}${random}`.toUpperCase();
  // };

  const handleProceedToLogin = () => {
    navigate("/company/login");
  };

  const handleProceedToTerms = () => {
    navigate(`/company/terms`);
  };

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Verifying Your Account
            </h2>
            <p className="text-gray-600">
              Please wait while we activate your company account...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Account Activated!
            </h2>
            <p className="text-gray-600 mb-6">
              {activationData?.message ||
                "Your company account has been successfully activated."}
            </p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/company/login"
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Invalid Activation Link
            </h2>
            <p className="text-gray-600 mb-6">
              The activation link is invalid or has already been used.
            </p>
            <div className="space-y-4 max-w-xs mx-auto">
              <Link
                to="/company/login"
                className="block w-full px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Account Activation
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your company registration
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {renderContent()}

          {/* Help Section */}
          {(status === "error" || status === "expired") && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-800">Need Help?</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Check your spam or junk folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>
                    Ensure you're clicking the latest activation email
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Contact support if you continue to face issues</span>
                </li>
              </ul>
              <div className="mt-4">
                <a
                  href="mailto:support@companyportal.com"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  support@companyportal.com
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Company Portal. All rights reserved.
          </p>
          <p className="mt-1 text-xs">
            Need assistance? Contact us at{" "}
            <a
              href="mailto:support@companyportal.com"
              className="text-blue-600 hover:underline"
            >
              support@companyportal.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyAccountActivation;
