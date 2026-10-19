import { useEffect, useState } from "react";
import {
  getCompanyProfileAPI,
  updateCompanyProfileAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/company/companyAPI";

export const useViewCompanyProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    gst_number: "",
    pan_number: "",
    tin_number: "",
    industry: "",
    industry_id: "",
    work_type: "",
    service_charge: "",
    service_charge_type: "",
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
  const [formLoading, setFormLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch initial data
  useEffect(() => {
    const initialize = async () => {
      setFormLoading(true);
      try {
        await Promise.all([
          fetchCompanyProfile(),
          fetchIndustries(),
          fetchStates(),
        ]);
      } catch (error) {
        console.error("Error initializing:", error);
      }
      setFormLoading(false);
    };

    initialize();
  }, []);

  // Initialize arrays based on addresses
  useEffect(() => {
    const addressCount = formData.addresses?.length || 1;
    setCities(new Array(addressCount).fill([]));
    setFilteredCities(new Array(addressCount).fill([]));
    setLoadingCities(new Array(addressCount).fill(false));
  }, [formData.addresses]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await getCompanyProfileAPI();
      if (response.status === 200 && response.data) {
        const apiData = response.data;

        // Transform API data to match form structure
        const transformedData = {
          name: apiData.name || "",
          code: apiData.code || "",
          email: apiData.email || "",
          phone: apiData.phone || "",
          gst_number: apiData.gst_number || "",
          pan_number: apiData.pan_number || "",
          tin_number: apiData.tin_number || "",
          industry: apiData.industry || "",
          industry_id: apiData.industry_id || "",
          work_type: apiData.work_type || "",
          service_charge: apiData.service_charge || "",
          service_charge_type: apiData.service_charge_type || "",
          created_at: apiData.created_at || "",
          addresses:
            apiData.addresses?.map((addr) => ({
              address: addr.address || "",
              city: addr.city || "",
              state: addr.state || "",
              city_id: addr.city_id || "",
              state_id: addr.state_id || "",
              zip: addr.zip || "",
            })) || [],
        };

        setFormData(transformedData);

        // If there are addresses, fetch cities for each state
        if (transformedData.addresses.length > 0) {
          transformedData.addresses.forEach(async (addr, index) => {
            if (addr.state_id) {
              await fetchCitiesByState(addr.state_id, index);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
    }
  };

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
    }
  };

  const fetchCitiesByState = async (stateId, index = 0) => {
    if (!stateId) return;

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

  // Filter cities
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

  // Update profile
  const updateProfile = async () => {
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }
    // TAN Validation (Optional)
    if (
      formData.pan_number &&
      !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(formData.pan_number.toUpperCase())
    ) {
      newErrors.pan_number = "Invalid TAN format. Example: DELH12345A";
    }

    // CIN Validation (Optional)
    if (
      formData.tin_number &&
      !/^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(
        formData.tin_number.toUpperCase(),
      )
    ) {
      newErrors.tin_number =
        "Invalid CIN format. Example: U12345MH2023PTC123456";
    }
    // Service charge validation
    // if (!formData.service_charge_type) {
    //   newErrors.service_charge_type = "Service charge type is required";
    // }
    // if (!formData.service_charge) {
    //   newErrors.service_charge = "Service charge is required";
    // }

    // Address validation
    formData.addresses.forEach((addr, index) => {
      if (!addr.address.trim()) {
        newErrors[`address_${index}`] = "Address is required";
      }
      if (!addr.state_id) {
        newErrors[`state_${index}`] = "State is required";
      }
      if (!addr.city_id) {
        newErrors[`city_${index}`] = "City is required";
      }
      if (!addr.zip.trim()) {
        newErrors[`zip_${index}`] = "ZIP code is required";
      } else if (!/^\d{6}$/.test(addr.zip)) {
        newErrors[`zip_${index}`] = "Invalid ZIP code (6 digits required)";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    setLoading(true);
    try {
      // Transform data back to API format
      const apiData = {
        company_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gst_number: formData.gst_number || null,
        pan_number: formData.pan_number || null,
        tin_number: formData.tin_number || null,
        industry_id: formData.industry_id || null,
        work_type: formData.work_type || null,
        service_charge: formData.service_charge,
        service_charge_type: formData.service_charge_type,
        addresses: formData.addresses.map((addr) => ({
          address: addr.address,
          city_id: addr.city_id,
          state_id: addr.state_id,
          zip: addr.zip,
        })),
      };

      const response = await updateCompanyProfileAPI(apiData);
      if (response.status === 200) {
        setSuccessMsg("Profile updated successfully!");
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

  // Add new address
  const addAddress = () => {
    const updated = [
      ...formData.addresses,
      { address: "", city: "", city_id: "", state: "", state_id: "", zip: "" },
    ];
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  // Remove address
  const removeAddress = (index) => {
    if (formData.addresses.length <= 1) return;
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  // Handle address changes
  const handleAddressChange = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  // Handle state selection
  const handleStateSelect = async (index, state) => {
    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));
    await fetchCitiesByState(state.id, index);
  };

  // Handle city selection
  const handleCitySelect = (index, city) => {
    const updated = [...formData.addresses];
    updated[index] = {
      ...updated[index],
      city: city.name,
      city_id: city.id,
    };
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    formLoading,
    successMsg,
    industries,
    states,
    filteredStates,
    filteredCities,
    loadingCities,
    updateProfile,
    addAddress,
    removeAddress,
    handleAddressChange,
    filterStates,
    filterCities,
    handleStateSelect,
    handleCitySelect,
    fetchCitiesByState,
    setErrors,
    setSuccessMsg,
  };
};
