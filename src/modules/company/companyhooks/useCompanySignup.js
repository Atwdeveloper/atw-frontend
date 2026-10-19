import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  registerrCompany,
  updateCompanyData,
  getCompanyRegisterData,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/company/companyAuthAPI"; // adjust path as needed

export const useCompanyRegister = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1: Basic Company Info (register)
    company_name: "",
    email: "",
    company_phone: "",
    industry_ids: [], // sent as array to register, but we'll store single selection and convert

    // Step 2: Company Basic Update (edit)
    // (same fields can be edited)

    // Step 3: Owner Details
    owner_name: "",
    owner_email: "",
    owner_phone: "",

    // Step 4: KYC Details
    gst_number: "",
    pan_number: "",
    tin_number: "",

    // Step 5: Address Details (multiple)
    addresses: [],

    // Step 6: Terms
    accepted_terms: false,
  });

  // For single industry selection in UI
  const [selectedIndustryId, setSelectedIndustryId] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [token, setToken] = useState(
    () => localStorage.getItem("company_token") || null,
  );

  // Dropdown data
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesMap, setCitiesMap] = useState({}); // key: stateId, value: cities array
  const [citiesLoading, setCitiesLoading] = useState({});

  // ---------- Helpers ----------
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

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    clearFieldError(field);
  };

  // Address management
  const addAddress = () => {
    const newAddress = { address: "", city_id: "", state_id: "", zip: "" };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const updateAddress = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, addresses: updated }));
    clearFieldError(`address_${index}_${field}`);
  };

  const removeAddress = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  // Industry selection (single for UI, but API expects array)
  const handleIndustryChange = (industryId) => {
    setSelectedIndustryId(industryId);
    updateFormData({ industry_ids: industryId ? [parseInt(industryId)] : [] });
    clearFieldError("industry_ids");
  };

  // ---------- API Fetchers ----------
  const fetchIndustries = async () => {
    setIndustriesLoading(true);
    try {
      const res = await getIndustriesAPI();
      setIndustries(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch industries", err);
    } finally {
      setIndustriesLoading(false);
    }
  };

  const fetchStates = async () => {
    setStatesLoading(true);
    try {
      const res = await getStatesAPI();
      setStates(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setStatesLoading(false);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId || citiesMap[stateId]) return;
    setCitiesLoading((prev) => ({ ...prev, [stateId]: true }));
    try {
      const res = await getCitiesByStateAPI(stateId);
      const cities = ensureArray(res);
      setCitiesMap((prev) => ({ ...prev, [stateId]: cities }));
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setCitiesLoading((prev) => ({ ...prev, [stateId]: false }));
    }
  };

  // ---------- Effects ----------
  useEffect(() => {
    fetchIndustries();
    fetchStates();
  }, []);

  // When token exists, fetch saved data to resume
  useEffect(() => {
    if (token) fetchSavedData();
  }, [token]);

  // ---------- Validation per step ----------
  const validateStep1 = () => {
    const errs = {};
    if (!formData.company_name?.trim())
      errs.company_name = "Company name is required";
    if (!formData.email?.trim()) errs.email = "Company email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email is invalid";
    const phoneDigits = formData.company_phone?.replace(/\D/g, "");
    if (!formData.company_phone) errs.company_phone = "Phone is required";
    else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
      errs.company_phone = "Must be 10 digits starting with 6-9";
    if (!formData.industry_ids || formData.industry_ids.length === 0)
      errs.industry_ids = "Please select an industry";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => validateStep1(); // same fields

  const validateStep3 = () => {
    const errs = {};
    if (!formData.owner_name?.trim())
      errs.owner_name = "Owner name is required";
    if (!formData.owner_email?.trim())
      errs.owner_email = "Owner email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.owner_email))
      errs.owner_email = "Email is invalid";
    const phoneDigits = formData.owner_phone?.replace(/\D/g, "");
    if (!formData.owner_phone) errs.owner_phone = "Owner phone is required";
    else if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
      errs.owner_phone = "Must be 10 digits starting with 6-9";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs = {};
    if (!formData.gst_number?.trim())
      errs.gst_number = "GST number is required";
    // Optional: PAN and TIN can be validated if present
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs = {};
    if (formData.addresses.length === 0) {
      errs.addresses = "At least one address is required";
    } else {
      formData.addresses.forEach((addr, idx) => {
        if (!addr.address?.trim())
          errs[`address_${idx}_address`] = "Address is required";
        if (!addr.state_id)
          errs[`address_${idx}_state_id`] = "State is required";
        if (!addr.city_id) errs[`address_${idx}_city_id`] = "City is required";
        const zip = addr.zip?.trim();
        if (!zip) errs[`address_${idx}_zip`] = "ZIP code is required";
        else if (!/^\d{6}$/.test(zip))
          errs[`address_${idx}_zip`] = "ZIP must be 6 digits";
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep6 = () => {
    const errs = {};
    if (!formData.accepted_terms)
      errs.accepted_terms = "You must accept the terms";
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

  // ---------- API Handlers ----------
  const submitStep1 = async () => {
    if (!validateStep1()) return false;
    setLoading(true);
    try {
      const payload = {
        company_name: formData.company_name,
        email: formData.email,
        company_phone: formData.company_phone.replace(/\D/g, ""),
        industry_ids: formData.industry_ids,
      };
      const response = await registerrCompany(payload);
      const { token: authToken, company } = response.data || response;
      if (!authToken) throw new Error("No token received");
      localStorage.setItem("company_token", authToken);
      setToken(authToken);
      if (company) {
        // Prefill any returned data
        updateFormData({
          company_name: company.company_name || formData.company_name,
          email: company.email || formData.email,
          company_phone: company.company_phone || formData.company_phone,
        });
        if (company.industry_ids?.length) {
          setSelectedIndustryId(company.industry_ids[0]?.toString());
        }
      }
      Swal.fire({
        icon: "success",
        title: "Company Created",
        text: "Continue with next steps.",
        timer: 1500,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Step 1 Failed",
        text: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentStep = async () => {
    if (!validateCurrentStep()) return false;
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please start over.",
      });
      navigate("/company/register");
      return false;
    }
    setLoading(true);
    try {
      let payload = {};
      if (currentStep === 2) {
        payload = {
          company_name: formData.company_name,
          email: formData.email,
          phone: formData.company_phone.replace(/\D/g, ""),
          industry_id: formData.industry_ids[0] || null,
        };
      } else if (currentStep === 3) {
        payload = {
          owner_name: formData.owner_name,
          owner_email: formData.owner_email,
          owner_phone: formData.owner_phone.replace(/\D/g, ""),
        };
      } else if (currentStep === 4) {
        payload = {
          gst_number: formData.gst_number,
          pan_number: formData.pan_number,
          tin_number: formData.tin_number,
        };
      } else if (currentStep === 5) {
        // Format addresses: keep id if exists (for update), otherwise omit for create
        payload = {
          addresses: formData.addresses.map((addr) => {
            const clean = {
              address: addr.address,
              city_id: parseInt(addr.city_id),
              state_id: parseInt(addr.state_id),
              zip: addr.zip,
            };
            if (addr.id) clean.id = addr.id;
            return clean;
          }),
        };
      } else if (currentStep === 6) {
        payload = { accepted_terms: formData.accepted_terms };
      }

      await updateCompanyData(payload);
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
      Swal.fire({
        icon: "error",
        title: `Step ${currentStep} Failed`,
        text: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedData = async () => {
    if (!token) return;
    setIsFetchingProfile(true);
    try {
      const response = await getCompanyRegisterData();
      const savedData = response.data || response;
      // Map to our form structure
      updateFormData({
        company_name: savedData.company_name || "",
        email: savedData.email || "",
        company_phone: savedData.phone || savedData.company_phone || "",
        owner_name: savedData.owner_name || "",
        owner_email: savedData.owner_email || "",
        owner_phone: savedData.owner_phone || "",
        gst_number: savedData.gst_number || "",
        pan_number: savedData.pan_number || "",
        tin_number: savedData.tin_number || "",
        addresses: savedData.addresses || [],
        accepted_terms: savedData.accepted_terms || false,
      });
      if (savedData.industry_id) {
        setSelectedIndustryId(savedData.industry_id.toString());
        updateFormData({ industry_ids: [savedData.industry_id] });
      } else if (savedData.industry_ids?.length) {
        setSelectedIndustryId(savedData.industry_ids[0].toString());
        updateFormData({ industry_ids: savedData.industry_ids });
      }

      // Determine step based on completeness
      const step = detectStepFromData(savedData);
      setCurrentStep(step);
    } catch (error) {
      console.error("Failed to fetch saved registration:", error);
      localStorage.removeItem("company_token");
      setToken(null);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const detectStepFromData = (data) => {
    if (!data.company_name || !data.email || !data.phone) return 1;
    if (!data.owner_name || !data.owner_email || !data.owner_phone) return 3;
    if (!data.gst_number) return 4;
    if (!data.addresses || data.addresses.length === 0) return 5;
    if (!data.accepted_terms) return 6;
    return 6;
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const success = await submitStep1();
      if (success) setCurrentStep(2);
      return;
    }
    if (currentStep < totalSteps) {
      const success = await submitCurrentStep();
      if (success) setCurrentStep((prev) => prev + 1);
    } else if (currentStep === totalSteps) {
      const success = await submitCurrentStep();
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Registration Complete!",
          text: "Your company has been registered.",
        });
        localStorage.removeItem("company_token");
        if (onSuccess) onSuccess();
        else navigate("/company/dashboard");
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
    token,
    selectedIndustryId,
    industries,
    industriesLoading,
    states,
    statesLoading,
    citiesMap,
    citiesLoading,
    handleChange,
    handleIndustryChange,
    addAddress,
    updateAddress,
    removeAddress,
    nextStep,
    prevStep,
    goToStep,
    fetchCities,
  };
};
