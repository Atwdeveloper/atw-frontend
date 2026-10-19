import { useState, useEffect } from "react";
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  deleteNotificationAPI,
  clearOldNotificationsAPI,
  exportNotificationsAPI,
} from "../../../api/company/companyNotificationAPI";
import Swal from "sweetalert2";

export const useCompanyNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
    highPriority: 0,
  });
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    unread: 0,
    companies: 0,
    workers: 0,
    jobs: 0,
    alerts: 0,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Helper: format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Transform API notification to UI format
  const transformNotification = (apiNotif) => {
    let payload = {};
    try {
      payload = JSON.parse(apiNotif.payload || "{}");
    } catch (e) {
      console.warn("Invalid payload JSON", apiNotif.payload);
    }

    const companyName = payload.company_name || payload.companyName || null;
    const workerName = payload.worker_name || payload.workerName || null;
    const jobTitle = payload.job_title || payload.jobTitle || null;
    const amount = payload.amount ? `₹${payload.amount}` : null;

    let type = apiNotif.type;
    let tabKey = "all";
    if (type === "company_updated") tabKey = "companies";
    else if (type === "new_worker" || type === "worker_updated")
      tabKey = "workers";
    else if (type === "job_posting" || type === "job_updated") tabKey = "jobs";
    else if (type === "withdrawal_request" || type === "approval_required")
      tabKey = "alerts";
    else tabKey = "all";

    return {
      id: apiNotif.id,
      type: type,
      title: apiNotif.title,
      description: apiNotif.message,
      time: formatTime(apiNotif.created_at),
      read: apiNotif.read_at !== null,
      timestamp: apiNotif.created_at,
      companyName,
      workerName,
      jobTitle,
      amount,
      channels: ["platform"],
      priority: "medium",
      tabKey,
    };
  };

  // Calculate stats from given list
  const calculateAllStats = (notifList) => {
    const today = new Date().toDateString();

    const mainStats = {
      total: notifList.length,
      unread: notifList.filter((n) => !n.read).length,
      today: notifList.filter(
        (n) => new Date(n.timestamp).toDateString() === today,
      ).length,
      highPriority: 0,
    };

    const tabStats = {
      all: notifList.length,
      unread: notifList.filter((n) => !n.read).length,
      companies: notifList.filter((n) => n.tabKey === "companies").length,
      workers: notifList.filter((n) => n.tabKey === "workers").length,
      jobs: notifList.filter((n) => n.tabKey === "jobs").length,
      alerts: notifList.filter((n) => n.tabKey === "alerts").length,
    };

    return { mainStats, tabStats };
  };

  // Fetch notifications for a given page
  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getNotificationsAPI(page);
      const apiData = response?.data?.data || [];
      const pagination = response?.data || {};

      // Update pagination meta
      setCurrentPage(pagination.current_page || page);
      setLastPage(pagination.last_page || 1);
      setTotalItems(pagination.total || 0);
      setPerPage(pagination.per_page || 10);

      const transformed = apiData.map(transformNotification);
      const { mainStats, tabStats } = calculateAllStats(transformed);
      setNotifications(transformed);
      setStats(mainStats);
      setTabCounts(tabStats);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not load notifications. Please try again.",
      });
      setNotifications([]);
      setStats({ total: 0, unread: 0, today: 0, highPriority: 0 });
      setTabCounts({
        all: 0,
        unread: 0,
        companies: 0,
        workers: 0,
        jobs: 0,
        alerts: 0,
      });
      setCurrentPage(1);
      setLastPage(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Pagination navigation
  const goToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) return;
    fetchNotifications(page);
  };

  const nextPage = () => {
    if (currentPage < lastPage) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  // Mark single as read
  const markAsRead = async (id) => {
    try {
      await markNotificationReadAPI(id);
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      const { mainStats, tabStats } = calculateAllStats(updated);
      setNotifications(updated);
      setStats(mainStats);
      setTabCounts(tabStats);
    } catch (error) {
      console.error("Failed to mark as read", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not mark notification as read.",
      });
    }
  };

  // Mark all as read (only current page)
  const markAllAsRead = async () => {
    const result = await Swal.fire({
      title: "Mark all as read?",
      text: "All notifications on this page will be marked as read.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark all",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await markAllNotificationsReadAPI();
      const updated = notifications.map((n) => ({ ...n, read: true }));
      const { mainStats, tabStats } = calculateAllStats(updated);
      setNotifications(updated);
      setStats(mainStats);
      setTabCounts(tabStats);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "All notifications marked as read.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not mark all as read.",
      });
    }
  };

  // Delete single notification (and refetch current page)
  const deleteNotification = async (id) => {
    const result = await Swal.fire({
      title: "Delete notification?",
      text: "This notification will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteNotificationAPI(id);
      // Refetch current page to keep pagination consistent
      await fetchNotifications(currentPage);
    } catch (error) {
      console.error("Failed to delete", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not delete notification.",
      });
    }
  };

  // Clear old notifications (then refetch page 1)
  const clearOldNotifications = async () => {
    const result = await Swal.fire({
      title: "Clear old notifications?",
      text: "Notifications older than 30 days will be cleared.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear them",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    try {
      await clearOldNotificationsAPI();
      await fetchNotifications(1);
      Swal.fire({
        icon: "success",
        title: "Cleared!",
        text: "Old notifications have been cleared.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to clear old notifications", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not clear old notifications.",
      });
    }
  };

  // Export notifications (from current page? or all? we keep as is)
  const exportNotifications = async () => {
    try {
      setLoading(true);
      const response = await exportNotificationsAPI();
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      let filename = "notifications-export.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      Swal.fire({
        icon: "success",
        title: "Export Downloaded!",
        text: "Your notifications have been exported.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Export failed", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Could not download the export file.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1);
  }, []);

  return {
    notifications,
    loading,
    stats,
    tabCounts,
    currentPage,
    lastPage,
    totalItems,
    perPage,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearOldNotifications,
    exportNotifications,
    fetchNotifications,
    goToPage,
    nextPage,
    prevPage,
  };
};
