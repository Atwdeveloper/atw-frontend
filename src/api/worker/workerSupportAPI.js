import axiosInstance from "../axiosInstance";

/**
 * Fetch all conversations for the current worker.
 * Expected response: { data: Conversation[] } or an array.
 */
export const getWorkerConversationsAPI = async () => {
  const response = await axiosInstance.get("/messaging/worker-admin-conversation");
  return response.data?.data || response.data || [];
};

export const sendWorkerMessageAPI = async (payload) => {
  const response = await axiosInstance.post("/messaging/send", payload);
  return response.data; // Expected to return the new message & possibly the conversation
};