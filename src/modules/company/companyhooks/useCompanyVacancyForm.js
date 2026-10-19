import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  getVacancyAPI,
  createVacancyAPI,
  updateVacancyAPI,
  getDesignationsAPI,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../api/company/companyVacancyAPI";

// Mapping for weekday codes (1 = Monday ... 7 = Sunday)
// const weekdayMap = [
//   { index: 1, code: "mon" },
//   { index: 2, code: "tue" },
//   { index: 3, code: "wed" },
//   { index: 4, code: "thu" },
//   { index: 5, code: "fri" },
//   { index: 6, code: "sat" },
//   { index: 7, code: "sun" },
// ];

export const useCompanyVacancyForm = (mode = "create", vacancyId = null) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);

  // Industries & Designations
  const [industries, setIndustries] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);

  // Get company ID from cookie
  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");
  // const companyId = parsedUser?.company?.id;
  const companyId = parsedUser?.company?.id || parsedUser?.id;

  // State & City
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const companyCookie = Cookies.get("company");
  const parsedCompany = companyCookie ? JSON.parse(companyCookie) : {};
  // Form state – now includes industry_id
  const [formData, setFormData] = useState({
    rate_type: "",
    designation_id: "",
    number_of_workers: "",
    shift_start: "",
    shift_end: "",
    base_rate: "",
    salary_amount: "",
    break_type: "",
    break_duration_minutes: "",
    meals: "",
    notes_to_workers: "",
    state_id: "",
    city_id: "",
    industry_id: parsedCompany?.industry_id || "",
    schedule_mode: "dates",
    selected_dates: [],
    weekdays: [],
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Fetch industries
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await getIndustriesAPI();
        const industriesData = response.data?.data || [];
        setIndustries(industriesData);
        setFilteredIndustries(industriesData);
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };
    fetchIndustries();
  }, []);

  // ✅ Fetch designations when industry_id changes
  useEffect(() => {
    const fetchDesignations = async () => {
      if (!formData.industry_id) {
        setDesignations([]);
        setFilteredDesignations([]);
        return;
      }
      setDesignationsLoading(true);
      try {
        const response = await getDesignationsAPI(formData.industry_id, {
          per_page: 1000,
        });
        let designationsArray = [];
        if (response.data && Array.isArray(response.data.data.data)) {
          designationsArray = response.data.data.data;
        } else if (Array.isArray(response.data.data.data)) {
          designationsArray = response.data.data.data;
        }
        setDesignations(designationsArray);
        setFilteredDesignations(designationsArray);
      } catch (error) {
        console.error("Error fetching designations:", error);
        setDesignations([]);
        setFilteredDesignations([]);
      } finally {
        setDesignationsLoading(false);
      }
    };
    fetchDesignations();
  }, [formData.industry_id]);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await getStatesAPI();
        setStates(response.data.data || response.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when selectedStateId changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await getCitiesByStateAPI(selectedStateId);
        setCities(response.data.data || response.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedStateId]);

  // Fetch vacancy data for edit mode
  useEffect(() => {
    const fetchVacancy = async () => {
      if (mode === "edit" && vacancyId) {
        try {
          setFormLoading(true);
          const response = await getVacancyAPI(vacancyId);
          const data = response.data.data;

          const rateType = data.rate_type || "";
          const baseRate = data.base_rate || "";
          const salaryAmount = rateType === "salary" ? baseRate : "";

          const breakType = data.break_type || "";
          const breakDuration = data.break_duration_minutes || "";
          const meals = data.meal_provided ? "provided" : "not_provided";

          const state_id = data.state_id || "";
          const city_id = data.city_id || "";
          // const industry_id = data.industry_id || "";
          const industry_id =
            data.industry_id || parsedCompany?.industry_id || "";

          // Schedule
          let scheduleMode = "dates";
          let selectedDates = [];
          let weekdays = [];
          let startDate = "";
          let endDate = "";

          if (data.schedules && data.schedules.length > 0) {
            const schedule = data.schedules[0];
            scheduleMode = schedule.mode || "dates";

            if (scheduleMode === "dates") {
              if (schedule.dates && Array.isArray(schedule.dates)) {
                if (
                  schedule.dates.length > 0 &&
                  typeof schedule.dates[0] === "string"
                ) {
                  selectedDates = schedule.dates.map((d) => d.split("T")[0]);
                } else {
                  selectedDates = schedule.dates
                    .map((d) => (d.date ? d.date.split("T")[0] : ""))
                    .filter(Boolean);
                }
              }
            } else if (scheduleMode === "weekly" || scheduleMode === "salary") {
              if (schedule.weekdays && Array.isArray(schedule.weekdays)) {
                if (
                  schedule.weekdays.length > 0 &&
                  typeof schedule.weekdays[0] === "number"
                ) {
                  weekdays = schedule.weekdays;
                } else {
                  weekdays = schedule.weekdays
                    .map((w) => w.weekday)
                    .filter(Boolean);
                }
              }
              startDate = schedule.start_date || "";
              endDate = schedule.end_date || "";
            }
          }

          setFormData({
            rate_type: rateType,
            designation_id: data.designation_id || "",
            number_of_workers: data.number_of_workers || "",
            shift_start: data.shift_start_time || "",
            shift_end: data.shift_end_time || "",
            base_rate: rateType !== "salary" ? baseRate : "",
            salary_amount: salaryAmount,
            break_type: breakType,
            break_duration_minutes: breakDuration,
            meals,
            notes_to_workers: data.notes_to_workers || "",
            state_id,
            city_id,
            industry_id, // ✅ set industry_id
            schedule_mode: scheduleMode,
            selected_dates: selectedDates,
            weekdays,
            start_date: startDate,
            end_date: endDate,
          });

          if (state_id) setSelectedStateId(state_id);
        } catch (error) {
          console.error("Error fetching vacancy:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load vacancy data.",
          });
        } finally {
          setFormLoading(false);
        }
      } else {
        setFormLoading(false);
      }
    };
    fetchVacancy();
  }, [mode, vacancyId]);

  const handleSubmit = async (localData) => {
    if (!companyId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Company ID not found. Please log in again.",
      });
      return;
    }

    setLoading(true);

    try {
      const isSalary = localData.rate_type === "salary";

      const apiData = {
        company_id: String(companyId),
        rate_type: isSalary ? "salary" : localData.rate_type,
        designation_id: localData.designation_id,
        number_of_workers: localData.number_of_workers,
        shift_start_time: localData.shift_start,
        shift_end_time: localData.shift_end,
        break_type: localData.break_type || "none",

        break_duration_minutes:
          localData.break_type === "unpaid"
            ? localData.break_duration_minutes
            : null,

        meal_provided: localData.meals === "provided" ? 1 : 0,

        notes_to_workers: localData.notes_to_workers || null,

        state_id: localData.state_id,
        city_id: localData.city_id,
        industry_id: localData.industry_id,

        base_rate: isSalary ? localData.salary_amount : localData.base_rate,

        mode: localData.schedule_mode,

        dates:
          localData.schedule_mode === "dates" ? localData.selected_dates : [],

        weekdays:
          localData.schedule_mode === "weekly" ? localData.weekdays : [],

        // start_date:
        //   localData.schedule_mode === "weekly" &&
        //   localData.start_date
        //     ? localData.start_date
        //     : null,
        start_date:
          (localData.schedule_mode === "weekly" ||
            localData.schedule_mode === "salary") &&
          localData.start_date
            ? localData.start_date
            : null,

        end_date:
          localData.schedule_mode === "weekly" && localData.end_date
            ? localData.end_date
            : null,
      };

      const response =
        mode === "edit"
          ? await updateVacancyAPI(vacancyId, apiData)
          : await createVacancyAPI(apiData);

      if (response?.data?.status && response.data.status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Something went wrong.",
        });

        return null;
      }

      return response;
    } catch (error) {
      console.error("Submit error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save vacancy.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };
  const validateForm = (localData) => {
    const newErrors = {};

    // Common required fields
    if (!localData.rate_type) newErrors.rate_type = "Job type is required";
    if (!localData.industry_id) newErrors.industry_id = "Industry is required";
    if (!localData.designation_id)
      newErrors.designation_id = "Designation is required";
    if (!localData.number_of_workers)
      newErrors.number_of_workers = "Number of workers is required";
    else if (localData.number_of_workers <= 0)
      newErrors.number_of_workers = "Must be at least 1";
    if (!localData.shift_start)
      newErrors.shift_start = "Shift start time is required";
    if (!localData.shift_end)
      newErrors.shift_end = "Shift end time is required";

    // Rate validation
    if (localData.rate_type === "salary") {
      if (!localData.salary_amount)
        newErrors.salary_amount = "Monthly salary is required";
      else if (localData.salary_amount <= 0)
        newErrors.salary_amount = "Salary must be positive";
    } else {
      if (!localData.base_rate) newErrors.base_rate = "Base rate is required";
      else if (localData.base_rate <= 0)
        newErrors.base_rate = "Rate must be positive";
    }

    // Break duration
    if (localData.break_type === "unpaid") {
      if (!localData.break_duration_minutes) {
        newErrors.break_duration_minutes =
          "Break duration is required for paid breaks";
      } else if (localData.break_duration_minutes <= 0) {
        newErrors.break_duration_minutes = "Duration must be positive";
      }
    }

    // Schedule validation
    if (localData.schedule_mode === "dates") {
      if (!localData.selected_dates || localData.selected_dates.length === 0) {
        newErrors.selected_dates = "At least one date must be selected";
      }
    } else if (localData.schedule_mode === "weekly") {
      if (!localData.weekdays || localData.weekdays.length === 0) {
        newErrors.weekdays = "At least one weekday must be selected";
      }
    }

    return newErrors;
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateErrors = (updates) => {
    setErrors((prev) => ({ ...prev, ...updates }));
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => setErrors({});

  const handleStateChange = (stateId) => {
    setSelectedStateId(stateId);
    updateFormData({ state_id: stateId, city_id: "" });
    clearError("state_id");
    clearError("city_id");
  };

  // Industry filter function
  const filterIndustries = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredIndustries(industries);
    } else {
      const filtered = industries.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredIndustries(filtered);
    }
  };

  return {
    loading,
    formLoading,
    formData,
    errors,
    industries: filteredIndustries,
    designations: filteredDesignations,
    designationsLoading,
    states,
    cities,
    loadingStates,
    loadingCities,
    selectedStateId,
    handleStateChange,
    filterIndustries, // ✅ new
    handleSubmit,
    validateForm,
    updateFormData,
    updateErrors,
    clearError,
    clearAllErrors,
  };
};
