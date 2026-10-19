import React, { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useAddCompany } from "../../agenthooks/useAgentCompanyAdd";
import {
  AlertCircle,
  Search,
  CheckCircle,
  MapPin,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";
import Loader from "../../../../common/components/Loader";

const SingleAddCompanyForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    formLoading,

    submitCompany,
    industries,
    states,
    filteredStates,
    filteredCities,
    loadingCities,
    fetchCitiesByState,
    filterStates,
    filterCities,
  } = useAddCompany();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState([]);
  const phonePattern = /^[6-9]\d{9}$/;

  // Refs for dropdowns
  const stateRefs = useRef([]);
  const cityRefs = useRef([]);

  // Define initial form data for dirty check
  const initialFormData = useRef({
    company_name: "",
    email: "",
    phone: "",
    gst_number: "",
    pan_number: "",
    tin_number: "",
    industry_id: "",
    work_type: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    service_charge_type: "",
    service_charge: "",
    addresses: [
      { address: "", city: "", city_id: "", state: "", state_id: "", zip: "" },
    ],
  });

  // Initialize dropdown arrays
  // useEffect(() => {
  //   const addressCount = formData.addresses?.length || 1;
  //   setShowStateDropdown(new Array(addressCount).fill(false));
  //   setShowCityDropdown(new Array(addressCount).fill(false));
  // }, [formData.addresses]);
  useEffect(() => {
    const addressCount = formData.addresses?.length || 1;

    setShowStateDropdown(new Array(addressCount).fill(false));
    setShowCityDropdown(new Array(addressCount).fill(false));
  }, []);

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
    if (
      name === "gst_number" ||
      name === "tin_number" ||
      name === "pan_number"
    ) {
      value = value.toUpperCase();
    }
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

  // Fix: Handle single industry selection
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

  // Handle city search - FIXED VERSION
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

  const handleStateSelect = async (index, state) => {
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
    await fetchCitiesByState(state.id, index);
  };

  const handleCitySelect = (index, city) => {
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
  };

  const handleAddressChangeLocal = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, addresses: updated }));
    setErrors((prev) => ({ ...prev, [`${field}_${index}`]: "" }));
  };

  const addAddressLocal = () => {
    const updated = [
      ...formData.addresses,
      { address: "", city: "", city_id: "", state: "", state_id: "", zip: "" },
    ];
    setFormData((prev) => ({ ...prev, addresses: updated }));
    setErrors((prev) => ({ ...prev, addresses: "" }));

    // Initialize dropdown states for new address
    setShowStateDropdown((prev) => [...prev, false]);
    setShowCityDropdown((prev) => [...prev, false]);
  };

  const removeAddressLocal = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: updated }));

    // Update dropdown arrays
    setShowStateDropdown((prev) => prev.filter((_, i) => i !== index));
    setShowCityDropdown((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set submitting state to true to disable warnings
    setIsSubmitting(true);

    try {
      const result = await submitCompany();

      if (result?.success === false) {
        setIsSubmitting(false);

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: result.message,
        });

        return;
      }

      if (result === true) {
        // Update initial data ref to current form data after successful submission
        initialFormData.current = JSON.parse(JSON.stringify(formData));

        Swal.fire({
          icon: "success",
          title: "Company added",
          text: "New company has been added successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
        navigate("/agent/company/list");
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
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/agent/company/list");
  };

  if (formLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* 🔹 Unsaved Changes Indicator - hide when submitting */}
      {isFormDirty && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
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
            <span className="text-blue-800 font-medium">Saving company...</span>
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
                maxLength={50}
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.company_name ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Company Name"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.company_name}
                </p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <label className="text-sm text-slate-600">
                Company Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={formData.email}
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
            <div>
              <label className="text-sm text-slate-600">
                Service Charge Type
              </label>

              <select
                value={formData.service_charge_type}
                disabled
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 border bg-gray-100 text-gray-600 cursor-not-allowed ${
                  errors.service_charge_type
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
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
                disabled
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 border bg-gray-100 text-gray-600 cursor-not-allowed ${
                  errors.service_charge ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  formData.service_charge_type === "fixed"
                    ? "Service charge "
                    : "Service charge "
                }
              />

              {errors.service_charge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.service_charge}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-gray-200"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Contact person <span className="text-red-500">*</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 px-6 py-4 gap-4">
            {/* Contact Person Name */}
            <div>
              <label className="text-sm text-slate-600">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => handleChange("owner_name", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.owner_name ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Person Name"
              />
              {errors.owner_name && (
                <p className="text-red-500 text-sm mt-1">{errors.owner_name}</p>
              )}
            </div>

            {/* Contact Person Phone */}
            <div>
              <label className="text-sm text-slate-600">
                Contact Person Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.owner_phone}
                onChange={(e) => handleChange("owner_phone", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.owner_phone ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Person Number"
              />
              <AnimatePresence>
                {formData.owner_phone &&
                  !phonePattern.test(
                    formData.owner_phone.replace(/\s/g, ""),
                  ) && (
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
              {errors.owner_phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_phone}
                </p>
              )}
            </div>

            {/* Contact Person Email */}
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">
                Contact Person Email Address{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner_email}
                onChange={(e) => handleChange("owner_email", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.owner_email ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter Email Address"
              />
              {errors.owner_email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_email}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Business Profile - Single Industry Selection */}
        <motion.div
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
        </motion.div>

        {/* Company Addresses */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="flex bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 justify-between items-center ">
            <h2 className="text-lg font-semibold text-slate-700">
              Company Addresses
            </h2>
            <button
              type="button"
              className={`text-blue-600 text-sm font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={addAddressLocal}
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
                    onClick={() => !isSubmitting && removeAddressLocal(index)}
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
                  Address Line <span className="text-red-500">*</span>
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
                {/* State Dropdown - UPDATED */}
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
                            onClick={() => handleStateSelect(index, state)}
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

                {/* City Dropdown - UPDATED */}
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
                              onClick={() => handleCitySelect(index, city)}
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
              <label className="text-sm text-slate-600">
                GST Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => handleChange("gst_number", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gst_number ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter GST Number"
              />
              {errors.gst_number && (
                <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>
              )}
            </div>

            {/* CIN */}
            <div>
              <label className="text-sm text-slate-600">CIN</label>
              {/* <input
                type="text"
                maxLength={21}
                value={formData.tin_number}
                onChange={(e) => handleChange("tin_number", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isSubmitting ? "bg-gray-100" : ""
                }`}
                placeholder="Enter CIN"
              /> */}
              <input
                type="text"
                maxLength={21}
                value={formData.tin_number}
                onChange={(e) => handleChange("tin_number", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tin_number ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
                placeholder="Enter CIN"
              />

              {errors.tin_number && (
                <p className="text-red-500 text-sm mt-1">{errors.tin_number}</p>
              )}
            </div>

            {/* TAN */}
            <div>
              <label className="text-sm text-slate-600">TAN</label>
              {/* <input
                type="text"
                maxLength={10}
                value={formData.pan_number}
                onChange={(e) => handleChange("pan_number", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isSubmitting ? "bg-gray-100" : ""
                }`}
                placeholder="Enter TAN"
              /> */}
              <input
                type="text"
                maxLength={10}
                value={formData.pan_number}
                onChange={(e) => handleChange("pan_number", e.target.value)}
                disabled={isSubmitting}
                autoComplete="off"
                className={`w-full rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pan_number ? "border border-red-500" : "border"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
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
              {isSubmitting ? "Adding Company..." : "Submit"}
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

export default SingleAddCompanyForm;
