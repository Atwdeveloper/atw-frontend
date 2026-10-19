import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAgentProfile } from "../../agenthooks/useAgentProfile";
import { useAuth } from "../../../../common/hooks/useAuth";

import Loader from "../../../../common/components/Loader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MapPinned,
  Calendar,
  FileText,
  Home,
  Building2,
  AlertCircle,
  CheckCircle,
  Search,
  Hash,
  CreditCard,
  Fingerprint,
  Award,
} from "lucide-react";

const AgentEditProfile = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,

    setPasswordData,
    errors,

    loading,
    formLoading,
    successMsg,

    states,
    cities,
    loadingCities,

    currentCities,
    fetchCurrentCitiesByState,
    handleStateChange,
    handleCityChange,
    handleCurrentStateChange,
    handleCurrentCityChange,
    handleDepartmentChange,
    updateProfile,
    changePassword,
    setErrors,
    setPasswordErrors,
    setSuccessMsg,
    fetchCitiesByState,
  } = useAgentProfile({ loadLocationData: true });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCurrentStateDropdown, setShowCurrentStateDropdown] =
    useState(false);
  const [showCurrentCityDropdown, setShowCurrentCityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const { setUser } = useAuth();

  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const currentStateRef = useRef(null);
  const currentCityRef = useRef(null);
  const departmentRef = useRef(null);

  const phonePattern = /^[6-9]\d{9}$/;

  // Auto‑fill account holder name from full name
  useEffect(() => {
    const fullName = [
      formData.first_name,
      formData.middle_name,
      formData.last_name,
    ]
      .filter(Boolean)
      .join(" ");
    setFormData((prev) => ({
      ...prev,
      account_holder_name: fullName,
    }));
  }, [formData.first_name, formData.middle_name, formData.last_name]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateRef.current && !stateRef.current.contains(event.target))
        setShowStateDropdown(false);
      if (cityRef.current && !cityRef.current.contains(event.target))
        setShowCityDropdown(false);
      if (
        currentStateRef.current &&
        !currentStateRef.current.contains(event.target)
      )
        setShowCurrentStateDropdown(false);
      if (
        currentCityRef.current &&
        !currentCityRef.current.contains(event.target)
      )
        setShowCurrentCityDropdown(false);
      if (
        departmentRef.current &&
        !departmentRef.current.contains(event.target)
      )
        setShowDepartmentDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (name, value) => {
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Mobile number formatting
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 7);
    const part3 = value.slice(7, 10);
    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;
    handleChange("phone", formatted);
  };

  // PAN, Aadhaar, UAN, etc.
  const handlePANChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value)) {
      handleChange("pan_number", value.slice(0, 10));
    }
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = value.slice(0, 12);
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + "-" + formatted.slice(4);
    }
    if (formatted.length > 9) {
      formatted = formatted.slice(0, 9) + "-" + formatted.slice(9);
    }
    handleChange("aadhar_number", formatted);
  };

  const handleUANChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("uan_number", value.slice(0, 12));
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("account_number", value.slice(0, 18));
  };

  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    handleChange("ifsc_code", value.slice(0, 11));
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("zip", value.slice(0, 6));
  };

  // ---- Department (only one from work details still present) ----
  const handleDepartmentSearch = (value) => {
    handleChange("department", value);
    setShowDepartmentDropdown(true);
  };

  const handleDepartmentSelect = (department) => {
    handleDepartmentChange(department.id, department.name);
    setShowDepartmentDropdown(false);
  };

  // ---- State & City (residential) ----
  const handleStateSearch = (value) => {
    handleChange("state", value);
    setShowStateDropdown(true);
  };

  const handleStateSelect = async (state) => {
    await handleStateChange(state.id, state.name);
    setShowStateDropdown(false);
  };

  const handleCitySearch = (value) => {
    handleChange("city", value);
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city) => {
    handleCityChange(city.id, city.name);
    setShowCityDropdown(false);
  };

  // ---- Current State & City (working) ----
  const handleCurrentStateSearch = (value) => {
    handleChange("current_state", value);
    setShowCurrentStateDropdown(true);
  };

  const handleCurrentStateSelect = async (state) => {
    await handleCurrentStateChange(state.id, state.name);
    await fetchCurrentCitiesByState(state.id);
    setShowCurrentStateDropdown(false);
  };

  const handleCurrentCitySearch = (value) => {
    handleChange("current_city", value);
    setShowCurrentCityDropdown(true);
  };

  const handleCurrentCitySelect = (city) => {
    handleCurrentCityChange(city.id, city.name);
    setShowCurrentCityDropdown(false);
  };

  // ---- Payment method ----
  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    handleChange("payment_method", method);
    if (method === "cash") {
      handleChange("account_holder_name", "");
      handleChange("account_number", "");
      handleChange("confirm_account_number", "");
      handleChange("ifsc_code", "");
      handleChange("account_type", "");
    }
  };

  // ---- Dress size (button group) ----
  const handleDressSizeSelect = (size) => {
    const newSize = formData.dress_size === size ? "" : size;
    handleChange("dress_size", newSize);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await updateProfile();
      if (success) {
        setUser((prev) => ({
          ...prev,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone.replace(/\D/g, ""),
        }));
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/agent/profile");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const success = await changePassword();
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleCancel = () => {
    navigate("/agent/profile");
  };

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col justify-center items-center">
      {/* Header */}
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold text-gray-900">Edit Agent Profile</h1>
        <p className="text-gray-600 mt-1">
          Update your personal and professional information
        </p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMsg}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* ========== BASIC DETAILS CARD ========== */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Basic Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.first_name ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.first_name}
                </p>
              )}
            </div>
            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.middle_name || ""}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Middle Name"
                />
              </div>
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.last_name ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.last_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email || ""}
                  maxLength={100}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                      agent_email: e.target.value,
                    }))
                  }
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.agent_email ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="agent@example.com"
                />
              </div>
              {errors.agent_email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.agent_email}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={handleMobileChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="xxx-xxxx-xxx"
                  maxLength={12}
                />
              </div>
              {formData.phone &&
                !phonePattern.test(formData.phone.replace(/\D/g, "")) && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> Must be 10 digits starting with
                    6-9
                  </p>
                )}
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date of Joining */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.date_of_joining}
                  onChange={(e) => handleChange("date_of_joining", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div> */}

            {/* Father's Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.father_name}
                  maxLength={50}
                  onChange={(e) => handleChange("father_name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter father's name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== WORK DETAILS CARD ========== */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Work Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Work Location */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.work_location}
                  onChange={(e) => handleChange("work_location", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter work location"
                />
              </div>
            </div> */}

            {/* Work Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Experience (Years)
              </label>
              <div className="relative">
                <Award
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  value={formData.work_experience}
                  onChange={(e) =>
                    handleChange("work_experience", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter years of experience"
                  min="0"
                  max="50"
                  step="0.5"
                />
              </div>
            </div>

            {/* Dress Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dress Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleDressSizeSelect(size)}
                    className={`py-3 rounded-lg border text-center transition ${
                      formData.dress_size === size
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== IDENTIFICATION CARD ========== */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Identification
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.pan_number}
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                />
              </div>
              {errors.pan_number && (
                <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
              )}
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <div className="relative">
                <Fingerprint
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.aadhar_number}
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength="14"
                />
              </div>
              {errors.aadhar_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadhar_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========== ADDRESS DETAILS ========== */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Address Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Residential Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residential Address
              </label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.agent_location}
                  onChange={(e) =>
                    handleChange("agent_location", e.target.value)
                  }
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your residential address"
                />
              </div>
            </div>

            {/* State Dropdown (residential) */}
            <div ref={stateRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={
                    states.find((s) => s.id == formData.state_id)?.name || ""
                  }
                  onChange={(e) => handleStateSearch(e.target.value)}
                  onFocus={() => setShowStateDropdown(true)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.state_id ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Search or select state"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.state_id && (
                <p className="text-red-500 text-sm mt-1">{errors.state_id}</p>
              )}
              {showStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {states.map((state) => (
                    <div
                      key={state.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleStateSelect(state)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{state.name}</span>
                        {formData.state_id === state.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* City Dropdown (residential) */}
            <div ref={cityRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={
                    cities.find((c) => c.id == formData.city_id)?.name || ""
                  }
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => formData.state_id && setShowCityDropdown(true)}
                  disabled={!formData.state_id}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.city_id ? "border-red-300" : "border-gray-300"
                  } ${!formData.state_id ? "bg-gray-100 cursor-not-allowed" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder={
                    formData.state_id
                      ? "Search or select city"
                      : "Select state first"
                  }
                />
                {loadingCities ? (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                )}
              </div>
              {errors.city_id && (
                <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>
              )}
              {showCityDropdown && formData.state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{city.name}</span>
                        {formData.city_id === city.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <div className="relative">
                {/* <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /> */}
                <MapPinned
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />{" "}
                <input
                  type="text"
                  value={formData.zip}
                  onChange={handleZipChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                Work Address
              </h3>
            </div>
            {/* Working State */}
            <div ref={currentStateRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working State
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.current_state}
                  onChange={(e) => handleCurrentStateSearch(e.target.value)}
                  onFocus={() => setShowCurrentStateDropdown(true)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search working state"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {showCurrentStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {states.map((state) => (
                    <div
                      key={state.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCurrentStateSelect(state)}
                    >
                      <span>{state.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Working City */}
            <div ref={currentCityRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working City
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.current_city}
                  onChange={(e) => handleCurrentCitySearch(e.target.value)}
                  onFocus={() =>
                    formData.current_state_id &&
                    setShowCurrentCityDropdown(true)
                  }
                  disabled={!formData.current_state_id}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 ${
                    !formData.current_state_id
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder={
                    formData.current_state_id
                      ? "Search working city"
                      : "Select working state first"
                  }
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {showCurrentCityDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {currentCities.map((city) => (
                    <div
                      key={city.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCurrentCitySelect(city)}
                    >
                      <span>{city.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========== PAYMENT INFORMATION CARD ========== */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Payment Information
          </div>
          <div className="p-6">
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank"
                    checked={formData.payment_method === "bank"}
                    onChange={handlePaymentMethodChange}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">Bank Transfer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={formData.payment_method === "cash"}
                    onChange={handlePaymentMethodChange}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">Cash</span>
                </label>
              </div>
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
              )}
            </div> */}

            {formData.payment_method === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Holder Name (auto‑filled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.account_holder_name || ""}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-filled from name"
                    />
                  </div>
                  {errors.account_holder_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.account_holder_name}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={handleAccountNumberChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                        errors.account_number
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter account number"
                      maxLength="18"
                    />
                  </div>
                  {errors.account_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.account_number}
                    </p>
                  )}
                </div>

                {/* Confirm Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Account Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.confirm_account_number}
                      onChange={(e) =>
                        handleChange("confirm_account_number", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                        errors.confirm_account_number
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Confirm account number"
                      maxLength="18"
                    />
                  </div>
                  {errors.confirm_account_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirm_account_number}
                    </p>
                  )}
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.ifsc_code}
                      onChange={handleIFSCChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                        errors.ifsc_code ? "border-red-300" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter IFSC code"
                      maxLength="11"
                    />
                  </div>
                  {errors.ifsc_code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ifsc_code}
                    </p>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      value={formData.account_type || ""}
                      onChange={(e) =>
                        handleChange("account_type", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                        errors.account_type
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select account type</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                  {errors.account_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.account_type}
                    </p>
                  )}
                </div>
              </div>
            )}

            {formData.payment_method === "cash" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> When selecting cash payment, salary
                  will be disbursed manually in cash. Ensure proper
                  documentation and receipt collection for each payment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentEditProfile;
