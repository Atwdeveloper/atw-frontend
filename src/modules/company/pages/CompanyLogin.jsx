// import React, { useState, useEffect } from "react";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   Building,
//   AlertCircle,
//   Phone,
// } from "lucide-react";
// import { useCompanyLogin } from "../companyhooks/useCompanyLogin";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// const CompanyLogin = () => {
//   const { handleLogin, loading, error } = useCompanyLogin();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const navigate = useNavigate();
//   useEffect(() => {
//     const loadCookieData = () => {
//       setLogoUrl(Cookies.get("logo_url") || "");
//       setSupportEmail(Cookies.get("support_email") || "");
//       setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//       setPhoneNumber(Cookies.get("phone_number") || "");
//     };

//     loadCookieData();

//     const timer = setTimeout(loadCookieData, 500);

//     return () => clearTimeout(timer);
//   }, []);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     let newErrors = { email: "", password: "" };
//     let isValid = true;

//     if (!formData.email.trim()) {
//       newErrors.email = "Email address is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     handleLogin(formData.email, formData.password);
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/admin/Login-Bg.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>

//       <div className="relative z-10 w-full max-w-md p-4">
//         <div className="text-center mb-3">
//           <div className="flex justify-center mb-4">
//             <div onClick={() => navigate("/")} className="cursor-pointer">
//               {logoUrl ? (
//                 <img src={logoUrl} alt="Company Logo" className="max-h-24" />
//               ) : (
//                 <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
//                   <Building className="w-10 h-10 text-white" />
//                 </div>
//               )}
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Company Portal
//           </h1>
//           <p className="text-gray-600">
//             Access your company dashboard and manage your operations
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//           <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
//             Welcome Back{" "}
//             <span className="font-light ml-2">Sign in to continue</span>
//           </h2>

//           <form className="space-y-4" onSubmit={onSubmit}>
//             {/* Email Field */}
//             <div className="space-y-1">
//               <label className="text-sm font-medium text-gray-700">
//                 Company Email Address <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                   <Mail size={20} />
//                 </span>
//                 <input
//                   type="email"
//                   name="email"
//                   maxLength={100}
//                   placeholder="company@example.com"
//                   onChange={handleChange}
//                   value={formData.email}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
//                     errors.email
//                       ? "border-red-500"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm flex items-center gap-1">
//                   <AlertCircle size={14} />
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="space-y-1">
//               <label className="text-sm font-medium text-gray-700">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                   <Lock size={20} />
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter your password"
//                   onChange={handleChange}
//                   maxLength={25}
//                   value={formData.password}
//                   className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
//                     errors.password
//                       ? "border-red-500"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 />
//                 <span
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </span>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm flex items-center gap-1">
//                   <AlertCircle size={14} />
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember & Forgot */}
//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <span className="text-gray-700">Remember me</span>
//               </label>
//               <Link
//                 to="/company/forgot-password"
//                 className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* API Error */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-red-700 text-sm font-medium">
//                       Login Failed
//                     </p>
//                     <p className="text-red-600 text-sm mt-1">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
//               }`}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </button>

//             {/* WhatsApp & Call Buttons - Fixed Alignment */}
//             {(whatsappNumber || phoneNumber) && (
//               <div className="pt-6 border-t border-gray-200">
//                 <p className="text-sm font-semibold text-gray-500 text-center mb-3">
//                   Help & Support
//                 </p>
//                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
//                   {whatsappNumber && (
//                     <a
//                       href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors w-full sm:w-auto"
//                     >
//                       <img
//                         src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                         alt="WhatsApp"
//                         className="w-5 h-5"
//                       />
//                       <span className="font-medium">WhatsApp</span>
//                     </a>
//                   )}
//                   {phoneNumber && (
//                     <a
//                       href={`tel:${phoneNumber}`}
//                       className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors w-full sm:w-auto"
//                     >
//                       <Phone size={20} />
//                       <span className="font-medium">Call Us</span>
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Terms */}
//             <div className="text-center pt-4 border-t border-gray-200">
//               <p className="text-gray-600 text-sm">
//                 Already have a company account?{" "}
//                 <Link
//                   to="/company/register"
//                   className="text-green-600 hover:text-green-800 font-semibold hover:underline transition"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Company Portal. All rights reserved.
//           </p>
//           <p className="mt-1">
//             Need help?{" "}
//             <a
//               href={`mailto:${supportEmail}`}
//               className="text-amber-300 hover:underline"
//             >
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>

//       <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
//     </div>
//   );
// };

// export default CompanyLogin;
import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  AlertCircle,
  Phone,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useCompanyLogin } from "../companyhooks/useCompanyLogin";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CompanyLogin = () => {
  const { handleLogin, loading, error } = useCompanyLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // A failed login invalidates the already-used captcha token — reset the
  // widget so the user has to verify again before retrying.
  useEffect(() => {
    if (error) {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  }, [error]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!captchaToken) {
      setCaptchaError("Please verify that you are not a robot");
      return;
    }
    setCaptchaError("");

    handleLogin(formData.email, formData.password, captchaToken);
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
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Login to access your company account
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
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
                    onChange={handleChange}
                    value={formData.email}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    maxLength={25}
                    value={formData.password}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link
                  to="/company/forgot-password"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* reCAPTCHA */}
              <div className="flex flex-col items-start gap-1">
                <div style={{ width: 304 * 0.85, height: 78 * 0.85 }}>
                  <div
                    style={{ transform: "scale(0.85)", transformOrigin: "0 0" }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={(token) => {
                        setCaptchaToken(token);
                        setCaptchaError("");
                      }}
                      onExpired={() => setCaptchaToken(null)}
                    />
                  </div>
                </div>
                {captchaError && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {captchaError}
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
                        Login Failed
                      </p>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign In Button */}
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
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
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

export default CompanyLogin;