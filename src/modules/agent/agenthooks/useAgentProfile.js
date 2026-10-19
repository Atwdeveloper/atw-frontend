import { useEffect, useState } from "react";
import {
  getAgentProfile,
  updateAgentProfile,
  getStatesAPI,
  getCitiesByStateAPI,
  getDepartmentsAPI,
} from "../../../api/agent/agentProfileAPI";

const formatDate = (date) => {
  if (!date) return "";
  return date.split("T")[0]; // converts ISO → YYYY-MM-DD
};

export const useAgentProfile = (options = {}) => {
  const { loadLocationData = false } = options;

  // -----------------------------------------------------
  // STATE – FORM DATA (extended with new fields)
  // -----------------------------------------------------
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    date_of_joining: "",
    father_name: "",
    pan_number: "",
    aadhar_number: "",
    agent_location: "",
    city_id: "",
    state_id: "",
    agent_code: "",
    status: "",
    agent_id: "",

    // WORK DETAILS (industry & designation removed)
    work_location: "",
    department_id: "", // still present if needed
    work_experience: "",
    dress_size: "",
    bonus_frequency: "",

    // ADDRESS DETAILS
    zip: "",
    current_state_id: "",
    current_city_id: "",
    current_state: "",
    current_city: "",

    // PAYMENT INFORMATION
    payment_method: "bank",
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    account_type: "",
  });

  // -----------------------------------------------------
  // DROPDOWN DATA
  // -----------------------------------------------------
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // industry & designation arrays removed
  const [departments, setDepartments] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);

  // -----------------------------------------------------
  // LOADING STATES
  // -----------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCurrentCities, setLoadingCurrentCities] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // -----------------------------------------------------
  // FETCH AGENT PROFILE
  // -----------------------------------------------------
  const fetchAgentProfile = async () => {
    try {
      const response = await getAgentProfile();
      const agentData = response.data;

      setFormData((prev) => ({
        ...prev,
        ...agentData,
        date_of_birth: formatDate(agentData.date_of_birth),
        date_of_joining: formatDate(agentData.date_of_joining),
        city_id: agentData.city_id?.toString() || "",
        state_id: agentData.state_id?.toString() || "",
        department_id: agentData.department_id?.toString() || "",
        current_state_id: agentData.current_state_id?.toString() || "",
        current_city_id: agentData.current_city_id?.toString() || "",
        current_state: agentData.current_state || "",
        current_city: agentData.current_city || "",
      }));
    } catch (error) {
      console.error("Error fetching agent profile:", error);
      setErrors((prev) => ({ ...prev, api: "Failed to load profile" }));
    }
  };

  // -----------------------------------------------------
  // FETCH RESIDENTIAL STATES & CITIES
  // -----------------------------------------------------
  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      setStates(response.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCitiesByState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setLoadingCities(false);
  };

  // -----------------------------------------------------
  // FETCH DEPARTMENT DATA (kept, though not displayed)
  // -----------------------------------------------------
  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await getDepartmentsAPI();
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
    setLoadingDepartments(false);
  };

  // -----------------------------------------------------
  // FETCH WORKING STATE/CITY DATA
  // -----------------------------------------------------
  const fetchCurrentCitiesByState = async (stateId) => {
    if (!stateId) {
      setCurrentCities([]);
      return;
    }
    setLoadingCurrentCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      setCurrentCities(response.data || []);
    } catch (error) {
      console.error("Error fetching working cities:", error);
    }
    setLoadingCurrentCities(false);
  };

  // -----------------------------------------------------
  // HANDLERS
  // -----------------------------------------------------
  const handleStateChange = async (stateId, stateName) => {
    setFormData((prev) => ({
      ...prev,
      state_id: stateId.toString(),
      city_id: "",
      state: stateName,
    }));
    setErrors((prev) => ({ ...prev, state_id: "", city_id: "" }));
    await fetchCitiesByState(stateId);
  };

  const handleCityChange = (cityId, cityName) => {
    setFormData((prev) => ({
      ...prev,
      city_id: cityId.toString(),
      city: cityName,
    }));
    setErrors((prev) => ({ ...prev, city_id: "" }));
  };

  // Removed: handleIndustryChange, handleDesignationChange

  const handleDepartmentChange = (departmentId, departmentName) => {
    setFormData((prev) => ({
      ...prev,
      department_id: departmentId.toString(),
      department: departmentName,
    }));
  };

  const handleCurrentStateChange = async (stateId, stateName) => {
    setFormData((prev) => ({
      ...prev,
      current_state_id: stateId.toString(),
      current_city_id: "",
      current_state: stateName,
      current_city: "",
    }));
    await fetchCurrentCitiesByState(stateId);
  };

  const handleCurrentCityChange = (cityId, cityName) => {
    setFormData((prev) => ({
      ...prev,
      current_city_id: cityId.toString(),
      current_city: cityName,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      payment_method: method,
    }));
    if (method === "cash") {
      setFormData((prev) => ({
        ...prev,
        account_holder_name: "",
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
        account_type: "",
      }));
    }
  };

  // -----------------------------------------------------
  // UPDATE PROFILE
  // -----------------------------------------------------
  const updateProfile = async () => {
    const newErrors = {};

    if (!formData.first_name?.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name?.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.phone?.trim()) newErrors.phone = "Mobile number is required";
    if (!formData.state_id)
      newErrors.state_id = "Residential state is required";
    if (!formData.city_id) newErrors.city_id = "Residential city is required";
    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number.toUpperCase())
    ) {
      newErrors.pan_number = "Invalid PAN number. Example: ABCDE1234F";
    }
    if (
      formData.aadhar_number &&
      formData.aadhar_number.replace(/\D/g, "").length !== 12
    ) {
      newErrors.aadhar_number =
        "Aadhaar number must be exactly 12 digits. Example: 1234-5678-9012";
    }
    if (formData.payment_method === "bank") {
      if (!formData.account_holder_name?.trim())
        newErrors.account_holder_name = "Account holder name is required";
      if (!formData.account_number?.trim())
        newErrors.account_number = "Account number is required";
      if (formData.account_number !== formData.confirm_account_number)
        newErrors.confirm_account_number = "Account numbers do not match";
      if (!formData.ifsc_code?.trim()) {
        newErrors.ifsc_code = "IFSC code is required";
      } else if (
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase())
      ) {
        newErrors.ifsc_code = "Invalid IFSC code. Example: SBIN0001234";
      }
      if (!formData.account_type?.trim())
        newErrors.account_type = "Account type is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    setLoading(true);

    try {
      const payload = {
        ...formData,

        state_id: formData.state_id ? parseInt(formData.state_id) : null,
        city_id: formData.city_id ? parseInt(formData.city_id) : null,
        department_id: formData.department_id
          ? parseInt(formData.department_id)
          : null,
        current_state_id: formData.current_state_id
          ? parseInt(formData.current_state_id)
          : null,
        current_city_id: formData.current_city_id
          ? parseInt(formData.current_city_id)
          : null,
      };

      delete payload.agent_code;
      delete payload.status;
      delete payload.agent_id;
      delete payload.confirm_account_number;
      delete payload.city;
      delete payload.state;
      delete payload.department;
      delete payload.current_state;
      delete payload.current_city;

      const response = await updateAgentProfile(payload);

      if (response.status === 200) {
        setSuccessMsg("Profile updated successfully!");
        await fetchAgentProfile();
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setErrors((prev) => ({ ...prev, api: errorMessage }));
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  // -----------------------------------------------------
  // INITIAL LOAD
  // -----------------------------------------------------
  useEffect(() => {
    const initialize = async () => {
      setFormLoading(true);

      try {
        const response = await getAgentProfile();
        const agentData = response.data;

        setFormData((prev) => ({
          ...prev,
          ...agentData,
          date_of_birth: formatDate(agentData.date_of_birth),
          date_of_joining: formatDate(agentData.date_of_joining),
          city_id: agentData.city_id?.toString() || "",
          state_id: agentData.state_id?.toString() || "",
          department_id: agentData.department_id?.toString() || "",
          current_state_id: agentData.current_state_id?.toString() || "",
          current_city_id: agentData.current_city_id?.toString() || "",
          current_state: agentData.current_state || "",
          current_city: agentData.current_city || "",
        }));

        if (loadLocationData) {
          await Promise.all([fetchStates(), fetchDepartments()]);

          if (agentData.state_id) {
            await fetchCitiesByState(agentData.state_id);
          }

          if (agentData.current_state_id) {
            await fetchCurrentCitiesByState(agentData.current_state_id);
          }
        }
      } catch (error) {
        console.error("Error initializing agent profile:", error);
      }

      setFormLoading(false);
    };

    initialize();
  }, [loadLocationData]);

  // -----------------------------------------------------
  // RETURN (password management is separate – left untouched)
  // -----------------------------------------------------
  return {
    formData,
    setFormData,
    states,
    cities,
    departments,
    currentCities,

    loading,
    formLoading,
    loadingCities,
    loadingCurrentCities,
    loadingDepartments,

    errors,
    successMsg,
    setErrors,
    setSuccessMsg,

    handleStateChange,
    handleCityChange,
    handleDepartmentChange,
    handleCurrentStateChange,
    handleCurrentCityChange,
    handlePaymentMethodChange,

    fetchCitiesByState,
    fetchCurrentCitiesByState,

    updateProfile,
  };
};
