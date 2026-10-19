import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useAgentLogin } from "../agenthooks/useAgentLogin";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AgentLogin = () => {
  const { handleLogin, loading, error } = useAgentLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
    handleLogin(formData.email, formData.password);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/admin/Login-Bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="text-center mb-3">
          <div className="flex justify-center mb-4">
            <div onClick={() => navigate("/")} className="cursor-pointer">
              {logoUrl ? (
                <img src={logoUrl} alt="Agent Logo" className="max-h-24" />
              ) : (
                <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agent Portal
          </h1>
          <p className="text-gray-600">
            Access your agent dashboard and manage your tasks
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Welcome Back <br />
            <span className="font-light ml-2">Sign in to continue</span>
          </h2>

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Email field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Agent Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  maxLength={100}
                  placeholder="agent@example.com"
                  onChange={handleChange}
                  value={formData.email}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  maxLength={25}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link
                to="/agent/forgot-password"
                className="text-green-600 hover:text-green-800 font-medium hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* WhatsApp & Call Buttons */}
            {(whatsappNumber || phoneNumber) && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-500 text-center mb-3">
                  Help & Support
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors w-full sm:w-auto"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        className="w-5 h-5"
                      />
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  )}
                  {phoneNumber && (
                    <a
                      href={`tel:${phoneNumber}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors w-full sm:w-auto"
                    >
                      <Phone size={20} />
                      <span className="font-medium">Call Us</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                Don't! Have an account?{" "}
                <Link
                  to="/agent/register"
                  className="ml-1 text-blue-500  hover:text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>© {new Date().getFullYear()} Agent Portal. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-amber-300 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default AgentLogin;
