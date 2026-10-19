import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  getAppliedJobsAPI,
  getAppliedJobDetailAPI,
  cancelApplicationAPI,
} from "../../../api/worker/workerJobvacanciesAPI";

export const useWorkerAppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");
  const workerId = parsedUser?.worker_id;

  // Helper to convert weekday numbers to day names
  const getWeekdayNames = (weekdayNumbers) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdayNumbers.map((num) => days[num]).join(", ");
  };

  // Helper to format a date for display (e.g., "26 Feb 2026")
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Generate a readable schedule description
  // const getScheduleDescription = (schedule) => {
  //   if (!schedule) return "No schedule specified";

  //   if (schedule.mode === "weekly" && schedule.weekdays?.length) {
  //     return `Weekly on ${getWeekdayNames(schedule.weekdays)}`;
  //   }
  //   if (schedule.mode === "daily") {
  //     return "Daily";
  //   }
  //   if (schedule.mode === "monthly") {
  //     return "Monthly";
  //   }
  //   if (schedule.mode === "dates" && schedule.dates?.length) {
  //     const formattedDates = schedule.dates
  //       .map((d) => formatDateForDisplay(d))
  //       .join(", ");
  //     return `Specific dates: ${formattedDates}`;
  //   }
  //   return `${schedule.mode} schedule`;
  // };
  const getScheduleDescription = (schedule) => {
    if (!schedule) return "No schedule available";

    if (schedule.mode === "weekly" && schedule.weekdays?.length) {
      return `Weekly on ${getWeekdayNames(schedule.weekdays)}`;
    }

    if (schedule.mode === "daily") {
      return "Daily";
    }

    if (schedule.mode === "monthly") {
      return "Monthly";
    }

    if (schedule.mode === "salary") {
      return "";
    }

    if (schedule.mode === "dates" && schedule.dates?.length) {
      const formattedDates = schedule.dates
        .map((d) => formatDateForDisplay(d))
        .join(", ");

      return `Specific dates: ${formattedDates}`;
    }

    return "No schedule available";
  };
  // Extract job start and end dates from schedule
  const getJobDatesFromSchedule = (schedule) => {
    if (!schedule) {
      return {
        jobStartDate: new Date().toISOString().split("T")[0],
        jobEndDate: new Date().toISOString().split("T")[0],
      };
    }

    // if (schedule.start_date && schedule.end_date) {
    //   return {
    //     jobStartDate: schedule.start_date,
    //     jobEndDate: schedule.end_date,
    //   };
    // }
    if (schedule.start_date) {
      return {
        jobStartDate: schedule.start_date,
        jobEndDate: schedule.end_date || null,
      };
    }
    if (schedule.mode === "dates" && schedule.dates?.length) {
      const dates = schedule.dates.map(
        (d) => new Date(d).toISOString().split("T")[0],
      );
      dates.sort();
      return {
        jobStartDate: dates[0],
        jobEndDate: dates[dates.length - 1],
      };
    }
    return {
      jobStartDate: null,
      jobEndDate: null,
    };
    // fallback
    // return {
    //   jobStartDate: new Date().toISOString().split("T")[0],
    //   jobEndDate: new Date().toISOString().split("T")[0],
    // };
  };

  // Transform a single application
  const transformApplication = (app) => {
    if (!app || !app.vacancy_summary || !app.vacancy_details) return null;

    const summary = app.vacancy_summary;
    const details = app.vacancy_details;

    // Determine work type from rate_type
    let workType = "daily";
    if (details.rate_type === "hourly") workType = "hourly";
    else if (details.rate_type === "salary") workType = "salary";
    // "pcs" remains daily – but we keep rate_type separately

    const ratePerWorker = `₹${summary.base_rate || details.base_rate || 0}`;
    const place =
      `${summary.city || ""}, ${summary.state || ""}`
        .replace(/^,\s*/, "")
        .replace(/,\s*$/, "") || "Location not specified";
    const shift =
      details.shift_start_time && details.shift_end_time
        ? `${details.shift_start_time.substring(0, 5)} - ${details.shift_end_time.substring(0, 5)}`
        : "Not specified";

    // Get schedule (first one, if any)
    const schedule = details.schedules?.[0] || null;

    // Get job dates from schedule
    const { jobStartDate, jobEndDate } = getJobDatesFromSchedule(schedule);

    // Generate schedule description
    const scheduleDescription = getScheduleDescription(schedule);

    // Map backend status to UI status
    let uiStatus = "pending";
    if (app.status === "applied") uiStatus = "pending";
    else if (app.status === "accepted") uiStatus = "confirmed";
    else if (["rejected", "cancelled"].includes(app.status))
      uiStatus = "cancelled";
    else if (app.status === "completed") uiStatus = "confirmed";

    return {
      id: summary.id,
      applicationId: app.id,
      jobTitle: summary.designation,
      designation: summary.designation,
      department: "General",
      companyName: details.company_name || "",
      place,
      ratePerWorker,
      workType,
      rateType: details.rate_type,
      jobStartDate,
      jobEndDate,
      appliedDate: app.applied_at || new Date().toISOString().split("T")[0],
      shift,
      shiftStart: details.shift_start_time,
      shiftEnd: details.shift_end_time,
      experience: "Not specified",
      jobId: `VAC-${summary.id}`,
      workersRequired: details.number_of_workers,
      jobDescription: details.notes_to_workers || "No description provided",
      status: uiStatus,
      mealProvided: details.meal_provided === 1,
      breakType: details.break_type,
      breakDuration: details.break_duration_minutes ?? 0,
      scheduleDescription,
    };
  };

  // Fetch all applied jobs
  const fetchApplications = useCallback(async () => {
    if (!workerId) return;
    setLoading(true);
    try {
      const response = await getAppliedJobsAPI();
      let appsData = [];

      if (Array.isArray(response.data?.data?.applications?.data)) {
        appsData = response.data.data.applications.data;
      } else if (Array.isArray(response.data?.data?.data)) {
        appsData = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        appsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        appsData = response.data;
      }
      // let appsData = [];
      // if (Array.isArray(response.data?.data?.data)) {
      //   appsData = response.data.data.data;
      // } else if (Array.isArray(response.data?.data)) {
      //   appsData = response.data.data;
      // } else if (Array.isArray(response.data)) {
      //   appsData = response.data;
      // }

      const transformed = appsData
        .map(transformApplication)
        .filter((app) => app !== null);

      setApplications(transformed);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load your applications.",
      });
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Cancel application
  const cancelApplication = async (applicationId, jobTitle) => {
    const result = await Swal.fire({
      title: "Cancel Application?",
      text: `Are you sure you want to cancel your application for "${jobTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    setCancelling(true);
    try {
      await cancelApplicationAPI(applicationId);
      setApplications((prev) =>
        prev.filter((app) => app.applicationId !== applicationId),
      );
      Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: "Your application has been cancelled.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to cancel application.",
      });
    } finally {
      setCancelling(false);
    }
  };

  // Fetch single applied job details (optional)
  const fetchApplicationDetail = async (applicationId) => {
    try {
      const response = await getAppliedJobDetailAPI(applicationId);
      return response.data?.data || null;
    } catch (error) {
      console.error("Error fetching job detail:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load job details.",
      });
      return null;
    }
  };

  return {
    applications,
    loading,
    cancelling,
    fetchApplications,
    cancelApplication,
    fetchApplicationDetail,
    refresh: fetchApplications,
  };
};
