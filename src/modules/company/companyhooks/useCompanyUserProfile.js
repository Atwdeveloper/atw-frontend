import { useEffect, useState } from "react";

import {
  getUserProfileAPI,
  updateUserProfileAPI,
} from "../../../api/company/companyUserAPI";

export const useCompanyUserProfile = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    date_of_joining: "",
    designation_id: "",
    designation: null,
    user_type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    const initializeForm = async () => {
      setFormLoading(true);
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Error initializing form:", error);
      }
      setFormLoading(false);
    };

    initializeForm();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfileAPI();
      if (response.status === 200 && response.data) {
        const userData = response.data;
        setFormData({
          id: userData.id || "",
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          date_of_joining: userData.date_of_joining || "",
          designation_id: userData.designation_id || "",
          designation: userData.designation || null,
          user_type: userData.user_type || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    const phonePattern = /^[6-9]\d{9}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone =
        "Invalid phone number (must be 10 digits starting with 6-9)";
    }

    // Optional: Date validation if date_of_joining is provided
    if (formData.date_of_joining) {
      const date = new Date(formData.date_of_joining);
      if (isNaN(date.getTime())) {
        newErrors.date_of_joining = "Invalid date format";
      } else if (date > new Date()) {
        newErrors.date_of_joining = "Joining date cannot be in the future";
      }
    }

    return newErrors;
  };

  // Update profile
  const updateProfile = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setLoading(true);
    try {
      // Prepare payload - only send editable fields (designation is not updated)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      const response = await updateUserProfileAPI(payload);
      if (response.status === 200) {
        setSuccessMsg("Profile updated successfully!");
        return true;
      }
    } catch (error) {
      console.error("Update error:", error);

      // Handle API validation errors
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });

        setErrors(formattedErrors);
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile";
        setErrors((prev) => ({ ...prev, api: errorMessage }));
      }
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  return {
    // State
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    formLoading,
    successMsg,
    setSuccessMsg,

    // Actions
    updateProfile,
    handleChange,
    validateForm,

    // Helper functions
    clearError: (fieldName) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    },

    clearAllErrors: () => {
      setErrors({});
    },
  };
};
