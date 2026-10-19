import { useState, useEffect } from "react";
import {
  getVacanciesAPI,
  deleteVacancyAPI,
  toggleVacancyStatusAPI,
} from "../../../api/company/companyVacancyAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const useCompanyVacancyListing = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");
  const companyId = parsedUser?.company?.id || parsedUser?.id;

  const defaultFilters = {
    designation_id: "",
    rate_type: "",
    status: "",
    state_id: "",
    city_id: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const debouncedFilters = useDebounce(filters, 800);

  const BACKEND_FILTER_KEYS = [
    "designation_id",
    "rate_type",
    "status",
    "state_id",
    "city_id",
  ];

  const prepareFiltersForApi = (rawFilters) => {
    const apiFilters = {};

    BACKEND_FILTER_KEYS.forEach((key) => {
      if (rawFilters[key]) {
        apiFilters[key] = rawFilters[key];
      }
    });

    return apiFilters;
  };

  const fetchVacancies = async (appliedFilters = debouncedFilters) => {
    if (!companyId) {
      setVacancies([]);
      return;
    }

    setLoading(true);

    try {
      const apiFilters = prepareFiltersForApi(appliedFilters);

      const params = {
        page,
        limit,
        company_id: companyId,
        ...apiFilters,
      };

      const response = await getVacanciesAPI(params);

      const paginationData = response?.data?.data || {};

      setVacancies(paginationData?.data || []);

      setTotalPages(paginationData?.last_page || 1);

      setTotalRecords(paginationData?.total || 0);
    } catch (error) {
      console.error("Error fetching vacancies:", error);

      setVacancies([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchVacancies();
    }
  }, [page, debouncedFilters, companyId]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This vacancy will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteVacancyAPI(id);
      if (response?.data?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.message || "Delete failed",
        });

        return;
      }
      if (response?.status === 200 || response?.status === 204) {
        setVacancies((prev) => prev.filter((v) => v.id !== id));

        setTotalRecords((prev) => prev - 1);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Vacancy has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = currentStatus === "active";
    const newStatus = isActive ? "inactive" : "active";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This vacancy will be ${isActive ? "deactivated" : "activated"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await toggleVacancyStatusAPI(id, newStatus);

      // Backend validation error
      if (response?.data?.status === 500) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text:
            response?.data?.message ||
            `Failed to ${isActive ? "deactivate" : "activate"} vacancy.`,
        });

        return;
      }

      // Success
      if (response?.data?.status === 200 || response?.status === 200) {
        setVacancies((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: newStatus,
                }
              : v,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Vacancy has been ${isActive ? "deactivated" : "activated"}.`,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message || "Failed to update vacancy status.",
      });
    }
  };
  return {
    vacancies,
    loading,
    page,
    totalPages,
    totalRecords,
    setPage,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
  };
};
