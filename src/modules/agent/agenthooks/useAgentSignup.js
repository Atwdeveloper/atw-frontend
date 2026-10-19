import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  registerAgent,
  updateRegisterData,
  getRegisterData,
  getStatesAPI,
  getCitiesByStateAPI,
  getDesignationsAPI,
  getIndustriesAPI,
} from "../../../api/agent/agentAuthAPI";
import Cookies from "js-cookie";
import { useAuthContext } from "../../../common/context/AuthContext";

export const useAgentSignup = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1
  const totalSteps = 6;
  const { login, refreshAuth } = useAuthContext();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    middle_name: "",
    gender: "",
    date_of_birth: "",
    father_name: "",
    pan_number: "",
    aadhar_number: "",
    agent_location: "",
    state_id: "",
    city_id: "",
    zip: "",
    work_location: "",
    industry_id: "",
    designation_id: "",
    department_id: "",
    work_experience: "",
    dress_size: "",
    bonus_frequency: "",
    current_state_id: "",
    current_city_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const [isResuming, setIsResuming] = useState(false);

  // Dropdown states
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [permanentCities, setPermanentCities] = useState([]);
  const [permanentCitiesLoading, setPermanentCitiesLoading] = useState(false);
  const [currentCities, setCurrentCities] = useState([]);
  const [currentCitiesLoading, setCurrentCitiesLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.data?.data && Array.isArray(data.data.data))
      return data.data.data;
    return [];
  };

  const updateFormData = (newData) =>
    setFormData((prev) => ({ ...prev, ...newData }));
  const clearFieldError = (fieldName) =>
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

  // const handleChange = (field, value) => {
  //   updateFormData({ [field]: value });
  //   clearFieldError(field);

  //   if (field === 'state_id') {
  //     updateFormData({ city_id: '' });
  //     setPermanentCities([]);
  //   }
  //   if (field === 'current_state_id') {
  //     updateFormData({ current_city_id: '' });
  //     setCurrentCities([]);
  //   }
  //   if (field === 'industry_id') {
  //     updateFormData({ designation_id: '', department_id: '' });
  //     setDesignations([]);
  //     setDepartments([]);
  //   }
  // };
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    clearFieldError(field);

    if (field === "state_id") {
      updateFormData({ city_id: "" });
      setPermanentCities([]);
    }

    if (field === "current_state_id") {
      updateFormData({ current_city_id: "" });
      setCurrentCities([]);
    }

    if (field === "industry_id") {
      updateFormData({ designation_id: "", department_id: "" });
      setDesignations([]);
      setDepartments([]);
    }
  };

  // ---------- API Fetchers ----------
  const fetchStates = async () => {
    setStatesLoading(true);
    try {
      const res = await getStatesAPI();
      setStates(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch states", err);
      setStates([]);
    } finally {
      setStatesLoading(false);
    }
  };

  const fetchPermanentCities = async (stateId) => {
    if (!stateId) {
      setPermanentCities([]);
      return;
    }
    setPermanentCitiesLoading(true);
    try {
      const res = await getCitiesByStateAPI(stateId);
      setPermanentCities(ensureArray(res));
    } catch (err) {
      console.error(err);
      setPermanentCities([]);
    } finally {
      setPermanentCitiesLoading(false);
    }
  };

  const fetchCurrentCities = async (stateId) => {
    if (!stateId) {
      setCurrentCities([]);
      return;
    }
    setCurrentCitiesLoading(true);
    try {
      const res = await getCitiesByStateAPI(stateId);
      setCurrentCities(ensureArray(res));
    } catch (err) {
      console.error(err);
      setCurrentCities([]);
    } finally {
      setCurrentCitiesLoading(false);
    }
  };

  const fetchIndustries = async () => {
    setIndustriesLoading(true);
    try {
      const res = await getIndustriesAPI();
      setIndustries(ensureArray(res));
    } catch (err) {
      console.error(err);
      setIndustries([]);
    } finally {
      setIndustriesLoading(false);
    }
  };

  const fetchDesignations = async (industryId) => {
    if (!industryId) {
      setDesignations([]);
      return;
    }
    setDesignationsLoading(true);
    try {
      const res = await getDesignationsAPI(industryId);
      setDesignations(ensureArray(res.data));
    } catch (err) {
      console.error(err);
      setDesignations([]);
    } finally {
      setDesignationsLoading(false);
    }
  };

  // ---------- Effects ----------
  useEffect(() => {
    fetchStates();
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (formData.state_id) fetchPermanentCities(formData.state_id);
  }, [formData.state_id]);

  useEffect(() => {
    if (formData.current_state_id)
      fetchCurrentCities(formData.current_state_id);
  }, [formData.current_state_id]);

  useEffect(() => {
    fetchDesignations(formData.industry_id);
  }, [formData.industry_id]);

  // Only fetch saved data if token exists
  useEffect(() => {
    if (token) {
      fetchSavedData();
    }
  }, [token]);

  // ---------- Validation ----------
  const validateStep1 = () => {
    const errs = {};
    if (!formData.first_name?.trim())
      errs.first_name = "First name is required";
    if (!formData.last_name?.trim()) errs.last_name = "Last name is required";
    if (!formData.email?.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email is invalid";

    const phoneDigits = formData.phone?.replace(/\D/g, "") || "";
    if (!phoneDigits) errs.phone = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(phoneDigits))
      errs.phone = "Must be 10 digits starting with 6-9";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.gender) errs.gender = "Please select gender";
    if (!formData.date_of_birth)
      errs.date_of_birth = "Date of birth is required";
    if (!formData.father_name?.trim())
      errs.father_name = "Father's name is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.pan_number?.trim())
      errs.pan_number = "PAN number is required";
    else if (
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number.toUpperCase())
    )
      errs.pan_number = "Invalid PAN format (e.g., ABCDE1234F)";
    if (!formData.aadhar_number?.trim())
      errs.aadhar_number = "Aadhar number is required";
    else if (!/^\d{12}$/.test(formData.aadhar_number))
      errs.aadhar_number = "Aadhar must be 12 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs = {};
    if (!formData.agent_location?.trim())
      errs.agent_location = "Location is required";
    if (!formData.state_id) errs.state_id = "State is required";
    if (!formData.city_id) errs.city_id = "City is required";
    if (!formData.zip?.trim()) errs.zip = "ZIP code is required";
    else if (!/^\d{6}$/.test(formData.zip)) errs.zip = "ZIP must be 6 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs = {};

    if (!formData.work_experience && formData.work_experience !== 0)
      errs.work_experience = "Work experience is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validateStep6 = () => {
    const errs = {};
    if (!formData.current_state_id) errs.current_state_id = "State is required";
    if (!formData.current_city_id) errs.current_city_id = "City is required";
    if (!formData.accepted_terms) {
      errs.accepted_terms = "Please accept the Terms & Conditions";
    }

    if (!formData.accepted_privacy) {
      errs.accepted_privacy = "Please accept the Privacy Policy";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      case 6:
        return validateStep6();
      default:
        return true;
    }
  };

  // ---------- Submission ----------

  const submitStep1 = async () => {
    if (!validateStep1()) return false;

    setLoading(true);

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""),
      };

      const response = await registerAgent(payload);

      // Handle API validation errors returned with HTTP 200
      if (response?.status === 500 || response?.data?.status === 500) {
        const apiErrors = response?.data?.data || response?.data || {};

        const formattedErrors = {};

        Object.keys(apiErrors).forEach((field) => {
          formattedErrors[field] = apiErrors[field][0];
        });

        setErrors(formattedErrors);

        // Build Swal message
        const errorMessage = Object.values(formattedErrors).join("<br>");

        Swal.fire({
          icon: "error",
          title: "Validation Failed",
          html: errorMessage,
        });

        return false;
      }

      const authToken = response?.data?.token || response?.token;

      const agent = response?.data?.agent || response?.agent;

      if (!authToken) {
        throw new Error("No token received");
      }

      login(agent, authToken, "agent", agent?.profile_status || "pending");

      setToken(authToken);

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Please continue registration.",
        timer: 1500,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("STEP1 ERROR =", error);

      Swal.fire({
        icon: "error",
        title: "Step 1 Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentStep = async () => {
    if (!validateCurrentStep()) return false;

    const currentToken = token || Cookies.get("token");

    if (!currentToken) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please start over.",
      });

      navigate("/agent/register");
      return false;
    }

    setLoading(true);

    try {
      const stepFields = getFieldsForStep(currentStep);

      const payload = {};

      stepFields.forEach((field) => {
        if (
          formData[field] !== undefined &&
          formData[field] !== null &&
          formData[field] !== ""
        ) {
          payload[field] = formData[field];
        }
      });

      // Format values
      if (payload.phone) {
        payload.phone = payload.phone.replace(/\D/g, "");
      }

      if (payload.pan_number) {
        payload.pan_number = payload.pan_number.toUpperCase();
      }

      // API CALL
      const response = await updateRegisterData(payload);

      // ✅ HANDLE API CUSTOM ERROR INSIDE 200 RESPONSE
      if (response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data || response?.message || "Something went wrong",
        });

        return false;
      }

      if (
        currentStep === totalSteps &&
        response?.data?.profile_status === "completed"
      ) {
        const updatedAgent = response?.data?.agent || {};

        const currentUser = Cookies.get("user")
          ? JSON.parse(Cookies.get("user"))
          : {};

        const newUser = {
          ...currentUser,
          ...updatedAgent,
          profile_status: "completed",
        };

        Cookies.set("user", JSON.stringify(newUser), cookieOptions);

        Cookies.set("profile_status", "completed", cookieOptions);

        refreshAuth();
      }

      if (currentStep < totalSteps) {
        Swal.fire({
          icon: "success",
          title: "Progress Saved",
          text: `Step ${currentStep} completed.`,
          timer: 1000,
          showConfirmButton: false,
        });
      }

      return true;
    } catch (error) {
      console.error("Submit step error:", error);

      Swal.fire({
        icon: "error",
        title: `Step ${currentStep} Failed`,
        text:
          error?.response?.data?.data ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper to detect current step from saved data
  const detectStepFromData = (data) => {
    if (!data.email || !data.phone) return 1;
    if (!data.gender || !data.date_of_birth || !data.father_name) return 2;
    if (!data.pan_number || !data.aadhar_number) return 3;
    if (!data.state_id || !data.city_id || !data.zip) return 4;
    if (!data.industry_id || !data.designation_id || !data.work_experience)
      return 5;
    if (!data.current_state_id || !data.current_city_id) return 6;
    return 6;
  };

  const fetchSavedData = async () => {
    if (!token) return;
    setIsFetchingProfile(true);
    try {
      const response = await getRegisterData();
      const savedData = response?.data || {};

      updateFormData(savedData);
      setIsResuming(true);
      const step = detectStepFromData(savedData);
      setCurrentStep(step);
    } catch (error) {
      console.error("Failed to fetch saved registration:", error);
      // If token invalid, clear it
      Cookies.remove("token");
      setToken(null);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const getFieldsForStep = (step) => {
    const map = {
      1: ["first_name", "last_name", "email", "phone"],
      2: ["gender", "date_of_birth", "father_name"],
      3: ["pan_number", "aadhar_number"],
      4: ["agent_location", "state_id", "city_id", "zip"],
      5: [
        "work_location",
        "industry_id",
        "designation_id",
        "department_id",
        "work_experience",
      ],
      6: ["dress_size", "current_state_id", "current_city_id"],
    };
    return map[step] || [];
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const success = await submitStep1();
      if (success) setCurrentStep(2);
      return;
    }

    const currentToken = token || Cookies.get("token");
    if (!currentToken) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please start over.",
      }).then(() => navigate("/agent/signup"));
      return;
    }

    if (currentStep < totalSteps) {
      const success = await submitCurrentStep();
      if (success) setCurrentStep((prev) => prev + 1);
      return;
    }

    // Final step
    if (currentStep === totalSteps) {
      const success = await submitCurrentStep();
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Registration Complete!",
          text: "Redirecting to your dashboard...",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/agent/dashboard");
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps && step < currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading: loading || isFetchingProfile,
    isResuming,
    token,
    handleChange,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    fetchSavedData,
    getFieldsForStep,
    states,
    statesLoading,
    permanentCities,
    permanentCitiesLoading,
    currentCities,
    currentCitiesLoading,
    industries,
    industriesLoading,
    designations,
    designationsLoading,
    departments: departments,
    departmentsLoading: departmentsLoading,
  };
};
