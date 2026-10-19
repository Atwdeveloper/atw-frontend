import axiosInstance from "../axiosInstance";

/**
 * Fetch the company’s ongoing conversation with admin.
 * Returns the complete conversation object including messages.
 */
export const getCompanyConversationAPI = async () => {
  const response = await axiosInstance.get("/messaging/company-admin-conversation");
  return response.data; // shape: { conversation_id, messages, other_participant, ... }
};

/**
 * Send a message from the company to admin.
 */
export const sendCompanyMessageAPI = async (payload) => {
  const response = await axiosInstance.post("/messaging/send", payload);
  return response.data;
};