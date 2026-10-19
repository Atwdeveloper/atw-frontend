// import React, { useState, useEffect } from "react";
// import { User, Phone, AlertCircle, CheckCircle } from "lucide-react";
// import { useWorkerLogin } from "../workerhooks/useWorkerLogin";
// import Cookies from "js-cookie";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const WorkerLogin = () => {
//   const { sendOtp, verifyOtp, loading, otpSending, otpVerifying } =
//     useWorkerLogin();
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [infoMessage, setInfoMessage] = useState("");
//   const [step, setStep] = useState("mobile");
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

//   const validateMobile = (number) => {
//     const digitsOnly = number.replace(/\D/g, "");
//     if (digitsOnly.length === 0) return "Mobile number is required";
//     if (digitsOnly.length !== 10) return "Mobile number must be 10 digits";
//     return "";
//   };

//   const handleMobileChange = (e) => {
//     const raw = e.target.value;
//     const filtered = raw.replace(/\D/g, "").slice(0, 10);
//     setMobile(filtered);
//     if (error) setError("");
//     if (infoMessage) setInfoMessage("");
//   };

//   const handleOtpChange = (e) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 6);
//     setOtp(value);
//     if (error) setError("");
//   };

//   const onSendOtp = async (e) => {
//     e.preventDefault();
//     const validationError = validateMobile(mobile);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
//     setError("");
//     setInfoMessage("");

//     const result = await sendOtp(mobile);
//     if (result.success) {
//       setInfoMessage(result.message || "OTP sent successfully!");
//       setStep("otp");
//     } else {
//       // Error already shown by hook (Swal), but we set local error too
//       setError(result.message || "Failed to send OTP");
//     }
//   };

//   const onVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 6) {
//       setError("Please enter a valid 6-digit OTP");
//       return;
//     }
//     setError("");
//     const result = await verifyOtp(mobile, otp);
//     if (!result.success) {
//       setError(result.message || "Invalid OTP");
//     }
//   };

//   const resetToMobileStep = () => {
//     setStep("mobile");
//     setOtp("");
//     setInfoMessage("");
//     setError("");
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
//                 <img src={logoUrl} alt="Logo" className="max-h-24" />
//               ) : (
//                 <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
//                   <User className="w-10 h-10 text-white" />
//                 </div>
//               )}
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Worker Portal
//           </h1>
//           <p className="text-gray-600">
//             Access your worker dashboard, manage shifts, and get paid
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//           <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
//             {step === "mobile" ? "Welcome Back" : "Verify OTP"}
//             <span className="font-light ml-2">
//               {step === "mobile"
//                 ? "Sign in to continue"
//                 : "Enter the 6-digit code"}
//             </span>
//           </h2>

//           {/* Info Message (API response) */}
//           {infoMessage && (
//             <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
//               <div className="flex items-center gap-2 text-green-700">
//                 <CheckCircle size={18} />
//                 <span className="text-sm">{infoMessage}</span>
//               </div>
//             </div>
//           )}

