import { useState, useEffect } from "react";
import {
  getStaffsAPI,
  deleteStaffAPI,
  toggleStaffStatusAPI,
} from "../../../api/company/companyStaffAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Swal from "sweetalert2";

export const useStaffListing = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const defaultFilters = {
    name: "",
    email: "",
    phone: "",
    designation_id: "",
    status: "",
    industry_id: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);

  const buildFilters = (filters) => {
    const cleaned = {};

    Object.keys(filters).forEach((key) => {
      let value = filters[key];

      if (value === "" || value === null || value === undefined) return;

      if (key === "status") {
        if (value === "active") value = 1;
        else if (value === "inactive") value = 0;
        else return;
      }

      cleaned[key] = value;
    });

    return cleaned;
  };

  const fetchStaffs = async (appliedFilters = debouncedFilters) => {
    setLoading(true);

    try {
      const apiFilters = buildFilters(appliedFilters);

      const response = await getStaffsAPI({
        page,
        limit,
        ...apiFilters,
      });

      const paginationData = response?.data?.data || {};

      setStaffs(paginationData?.data || []);

      setTotalPages(paginationData?.last_page || 1);

      setTotalRecords(paginationData?.total || 0);
    } catch (error) {
      console.error("Error fetching staffs:", error);

      setStaffs([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [page]);

  // 🔍 Filters (debounced)
  useEffect(() => {
    setPage(1);
    fetchStaffs(debouncedFilters);
  }, [debouncedFilters]);

  const handleSearch = () => {
    setPage(1);
    fetchStaffs();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setPage(1);
    fetchStaffs(defaultFilters);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This staff member will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteStaffAPI(id);

      if (response?.status === 200 || response?.status === 204) {
        setStaffs((prev) => prev.filter((s) => s.id !== id));

        setTotalRecords((prev) => Math.max(prev - 1, 0));

        Swal.fire("Deleted!", "Staff removed successfully.", "success");
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire("Error", "Failed to delete staff.", "error");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive =
      currentStatus === true || currentStatus === "true" || currentStatus === 1;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This staff will be ${isActive ? "deactivated" : "activated"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await toggleStaffStatusAPI(id, !isActive);

      if (response?.status === 200 || response?.status === 204) {
        setStaffs((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: isActive ? 0 : 1,
                }
              : s,
          ),
        );
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  return {
    staffs,
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
