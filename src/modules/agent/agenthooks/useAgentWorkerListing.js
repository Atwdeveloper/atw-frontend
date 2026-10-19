import { useState, useEffect, useCallback, useRef } from "react";
import {
  getWorkersAPI,
  deleteWorkerAPI,
} from "../../../api/agent/agentWorkerAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";

export const useWorkerListing = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const defaultFilters = {
    worker_name: "",
    worker_code: "",
    department: "",
    designation: "",
    state: "",
    city: "",
    joining_date_from: "",
    joining_date_to: "",
    industry: "",
    industry_id: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 600);

  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const buildApiParams = (appliedFilters) => {
    const params = {
      page,
      per_page: limit, // ⭐ backend expects per_page
      ...appliedFilters,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    return params;
  };

  const fetchWorkers = useCallback(
    async (appliedFilters = debouncedFilters) => {
      abortPreviousRequest();

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);

      try {
        const apiParams = buildApiParams(appliedFilters);
        const response = await getWorkersAPI(apiParams, { signal });

        if (!isMountedRef.current || signal.aborted) return;

        const data = response?.data?.data || [];
        const total = response?.data?.total || 0;
        const lastPage = response?.data?.last_page || 1;

        setWorkers(data);
        setTotalRecords(total);
        setTotalPages(lastPage);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching workers:", error);
        }
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, debouncedFilters, abortPreviousRequest],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchWorkers(debouncedFilters);

    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters, fetchWorkers]);

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

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
      text: "This worker will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteWorkerAPI(id);

      setWorkers((prev) => prev.filter((w) => w.id !== id));
      setTotalRecords((prev) => prev - 1);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Worker deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not delete worker.",
      });
    }
  };

  return {
    workers,
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
  };
};
