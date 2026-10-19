import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useWorkerProfile } from "../../workerhooks/useWorkerProfile";
import { useAuth } from "../../../../common/hooks/useAuth";

import Loader from "../../../../common/components/Loader";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  FileText,
  Home,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Search,
  Hash,
  CreditCard,
  Fingerprint,
  Award,
  ShieldCheck,
} from "lucide-react";

const EditWorkerProfile = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    // passwordData,
    setPasswordData,
    errors,
    // passwordErrors,
    loading,
    formLoading,
    successMsg,
    // passwordSuccessMsg,
    industries,
    designations,
    // departments,
    verifyBankAccount,
    isBankVerified,
    verifyingBank,
    states,
    cities,
    // photoPreview,
    // photoFile,
    loadingCities,
    currentCities,
    handleCurrentStateChange,
    handleCurrentCityChange,
    fetchCurrentCitiesByState,
    // handlePhotoChange,
    handleStateChange,
    handleCityChange,
    updateProfile,
    changePassword,
    setErrors,
    setPasswordErrors,
    // setSuccessMsg,
    // fetchCitiesByState,
  } = useWorkerProfile();

  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  // const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCurrentStateDropdown, setShowCurrentStateDropdown] =
    useState(false);
  const [showCurrentCityDropdown, setShowCurrentCityDropdown] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showEsic, setShowEsic] = useState(false);
  const { setUser } = useAuth();

  const fileInputRef = useRef(null);
  const industryRef = useRef(null);
  const designationRef = useRef(null);
  // const departmentRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const currentStateRef = useRef(null);
  const currentCityRef = useRef(null);
  const phonePattern = /^[6-9]\d{9}$/;
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
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setShowIndustryDropdown(false);
      }
      if (
        designationRef.current &&
        !designationRef.current.contains(event.target)
      ) {
        setShowDesignationDropdown(false);
      }
      // if (
      //   departmentRef.current &&
      //   !departmentRef.current.contains(event.target)
      // ) {
      //   setShowDepartmentDropdown(false);
      // }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (
        currentStateRef.current &&
        !currentStateRef.current.contains(event.target)
      ) {
        setShowCurrentStateDropdown(false);
      }
      if (
        currentCityRef.current &&
        !currentCityRef.current.contains(event.target)
      ) {
        setShowCurrentCityDropdown(false);
      }
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
  const maskValue = (value) => {
    if (!value) return "";

    const cleanValue = value.toString();

    return (
      "*".repeat(Math.max(0, cleanValue.length - 4)) + cleanValue.slice(-4)
    );
  };
  // Handle mobile number formatting
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);

    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 7);
    const part3 = value.slice(7, 10);

    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;

    handleChange("mobile_number", formatted);
  };

  // Handle PAN number
  const handlePANChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value)) {
      handleChange("pan_number", value.slice(0, 10));
    }
  };

  // Handle Aadhaar number
  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    let formatted = value.slice(0, 12);
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + "-" + formatted.slice(4);
    }
    if (formatted.length > 9) {
      formatted = formatted.slice(0, 9) + "-" + formatted.slice(9);
    }

    handleChange("aadhaar_number", formatted);
  };
  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes((formData.state || "").toLowerCase()),
  );

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes((formData.city || "").toLowerCase()),
  );

  const filteredCurrentStates = states.filter((state) =>
    state.name
      .toLowerCase()
      .includes((formData.current_state || "").toLowerCase()),
  );

  const filteredCurrentCities = currentCities.filter((city) =>
    city.name
      .toLowerCase()
      .includes((formData.current_city || "").toLowerCase()),
  );

  // const filteredIndustries = industries.filter((industry) =>
  //   industry.name
  //     .toLowerCase()
  //     .includes((formData.industry || "").toLowerCase())
  // );
  const filteredIndustries =
    formData.industry_id && !showIndustryDropdown
      ? industries
      : industries.filter((industry) =>
          industry.name
            .toLowerCase()
            .includes((formData.industry || "").toLowerCase()),
        );
  const filteredDesignations = designations.filter((designation) =>
    designation.name
      .toLowerCase()
      .includes((formData.designation || "").toLowerCase()),
  );
  // Handle UAN number
  const handleUANChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("uan_number", value.slice(0, 12));
  };

  // Handle account number
  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("account_number", value.slice(0, 18));
  };

  // Handle IFSC code
  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    handleChange("ifsc_code", value.slice(0, 11));
  };

  // Handle zip code
  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("zip", value.slice(0, 6));
  };

  // Handle industry search and selection
  const handleIndustrySearch = (value) => {
    handleChange("industry", value);
    setShowIndustryDropdown(true);
  };

  const handleIndustrySelect = (industry) => {
    handleChange("industry", industry.name);
    handleChange("industry_id", industry.id);
    handleChange("designation", "");
    handleChange("designation_id", "");
    setShowIndustryDropdown(false);
  };

  // Handle designation search and selection
  const handleDesignationSearch = (value) => {
    handleChange("designation", value);
    setShowDesignationDropdown(true);
  };

  const handleDesignationSelect = (designation) => {
    handleChange("designation", designation.name);
    handleChange("designation_id", designation.id);
    setShowDesignationDropdown(false);
  };

  // Handle state search and selection
  const handleStateSearch = (value) => {
    handleChange("state", value);
    setShowStateDropdown(true);
  };

  const handleStateSelect = async (state) => {
    await handleStateChange(state.id, state.name);
    setShowStateDropdown(false);
  };

  // Handle city search and selection
  const handleCitySearch = (value) => {
    handleChange("city", value);
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city) => {
    handleCityChange(city.id, city.name);
    setShowCityDropdown(false);
  };
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
  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    handleChange("payment_method", method);

    if (method === "cash") {
      handleChange("account_holder_name", "");
      handleChange("bank_name", "");
      handleChange("account_number", "");
      handleChange("confirm_account_number", "");
      handleChange("ifsc_code", "");
      handleChange("account_type", "");
    }
  };

  // Handle dress size selection
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
          mobile_number: formData.mobile_number.replace(/\D/g, ""),
        }));

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/worker/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Please fill the mandatory fields.",
        });
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
    navigate("/worker/profile");
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
      <div className="mb-6 max-w-7xl w-full">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">
          Update your personal and professional information
        </p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-7xl w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMsg}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl w-full">
        {/* Basic Details Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Basic Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Name Fields */}
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
                  value={formData.middle_name}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Middle"
                />
              </div>
            </div>

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

            {/* Work Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.work_email}
                  onChange={(e) => handleChange("work_email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.work_email ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.work_email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.work_email}
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
                  value={formData.mobile_number}
                  onChange={handleMobileChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.mobile_number ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="xxx-xxxx-xxx"
                  maxLength={12}
                />
              </div>
              {formData.mobile_number &&
                !phonePattern.test(
                  formData.mobile_number.replace(/\D/g, ""),
                ) && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> Must be 10 digits starting with
                    6-9
                  </p>
                )}
              {errors.mobile_number && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.mobile_number}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.gender ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.gender}
                </p>
              )}
            </div>

            {/* Industry Dropdown */}
            <div ref={industryRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleIndustrySearch(e.target.value)}
                  disabled
                  // onFocus={() => setShowIndustryDropdown(true)}
                  onFocus={() => {
                    handleChange("industry", "");
                    setShowIndustryDropdown(true);
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.industry ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Search industry"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.industry}
                </p>
              )}

              {showIndustryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {industries.length > 0 ? (
                    filteredIndustries.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleIndustrySelect(item)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          {formData.industry_id === item.id && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No industries found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Designation Dropdown */}
            <div ref={designationRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.designation}
                  disabled
                  onChange={(e) => handleDesignationSearch(e.target.value)}
                  onFocus={() => setShowDesignationDropdown(true)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border  ${
                    errors.designation ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Search designation"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.designation}
                </p>
              )}

              {showDesignationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {designations.length > 0 ? (
                    filteredDesignations.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleDesignationSelect(item)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          {formData.designation_id === item.id && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No designations found
                    </div>
                  )}
                </div>
              )}
            </div>

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

          {/* EPF Section */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Employee's Provident Fund (EPF)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UAN Number<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.uan_number}
                    onChange={handleUANChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.uan_number ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="12-digit UAN (000000000000)"
                    maxLength={12}
                  />
                </div>
                {errors.uan_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.uan_number === "string"
                      ? errors.uan_number
                      : errors.uan_number?.[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ESI Section */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Employee's State Insurance (ESI)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ESIC Number<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  {/* <input
                    type="text"
                    maxlength={10}
                    value={formData.esic_number}
                    onChange={(e) =>
                      handleChange("esic_number", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.esic_number ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter ESIC Number"
                  /> */}
                  <input
                    type={showEsic ? "text" : "password"}
                    value={
                      showEsic
                        ? formData.esic_number
                        : maskValue(formData.esic_number)
                    }
                    onChange={(e) =>
                      handleChange("esic_number", e.target.value)
                    }
                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                      errors.esic_number ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEsic(!showEsic)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showEsic ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>{" "}
                </div>
                {errors.esic_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.esic_number === "string"
                      ? errors.esic_number
                      : errors.esic_number?.[0]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Personal Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
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
                  maxLength={35}
                  value={formData.father_name}
                  onChange={(e) => handleChange("father_name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter father's name"
                />
              </div>
            </div>

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
                {/* <input
                  type="text"
                  value={formData.pan_number}
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                /> */}
                <input
                  type={showPan ? "text" : "password"}
                  value={
                    showPan
                      ? formData.pan_number
                      : maskValue(formData.pan_number)
                  }
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                />
                <button
                  type="button"
                  onClick={() => setShowPan(!showPan)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPan ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>{" "}
              </div>
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
                {/* <input
                  type="text"
                  value={formData.aadhaar_number}
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength="14"
                /> */}
                <input
                  type={showAadhaar ? "text" : "password"}
                  value={
                    showAadhaar
                      ? formData.aadhaar_number
                      : maskValue(formData.aadhaar_number)
                  }
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength="14"
                />
                <button
                  type="button"
                  onClick={() => setShowAadhaar(!showAadhaar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>{" "}
              </div>
            </div>

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
                  value={formData.residential_address}
                  onChange={(e) =>
                    handleChange("residential_address", e.target.value)
                  }
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your residential address"
                />
              </div>
            </div>

            {/* State Dropdown */}
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
                  value={formData.state}
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
                  {states.length > 0 ? (
                    filteredStates.map((state) => (
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
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No states found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* City Dropdown */}
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
                  value={formData.city}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => formData.state_id && setShowCityDropdown(true)}
                  disabled={!formData.state_id}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.city_id ? "border-red-300" : "border-gray-300"
                  } ${
                    !formData.state_id ? "bg-gray-100 cursor-not-allowed" : ""
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
                  {cities.length > 0 ? (
                    filteredCities.map((city) => (
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
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No cities found
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <div className="relative">
                {/* <Hash
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                /> */}
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
          </div>
        </div>

        {/* Working Address Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Work Address
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Working State */}
            <div ref={currentStateRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work State <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.current_state_id
                      ? "border-red-300"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Search or select state"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.current_state_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.current_state_id}
                </p>
              )}
              {showCurrentStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCurrentStates.map((state) => (
                    <div
                      key={state.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCurrentStateSelect(state)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{state.name}</span>
                        {formData.current_state_id === state.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Working City */}
            <div ref={currentCityRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work City <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.current_city_id
                      ? "border-red-300"
                      : "border-gray-300"
                  } ${
                    !formData.current_state_id
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder={
                    formData.current_state_id
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
              {errors.current_city_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.current_city_id}
                </p>
              )}
              {showCurrentCityDropdown && formData.current_state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCurrentCities.map((city) => (
                    <div
                      key={city.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCurrentCitySelect(city)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{city.name}</span>
                        {formData.current_city_id === city.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Working Address (textarea) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Address<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.working_address || ""}
                  onChange={(e) =>
                    handleChange("working_address", e.target.value)
                  }
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your working address"
                />
              </div>
              {errors.working_address && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors.working_address === "string"
                    ? errors.working_address
                    : errors.working_address?.[0]}
                </p>
              )}
            </div>

            {/* Working Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Zip Code
              </label>
              <div className="relative">
                {/* <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /> */}
                <input
                  type="text"
                  value={formData.working_zip || ""}
                  onChange={(e) =>
                    handleChange(
                      "working_zip",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Payment Information Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="text-lg bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-4 font-semibold text-gray-700">
            Payment Information
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  Bank Transfer
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                Bank Account Details
              </h3>
              <p className="text-xs text-gray-400">
                Update your bank information below
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
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
                  Account Number
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
                  Confirm Account Number
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
                  IFSC Code
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Hash
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        errors.ifsc_code ? "text-red-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={(e) =>
                        handleChange("ifsc_code", e.target.value.toUpperCase())
                      }
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border uppercase transition-all duration-200 ${
                        errors.ifsc_code
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter IFSC code"
                      maxLength="11"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={verifyBankAccount}
                    disabled={verifyingBank || isBankVerified}
                    className={`whitespace-nowrap text-xs font-medium px-4 py-2.5 rounded-lg transition-colors h-full ${
                      isBankVerified
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    }`}
                  >
                    {verifyingBank
                      ? "..."
                      : isBankVerified
                        ? "Verified"
                        : "Verify Account"}
                  </button>
                </div>
                {errors.bank_verification && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.bank_verification}
                  </p>
                )}
                {errors.ifsc_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ifsc_code}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
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
                      errors.account_type ? "border-red-300" : "border-gray-300"
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
          </div>
        </div>

        {/* Change Password Card (commented out) */}
        {/* ... unchanged ... */}

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

export default EditWorkerProfile;
