import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useEditWorker } from "../../agenthooks/useEditWorkerByAgent";
import Loader from "../../../../common/components/Loader";
import {
  AlertCircle,
  Search,
  CheckCircle,
  Plus,
  User,
  Mail,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  Calendar,
  Home,
  MapPin,
  Building2,
  Landmark,
  MapPinned,
  ShieldCheck,
  CreditCard,
  FileText,
  Award,
  Fingerprint,
} from "lucide-react";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";

const EditWorkerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    formLoading,
    industries,
    designations,
    states,
    cities,
    loadingCities,
    workingCities,
    loadingWorkingCities,
    clearError,
    filterIndustries,
    filterDesignations,
    filterStates,
    filterCities,
    fetchCitiesByState,
    fetchWorkingCitiesByState,
    filterWorkingCities,
    fetchDesignationsByIndustry,
    addNewDesignation,
    submitEdit,
    resetForm,
  } = useEditWorker(id);

  const [initialFormData, setInitialFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  // Set initial form data for dirty check
  useEffect(() => {
    if (
      formData &&
      Object.keys(formData).length > 0 &&
      !initialFormData &&
      !formLoading
    ) {
      setInitialFormData(JSON.parse(JSON.stringify(formData)));
    }
  }, [formData, formLoading, initialFormData]);

  const isFormDirty = useMemo(() => {
    if (!initialFormData || !formData || isSubmitting) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, isSubmitting]);

  useUnsavedChangesWarning(
    isFormDirty && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  // UI states
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCurrentStateDropdown, setShowCurrentStateDropdown] =
    useState(false);
  const [showCurrentCityDropdown, setShowCurrentCityDropdown] = useState(false);

  const designationRef = useRef(null);
  const industryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const currentStateRef = useRef(null);
  const currentCityRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        designationRef.current &&
        !designationRef.current.contains(event.target)
      )
        setShowDesignationDropdown(false);
      if (industryRef.current && !industryRef.current.contains(event.target))
        setShowIndustryDropdown(false);
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-update account holder name from name fields
  useEffect(() => {
    const fullName = [
      formData.first_name,
      formData.middle_name,
      formData.last_name,
    ]
      .filter(Boolean)
      .join(" ");
    setFormData((prev) => ({ ...prev, account_holder_name: fullName }));
  }, [
    formData.first_name,
    formData.middle_name,
    formData.last_name,
    setFormData,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearError(name);
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 7);
    const part3 = value.slice(7, 10);
    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;
    setFormData((prev) => ({ ...prev, mobile_number: formatted }));
    clearError("mobile_number");
  };

  const handleUANChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setFormData((prev) => ({ ...prev, uan_number: value }));
    clearError("uan_number");
  };

  const handlePANChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, pan_number: value.slice(0, 10) }));
      clearError("pan_number");
    }
  };

  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 12);
    let formatted = value;
    if (formatted.length > 4)
      formatted = formatted.slice(0, 4) + "-" + formatted.slice(4);
    if (formatted.length > 9)
      formatted = formatted.slice(0, 9) + "-" + formatted.slice(9);
    setFormData((prev) => ({ ...prev, aadhar_number: formatted }));
    clearError("aadhar_number");
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 18);
    setFormData((prev) => ({ ...prev, account_number: value }));
    clearError("account_number");
  };

  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, ifsc_code: value.slice(0, 11) }));
    clearError("ifsc_code");
  };

  // Industry handlers
  const handleIndustrySearch = (value) => {
    setFormData((prev) => ({ ...prev, industry: value, industry_id: "" }));
    filterIndustries(value);
    setShowIndustryDropdown(true);
  };
  const handleIndustrySelect = async (industry) => {
    setFormData((prev) => ({
      ...prev,
      industry: industry.name,
      industry_id: industry.id,
      designation: "",
      designation_id: "",
    }));
    await fetchDesignationsByIndustry(industry.id);
    clearError("industry");
    setShowIndustryDropdown(false);
  };

  // Designation handlers
  const handleDesignationSearch = (value) => {
    setFormData((prev) => ({
      ...prev,
      designation: value,
      designation_id: "",
    }));
    filterDesignations(value);
    setShowDesignationDropdown(true);
  };
  const handleDesignationSelect = (designation) => {
    setFormData((prev) => ({
      ...prev,
      designation: designation.name,
      designation_id: designation.id,
      new_designation: "",
    }));
    clearError("designation");
    setShowDesignationDropdown(false);
  };
  const handleAddNewDesignation = async () => {
    if (!formData.designation.trim()) return;
    if (!formData.industry_id) {
      Swal.fire({
        icon: "error",
        title: "Industry Required",
        text: "Please select an industry first",
      });
      return;
    }
    try {
      const newDesignation = await addNewDesignation(
        formData.designation.trim(),
        formData.industry_id,
      );
      setFormData((prev) => ({
        ...prev,
        designation: newDesignation.name,
        designation_id: newDesignation.id,
        new_designation: "",
      }));
      setShowDesignationDropdown(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Designation added",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add designation",
      });
    }
  };

  // Residential address handlers
  const handleStateSearch = (value) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
      state_id: "",
      city: "",
      city_id: "",
    }));
    filterStates(value);
    setShowStateDropdown(true);
  };
  const handleStateSelect = async (state) => {
    setFormData((prev) => ({
      ...prev,
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    }));
    clearError("state_id");
    await fetchCitiesByState(state.id);
    setShowStateDropdown(false);
  };
  const handleCitySearch = (value) => {
    setFormData((prev) => ({ ...prev, city: value, city_id: "" }));
    filterCities(value);
    setShowCityDropdown(true);
  };
  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city: city.name, city_id: city.id }));
    clearError("city_id");
    setShowCityDropdown(false);
  };

  // Working address handlers
  const handleCurrentStateSearch = (value) => {
    setFormData((prev) => ({
      ...prev,
      current_state: value,
      current_state_id: "",
      current_city: "",
      current_city_id: "",
    }));
    filterStates(value);
    setShowCurrentStateDropdown(true);
  };
  const handleCurrentStateSelect = async (state) => {
    setFormData((prev) => ({
      ...prev,
      current_state: state.name,
      current_state_id: state.id,
      current_city: "",
      current_city_id: "",
    }));
    clearError("current_state_id");
    await fetchWorkingCitiesByState(state.id);
    setShowCurrentStateDropdown(false);
  };
  const handleCurrentCitySearch = (value) => {
    setFormData((prev) => ({
      ...prev,
      current_city: value,
      current_city_id: "",
    }));
    filterWorkingCities(value);
    setShowCurrentCityDropdown(true);
  };
  const handleCurrentCitySelect = (city) => {
    setFormData((prev) => ({
      ...prev,
      current_city: city.name,
      current_city_id: city.id,
    }));
    clearError("current_city_id");
    setShowCurrentCityDropdown(false);
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    if (method === "cash") {
      setFormData((prev) => ({
        ...prev,
        payment_method: method,
        account_holder_name: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        account_type: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, payment_method: method }));
    }
    clearError("payment_method");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await submitEdit(formData);
      if (response?.success) {
        setInitialFormData(JSON.parse(JSON.stringify(formData)));
        Swal.fire({
          icon: "success",
          title: "Worker Updated",
          text: "Worker details have been updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        }).then(() => {
          navigate("/agent/worker/list");
        });
      }
    } catch (error) {
      if (error.message !== "Validation failed") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            error?.message ||
            "Failed to update worker. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/agent/worker/list");
  };

  const handleReset = () => {
    if (initialFormData) {
      setFormData(JSON.parse(JSON.stringify(initialFormData)));
    }
  };

  if (formLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!formData.id && !loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Worker not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Worker Profile
        </h1>
        <p className="text-gray-600 mt-2">
          Update worker details and personal information
        </p>
      </div>

      {isFormDirty && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                You have unsaved changes
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
        onSubmit={handleSubmit}
      >
        {/* Basic Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Basic Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* Worker Code (read-only) */}
            <div className="md:col-span-3">
              <label className="text-sm text-slate-600 font-medium">
                Worker Code
              </label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.worker_code}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Worker Code cannot be changed
              </p>
            </div>

            {/* First Name */}
            <div>
              <label className="text-sm text-slate-600">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.first_name}
                  onChange={handleChange}
                  name="first_name"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.first_name ? "border-red-500" : "border"}`}
                  placeholder="Enter First Name"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.first_name}
                </p>
              )}
            </div>
            {/* Middle Name */}
            <div>
              <label className="text-sm text-slate-600">Middle Name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.middle_name}
                  onChange={handleChange}
                  name="middle_name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Enter Middle Name"
                />
              </div>
            </div>
            {/* Last Name */}
            <div>
              <label className="text-sm text-slate-600">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.last_name}
                  onChange={handleChange}
                  name="last_name"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.last_name ? "border-red-500" : "border"}`}
                  placeholder="Enter Last Name"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.last_name}
                </p>
              )}
            </div>
            {/* Work Email */}
            <div>
              <label className="text-sm text-slate-600">
                Personal Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.work_email}
                  onChange={handleChange}
                  name="work_email"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.work_email ? "border-red-500" : "border"}`}
                  placeholder="Enter Personal Email"
                />
              </div>
              {errors.work_email && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.work_email}
                </p>
              )}
            </div>
            {/* Mobile Number */}
            <div>
              <label className="text-sm text-slate-600">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.mobile_number}
                  onChange={handleMobileChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.mobile_number ? "border-red-500" : "border"}`}
                  placeholder="xxx-xxxx-xxx"
                  maxLength={12}
                />
              </div>
              {errors.mobile_number && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.mobile_number}
                </p>
              )}
            </div>
            {/* Gender */}
            <div>
              <label className="text-sm text-slate-600">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={formData.gender}
                  onChange={handleChange}
                  name="gender"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.gender ? "border-red-500" : "border"}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.gender}
                </p>
              )}
            </div>
            {/* Dress Size */}
            <div>
              <label className="text-sm text-slate-600">Dress Size</label>
              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dress_size: prev.dress_size === size ? "" : size,
                      }))
                    }
                    className={`py-3 rounded-lg border text-center transition ${formData.dress_size === size ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold" : "border-gray-300 hover:bg-gray-50"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Industry (disabled) */}
            <div ref={industryRef} className="relative">
              <label className="text-sm text-slate-600">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.industry}
                  disabled
                  className="w-full pl-10 pr-10 py-2 rounded-lg border bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Industry"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Industry cannot be changed
              </p>
            </div>
            {/* Designation */}
            <div ref={designationRef} className="relative">
              <label className="text-sm text-slate-600">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleDesignationSearch(e.target.value)}
                  onFocus={() => setShowDesignationDropdown(true)}
                  disabled={!formData.industry_id}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.designation ? "border-red-500" : "border"} ${!formData.industry_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={
                    formData.industry_id
                      ? "Search or enter designation"
                      : "Select industry first"
                  }
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  <AlertCircle size={14} /> {errors.designation}
                </p>
              )}
              {showDesignationDropdown && formData.industry_id && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {designations.length > 0 ? (
                    <>
                      {designations.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                          onClick={() => handleDesignationSelect(item)}
                        >
                          <div className="flex justify-between">
                            <span>{item.name}</span>
                            {formData.designation_id === item.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                      {!designations.some(
                        (d) =>
                          d.name.toLowerCase() ===
                          formData.designation.toLowerCase(),
                      ) &&
                        formData.designation.trim() && (
                          <button
                            type="button"
                            onClick={handleAddNewDesignation}
                            className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Plus size={16} /> Add "{formData.designation}"
                          </button>
                        )}
                    </>
                  ) : (
                    <div className="px-4 py-3">
                      No designations found
                      {formData.designation.trim() && (
                        <button
                          type="button"
                          onClick={handleAddNewDesignation}
                          className="mt-2 w-full bg-blue-50 text-blue-600 py-1 rounded"
                        >
                          Add "{formData.designation}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Experience */}
            <div>
              <label className="text-sm text-slate-600">
                Experience (Years)
              </label>
              <div className="relative">
                <Award
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  value={formData.work_experience}
                  onChange={handleChange}
                  name="work_experience"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Years"
                  min="0"
                  max="50"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Statutory Details - Simplified */}
          <div className="border-t p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <ShieldCheck className="text-orange-500" size={20} />
              Statutory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">UAN Number</label>
                <div className="relative">
                  {/* <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
                  <Fingerprint
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.uan_number}
                    onChange={handleUANChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    placeholder="12-digit UAN"
                    maxLength="12"
                  />
                </div>
                {errors.uan_number && (
                  <p className="text-red-500 text-sm mt-1">
                    <AlertCircle size={14} /> {errors.uan_number}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-slate-600">ESIC Number</label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.esic_number}
                    maxLength={10}
                    onChange={handleChange}
                    name="esic_number"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    placeholder="Enter ESIC Number"
                  />
                </div>
                {errors.esic_number && (
                  <p className="text-red-500 text-sm mt-1">
                    <AlertCircle size={14} /> {errors.esic_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Personal Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div>
              <label>Date of Birth</label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  name="date_of_birth"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                />
              </div>
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date_of_birth}
                </p>
              )}
            </div>
            <div>
              <label>Father's Name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={handleChange}
                  name="father_name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Father's Name"
                />
              </div>
            </div>
            <div>
              <label>PAN Number</label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {/* <input
                  type="text"
                  value={formData.pan_number}
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                /> */}
                <input
                  type={showPan ? "text" : "password"}
                  value={formData.pan_number}
                  onChange={handlePANChange}
                  className="w-full pl-10 pr-12 py-2 rounded-lg border"
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
              {errors.pan_number && (
                <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
              )}
            </div>
            <div>
              <label>Aadhaar Number</label>
              <div className="relative">
                <Fingerprint
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {/* <input
                  type="text"
                  value={formData.aadhar_number}
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength="14"
                /> */}
                <input
                  type={showAadhaar ? "text" : "password"}
                  value={formData.aadhar_number}
                  onChange={handleAadhaarChange}
                  className="w-full pl-10 pr-12 py-2 rounded-lg border"
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
              {errors.aadhar_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadhar_number}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label>Residential Address</label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.residential_address}
                  onChange={handleChange}
                  name="residential_address"
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Full address"
                ></textarea>
              </div>
            </div>
            <div ref={stateRef} className="relative">
              <label>
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleStateSearch(e.target.value)}
                  onFocus={() => setShowStateDropdown(true)}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.state_id ? "border-red-500" : "border"}`}
                  placeholder="Search state"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.state_id && (
                <p className="text-red-500 text-sm mt-1">{errors.state_id}</p>
              )}
              {showStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {states.map((s) => (
                    <div
                      key={s.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleStateSelect(s)}
                    >
                      <div className="flex justify-between">
                        <span>{s.name}</span>
                        {formData.state_id === s.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={cityRef} className="relative">
              <label>
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => formData.state_id && setShowCityDropdown(true)}
                  disabled={!formData.state_id}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.city_id ? "border-red-500" : "border"} ${!formData.state_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={
                    formData.state_id ? "Search city" : "Select state first"
                  }
                />
                {loadingCities ? (
                  <div className="absolute right-3 top-1/2 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                )}
              </div>
              {errors.city_id && (
                <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>
              )}
              {showCityDropdown && formData.state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {cities.map((c) => (
                    <div
                      key={c.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCitySelect(c)}
                    >
                      <div className="flex justify-between">
                        <span>{c.name}</span>
                        {formData.city_id === c.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label>Pincode</label>
              <div className="relative">
                {/* <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
                <MapPinned
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      zip: e.target.value.replace(/\D/g, "").slice(0, 6),
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="6-digit"
                  maxLength="6"
                />
              </div>
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Working Address Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Working Address
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div ref={currentStateRef} className="relative">
              <label className="text-sm text-slate-600">Working State</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.current_state}
                  onChange={(e) => handleCurrentStateSearch(e.target.value)}
                  onFocus={() => setShowCurrentStateDropdown(true)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border"
                  placeholder="Search state"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {showCurrentStateDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {states.map((s) => (
                    <div
                      key={s.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCurrentStateSelect(s)}
                    >
                      <div className="flex justify-between">
                        <span>{s.name}</span>
                        {formData.current_state_id === s.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={currentCityRef} className="relative">
              <label className="text-sm text-slate-600">Working City</label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${!formData.current_state_id ? "bg-gray-100 cursor-not-allowed" : "border"}`}
                  placeholder={
                    formData.current_state_id
                      ? "Search city"
                      : "Select state first"
                  }
                />
                {loadingWorkingCities ? (
                  <div className="absolute right-3 top-1/2 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                )}
              </div>
              {showCurrentCityDropdown && formData.current_state_id && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg max-h-60 overflow-auto">
                  {workingCities.map((c) => (
                    <div
                      key={c.id}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => handleCurrentCitySelect(c)}
                    >
                      <div className="flex justify-between">
                        <span>{c.name}</span>
                        {formData.current_city_id === c.id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Working Address</label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  value={formData.working_address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      working_address: e.target.value,
                    }))
                  }
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="Working address"
                ></textarea>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600">Working Zip Code</label>
              <div className="relative">
                {/* <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
                <MapPinned
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.working_zip}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      working_zip: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  placeholder="6-digit"
                  maxLength="6"
                />
              </div>
              {errors.working_zip && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.working_zip}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b px-6 py-4 font-semibold">
            Payment Information
          </div>
          <div className="p-6">
            <div className="mb-6">
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
                    className="mr-2"
                  />
                  <span>Bank Transfer</span>
                </label>
                {/* <label className="flex items-center"><input type="radio" name="payment_method" value="cash" checked={formData.payment_method === "cash"} onChange={handlePaymentMethodChange} className="mr-2" /><span>Cash</span></label> */}
              </div>
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.payment_method}
                </p>
              )}
            </div>
            {formData.payment_method === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                <div>
                  <label>
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    {/* <input
                      type="text"
                      value={formData.account_holder_name}
                      disabled
                      className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100"
                    /> */}
                    <input
                      type={showAccount ? "text" : "password"}
                      value={formData.account_number}
                      onChange={handleAccountNumberChange}
                      maxLength="18"
                      className="w-full pl-10 pr-12 py-2 rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccount(!showAccount)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showAccount ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>{" "}
                  </div>
                </div>
                {/* <div><label>Bank Name <span className="text-red-500">*</span></label><div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" value={formData.bank_name} onChange={handleChange} name="bank_name" className="w-full pl-10 pr-4 py-2 rounded-lg border" /></div>{errors.bank_name && <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>}</div> */}
                <div>
                  <label>
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={handleAccountNumberChange}
                      maxLength="18"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    />
                  </div>
                  {errors.account_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.account_number}
                    </p>
                  )}
                </div>
                <div>
                  <label>
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Landmark
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.ifsc_code}
                      onChange={handleIFSCChange}
                      maxLength="11"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border uppercase"
                    />
                  </div>
                  {errors.ifsc_code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ifsc_code}
                    </p>
                  )}
                </div>
                <div>
                  <label>
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      value={formData.account_type}
                      onChange={handleChange}
                      name="account_type"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    >
                      <option value="">Select</option>
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
              <div className="border-t pt-6">
                <p className="text-sm text-slate-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <strong>Note:</strong> Cash payment selected. Ensure proper
                  documentation.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="border px-6 py-2 rounded-lg text-slate-600 bg-gray-50 hover:bg-gray-100"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="border px-6 py-2 rounded-lg text-slate-600 bg-gray-50 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:brightness-105 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
                Updating...
              </span>
            ) : (
              "Update Worker"
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default EditWorkerPage;
