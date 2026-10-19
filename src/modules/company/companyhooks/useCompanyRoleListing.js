import { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { useDebounce } from "../../../common/hooks/useDebounce";
import {
  getAllRoles,
  deleteRoleAPI,
} from "../../../api/company/companyRoleAPI";
export const useCompanyRoleListing = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Default filters
  const defaultFilters = {
    search: "",
    status: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup function for aborting requests
  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const buildApiParams = (appliedFilters) => {
    const params = {
      page,
      limit,
      ...appliedFilters,
    };

    // Remove empty values
    Object.keys(params).forEach((key) => {
      if (
        params[key] === "" ||
        params[key] === null ||
        params[key] === undefined
      ) {
        delete params[key];
      }
    });

    return params;
  };

  // Fetch roles
  const fetchRoles = useCallback(
    async (appliedFilters = debouncedFilters) => {
      abortPreviousRequest();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setLoading(true);

      try {
        const apiParams = buildApiParams(appliedFilters);
        const response = await getAllRoles(apiParams, { signal });
        if (!isMountedRef.current) return;
        if (signal.aborted) {
          return;
        }
        const data = response?.data?.data || [];

        if (data.length > 0) {
          setRoles(data);
          setTotalPages(response?.data?.last_page || 1);
          setTotalRecords(response?.data?.total || 0);
        } else {
          setRoles([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (error) {
        if (!isMountedRef.current) return;

        // Check if error is from abort
        if (error.name === "AbortError") {
          return;
        }
        setRoles([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, abortPreviousRequest],
  );

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedFilters]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchRoles(debouncedFilters);
    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters]);

  const handleSearch = () => {
    setPage(1);
    fetchRoles();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
    // fetchRoles(defaultFilters);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This role will be permanently deleted. Users assigned to this role will lose their permissions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteRoleAPI(id);

      if (response?.status === 200 || response?.status === 204) {
        setRoles((prev) => prev.filter((role) => role.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The role has been successfully deleted.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refresh list
        fetchRoles();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text:
            response?.message || "Could not delete the role. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const getPermissionCount = (permissions) => {
    return permissions ? permissions.length : 0;
  };

  return {
    roles,
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
    getPermissionCount,
    fetchRoles,
  };
};
