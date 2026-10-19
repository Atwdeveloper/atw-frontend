// import React, { useState } from "react";
// import { Mail, Key, CheckCircle, AlertCircle, Shield } from "lucide-react";
// import { useCompanyForgotPassword } from "../companyhooks/useCompanyForgotPassword";

// const CompanyForgotPassword = () => {
//   const { requestPasswordReset, loading, error, success, clearError } =
//     useCompanyForgotPassword();
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setEmailError("");
//     clearError();

//     // Validate email
//     if (!email.trim()) {
//       setEmailError("Email address is required");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setEmailError("Please enter a valid email address");
//       return;
//     }

//     await requestPasswordReset(email);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
//       <div className="max-w-lg w-full">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
//               <Key className="w-10 h-10 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             Reset Your Password
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Enter your email address and we'll send you a reset link
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//           {!success ? (
//             <>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Shield className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     Forgot Password?
//                   </h2>
//                   <p className="text-gray-600 text-sm">
//                     Don't worry, we'll help you reset it
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                     <Mail className="w-4 h-4" />
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       setEmailError("");
//                       clearError();
//                     }}
//                     placeholder="company@example.com"
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
//                       emailError
//                         ? "border-red-500"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   />
//                   {emailError && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle size={14} />
//                       {emailError}
//                     </p>
//                   )}
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                     <div className="flex items-start gap-3">
//                       <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="text-red-700 text-sm font-medium">
//                           Reset Failed
//                         </p>
//                         <p className="text-red-600 text-sm mt-1">{error}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-lg"
//                   }`}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                       Sending Reset Link...
//                     </div>
//                   ) : (
//                     "Send Reset Link"
//                   )}
//                 </button>
//               </form>
//             </>
//           ) : (
//             /* Success State */
//             <div className="text-center py-6">
//               <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <CheckCircle className="w-12 h-12 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-3">
//                 Check Your Email
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 We've sent a password reset link to{" "}
//                 <span className="font-semibold text-gray-800">{email}</span>
//               </p>

//               <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//                 <h3 className="text-lg font-semibold text-green-800 mb-2">
//                   What's Next?
//                 </h3>
//                 <ul className="space-y-2 text-sm text-green-700">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                     <span>
//                       Check your email for the reset link(Check spam folder
//                       also)
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                     <span>Click the link within 30 minutes</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                     <span>Set your new password</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                     <span>Login with your new credentials</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6 text-gray-500 text-sm">
//           <p>
//             © {new Date().getFullYear()} Company Portal. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyForgotPassword;
import React, { useState, useEffect } from "react";
import { Mail, AlertCircle, CheckCircle, Building, Phone } from "lucide-react";
import { useCompanyForgotPassword } from "../companyhooks/useCompanyForgotPassword";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CompanyForgotPassword = () => {
  const { requestPasswordReset, loading, error, success, clearError } =
    useCompanyForgotPassword();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCookieData = () => {
      setLogoUrl(Cookies.get("logo_url") || "");
      setSupportEmail(Cookies.get("support_email") || "");
      setWhatsappNumber(Cookies.get("whatsapp_number") || "");
      setPhoneNumber(Cookies.get("phone_number") || "");
    };

    loadCookieData();

    const timer = setTimeout(loadCookieData, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    clearError();

    // Validate email
    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    await requestPasswordReset(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl">
        {/* Logo header */}
        <div className="flex justify-center mb-6">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex flex-col items-center"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="max-h-16" />
            ) : (
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Building className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-visible grid grid-cols-1 md:grid-cols-2">
          {/* Left: form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Enter your registered email address
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Company Email Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        maxLength={100}
                        placeholder="company@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                          clearError();
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                          emailError
                            ? "border-red-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* API Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-red-700 text-sm font-medium">
                            Reset Failed
                          </p>
                          <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Reset Link...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Don’t have an account??{" "}
                    <Link
                      to="/company/register"
                      className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition"
                    >
                      Create account
                    </Link>
                  </p>

                  {/* Help & Support */}
                  {(whatsappNumber || phoneNumber) && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 text-center mb-3">
                        Help &amp; Support
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                              alt="WhatsApp"
                              className="w-4 h-4"
                            />
                            WhatsApp Help
                          </a>
                        )}
                        {phoneNumber && (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <Phone size={16} />
                            Call Support
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-3 border-t border-gray-200">
                    <p className="text-gray-500 text-xs">
                      By signing in, you agree to our Terms of Service
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">
                      © {new Date().getFullYear()} Company Portal. All rights
                      reserved.
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Need help?{" "}
                      <a
                        href={`mailto:${supportEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        Contact Support
                      </a>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 text-sm mb-5">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-left">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">
                    What's Next?
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>
                        Check your email for the reset link (Check spam
                        folder also)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Click the link within 30 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Set your new password</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Login with your new credentials</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/company/login"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition text-sm"
                >
                  Back to Login
                </Link>

                <div className="text-center pt-4 mt-4 border-t border-gray-200">
                  <p className="text-gray-400 text-xs">
                    © {new Date().getFullYear()} Company Portal. All rights
                    reserved.
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Need help?{" "}
                    <a
                      href={`mailto:${supportEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: illustration panel */}
          <div className="hidden md:block relative overflow-hidden rounded-r-2xl">
            <img
              src="/images/company/company-portal.png"
              alt="Company Portal"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl font-bold text-white">
                Company Portal
              </h2>
              <p className="text-white/90 text-sm mt-1">
                Login For Company account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForgotPassword;