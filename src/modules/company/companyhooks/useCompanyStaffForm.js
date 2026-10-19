import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getStaffAPI,
  createStaffAPI,
  updateStaffAPI,
  getRolesAPI,
} from "../../../api/company/companyStaffAPI";
import Cookies from "js-cookie";

export const useStaffForm = (mode = "create", staffId = null) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [roles, setRoles] = useState([]);
  const companyCookie = Cookies.get("company");
  const parsedCompany = companyCookie ? JSON.parse(companyCookie) : {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    staff_title: "",
  });

  const [errors, setErrors] = useState({});

  const fetchRoles = async () => {
    try {
      const response = await getRolesAPI();
      const rolesData = response.data?.data || response.data || response || [];
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("fetchRoles error:", error);
      Swal.fire({
        icon: "warning",
        title: "Roles could not be loaded",
        text: "You may proceed, but role selection is unavailable.",
      });
    }
  };

  const fetchStaffData = async () => {
    try {
      const response = await getStaffAPI(staffId);
      const staffData = response.data.data;
      setInitialData(staffData);
      setFormData({
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        role_id: staffData.permission_profile_id || "",
        staff_title: staffData.staff_title || "",
      });
    } catch (error) {
      console.error("Error fetching staff data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setFormLoading(true);
        await fetchRoles();
        if (mode === "edit" && staffId) {
          await fetchStaffData();
        }
      } catch (error) {
        console.error("Unhandled error in initializeForm:", error);
        Swal.fire({
          icon: "error",
          title: "Initialization Error",
          text: "Failed to load required data. Please refresh the page.",
        });
      } finally {
        setFormLoading(false);
      }
    };
    initializeForm();
  }, [mode, staffId]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        permission_profile_id: formData.role_id,
        staff_title: formData.staff_title,
      };
      const response =
        mode === "edit"
          ? await updateStaffAPI(staffId, apiData)
          : await createStaffAPI(apiData);
      return response;
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} staff:`,
        error,
      );

      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });
        setErrors(formattedErrors);
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: Object.values(formattedErrors)
            .map((err) => `<div class="text-left">• ${err}</div>`)
            .join(""),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.message || "Unexpected error occurred",
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must be 10 digits and start with 6, 7, 8, or 9";
    }

    if (!formData.role_id) newErrors.role_id = "Role is required";

    return newErrors;
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateErrors = (updates) => {
    setErrors((prev) => ({ ...prev, ...updates }));
  };

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    loading,
    formLoading,
    initialData,
    formData,
    errors,
    roles,
    handleSubmit,
    validateForm,
    updateFormData,
    updateErrors,
    clearError,
    clearAllErrors,
  };
};
