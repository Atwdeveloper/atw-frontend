import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getStaffAPI,
  createStaffAPI,
  updateStaffAPI,
  getRolesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/admin/adminStaffAPI";

export const useStaffForm = (mode = "create", staffId = null) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  // Dropdown data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Form data – removed industry, designation, department, UAN, PF, ESIC
  const [formData, setFormData] = useState({
    // Personal Details
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "male",
    role: "",
    role_id: "",

    // Address Details
    address: "",
    city: "",
    city_id: "",
    state: "",
    state_id: "",
    pincode: "",

    // Password (only create)
    password: "",
    confirm_password: "",

    // KYC
    aadhar_number: "",
    pan_number: "",

    // Bank Details
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    account_type: "savings",

    // Status
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // Initialize form
  useEffect(() => {
    const initializeForm = async () => {
      try {
        setFormLoading(true);
        await fetchDropdownData();
        if (mode === "edit" && staffId) {
          await fetchStaffData();
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load form data. Please refresh the page.",
        });
      } finally {
        setFormLoading(false);
      }
    };
    initializeForm();
  }, [mode, staffId]);

  // Fetch all dropdown data
  const fetchDropdownData = async () => {
    try {
      // Roles
      const rolesRes = await getRolesAPI();
      setRoles(rolesRes.data.data || []);

      // States
      const statesRes = await getStatesAPI();
      const statesData = statesRes.data?.data || [];
      setStates(statesData);
      setFilteredStates(statesData);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      if (error.response?.status !== 401) {
        Swal.fire({
          icon: "warning",
          title: "Dropdown Data",
          text: "Using sample data. Some features may be limited.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    }
  };

  // Fetch staff data for edit
  const fetchStaffData = async () => {
    try {
      const response = await getStaffAPI(staffId);
      const staffData = response.data.data;
      setInitialData(staffData);

      setFormData((prev) => ({
        ...prev,
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        date_of_birth: staffData.date_of_birth || "",
        gender: staffData.gender || "male",
        role: staffData.role || "",
        role_id: staffData.permission_profile_id || "",
        address: staffData.address || "",
        city: staffData.city || "",
        city_id: staffData.city_id || "",
        state: staffData.state || "",
        state_id: staffData.state_id || "",
        pincode: staffData.pincode || "",
        aadhar_number: staffData.aadhar_number || "",
        pan_number: staffData.pan_number || "",
        account_holder_name: staffData.account_holder_name || "",
        bank_name: staffData.bank_name || "",
        account_number: staffData.account_number || "",
        ifsc_code: staffData.ifsc_code || "",
        branch_name: staffData.branch_name || "",
        account_type: staffData.account_type || "savings",
        status: staffData.status || "active",
      }));

      // If state exists, fetch its cities
      if (staffData.state_id) {
        await fetchCitiesByState(staffData.state_id);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      throw error;
    }
  };

  // Fetch cities by state
  const fetchCitiesByState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      setFilteredCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      const citiesData = response.data.data || [];
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
      setFilteredCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Filter functions
  const filterStates = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredStates(states);
    } else {
      const filtered = states.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStates(filtered);
    }
  };

  const filterCities = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCities(filtered);
    }
  };

  // Validate form (removed industry, designation, department, UAN, PF, ESIC)
  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!formData.role_id) newErrors.role_id = "Role is required";

    // KYC validations
    if (formData.aadhar_number && formData.aadhar_number.length !== 12) {
      newErrors.aadhar_number = "Aadhar must be exactly 12 digits";
    }
    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
    ) {
      newErrors.pan_number = "PAN must be in format: ABCDE1234F";
    }

    // Bank validations
    if (
      formData.account_number &&
      (!/^\d{9,18}$/.test(formData.account_number) ||
        formData.account_number.length < 9 ||
        formData.account_number.length > 18)
    ) {
      newErrors.account_number = "Account number must be 9-18 digits";
    }
    if (
      formData.ifsc_code &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)
    ) {
      newErrors.ifsc_code = "IFSC must be in format: ABCD0123456";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // Prepare payload – removed industry/designation/department/UAN/PF/ESIC
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        permission_profile_id: formData.role_id,
        address: formData.address,
        city_id: formData.city_id ? String(formData.city_id) : "",
        state_id: formData.state_id ? String(formData.state_id) : "",
        pincode: formData.pincode,
        aadhar_number: formData.aadhar_number,
        pan_number: formData.pan_number,
        account_holder_name: formData.account_holder_name,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        branch_name: formData.branch_name,
        account_type: formData.account_type,
        status: formData.status,
      };

      const response =
        mode === "edit"
          ? await updateStaffAPI(staffId, apiData)
          : await createStaffAPI(apiData);

      return response.data;
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
    } finally {
      setLoading(false);
    }
  };

  // State updaters
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

  const generateStrongPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    let password = "";
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 4; i < 12; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    return password;
  };

  return {
    loading,
    formLoading,
    initialData,
    formData,
    errors,
    roles,
    filteredStates,
    filteredCities,
    states,
    cities,
    loadingCities,
    designationsLoading: false, // not used but kept for compatibility
    handleSubmit,
    filterStates,
    filterCities,
    fetchCitiesByState,
    validateForm,
    updateFormData,
    updateErrors,
    clearError,
    clearAllErrors,
    generateStrongPassword,
  };
};
