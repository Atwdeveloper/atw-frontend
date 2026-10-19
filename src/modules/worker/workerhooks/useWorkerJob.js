import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  getJobsAPI,
  applyJobAPI,
  getDepartmentsAPI,
  getStatesAPI,
  getCitiesWithVacanciesAPI,
  getAppliedJobsAPI,
} from "../../../api/worker/workerJobvacanciesAPI";

export const useWorkerJob = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const [filters, setFilters] = useState({
    department: "all",
    place: "all",
    jobType: "all",
    urgent: 0,
    search: "",
    nearby: true,
  });

  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");
  const workerId = parsedUser?.worker_id;

  const fetchAppliedJobs = useCallback(async () => {
    if (!workerId) return;

    try {
      const res = await getAppliedJobsAPI();
      // const appliedData = res.data?.data?.data || [];
      const appliedData = res.data?.data?.applications?.data || [];
      setAppliedJobs(appliedData);

      const ids = appliedData
        .map((item) => item.vacancy_details?.id)
        .filter(Boolean);

      setAppliedJobIds(ids);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }, [workerId]);
  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        const [deptRes, statesRes] = await Promise.all([
          getDepartmentsAPI(),
          getStatesAPI(),
        ]);
        setDepartments(deptRes.data?.data || []);
        setStates(statesRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingFilters(true);
      try {
        const res = await getCitiesWithVacanciesAPI();
        setCities(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchCities();
  }, []);

  const fetchData = useCallback(async () => {
    if (!workerId) return;

    setLoading(true);

    try {
      // const params = {};
      const params = {
        sort_by: "created_at",
        order: sortOrder === "newest" ? "desc" : "asc",
      };

      if (filters.nearby) {
        params.nearby = 1;
      } else {
        if (filters.place !== "all") params.city_id = filters.place;
      }

      if (filters.jobType !== "all") params.rate_type = filters.jobType;
      if (filters.urgent) params.urgent = 1;
      if (filters.search) params.search = filters.search;

      const res = await getJobsAPI(params);
      // const jobsData = res.data?.data?.data || [];
      const jobsData = res.data?.data?.vacancies?.data || [];
      const transformedJobs = jobsData.map((job) => {
        const place =
          job.city && job.state
            ? `${job.city}, ${job.state}`
            : job.city || job.state || "Location not specified";

        let departmentName = "N/A";
        if (job.department?.name) {
          departmentName = job.department.name;
        }

        let jobStartDate = null;
        if (job.schedules?.length) {
          const firstSchedule = job.schedules[0];
          if (firstSchedule.start_date) {
            jobStartDate = firstSchedule.start_date;
          } else if (firstSchedule.dates?.length) {
            jobStartDate = firstSchedule.dates[0];
          }
        }

        let jobScheduledDate = job.created_at || null;
        if (!jobScheduledDate && job.schedules?.length) {
          const dates = job.schedules.flatMap((s) => s.dates || []);
          if (dates.length) {
            jobScheduledDate = dates[0];
          }
        }

        return {
          ...job,
          jobTitle: job.designation || "Untitled Job",
          designation: job.designation || "N/A",
          department: departmentName,
          place,
          workersRequired: job.number_of_workers || 0,
          jobDescription: job.notes_to_workers || "No description provided",
          jobId: `VAC-${job.id}`,
          experience: job.experience_required || "Not specified",
          urgent: job.urgent || false,
          jobStartDate,
          jobScheduledDate,
        };
      });

      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Swal.fire("Error", "Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [workerId, filters, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Apply Job
  // const handleApply = async (jobId) => {
  //   try {
  //     await applyJobAPI(jobId);
  //     setAppliedJobIds((prev) => [...prev, jobId]);
  //     Swal.fire("Success", "Applied successfully!", "success");
  //   } catch (error) {
  //     Swal.fire("Error", "Application failed", "error");
  //   }
  // };
  // const handleApply = async (jobId) => {
  //   try {
  //     const response = await applyJobAPI(jobId);

  //     if (response?.data?.status !== 200) {
  //       Swal.fire(
  //         "Error",
  //         response?.data?.message || "Application failed",
  //         "error"
  //       );
  //       return;
  //     }

  //     setAppliedJobIds((prev) => [...prev, jobId]);

  //     Swal.fire(
  //       "Success",
  //       response?.data?.message || "Applied successfully!",
  //       "success"
  //     );
  //   } catch (error) {
  //     Swal.fire(
  //       "Error",
  //       error?.response?.data?.message || "Application failed",
  //       "error"
  //     );
  //   }
  // };
  const handleApply = async (jobId) => {
    try {
      const response = await applyJobAPI(jobId);

      if (response?.data?.status !== 200) {
        Swal.fire(
          "Error",
          response?.data?.message || "Application failed",
          "error",
        );
        return;
      }

      Swal.fire(
        "Success",
        response?.data?.message || "Applied successfully!",
        "success",
      );

      // 🔥 CRITICAL FIX: refresh server data
      await fetchAppliedJobs(); // updates appliedJobs + appliedJobIds
      await fetchData(); // updates jobs list (button state)
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Application failed",
        "error",
      );
    }
  };
  const setFilter = (key, value) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev;

      if (key === "nearby" && value === true) {
        return { ...prev, nearby: true, place: "all" };
      }

      return { ...prev, [key]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      department: "all",
      place: "all",
      jobType: "all",
      urgent: 0,
      search: "",
      nearby: false,
    });
  };

  return {
    jobs,
    appliedJobIds,
    appliedJobs,
    loading,
    departments,
    states,
    cities,
    loadingFilters,
    filters,
    nearby: filters.nearby,
    setFilter,
    clearFilters,
    handleApply,
    refresh: fetchData,
    sortOrder,
    setSortOrder,
    refreshAppliedJobs: fetchAppliedJobs,
  };
};
