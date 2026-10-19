import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useViewCompanyProfile } from "../../companyhooks/useViewCompanyProfile";
import Loader from "../../../../common/components/Loader";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";
import {
  AlertCircle,
  Search,
  CheckCircle,
  MapPin,
  Building2,
} from "lucide-react";

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    loading,
    formLoading,
    successMsg,
    industries,
    states,
    filteredStates,
    filteredCities,
    loadingCities,
    updateProfile,
    addAddress,
    removeAddress,
    handleAddressChange,
    filterStates,
    filterCities,
    handleStateSelect,
    handleCitySelect,
    setErrors,
    setSuccessMsg,
  } = useViewCompanyProfile();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState([]);

  const stateRefs = useRef([]);
  const cityRefs = useRef([]);
  const phonePattern = /^[6-9]\d{9}$/;

  // Define initial form data for dirty check
  const initialFormData = useRef({
    name: "",
    email: "",
    phone: "",
    gst_number: "",
    pan_number: "",
    tin_number: "",
    industry_id: "",
    service_charge_type: "",
    service_charge: "",
    addresses: [
      { address: "", city: "", city_id: "", state: "", state_id: "", zip: "" },
    ],
  });

  // Initialize dropdown arrays
  useEffect(() => {
    const addressCount = formData.addresses?.length || 1;
    setShowStateDropdown(new Array(addressCount).fill(false));
    setShowCityDropdown(new Array(addressCount).fill(false));
  }, [formData.addresses]);

  // Compute if form is dirty - exclude submission state
  const isFormDirty = useMemo(() => {
    if (!formData || isSubmitting) return false;

    return JSON.stringify(formData) !== JSON.stringify(initialFormData.current);
  }, [formData, isSubmitting]);

  // Use the unsaved changes warning hook
  useUnsavedChangesWarning(
    isFormDirty && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      stateRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setShowStateDropdown((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }
      });

      cityRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setShowCityDropdown((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }
      });
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

  const handleServiceChargeTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, service_charge_type: e.target.value }));
    setErrors((prev) => ({ ...prev, service_charge_type: "" }));
  };

  const handleServiceChargeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, service_charge: value }));
    setErrors((prev) => ({ ...prev, service_charge: "" }));
  };

  // Handle single industry selection
  const handleIndustryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, industry_id: value }));
    setErrors((prev) => ({ ...prev, industry_id: "" }));
  };

  const handleStateSearch = (index, value) => {
    if (isSubmitting) return;

    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      state: value,
      state_id: "",
      city: "",
      city_id: "",
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));

    // Filter states
    filterStates(value);

    // Always open dropdown when typing (if there are filtered states)
    setShowStateDropdown((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Handle city search
  const handleCitySearch = (index, value) => {
    if (isSubmitting) return;

    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      city: value,
      city_id: "",
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));

    // Filter cities
    filterCities(value, index);

    // Always open dropdown when typing (if state is selected and there are filtered cities)
    if (updated[index].state_id) {
      setShowCityDropdown((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }
  };

  // Handle input focus for state - show dropdown when empty field is clicked
  const handleStateFocus = (index) => {
    if (isSubmitting) return;

    // Show dropdown if there are states to show
    if (states.length > 0) {
      setShowStateDropdown((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }
  };

  // Handle input focus for city - show dropdown when empty field is clicked (if state is selected)
  const handleCityFocus = (index) => {
    if (isSubmitting) return;

    const item = formData.addresses[index];
    if (item.state_id) {
      setShowCityDropdown((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }
  };

  const handleStateSelectEdit = async (index, state) => {
    if (isSubmitting) return;

    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));

    // Clear errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`state_${index}`];
      delete newErrors[`city_${index}`];
      return newErrors;
    });

    // Close dropdown
    setShowStateDropdown((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });

    // Fetch cities for the selected state
    await handleStateSelect(index, state);
  };

  const handleCitySelectEdit = (index, city) => {
    if (isSubmitting) return;

    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      city: city.name,
      city_id: city.id,
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));

    // Clear error
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`city_${index}`];
      return newErrors;
    });

    // Close dropdown
    setShowCityDropdown((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });

    handleCitySelect(index, city);
  };

  const handleAddressChangeLocal = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, addresses: updated }));
    setErrors((prev) => ({ ...prev, [`${field}_${index}`]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set submitting state to true to disable warnings
    setIsSubmitting(true);

    try {
      const success = await updateProfile();
      if (success) {
        // Update initial data ref to current form data after successful submission
        initialFormData.current = JSON.parse(JSON.stringify(formData));

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your company profile has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/company/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errors.api || "Please fill all the required fields.",
        });
        // If submission failed, reset submitting state
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/profile");
  };

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const validateAlphaNumeric = (value) => {
    return /^[A-Za-z0-9]*$/.test(value);
  };
  return (
    <div className="flex-1 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className=" px-3 "
      >
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Edit Company Details
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Fill in the details below to create a new company account or upload
          multiple companies at once.
        </p>
      </motion.div>
      {/* 🔹 Unsaved Changes Indicator - hide when submitting */}
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

      {/* 🔹 Submitting indicator */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">Saving changes...</span>
          </div>
        </motion.div>
      )}

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-8"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Company Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Company Name */}
            <div>
              <label className="text-sm text-slate-600">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Company Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <label className="text-sm text-slate-600">
                Company Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.email}
                maxLength={100}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Company Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Company Phone */}
            <div>
              <label className="text-sm text-slate-600">
                Company Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Company Contact Number"
              />
              <AnimatePresence>
                {formData.phone &&
                  !phonePattern.test(formData.phone.replace(/\s/g, "")) && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Invalid number — must be 10 digits and start with 6–9
                    </motion.p>
                  )}
              </AnimatePresence>

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Service Charge Type Field */}
            <div>
              <label className="text-sm text-slate-600">
                Service Charge Type
              </label>
              <select
                value={formData.service_charge_type}
                onChange={handleServiceChargeTypeChange}
                disabled={true}
                autoComplete="off"
                className={`w-full rounded-lg bg-gray-100 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed ${
                  errors.service_charge_type
                    ? "border border-red-500"
                    : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
              >
                <option value="">Select Option</option>
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
              {errors.service_charge_type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.service_charge_type}
                </p>
              )}
            </div>

            {/* Service Charge Field */}
            <div>
              <label className="text-sm text-slate-600">Service Charge</label>
              <input
                type="text"
                value={formData.service_charge}
                onChange={handleServiceChargeChange}
                disabled={true}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed ${
                  errors.service_charge ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder={
                  formData.service_charge_type === "fixed"
                    ? "Enter amount in ₹"
                    : "Enter percentage %"
                }
              />
              {errors.service_charge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.service_charge}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.service_charge_type === "fixed"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Business Profile - Single Industry Selection */}
        {/* <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-gray-200"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Business Profile <span className="text-red-500">*</span>
          </div>

          <div className="px-6 pb-4 pt-2">
            <label className="text-sm text-slate-600">Industry</label>

            <select
              value={formData.industry_id}
              disabled={true}
              onChange={handleIndustryChange}
              disabled={isSubmitting}
              autoComplete="off"
              className={`w-full bg-[#FFFFFF] border border-[#DDDDDD] rounded-[8px] p-2 mt-1 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isSubmitting ? "bg-gray-100" : ""
                        }`}
            >
              <option value="">Select industry</option>
              {industries?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {errors.industry_id && (
              <p className="text-red-500 text-sm mt-1">{errors.industry_id}</p>
            )}
          </div>
        </motion.div> */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-gray-200"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Business Profile <span className="text-red-500">*</span>
          </div>

          <div className="px-6 pb-4 pt-2">
            <label className="text-sm text-slate-600">Industry</label>

            <div className="w-full bg-gray-100 border border-[#DDDDDD] rounded-[8px] p-2 mt-1 cursor-not-allowed">
              {industries?.find((item) => item.id == formData.industry_id)
                ?.name || "N/A"}
            </div>

            <input
              type="hidden"
              name="industry_id"
              value={formData.industry_id}
            />

            {errors.industry_id && (
              <p className="text-red-500 text-sm mt-1">{errors.industry_id}</p>
            )}
          </div>
        </motion.div>

        {/* Company Addresses */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="flex bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 justify-between items-center ">
            <h2 className="text-lg font-semibold text-slate-700">
              Work Address
            </h2>
            <button
              type="button"
              className={`text-blue-600 text-sm font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={addAddress}
              disabled={isSubmitting}
            >
              + Add another address
            </button>
          </div>

          {(formData.addresses || []).map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 px-6 py-4 gap-4 border-b last:border-none"
            >
              {index > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => !isSubmitting && removeAddress(index)}
                    disabled={isSubmitting}
                    className={`text-red-500 text-sm font-medium w-fit mb-2 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Remove Address
                  </button>
                </div>
              )}

              {/* Address Line */}
              <div>
                <label className="text-sm text-slate-600">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.address}
                  onChange={(e) =>
                    handleAddressChangeLocal(index, "address", e.target.value)
                  }
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[`address_${index}`]
                      ? "border border-red-500"
                      : "border"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
                  placeholder="Enter Address"
                />
                {errors[`address_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address_${index}`]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* State Dropdown */}
                <div
                  ref={(el) => (stateRefs.current[index] = el)}
                  className="relative"
                >
                  <label className="text-sm text-slate-600">
                    State / Province <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={item.state}
                      onChange={(e) => handleStateSearch(index, e.target.value)}
                      onFocus={() => handleStateFocus(index)}
                      disabled={isSubmitting}
                      autoComplete="off"
                      className={`w-full pl-10 pr-10 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`state_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isSubmitting ? "bg-gray-100" : ""}`}
                      placeholder="Search or select state"
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  {errors[`state_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`state_${index}`]}
                    </p>
                  )}

                  {/* State Dropdown */}
                  {showStateDropdown[index] && !isSubmitting && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredStates.length > 0 ? (
                        filteredStates.map((state) => (
                          <div
                            key={state.id}
                            className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleStateSelectEdit(index, state)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{state.name}</span>
                              {state.id === item.state_id && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500">
                          {item.state.trim()
                            ? "No matching states found"
                            : "Type to search states"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* City Dropdown */}
                <div
                  ref={(el) => (cityRefs.current[index] = el)}
                  className="relative"
                >
                  <label className="text-sm text-slate-600">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={item.city}
                      onChange={(e) => handleCitySearch(index, e.target.value)}
                      onFocus={() => handleCityFocus(index)}
                      disabled={isSubmitting || !item.state_id}
                      autoComplete="off"
                      className={`w-full pl-10 pr-10 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`city_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${
                        !item.state_id || isSubmitting
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder={
                        !item.state_id
                          ? "Select state first"
                          : "Search or select city"
                      }
                    />
                    {loadingCities[index] ? (
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
                  {errors[`city_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`city_${index}`]}
                    </p>
                  )}
                  {!item.state_id && !isSubmitting && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select a state first
                    </p>
                  )}

                  {/* City Dropdown */}
                  {showCityDropdown[index] &&
                    item.state_id &&
                    !isSubmitting && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCities[index]?.length > 0 ? (
                          filteredCities[index].map((city) => (
                            <div
                              key={city.id}
                              className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleCitySelectEdit(index, city)}
                            >
                              <div className="flex items-center justify-between">
                                <span>{city.name}</span>
                                {city.id === item.city_id && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500">
                            {item.city.trim()
                              ? "No matching cities found"
                              : "Type to search cities"}
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="text-sm text-slate-600">
                    ZIP / Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={item.zip}
                    onChange={(e) =>
                      handleAddressChangeLocal(index, "zip", e.target.value)
                    }
                    disabled={isSubmitting}
                    autoComplete="off"
                    className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`zip_${index}`]
                        ? "border border-red-500"
                        : "border"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="Enter ZIP / Postal Code"
                  />
                  {errors[`zip_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`zip_${index}`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-gray-200"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Tax Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 px-6 py-4 gap-4">
            {/* GST Number */}
            <div>
              <label className="text-sm text-slate-600">GST Number</label>
              <input
                type="text"
                maxLength={15}
                value={formData.gst_number}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  handleChange("gst_number", value);

                  if (!validateAlphaNumeric(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      gst_number: "Only alphabets and numbers are allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      gst_number: "",
                    }));
                  }
                }}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isSubmitting ? "bg-gray-100" : ""
                }`}
                placeholder="Enter GST Number"
              />
              {errors.gst_number && (
                <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>
              )}
            </div>

            {/* CIN */}
            <div>
              <label className="text-sm text-slate-600">CIN</label>
              <input
                type="text"
                value={formData.tin_number}
                maxLength={21}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  handleChange("tin_number", value);

                  if (!validateAlphaNumeric(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      tin_number: "Only alphabets and numbers are allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      tin_number: "",
                    }));
                  }
                }}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isSubmitting ? "bg-gray-100" : ""
                }`}
                placeholder="Enter CIN"
              />
              {errors.tin_number && (
                <p className="text-red-500 text-sm mt-1">{errors.tin_number}</p>
              )}
            </div>

            {/* TAN */}
            <div>
              <label className="text-sm text-slate-600">TAN</label>
              <input
                type="text"
                value={formData.pan_number}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  handleChange("pan_number", value);

                  if (!validateAlphaNumeric(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      pan_number: "Only alphabets and numbers are allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      pan_number: "",
                    }));
                  }
                }}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isSubmitting ? "bg-gray-100" : ""
                }`}
                placeholder="Enter TAN"
              />
              {errors.pan_number && (
                <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="flex-1 text-right">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow ${
                loading || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:brightness-105"
              }`}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`border px-6 py-2 rounded-lg text-slate-600 bg-gray-50 ml-3 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default EditCompanyProfile;
