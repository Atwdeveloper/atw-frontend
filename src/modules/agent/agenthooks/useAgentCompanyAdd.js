import { useEffect, useState } from "react";
import {
  addCompanyAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/agent/agentCompanyAPI";

export const useAddCompany = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    gst_number: "",
    pan_number: "",
    tin_number: "",
    industry_id: "",
    work_type: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    service_charge_type: "",
    service_charge: "",
    addresses: [
      { address: "", city: "", city_id: "", state: "", state_id: "", zip: "" },
    ],
  });

  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const initialize = async () => {
      setFormLoading(true);

      await fetchIndustries();
      await fetchStates();

      setFormLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    const addressCount = formData.addresses?.length || 1;
    setCities(new Array(addressCount).fill([]));
    setFilteredCities(new Array(addressCount).fill([]));
    setLoadingCities(new Array(addressCount).fill(false));
  }, []);

  const fetchIndustries = async () => {
    const response = await getIndustriesAPI();
    setIndustries(response.data);
  };

  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      const statesData = response.data.data || [];
      setStates(statesData);
      setFilteredStates(statesData);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
      setFilteredStates([]);
    }
  };

  const fetchCitiesByState = async (stateId, index = 0) => {
    if (!stateId) {
      const newCities = [...cities];
      newCities[index] = [];
      setCities(newCities);

      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = [];
      setFilteredCities(newFilteredCities);
      return;
    }

    try {
      const newLoadingCities = [...loadingCities];
      newLoadingCities[index] = true;
      setLoadingCities(newLoadingCities);

      const response = await getCitiesByStateAPI(stateId);
      const citiesData = response.data.data || [];

      const newCities = [...cities];
      newCities[index] = citiesData;
      setCities(newCities);

      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = citiesData;
      setFilteredCities(newFilteredCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      const newCities = [...cities];
      newCities[index] = [];
      setCities(newCities);

      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = [];
      setFilteredCities(newFilteredCities);
    } finally {
      const newLoadingCities = [...loadingCities];
      newLoadingCities[index] = false;
      setLoadingCities(newLoadingCities);
    }
  };

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

  const filterCities = (searchTerm, index = 0) => {
    if (!searchTerm.trim()) {
      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = cities[index] || [];
      setFilteredCities(newFilteredCities);
    } else {
      const filtered = (cities[index] || []).filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = filtered;
      setFilteredCities(newFilteredCities);
    }
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Clear specific error
  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const isEmpty = (v) => !v || !v.toString().trim();

  const validatePattern = (value, pattern, message) => {
    if (isEmpty(value)) return message.required;
    if (!pattern.test(value)) return message.invalid;
    return "";
  };

  const messages = {
    email: { required: "Email is required", invalid: "Enter a valid email" },
    phone: {
      required: "Phone number is required",
      invalid: "Must be a valid 10-digit Indian phone number starting with 6–9",
    },
    service_charge: {
      required: "Service charge is required",
      invalid: "Service charge must be a valid number",
    },
  };

  const patterns = {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
    phone: /^[6-9]\d{9}$/,
    service_charge: /^\d+(\.\d{1,2})?$/, // Allow numbers with optional decimal
    name: /^[a-zA-Z\s]{2,}$/,
    companyName: /^[a-zA-Z0-9\s&.,-]{2,}$/,
    address: /^[a-zA-Z0-9\s,.-]{5,}$/,
    city: /^[a-zA-Z\s]{2,}$/,
    state: /^[a-zA-Z\s]{2,}$/,
    cin: /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
    tan: /^[A-Z]{4}\d{5}[A-Z]$/,
    zip: /^\d{6}$/,
  };

  const validateField = (name, value) => {
    switch (name) {
      case "company_name":
        return validatePattern(value, patterns.companyName, {
          required: "Company Name is required",
          invalid: "Invalid Company Name",
        });

      case "email":
      case "owner_email":
        return validatePattern(value, patterns.email, messages.email);

      case "phone":
      case "owner_phone":
        return validatePattern(
          value.replace(/\s/g, ""),
          patterns.phone,
          messages.phone,
        );

      // case "service_charge":
      //   return validatePattern(value, patterns.service_charge, {
      //     required: "Service charge is required",
      //     invalid: "Service charge must be a valid number",
      //   });

      case "owner_name":
        return validatePattern(value, patterns.name, {
          required: "Owner name is required",
          invalid: "Owner name must contain only letters",
        });

      // case "service_charge_type":
      //   if (isEmpty(value)) return "Service charge type is required";
      //   if (!["fixed", "percentage"].includes(value)) return "Invalid service charge type";
      //   return "";
      case "tin_number": // CIN
        if (!value?.trim()) return "";

        if (!patterns.cin.test(value.toUpperCase())) {
          return "Invalid CIN format";
        }

        return "";

      case "pan_number": // TAN
        if (!value?.trim()) return "";

        if (!patterns.tan.test(value.toUpperCase())) {
          return "Invalid TAN format";
        }

        return "";
      case "gst_number":
        if (isEmpty(value)) return "GST number is required";

        const gstRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;

        if (!gstRegex.test(value.toUpperCase())) {
          return "Invalid GST format (e.g. 22ABCDE1234F1Z5)";
        }

        return "";

      default:
        return "";
    }
  };

  const validateAddress = (address, index) => {
    const errors = {};

    const addressFields = [
      {
        key: "address",
        pattern: patterns.address,
        message: "Address must be at least 5 characters",
      },
      { key: "city_id", pattern: /^.+$/, message: "City is required" },
      { key: "state_id", pattern: /^.+$/, message: "State is required" },
      { key: "zip", pattern: patterns.zip, message: "ZIP must be 6 digits" },
    ];

    addressFields.forEach(({ key, pattern, message }) => {
      if (!pattern.test(address[key])) {
        errors[`${key.replace("_id", "")}_${index}`] = message;
      }
    });

    return errors;
  };

  const validateSingleField = (name, value) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateAddressField = (index, field, value) => {
    const updatedAddress = { ...formData.addresses[index], [field]: value };
    const addressErrors = validateAddress(updatedAddress, index);

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`_${index}`)) delete newErrors[key];
      });
      return { ...newErrors, ...addressErrors };
    });
  };

  const validate = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (["addresses"].includes(key)) return;
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (!formData.industry_id.length) {
      newErrors.industry_id = "Select an industry";
    }

    if (
      formData.service_charge_type === "percentage" &&
      formData.service_charge
    ) {
      const charge = parseFloat(formData.service_charge);
      if (charge < 0 || charge > 100) {
        newErrors.service_charge = "Percentage must be between 0 and 100";
      }
    }

    formData.addresses.forEach((addr, idx) => {
      Object.assign(newErrors, validateAddress(addr, idx));
    });

    if (
      formData.email &&
      formData.owner_email &&
      formData.email.toLowerCase() === formData.owner_email.toLowerCase()
    ) {
      newErrors.owner_email =
        "Owner email must be different from company email";
    }
    if (!formData.owner_phone?.trim()) {
      newErrors.owner_phone = "Owner phone is required";
    }
    // if (
    //   formData.phone &&
    //   formData.owner_phone &&
    //   formData.phone.replace(/\s/g, "") ===
    //     formData.owner_phone.replace(/\s/g, "")
    // ) {
    //   newErrors.owner_phone =
    //     "Owner phone must be different from company phone";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitCompany = async () => {
    if (!validate()) return false;

    setLoading(true);
    setSuccessMsg("");
    setErrors({});

    try {
      const submitData = {
        ...formData,
        gst_number: formData.gst_number.toUpperCase(),
        pan_number: formData.pan_number.toUpperCase(),
        phone: formData.phone.replace(/\s/g, ""),
        owner_phone: formData.owner_phone.replace(/\s/g, ""),
        addresses: formData.addresses.map((addr) => ({
          ...addr,
          city_id: addr.city_id,
          state_id: addr.state_id,
        })),
      };

      const data = await addCompanyAPI(submitData);

      if (data.status === 500) {
        const apiErrors = data.data || {};

        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });

        setErrors((prev) => ({
          ...prev,
          ...formattedErrors,
        }));

        const allErrors = Object.values(apiErrors)
          .flat()
          .filter(Boolean)
          .join("\n");

        return {
          success: false,
          message: allErrors || data.message,
        };
      }
      if (data.status === 200) {
        setSuccessMsg("Company added successfully!");

        setFormData({
          company_name: "",
          email: "",
          phone: "",
          gst_number: "",
          pan_number: "",
          tin_number: "",
          industry_id: "",
          work_type: "",
          owner_name: "",
          owner_email: "",
          owner_phone: "",
          service_charge_type: "fixed",
          service_charge: "",
          addresses: [
            {
              address: "",
              city: "",
              city_id: "",
              state: "",
              state_id: "",
              zip: "",
            },
          ],
        });

        return true;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      setErrors({ api: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    successMsg,
    industries,
    states,
    cities,
    filteredStates,
    filteredCities,
    loadingCities,
    formLoading,
    submitCompany,
    validateSingleField,
    validateAddressField,
    fetchCitiesByState,
    filterStates,
    filterCities,
    updateFormData,
    clearError,
  };
};
