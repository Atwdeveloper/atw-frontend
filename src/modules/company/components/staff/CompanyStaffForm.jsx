import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Save,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useStaffForm } from "../../companyhooks/useCompanyStaffForm";
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

  const {
    loading,
    formLoading,
    formData,
    errors,
    roles,
    handleSubmit,
    validateForm,
    updateFormData,
    updateErrors,
    clearError,
    clearAllErrors,
  } = useStaffForm(mode, staffId);

  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    staff_title: "",
  });

  const baselineRef = useRef(null);
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (!formLoading && formData && !hasInitialised.current) {
      const newLocal = {
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        role_id: formData.role_id || "",
        staff_title: formData.staff_title || "",
      };
      setLocalData(newLocal);

      baselineRef.current =
        mode === "edit"
          ? { ...newLocal }
          : {
              name: "",
              email: "",
              phone: "",
              role_id: "",
              staff_title: "",
            };

      hasInitialised.current = true;
    }
  }, [formLoading, formData, mode]);

  const isFormDirty =
    JSON.stringify(localData) !== JSON.stringify(baselineRef.current || {});

  useUnsavedChangesWarning(
    isFormDirty,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  const handleInputChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    updateFormData({ [field]: value });
    clearError(field);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("phone", value);

    if (!value) {
      clearError("phone");
      return;
    }

    if (!/^[6-9]/.test(value)) {
      updateErrors({
        phone: "Phone number must start with 6, 7, 8, or 9",
      });
    } else if (value.length < 10) {
      updateErrors({
        phone: "Phone number must be 10 digits",
      });
    } else {
      clearError("phone");
    }
  };

  const handleRoleSelect = (e) => {
    const selectedId = e.target.value;
    const selectedRole = roles.find((role) => role.id == selectedId);
    setLocalData((prev) => ({ ...prev, role_id: selectedId }));
    updateFormData({
      role_id: selectedId,
      role: selectedRole ? selectedRole.name : "",
    });
    clearError("role_id");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(localData);
    if (Object.keys(validationErrors).length > 0) {
      updateErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: firstError,
      });
      return;
    }

    try {
      const response = await handleSubmit(localData);

      if (response?.status === 200 || response?.status === 201) {
        const savedStaff = response.data.data;

        const updatedData = {
          name: savedStaff.name || "",
          email: savedStaff.email || "",
          phone: savedStaff.phone || "",
          role_id: savedStaff.permission_profile_id || "",
          staff_title: savedStaff.staff_title || "",
        };

        updateFormData(updatedData);
        setLocalData(updatedData);
        baselineRef.current = { ...updatedData };
        clearAllErrors();

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
          navigate("/company/staff/listing");
        });
      } else if (response?.data?.errors) {
        const apiErrors = response.data.errors;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });
        updateErrors(formattedErrors);
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: Object.values(formattedErrors)
            .map((err) => `<div class="text-left">• ${err}</div>`)
            .join(""),
        });
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} staff:`,
        error,
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          `Failed to ${mode === "edit" ? "update" : "create"} staff.`,
      });
    }
  };

  const handleCancel = () => {
    navigate("/company/staff/listing");
  };

  if (formLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <Loader />
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
      {isFormDirty && (
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

      <form onSubmit={handleFormSubmit}>
        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Staff Details
                </h2>
              </div>
              {mode === "edit" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
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
                    maxLength={35}
                    value={localData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
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
                    type="email"
                    value={localData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.email}
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
                    value={localData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Staff Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Title
                </label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={35}
                    value={localData.staff_title}
                    onChange={(e) =>
                      handleInputChange("staff_title", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.staff_title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                {errors.staff_title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.staff_title}
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
                    value={localData.role_id}
                    onChange={handleRoleSelect}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.role_id ? "border-red-500" : "border-gray-300"
                    }`}
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
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 text-white rounded-lg font-medium transition flex items-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === "edit" ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {mode === "edit" ? "Update Staff" : "Create Staff"}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default StaffForm;
