import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAgentCompaniesAPI,
  deleteAgentCompanyAPI,
} from "../../../api/agent/agentCompanyAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";

export const useAgentCompanyListing = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const defaultFilters = {
    companyname: "",
    industry: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    dor_from: "",
    dor_to: "",
    company_type: "all",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);

  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const fetchCompanies = useCallback(
    async (debouncedFilters) => {
      abortPreviousRequest();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      try {
        const params = {
          page,
          limit,
          ...(debouncedFilters.companyname && {
            companyname: debouncedFilters.companyname,
          }),
          ...(debouncedFilters.industry && {
            industry: debouncedFilters.industry,
          }),
          ...(debouncedFilters.state && { state: debouncedFilters.state }),
          ...(debouncedFilters.state_id && {
            state_id: debouncedFilters.state_id,
          }),
          ...(debouncedFilters.city && { city: debouncedFilters.city }),
          ...(debouncedFilters.city_id && {
            city_id: debouncedFilters.city_id,
          }),
          ...(debouncedFilters.dor_from && {
            dor_from: debouncedFilters.dor_from,
          }),
          ...(debouncedFilters.dor_to && { dor_to: debouncedFilters.dor_to }),
          ...(debouncedFilters.company_type &&
            debouncedFilters.company_type !== "all" && {
              company_type: debouncedFilters.company_type,
            }),
        };

        const response = await getAgentCompaniesAPI(params, { signal });
        if (!isMountedRef.current) return;
        if (signal.aborted) return;

        // ✅ Correctly extract paginated data
        const paginatedData = response.data; // this is the pagination object
        const companiesArray = paginatedData.data || [];
        setCompanies(companiesArray);
        setTotalPages(paginatedData.last_page || 1);
        setTotalRecords(paginatedData.total || 0);
      } catch (error) {
        if (!isMountedRef.current) return;
        if (error.name === "AbortError") return;
        console.error("Failed to fetch companies:", error);
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, abortPreviousRequest],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchCompanies(debouncedFilters);
    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters, fetchCompanies, abortPreviousRequest]);

  const handleSearch = () => setPage(1);
  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This company will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAgentCompanyAPI(id);
      // Refresh the list after deletion
      fetchCompanies(debouncedFilters);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return {
    companies,
    loading,
    page,
    totalPages,
    totalRecords,
    setPage,
    defaultFilters,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,
  };
};
