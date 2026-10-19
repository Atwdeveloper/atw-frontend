import { useEffect, useState, useCallback } from "react";
import {
  getAgentCompanyDetailsAPI,
  editCompanyAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/agent/agentCompanyAPI";

export const useEditCompany = (companyId) => {
  const [formData, setFormData] = useState(null);
  const [industriesList, setIndustriesList] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]); // Array for each address
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]); // Array for each address
  const [loadingCities, setLoadingCities] = useState([]); // Array for each address
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch all necessary data
  const fetchAllData = useCallback(async () => {
    if (!companyId) return;

    try {
      setFormLoading(true);

      // Fetch all data in parallel
      const [companyRes, industriesRes, statesRes] = await Promise.all([
        getAgentCompanyDetailsAPI(companyId),
        getIndustriesAPI(),
        getStatesAPI(),
      ]);

      // Actual company data is inside `companyRes.data.data`
      const companyData = companyRes.data.data;

      setIndustriesList(industriesRes.data || []);

      const statesData = statesRes.data.data || [];
      setStates(statesData);
      setFilteredStates(statesData);

      // Format addresses from API
      const apiAddresses =
        companyData.addresses && companyData.addresses.length > 0
          ? companyData.addresses
          : [
              {
                id: "",
                address: "",
                city: "",
                city_id: "",
                state: "",
                state_id: "",
                zip: "",
              },
            ];

      // Initialize arrays for addresses
      const addressCount = apiAddresses.length;
      setCities(new Array(addressCount).fill([]));
      setFilteredCities(new Array(addressCount).fill([]));
      setLoadingCities(new Array(addressCount).fill(false));

      // Format data for the form
      const formattedData = {
        company_code: companyData.company_code || "",
        company_name: companyData.company_name || "",
        email: companyData.email || "",
        phone: companyData.phone || "",
        owner_id: companyData.company_owner?.id || "",
        // Owner fields from company_owner (if present)
        owner_name: companyData.company_owner?.owner_name || "",
        owner_phone: companyData.company_owner?.owner_phone || "",
        owner_email: companyData.company_owner?.owner_email || "",
        gst_number: companyData.gst_number || "",
        tin_number: companyData.tin_number || "",
        pan_number: companyData.pan_number || "",
        service_charge_type: companyData.service_charge_type || "fixed",
        service_charge: companyData.service_charge || "",
        industry_id: String(companyData.industry_id || ""), // Convert to string for select
        work_type: companyData.work_type || "",
        // Map addresses
        addresses: apiAddresses.map((addr) => ({
          id: addr.id || "",
          address: addr.address || "",
          city: addr.city || "",
          city_id: addr.city_id ? String(addr.city_id) : "",
          state: addr.state || "",
          state_id: addr.state_id ? String(addr.state_id) : "",
          zip: addr.zip || "",
        })),
      };

      setFormData(formattedData);

      // Fetch cities for each address that has a state_id
      await Promise.all(
        formattedData.addresses.map(async (addr, index) => {
          if (addr.state_id) {
            await fetchCitiesByState(addr.state_id, index);
          }
        }),
      );

      setFormLoading(false);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setFormLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch cities by state for specific address index
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
      newCities[index] = citiesData.map((city) => ({
        ...city,
        id: String(city.id),
      }));
      setCities(newCities);

      const newFilteredCities = [...filteredCities];
      newFilteredCities[index] = newCities[index];
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

  // Filter states
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

  // Filter cities for specific address index
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

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAddressError = (index, field) => {
    const errorKey = `${field}_${index}`;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  const validate = () => {
    let temp = {};

    if (!formData.company_name?.trim())
      temp.company_name = "Company name is required";

    if (!formData.email?.trim()) temp.email = "Company email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      temp.email = "Invalid email format";

    if (!formData.phone?.trim()) temp.phone = "Company contact is required";
    else if (!/^\d{10}$/.test(formData.phone))
      temp.phone = "Contact number must be 10 digits";

    // if (!formData.service_charge_type?.trim())
    //   temp.service_charge_type = "Service charge type is required";

    // if (!formData.service_charge)
    //   temp.service_charge = "Service charge is required";
    // else if (formData.service_charge_type === "percentage") {
    //   const charge = parseFloat(formData.service_charge);
    //   if (isNaN(charge) || charge < 0 || charge > 100) {
    //     temp.service_charge = "Percentage must be between 0 and 100";
    //   }
    // }

    // Contact Person – these fields are required if present in the form
    if (!formData.owner_name?.trim())
      temp.owner_name = "Contact person name is required";
    if (!formData.owner_phone?.trim())
      temp.owner_phone = "Contact person number is required";
    else if (!/^\d{10}$/.test(formData.owner_phone))
      temp.owner_phone = "Contact number must be 10 digits";
    if (!formData.owner_email?.trim())
      temp.owner_email = "Contact person email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.owner_email))
      temp.owner_email = "Invalid email format";

    if (!formData.industry_id) temp.industry_id = "Industry is required";
    // GST - Required
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

    if (!formData.gst_number?.trim()) {
      temp.gst_number = "GST number is required";
    } else if (!gstRegex.test(formData.gst_number.toUpperCase())) {
      temp.gst_number = "Invalid GST format. Example: 27AAPFU0939F1ZV";
    }

    // CIN - Optional
    const cinRegex = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;

    if (
      formData.tin_number?.trim() &&
      !cinRegex.test(formData.tin_number.toUpperCase())
    ) {
      temp.tin_number = "Invalid CIN format. Example: U74999DL2010PTC123456";
    }

    // TAN - Optional
    const tanRegex = /^[A-Z]{4}\d{5}[A-Z]$/;

    if (
      formData.pan_number?.trim() &&
      !tanRegex.test(formData.pan_number.toUpperCase())
    ) {
      temp.pan_number = "Invalid TAN format. Example: DELU12345B";
    }

    // Address validation
    (formData.addresses || []).forEach((a, i) => {
      if (!a.address?.trim()) temp[`address_${i}`] = "Address is required";
      if (!a.city_id) temp[`city_${i}`] = "City is required";
      if (!a.state_id) temp[`state_${i}`] = "State is required";
      if (!a.zip?.trim()) temp[`zip_${i}`] = "ZIP is required";
      else if (!/^\d{5,6}$/.test(a.zip))
        temp[`zip_${i}`] = "ZIP must be 5-6 digits";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const submitEdit = async () => {
    if (!validate()) return false;

    try {
      setLoading(true);
      setErrors({});

      const submitData = {
        company_name: formData.company_name,
        email: formData.email,
        phone: formData.phone,
        owner_id: formData.owner_id,
        gst_number: formData.gst_number || "",
        tin_number: formData.tin_number || "",
        pan_number: formData.pan_number || "",
        service_charge_type: formData.service_charge_type,
        service_charge: formData.service_charge,
        industry_id: formData.industry_id,
        work_type: formData.work_type || "",
        // Owner fields
        owner_name: formData.owner_name || "",
        owner_phone: formData.owner_phone || "",
        owner_email: formData.owner_email || "",
        addresses: formData.addresses.map((addr) => ({
          id: addr.id || undefined,
          address: addr.address,
          city_id: addr.city_id,
          state_id: addr.state_id,
          zip: addr.zip,
        })),
      };

      const res = await editCompanyAPI(companyId, submitData);

      // API returns:
      // { status: 500, message: "Pending approval from the Admin..." }

      if (res?.status === 500) {
        return {
          success: false,
          message: res?.message || "Failed to update company",
        };
      }

      if (res?.status === 200) {
        setSuccessMsg("Company updated successfully!");
        return {
          success: true,
        };
      }

      return {
        success: false,
        message: res?.message || "Failed to update company",
      };
    } catch (error) {
      console.error("Edit company failed:", error);
      setLoading(false);

      if (error.response) {
        if (error.response.status === 422) {
          const serverErrors = error.response.data.errors || {};
          const formattedErrors = {};
          Object.keys(serverErrors).forEach((key) => {
            formattedErrors[key] = Array.isArray(serverErrors[key])
              ? serverErrors[key][0]
              : serverErrors[key];
          });
          setErrors(formattedErrors);
        } else if (error.response.status === 404) {
          setErrors({ api: "Company not found." });
        } else if (error.response.status === 401) {
          setErrors({ api: "Unauthorized access." });
        } else {
          setErrors({
            api:
              error.response.data?.message ||
              `Server error: ${error.response.status}`,
          });
        }
      } else if (error.request) {
        setErrors({ api: "Network error. Please check your connection." });
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
      return false;
    }
  };

  return {
    formData,
    setFormData,
    industriesList,
    errors,
    setErrors,
    loading,
    formLoading,
    successMsg,
    submitEdit,
    fetchAllData,
    clearError,
    clearAddressError,
    states,
    cities,
    filteredStates,
    filteredCities,
    loadingCities,
    fetchCitiesByState,
    filterStates,
    filterCities,
  };
};
