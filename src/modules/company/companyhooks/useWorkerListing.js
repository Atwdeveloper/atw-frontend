import { useState, useEffect } from "react";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { getWorkersAPI } from "../../../api/company/companyWorkerAPI";
// No need for Cookies now

export const useWorkerListing = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWorkers, setTotalWorkers] = useState(0);

  // New filters: name, vacancy_id, state_id, city_id
  const defaultFilters = {
    name: "", // search by name or worker code
    vacancy_id: "", // selected vacancy ID
    state_id: "",
    city_id: "",
    attendance_date: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 800);

  const fetchWorkers = async (appliedFilters = debouncedFilters) => {
    setLoading(true);
    try {
      const apiFilters = { ...appliedFilters };
      Object.keys(apiFilters).forEach((key) => {
        if (
          apiFilters[key] === "" ||
          apiFilters[key] === null ||
          apiFilters[key] === undefined
        ) {
          delete apiFilters[key];
        }
      });

      const response = await getWorkersAPI({ page, limit, ...apiFilters });

      let appsArray = [];
      let lastPage = 1;
      let total = 0;

      const data = response?.data;

      if (data?.data && Array.isArray(data.data)) {
        appsArray = data.data.map((item) =>
          item.worker ? item : { worker: item },
        );
        lastPage = data.last_page || 1;
        total = data.total || 0;
      } else if (data?.data?.data && Array.isArray(data.data.data)) {
        appsArray = data.data.data;
        lastPage = data.data.last_page || 1;
        total = data.data.total || 0;
      } else if (data && Array.isArray(data)) {
        appsArray = data.map((item) => (item.worker ? item : { worker: item }));
        total = data.length;
        lastPage = 1;
      }

      setApplications(appsArray);
      setTotalPages(lastPage);
      setTotalWorkers(total);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setApplications([]);
      setTotalPages(1);
      setTotalWorkers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchWorkers(debouncedFilters);
  }, [debouncedFilters]);

  const handleClear = () => {
    setFilters({
      name: "",
      vacancy_id: "",
      state_id: "",
      city_id: "",
      attendance_date: "",
    });
    setPage(1);
    fetchWorkers({
      name: "",
      vacancy_id: "",
      state_id: "",
      city_id: "",
      attendance_date: "",
    });
  };

  return {
    applications,
    loading,
    page,
    totalPages,
    totalWorkers,
    setPage,
    filters,
    setFilters,
    handleClear,
  };
};
