import axiosInstance from "../axiosInstance";

// Fetch all notifications (paginated)
export const getNotificationsAPI = async (page = 1) => {
  const response = await axiosInstance.get(`/notifications?page=${page}`);
  return response.data;
};

// Mark single notification as read
export const markNotificationReadAPI = async (id) => {
  const response = await axiosInstance.post(`/notifications/${id}/mark-as-read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsReadAPI = async () => {
  const response = await axiosInstance.post("/notifications/mark-all-as-read");
  return response.data;
};

// Delete a notification
export const deleteNotificationAPI = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};

// Clear old notifications (custom endpoint – adjust if needed)
export const clearOldNotificationsAPI = async () => {
  // Assuming the backend has an endpoint to clear old notifications
  // If not, implement locally or change the endpoint
  const response = await axiosInstance.delete("/notifications/clear-old");
  return response.data;
};

// Get unread count for header badge
export const getUnreadCountAPI = async () => {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data;
};

// Export notifications (CSV/Excel)
export const exportNotificationsAPI = async () => {
  const response = await axiosInstance.get("/notifications/export", {
    responseType: "blob",
  });
  return response;
};