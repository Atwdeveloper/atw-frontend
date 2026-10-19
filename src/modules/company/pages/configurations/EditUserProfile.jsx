import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useCompanyUserProfile } from "../../companyhooks/useCompanyUserProfile";
import Loader from "../../../../common/components/Loader";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";
import {
  AlertCircle,
  Calendar,
  Briefcase,
  User,
  Mail,
  Phone,
} from "lucide-react";

const EditUserProfile = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    loading,
    formLoading,
    designations,
    updateProfile,
    handleChange,
    handleDesignationChange,
    clearError,
  } = useCompanyUserProfile();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const phonePattern = /^[6-9]\d{9}$/;
  const showTab = formData.user_type !== "owner";
  // Define initial form data for dirty check
  const initialFormData = useRef({});

  // Initialize initial data when form loads
  useEffect(() => {
    if (!formLoading && formData) {
      initialFormData.current = JSON.parse(JSON.stringify(formData));
    }
  }, [formLoading, formData]);

  // Compute if form is dirty - exclude submission state
  const isFormDirty = useMemo(() => {
    if (!formData || isSubmitting || formLoading) return false;

    return JSON.stringify(formData) !== JSON.stringify(initialFormData.current);
  }, [formData, isSubmitting, formLoading]);

  // Use the unsaved changes warning hook
  useUnsavedChangesWarning(
    isFormDirty && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleChange("phone", value);
  };

  // Handle designation selection
  const handleDesignationSelect = (e) => {
    const value = e.target.value;
    handleDesignationChange(value);
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
          text: "Your profile has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/company/configuration/user-profile");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Update",
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
    navigate("/company/configuration/user-profile");
  };

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 py-6"
      >
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Edit Profile
        </h1>
        <p className="text-sm text-slate-500">
          Update your personal and professional information.
        </p>
      </motion.div>

      {/* 🔹 Unsaved Changes Indicator */}
      {isFormDirty && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mx-3"
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
          className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-lg mx-3"
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
        className="space-y-6 mx-3"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* Personal Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[22px] shadow-sm border border-[#DDDDDD]"
        >
          <div className="text-lg bg-[#F9F9F9] rounded-t-[22px] border-b border-[#DDDDDD] px-6 py-4 font-semibold text-slate-700">
            Personal Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Full Name */}
            <div>
              <label className="text-sm text-slate-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={35}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={() => clearError("name")}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={`w-full pl-10 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border border-red-500" : "border"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-sm text-slate-600">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => clearError("email")}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={`w-full pl-10 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border border-red-500" : "border"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm text-slate-600">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onFocus={() => clearError("phone")}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={`w-full pl-10 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border border-red-500" : "border"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
                  placeholder="Enter 10-digit phone number"
                />
              </div>
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
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 pb-8"
        >
          <div className="flex-1 text-right">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`bg-blue-600 text-white px-8 py-3 rounded-lg shadow font-medium ${
                loading || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700 transition-colors"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`border border-gray-300 px-8 py-3 rounded-lg text-slate-700 bg-white hover:bg-gray-50 ml-3 font-medium ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "transition-colors"
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

export default EditUserProfile;
