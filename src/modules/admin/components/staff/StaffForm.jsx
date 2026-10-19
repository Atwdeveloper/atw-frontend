import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Fingerprint,
  FileText,
  Building2,
  Home,
  MapPin,
  CheckCircle,
  Search,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useStaffForm } from "../../adminhooks/useStaffForm";
import Swal from "sweetalert2";
import Loader from "../../../../common/components/Loader";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";

const StaffForm = ({
  mode = "create",
  title = "Staff Form",
  submitText = "Save",
  staffId = null,
}) => {
  const navigate = useNavigate();

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const stateRef = useRef(null);
  const cityRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldWarn, setShouldWarn] = useState(true);

  const {
    loading,
    formLoading,
    initialData,
    formData,
    errors,
    roles,
    filteredStates,
    filteredCities,

    loadingCities,
    handleSubmit,
    filterStates,
    filterCities,
    fetchCitiesByState,
    validateForm,
    updateFormData,
    updateErrors,
    clearError,
  } = useStaffForm(mode, staffId);

  // Track unsaved changes
  const isFormDirty = useMemo(() => {
    if (isSubmitting) return false;
    if (mode === "create") {
      const defaultEmptyValues = {
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "male",
        role: "",
        role_id: "",
        address: "",
        city: "",
        city_id: "",
        state: "",
        state_id: "",
        pincode: "",
        password: "",
        confirm_password: "",
        aadhar_number: "",
        pan_number: "",
        account_holder_name: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        branch_name: "",
        account_type: "savings",
        status: "active",
      };
      return JSON.stringify(formData) !== JSON.stringify(defaultEmptyValues);
    } else {
      return JSON.stringify(formData) !== JSON.stringify(initialData);
    }
  }, [formData, initialData, mode, isSubmitting]);

  useUnsavedChangesWarning(
    isFormDirty && shouldWarn && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // State search handler
  const handleStateSearch = (value) => {
    if (isSubmitting) return;
    updateFormData({ state: value, state_id: "", city: "", city_id: "" });
    filterStates(value);
    setShowStateDropdown(true);
  };

  const handleStateSelect = async (state) => {
    if (isSubmitting) return;
    updateFormData({
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    });
    clearError("state_id");
    await fetchCitiesByState(state.id);
    setShowStateDropdown(false);
  };

  // City search handler
  const handleCitySearch = (value) => {
    if (isSubmitting) return;
    updateFormData({ city: value, city_id: "" });
    filterCities(value);
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city) => {
    if (isSubmitting) return;
    updateFormData({
      city: city.name,
      city_id: city.id,
    });
    clearError("city_id");
    setShowCityDropdown(false);
  };

  // Phone validation (digits only)
  const handlePhoneChange = (e) => {
    if (isSubmitting) return;

    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    // Validation Check: Agar pehla digit 6-9 ke beech nahi hai
    if (value.length > 0 && !/^[6-9]/.test(value)) {
      // Hum directly errors object me temporary text daal rahe hain taaki aapka JSX isko padhle
      errors.phone = "Phone number must start with 6, 7, 8, or 9";

      // Form ko refresh karne ke liye ek dummy state update ya updateFormData call kar dete hain empty string ke sath
      updateFormData({ phone: "" });
      return;
    }

    // Agar user sahi number enter kar rha hai, toh data update karo
    updateFormData({ phone: value });

    // Agar errors object me humne upar temporary message dala tha, toh use saaf karo
    if (errors.phone === "Phone number must start with 6, 7, 8, or 9") {
      errors.phone = "";
    }

    clearError("phone");
  };

  // Aadhar validation (digits only)
  const handleAadharChange = (e) => {
    if (isSubmitting) return;
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    updateFormData({ aadhar_number: value });
    clearError("aadhar_number");
  };

  // PAN formatting
  const handlePANChange = (e) => {
    if (isSubmitting) return;
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10);
    updateFormData({ pan_number: value });
    clearError("pan_number");
  };

  // Role select
  const handleRoleSelect = (e) => {
    if (isSubmitting) return;
    const selectedId = e.target.value;
    const selectedRole = roles.find((role) => role.id == selectedId);
    updateFormData({
      role_id: selectedId,
      role: selectedRole ? selectedRole.name : "",
    });
    clearError("role_id");
  };

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setShouldWarn(false);

    // Frontend validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      updateErrors(validationErrors);
      setIsSubmitting(false);
      setShouldWarn(true);

      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all the required fields.",
      });
      return;
    }

    try {
      const response = await handleSubmit(formData);

      if (response?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text:
            mode === "edit"
              ? "Staff updated successfully"
              : "Staff created successfully",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/staff/listing");
        });
      } else {
        let errorMessage = "Something went wrong";

        if (response?.data) {
          const firstError = Object.values(response.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          }

          updateErrors(
            Object.keys(response.data).reduce((acc, key) => {
              acc[key] = response.data[key][0];
              return acc;
            }, {}),
          );
        } else if (response?.message) {
          errorMessage = response.message;
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });

        setShouldWarn(true);
      }
    } catch (error) {
      console.error("Submission error:", error);

      const apiErrors = error?.response?.data;

      let errorMessage = "Something went wrong";

      if (apiErrors?.data) {
        const firstError = Object.values(apiErrors.data)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        }

        updateErrors(
          Object.keys(apiErrors.data).reduce((acc, key) => {
            acc[key] = apiErrors.data[key][0];
            return acc;
          }, {}),
        );
      } else if (apiErrors?.message) {
        errorMessage = apiErrors.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });

      setShouldWarn(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/staff/listing");
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
    <motion.div
      className="flex-1 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {mode === "create" ? "Add New Staff" : "Edit Staff"}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === "create"
                ? "Create a new staff member with personal, KYC, and bank details"
                : "Edit staff member details"}
            </p>
          </div>
        </div>
      </motion.div>

      {isFormDirty && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              You have unsaved changes
            </span>
          </div>
        </motion.div>
      )}

      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              {mode === "edit" ? "Updating staff..." : "Creating staff..."}
            </span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="space-y-6">
          {/* Personal Details Card */}
          <motion.div
            className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Personal Details
                </h2>
              </div>
              {mode === "edit" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;

                      updateFormData({
                        name: value,
                        account_holder_name: value,
                      });

                      clearError("name");
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                      updateFormData({ email: e.target.value });
                      clearError("email");
                    }}
                    disabled={
                      isSubmitting ||
                      (mode === "edit" && initialData?.email_verified_at)
                    }
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } ${
                      (mode === "edit" && initialData?.email_verified_at) ||
                      isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.email}
                  </p>
                )}
                {mode === "edit" && initialData?.email_verified_at && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Email verified
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    disabled={
                      isSubmitting ||
                      (mode === "edit" && initialData?.phone_verified_at)
                    }
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } ${
                      (mode === "edit" && initialData?.phone_verified_at) ||
                      isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="10-digit phone number"
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.phone}
                  </p>
                )}
                {mode === "edit" && initialData?.phone_verified_at && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Phone verified
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleRoleSelect}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.role_id ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.profile_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role_id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.role_id}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
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
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!value) {
                        updateFormData({ date_of_birth: "" });
                        return;
                      }

                      const year = new Date(value).getFullYear();
                      const currentYear = new Date().getFullYear();

                      // Validation Rules
                      if (
                        year > currentYear ||
                        year < 1900 ||
                        value.length !== 10
                      ) {
                        updateErrors({
                          date_of_birth: "Please enter a valid date of birth",
                        });

                        updateFormData({
                          date_of_birth: "",
                        });

                        return;
                      }

                      // Valid DOB
                      updateFormData({
                        date_of_birth: value,
                      });

                      clearError("date_of_birth");
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.date_of_birth
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                </div>

                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => updateFormData({ gender: e.target.value })}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    isSubmitting ? "bg-gray-100" : ""
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Address Details Card */}
          <motion.div
            className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Address Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Address */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      updateFormData({ address: e.target.value })
                    }
                    disabled={isSubmitting}
                    rows="3"
                    className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isSubmitting ? "bg-gray-100" : ""
                    }`}
                    placeholder="Enter complete address"
                  />
                </div>
              </div>

              {/* State Dropdown */}
              <div ref={stateRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
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
                    onFocus={() => !isSubmitting && setShowStateDropdown(true)}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.state_id ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="Search or select state"
                  />
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.state_id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.state_id}
                  </p>
                )}
                {showStateDropdown && !isSubmitting && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((state) => (
                        <div
                          key={state.id}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleStateSelect(state)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{state.name}</span>
                            {state.id === formData.state_id && (
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
                  City
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
                    onFocus={() => {
                      if (formData.state_id && !isSubmitting) {
                        setShowCityDropdown(true);
                      }
                    }}
                    disabled={isSubmitting || !formData.state_id}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.city_id ? "border-red-500" : "border-gray-300"
                    } ${
                      !formData.state_id || isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder={
                      !formData.state_id
                        ? "Select state first"
                        : "Search or select city"
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
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.city_id}
                  </p>
                )}
                {!formData.state_id && !isSubmitting && (
                  <p className="text-sm text-gray-500 mt-1">
                    Please select a state first
                  </p>
                )}
                {showCityDropdown && formData.state_id && !isSubmitting && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <div
                          key={city.id}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleCitySelect(city)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{city.name}</span>
                            {city.id === formData.city_id && (
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
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      updateFormData({ pincode: value });
                      if (value && !/^\d{6}$/.test(value)) {
                        // handled during validation
                      } else {
                        clearError("pincode");
                      }
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="6-digit pincode"
                    maxLength="6"
                  />
                </div>
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* KYC Details Card (without UAN, PF, ESIC) */}
          <motion.div
            className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">KYC Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <div className="relative">
                  <Fingerprint
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleAadharChange}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.aadhar_number
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="12-digit Aadhar number"
                    maxLength="12"
                  />
                </div>
                {errors.aadhar_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.aadhar_number}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Only digits allowed (12 digits)
                </p>
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
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handlePANChange}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.pan_number ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                    placeholder="ABCDE1234F"
                    maxLength="10"
                  />
                </div>
                {errors.pan_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.pan_number}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex justify-end space-x-4"
            variants={itemVariants}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`px-8 py-2.5 text-white rounded-lg font-medium transition ${
                loading || isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : mode === "edit"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-900 hover:bg-blue-800"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === "edit" ? "Updating..." : "Creating..."}
                </span>
              ) : loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === "edit" ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={18} />
                  {submitText}
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default StaffForm;