//           <form
//             className="space-y-4"
//             onSubmit={step === "mobile" ? onSendOtp : onVerifyOtp}
//           >
//             {step === "mobile" ? (
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                     <Phone size={20} />
//                   </span>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     placeholder="Enter 10-digit mobile number"
//                     onChange={handleMobileChange}
//                     value={mobile}
//                     className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
//                       error && !infoMessage
//                         ? "border-red-500"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   />
//                 </div>
//                 {error && !infoMessage && (
//                   <p className="text-red-500 text-sm flex items-center gap-1">
//                     <AlertCircle size={14} />
//                     {error}
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     OTP (One Time Password){" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={handleOtpChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
//                       error
//                         ? "border-red-500"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   />
//                   {error && (
//                     <p className="text-red-500 text-sm flex items-center gap-1">
//                       <AlertCircle size={14} />
//                       {error}
//                     </p>
//                   )}
//                   <button
//                     type="button"
//                     onClick={resetToMobileStep}
//                     className="text-sm text-blue-600 hover:underline mt-2"
//                   >
//                     ← Change mobile number
//                   </button>
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={
//                 loading || (step === "mobile" ? otpSending : otpVerifying)
//               }
//               className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
//                 loading || (step === "mobile" ? otpSending : otpVerifying)
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
//               }`}
//             >
//               {(step === "mobile" ? otpSending : otpVerifying) ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                   {step === "mobile" ? "Sending OTP..." : "Verifying..."}
//                 </div>
//               ) : step === "mobile" ? (
//                 "Send OTP"
//               ) : (
//                 "Verify & Login"
//               )}
//             </button>

//             {/* Help & Support */}
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

//             <div className="text-center pt-2">
//               <p className="text-gray-500 text-xs">
//                 By signing in, you agree to our Terms of Service
//               </p>
//             </div>
//             <div className="text-center pt-4 border-t border-gray-200">
//               <p className="text-gray-600 text-sm">
//                 Don’t have a worker account?{" "}
//                 <Link
//                   to="/worker/register"
//                   className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>

//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Worker Portal. All rights reserved.
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

// export default WorkerLogin;


import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  HardHat,
  Wallet,
  Tablet,
  IndianRupee,
} from "lucide-react";
import { useWorkerLogin } from "../workerhooks/useWorkerLogin";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const WorkerLogin = () => {
  const {
    sendOtp,
    resendOtp,
    verifyOtp,
    loading,
    otpSending,
    otpResending,
    otpVerifying,
  } = useWorkerLogin();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [step, setStep] = useState("mobile");
  const [resendTimer, setResendTimer] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const otpInputRef = useRef(null);
  // Guards the auto-submit so a rejected code isn't re-sent on every render.
  const verifiedOtpRef = useRef("");

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

  const validateMobile = (number) => {
    const digitsOnly = number.replace(/\D/g, "");
    if (digitsOnly.length === 0) return "Mobile number is required";
    if (digitsOnly.length !== 10) return "Mobile number must be 10 digits";
    return "";
  };

  const handleMobileChange = (e) => {
    const raw = e.target.value;
    const filtered = raw.replace(/\D/g, "").slice(0, 10);
    setMobile(filtered);
    if (error) setError("");
    if (infoMessage) setInfoMessage("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    // Editing the code arms the auto-submit again, so correcting a digit and
    // retyping the same six still fires.
    if (value.length < 6) verifiedOtpRef.current = "";
    if (error) setError("");
  };

  const onSendOtp = async (e) => {
    e.preventDefault();
    const validationError = validateMobile(mobile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setInfoMessage("");

    const result = await sendOtp(mobile);
    if (result.success) {
      setInfoMessage(result.message || "OTP sent successfully!");
      setStep("otp");
      setResendTimer(45);
    } else {
      // Error already shown by hook (Swal), but we set local error too
      setError(result.message || "Failed to send OTP");
    }
  };

  const onResendOtp = async () => {
    setError("");
    const result = await resendOtp(mobile);
    if (result.success) {
      setInfoMessage(result.message || "OTP resent successfully!");
      setOtp("");
      verifiedOtpRef.current = "";
      setResendTimer(45);
    } else {
      setError(result.message || "Failed to resend OTP");
    }
  };

  // Countdown for the Resend OTP button, mirroring the Aadhaar OTP screen.
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendTimer]);

  const onVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setError("");
    const result = await verifyOtp(mobile, otp);
    if (!result.success) {
      setError(result.message || "Invalid OTP");
    }
  };

  // Put the cursor in the OTP box the moment the step appears, so the worker
  // can type straight away without tapping it first.
  useEffect(() => {
    if (step === "otp") otpInputRef.current?.focus();
  }, [step]);

  // Verify as soon as the sixth digit lands — there's nothing left to decide.
  useEffect(() => {
    if (step !== "otp" || otp.length !== 6 || otpVerifying || verifiedOtpRef.current === otp)
      return;
    verifiedOtpRef.current = otp;
    onVerifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  const resetToMobileStep = () => {
    setStep("mobile");
    setOtp("");
    verifiedOtpRef.current = "";
    setInfoMessage("");
    setError("");
    setResendTimer(0);
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
              <img src={logoUrl} alt="Logo" className="max-h-16" />
            ) : (
              <img
                src="/images/logo.png"
                alt="Default Logo"
                className="max-h-16"
              />
            )}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-visible grid grid-cols-1 md:grid-cols-2">
          {/* Left: form */}
          <div className="p-8 sm:p-10 flex flex-col  justify-center">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {step === "mobile" ? "Welcome Back" : "Enter the OTP"}
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                {step === "mobile"
                  ? "Login to access your worker account"
                  : "A 6-digit verification code has been sent to your registered mobile number."}
              </p>
            </div>

            {/* Info Message (API response) */}
            {infoMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={18} />
                  <span className="text-sm">{infoMessage}</span>
                </div>
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={step === "mobile" ? onSendOtp : onVerifyOtp}
            >
              {step === "mobile" ? (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter 10-digit mobile number"
                      onChange={handleMobileChange}
                      value={mobile}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error && !infoMessage
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                  </div>
                  {error && !infoMessage && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    OTP (One Time Password){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {error}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      onClick={resetToMobileStep}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ← Change mobile number
                    </button>
                    {resendTimer > 0 ? (
                      <span className="text-sm text-gray-400">
                        Resend OTP in 0:{String(resendTimer).padStart(2, "0")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={onResendOtp}
                        disabled={otpResending}
                        className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {otpResending ? "Resending..." : "Resend OTP"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || (step === "mobile" ? otpSending : otpVerifying)
                }
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${loading || (step === "mobile" ? otpSending : otpVerifying)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {(step === "mobile" ? otpSending : otpVerifying) ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {step === "mobile" ? "Sending OTP..." : "Verifying..."}
                  </div>
                ) : step === "mobile" ? (
                  "Send OTP"
                ) : (
                  "Login"
                )}
              </button>

              {/* {step === "mobile" && ( */}
                {/* <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/worker/register"
                    className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition"
                  >
                    Create account
                  </Link>
                </p> */}
              {/* )} */}

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
                  © {new Date().getFullYear()} Worker Portal. All rights
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
          <div className="hidden md:block relative overflow-visible">
            <img
              src="/images/worker/worker.svg"
              alt="Worker"
              className="absolute -top-24 -right-50 h-[131%] w-auto max-w-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;