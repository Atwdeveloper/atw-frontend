import { useState, useEffect, useRef, useCallback } from "react";
import {
  getStaffsAPI,
  deleteStaffAPI,
  toggleStaffStatusAPI,
} from "../../../api/admin/adminStaffAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";

export const useStaffListing = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [designations, setDesignations] = useState([]);

  // ⭐ DEFAULT FILTERS
  const defaultFilters = {
    name: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    dor_from: "",
    dor_to: "",
    designation: "",
    designation_id: "",
    industry: "",
    industry_id: "",
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

  const fetchStaffs = useCallback(
    async (appliedFilters = debouncedFilters) => {
      abortPreviousRequest();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setLoading(true);

      // Convert status before API call
      const formattedFilters = Object.fromEntries(
        Object.entries({
          ...appliedFilters,
          status: appliedFilters.status,
        }).filter(
          ([key, v]) =>
            v !== "" &&
            v !== null &&
            !["state", "city", "industry", "designation"].includes(key),
        ),
      );

      try {
        const response = await getStaffsAPI(
          {
            page,
            limit,
            ...formattedFilters,
          },
          { signal },
        );

        if (!isMountedRef.current) return;
        if (signal.aborted) {
          return;
        }

        // const data = response?.data?.data?.data || [];

        // if (data.length > 0) {
        //   setStaffs(data);
        //   setTotalPages(response?.data?.last_page || 1);
        // }

        //  NAYA FIXED CODE:
        const data = response?.data?.data?.data || [];
        const paginationInfo = response?.data?.data || {}; // Response ke structure ke hisab se

        if (data.length > 0) {
          setStaffs(data);

          // Backend response se total aur per_page nikalenge
          const totalRecords = paginationInfo.total || 0;
          const perPage = paginationInfo.per_page || 10;

          // Math.ceil(15 / 10) = 2 pages calculate ho jayega khud hi
          const calculatedPages = Math.ceil(totalRecords / perPage) || 1;

          setTotalPages(calculatedPages);
        } else {
          setStaffs([]);
          setTotalPages(1);
        }
      } catch (error) {
        if (!isMountedRef.current) return;

        // Check if error is from abort
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch companies:", error);
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, abortPreviousRequest],
  );

  // useEffect(() => {
  //   fetchDesignations();
  // }, []);

  useEffect(() => {
    isMountedRef.current = true;

    fetchStaffs(debouncedFilters);

    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [page, debouncedFilters, fetchStaffs]);

  // ⭐ HANDLERS
  const handleSearch = () => {
    setPage(1);
  };
  // const handleSearch = () => {
  //   setPage(1);
  //   fetchStaffs(filters); // ✅ FORCE API with latest filters
  // };
  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
    // fetchStaffs(defaultFilters);
  };

  const handleExportSearch = () => {
    setPage(1);
    fetchStaffs();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This staff member will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteStaffAPI(id);

      if (response?.status === 200 || response?.status === 204) {
        setStaffs((prev) => prev.filter((staff) => staff.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The staff member has been successfully deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not delete the staff member. Please try again.",
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

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = currentStatus === 1;
    const actionText = isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `This staff member will be ${actionText}d.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText} it`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await toggleStaffStatusAPI(id, !isActive);

      if (response?.status === 200 || response?.status === 204) {
        const updatedStatus = response?.data?.data?.new_status;

        setStaffs((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: updatedStatus } : s)),
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Staff has been ${updatedStatus === 1 ? "activated" : "deactivated"}.`,
          timer: 1500,
          showConfirmButton: false,
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

  return {
    staffs,
    designations,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportSearch,
  };
};
