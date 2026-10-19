import { useState, useEffect } from "react";
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  deleteNotificationAPI,
  clearOldNotificationsAPI,
  exportNotificationsAPI,
} from "../../../api/agent/agentNotificationAPI";
import Swal from "sweetalert2";

export const useAgentNotification = () => {
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
    agents: 0, // changed from 'workers' to 'agents'
    jobs: 0,
    alerts: 0,
  });

  // Helper: format time from API "created_at"
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
    const agentName = payload.agent_name || payload.agentName || null; // changed from workerName
    const jobTitle = payload.job_title || payload.jobTitle || null;
    const amount = payload.amount ? `₹${payload.amount}` : null;

    let tabKey = "all";
    const type = apiNotif.type;
    if (type.includes("company")) tabKey = "companies";
    else if (type.includes("agent"))
      tabKey = "agents"; // changed from 'workers'
    else if (type.includes("job")) tabKey = "jobs";
    else if (type.includes("withdrawal") || type.includes("approval"))
      tabKey = "alerts";
    else tabKey = "all";

    return {
      id: apiNotif.id,
      type,
      title: apiNotif.title,
      description: apiNotif.message,
      time: formatTime(apiNotif.created_at),
      read: apiNotif.read_at !== null,
      timestamp: apiNotif.created_at,
      companyName,
      agentName, // changed from workerName
      jobTitle,
      amount,
      channels: ["platform"],
      priority: "medium",
      tabKey,
    };
  };

  // Calculate all statistics from transformed notifications
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
      agents: notifList.filter((n) => n.tabKey === "agents").length, // changed from workers
      jobs: notifList.filter((n) => n.tabKey === "jobs").length,
      alerts: notifList.filter((n) => n.tabKey === "alerts").length,
    };

    return { mainStats, tabStats };
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotificationsAPI(1);
      const apiData = response?.data?.data || [];
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
        agents: 0,
        jobs: 0,
        alerts: 0,
      });
    } finally {
      setLoading(false);
    }
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

  // Mark all as read
  const markAllAsRead = async () => {
    const result = await Swal.fire({
      title: "Mark all as read?",
      text: "All notifications will be marked as read.",
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

  // Delete single notification
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
      const updated = notifications.filter((n) => n.id !== id);
      const { mainStats, tabStats } = calculateAllStats(updated);
      setNotifications(updated);
      setStats(mainStats);
      setTabCounts(tabStats);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Notification has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not delete notification.",
      });
    }
  };

  // Clear old notifications (older than 30 days)
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
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filtered = notifications.filter(
        (n) => new Date(n.timestamp) > thirtyDaysAgo,
      );
      const { mainStats, tabStats } = calculateAllStats(filtered);
      setNotifications(filtered);
      setStats(mainStats);
      setTabCounts(tabStats);
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

  // Export notifications
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
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    stats,
    tabCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearOldNotifications,
    exportNotifications,
    fetchNotifications,
  };
};
