import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  addWorkerAPI,
  addDesignationAPI,
  getIndustriesWithDesignationsAPI,
  getDesignationsByIndustryAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/agent/agentWorkerAPI";

// Validation patterns
const phonePattern = /^[6-9]\d{9}$/;
const uanPattern = /^\d{12}$/;
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const useAddWorker = () => {
  const navigate = useNavigate();

  const initialFormData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    work_email: "",
    mobile_number: "",
    gender: "",
    industry: "",
    industry_id: "",
    designation: "",
    designation_id: "",
    new_designation: "",
    dress_size: "",
    work_experience: "",
    uan_number: "",
    esic_number: "",
    bonus_frequency: "",
    date_of_birth: "",
    father_name: "",
    pan_number: "",
    aadhar_number: "",
    residential_address: "",
    state_id: "",
    city_id: "",
    zip: "",
    current_state: "",
    current_state_id: "",
    current_city: "",
    current_city_id: "",
    working_address: "",
    working_zip: "",
    payment_method: "bank",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    account_type: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [workingCities, setWorkingCities] = useState([]);
  const [filteredWorkingCities, setFilteredWorkingCities] = useState([]);
  const [loadingWorkingCities, setLoadingWorkingCities] = useState(false);

  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    const fetchAllData = async () => {
      setFormLoading(true);
      try {
        const industriesResponse = await getIndustriesWithDesignationsAPI();
        const industriesData = industriesResponse.data?.data || [];
        setIndustries(industriesData);
        setFilteredIndustries(industriesData);

        const statesResponse = await getStatesAPI();
        const statesData = statesResponse.data?.data || [];
        setStates(statesData);
        setFilteredStates(statesData);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load form data. Please refresh the page.",
        });
      } finally {
        setFormLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Auto-update account holder name
  useEffect(() => {
    const fullName = [
      formData.first_name,
      formData.middle_name,
      formData.last_name,
    ]
      .filter(Boolean)
      .join(" ");
    setFormData((prev) => {
      if (prev.account_holder_name === fullName) return prev;
      return { ...prev, account_holder_name: fullName };
    });
  }, [formData.first_name, formData.middle_name, formData.last_name]);

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Industry / Designation
  const filterIndustries = useCallback(
    (searchTerm) => {
      setFilteredIndustries(
        industries.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    },
    [industries],
  );

  const filterDesignations = useCallback(
    (searchTerm) => {
      setFilteredDesignations(
        designations.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    },
    [designations],
  );

  const fetchDesignationsByIndustry = useCallback(async (industryId) => {
    try {
      const response = await getDesignationsByIndustryAPI(industryId);
      const data = response.data?.data?.data || [];
      setDesignations(data);
      setFilteredDesignations(data);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      setDesignations([]);
      setFilteredDesignations([]);
    }
  }, []);

  const addNewDesignation = useCallback(async (designationName, industryId) => {
    try {
      const response = await addDesignationAPI({
        name: designationName,
        industry_id: industryId,
      });
      if (response.data) {
        const newDesignation = response.data.data;
        setDesignations((prev) => [...prev, newDesignation]);
        setFilteredDesignations((prev) => [...prev, newDesignation]);
        return newDesignation;
      }
    } catch (error) {
      console.error("Failed to add designation:", error);
      throw error;
    }
  }, []);

  // State / City (residential)
  const filterStates = useCallback(
    (searchTerm) => {
      setFilteredStates(
        states.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    },
    [states],
  );

  const filterCities = useCallback(
    (searchTerm) => {
      setFilteredCities(
        cities.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    },
    [cities],
  );

  const fetchCitiesByState = useCallback(async (stateId) => {
    if (!stateId) {
      setCities([]);
      setFilteredCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      const citiesData = response.data?.data || [];
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
      setFilteredCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Working address
  const filterWorkingCities = useCallback(
    (searchTerm) => {
      setFilteredWorkingCities(
        workingCities.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    },
    [workingCities],
  );

  const fetchWorkingCitiesByState = useCallback(async (stateId) => {
    if (!stateId) {
      setWorkingCities([]);
      setFilteredWorkingCities([]);
      return;
    }
    setLoadingWorkingCities(true);
    try {
      const response = await getCitiesByStateAPI(stateId);
      const citiesData = response.data?.data || [];
      setWorkingCities(citiesData);
      setFilteredWorkingCities(citiesData);
    } catch (error) {
      console.error("Failed to fetch working cities:", error);
      setWorkingCities([]);
      setFilteredWorkingCities([]);
    } finally {
      setLoadingWorkingCities(false);
    }
  }, []);

  // Validation
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.first_name) newErrors.first_name = "First name is required";
    if (!data.last_name) newErrors.last_name = "Last name is required";
    if (!data.work_email) newErrors.work_email = "Personal email is required";
    if (!data.mobile_number)
      newErrors.mobile_number = "Mobile number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.industry_id) newErrors.industry = "Industry is required";
    if (!data.designation_id && !data.new_designation)
      newErrors.designation = "Designation is required";

    if (data.date_of_birth) {
      const today = new Date();
      const dob = new Date(data.date_of_birth);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()))
        age--;
      if (age < 18)
        newErrors.date_of_birth = "Worker must be at least 18 years old";
    }

    if (!data.state_id) newErrors.state_id = "State is required";
    if (!data.city_id) newErrors.city_id = "City is required";
    if (data.zip && !/^\d{6}$/.test(data.zip))
      newErrors.zip = "Pincode must be 6 digits";
    if (data.working_zip && !/^\d{6}$/.test(data.working_zip))
      newErrors.working_zip = "Working zip must be 6 digits";

    if (data.payment_method === "bank") {
      if (!data.account_holder_name)
        newErrors.account_holder_name = "Account holder name is required";
      // if (!data.bank_name) newErrors.bank_name = "Bank name is required";
      if (!data.account_number)
        newErrors.account_number = "Account number is required";
      if (!data.confirm_account_number)
        newErrors.confirm_account_number = "Please confirm account number";
      if (data.account_number !== data.confirm_account_number)
        newErrors.confirm_account_number = "Account numbers do not match";
      if (!data.ifsc_code) newErrors.ifsc_code = "IFSC code is required";
      if (!data.account_type)
        newErrors.account_type = "Account type is required";
    }

    if (
      data.mobile_number &&
      !phonePattern.test(data.mobile_number.replace(/\D/g, ""))
    )
      newErrors.mobile_number =
        "Mobile number must be 10 digits starting with 6-9";
    if (data.work_email && !/\S+@\S+\.\S+/.test(data.work_email))
      newErrors.work_email = "Invalid email format";
    if (data.pan_number && !panPattern.test(data.pan_number))
      newErrors.pan_number = "Invalid PAN format (e.g., ABCDE1234F)";
    if (data.uan_number && !uanPattern.test(data.uan_number))
      newErrors.uan_number = "UAN must be exactly 12 digits";
    if (data.ifsc_code && !ifscPattern.test(data.ifsc_code))
      newErrors.ifsc_code = "Invalid IFSC format (e.g., HDFC0001234)";

    return newErrors;
  };

  // Prepare API payload
  const prepareFormDataForAPI = (data) => {
    const apiData = {
      first_name: data.first_name,
      middle_name: data.middle_name || null,
      last_name: data.last_name,
      email: data.work_email,
      work_email: data.work_email,
      mobile_number: data.mobile_number.replace(/\D/g, ""),
      gender: data.gender,
      dress_size: data.dress_size || null,
      work_experience: data.work_experience || null,
      industry_id: data.industry_id || null,
      designation_id: data.designation_id || null,
      ...(data.new_designation && { new_designation: data.new_designation }),
      uan_number: data.uan_number || null,
      esic_number: data.esic_number || null,
      bonus_frequency: data.bonus_frequency || null,
      date_of_birth: data.date_of_birth,
      father_name: data.father_name || null,
      pan_number: data.pan_number || null,
      aadhar_number: data.aadhar_number?.replace(/-/g, "") || null,
      address: data.residential_address || null,
      state_id: data.state_id || null,
      city_id: data.city_id || null,
      zip: data.zip || null,
      current_state_id: data.current_state_id || null,
      current_city_id: data.current_city_id || null,
      working_address: data.working_address || null,
      working_zip: data.working_zip || null,
      payment_method: data.payment_method,
      account_holder_name: data.account_holder_name || null,
      bank_name: data.bank_name || null,
      account_number: data.account_number || null,
      ifsc_code: data.ifsc_code || null,
      account_type: data.account_type || null,
    };
    Object.keys(apiData).forEach((key) => {
      if (apiData[key] === "") apiData[key] = null;
    });
    return apiData;
  };

  const submitForm = async (formDataToSubmit) => {
    const validationErrors = validateForm(formDataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      throw new Error("Validation failed");
    }

    setLoading(true);
    try {
      const apiData = prepareFormDataForAPI(formDataToSubmit);
      const response = await addWorkerAPI(apiData);
      console.log("API RESPONSE:", response);
      console.log("API RESPONSE DATA:", response?.data);
      if (response?.status === 500 && response?.data) {
        const backendErrors = {};

        Object.keys(response.data).forEach((key) => {
          backendErrors[key] = Array.isArray(response.data[key])
            ? response.data[key][0]
            : response.data[key];
        });

        setErrors(backendErrors);

        return {
          success: false,
          message: Object.values(backendErrors).flat().join(", "),
        };
      }
      if (response.status === 200 || response.status === 201) {
        setFormData(initialFormData);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to add worker");
      }
    } catch (error) {
      console.log("ERROR:", error);
      console.log("ERROR RESPONSE:", error?.response);
      console.log("ERROR RESPONSE DATA:", error?.response?.data);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        });
        setErrors(formattedErrors);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    formLoading,
    industries: filteredIndustries,
    designations: filteredDesignations,
    states: filteredStates,
    cities: filteredCities,
    loadingCities,
    workingCities: filteredWorkingCities,
    loadingWorkingCities,
    updateFormData,
    clearError,
    filterIndustries,
    filterDesignations,
    filterStates,
    filterCities,
    fetchCitiesByState,
    filterWorkingCities,
    fetchWorkingCitiesByState,
    addNewDesignation,
    fetchDesignationsByIndustry,
    submitForm,
    resetForm,
    navigate,
  };
};
