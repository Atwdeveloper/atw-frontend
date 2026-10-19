import axiosInstance from "../axiosInstance";

export const getDressOrdersAPI = (params) => {
  return axiosInstance.get("/agent/dress-orders-list", { params });
};

export const createDressOrderAPI = (payload) => {
  return axiosInstance.post("/agent/dress-orders", payload);
};

export const getDressOrderByIdAPI = (id) => {
  return axiosInstance.get(`/agent/dress-orders/${id}`);
};
export const getAgentProfileAPI = async () => {
  const response = await axiosInstance.get("/agent/profile");
  return response.data;
};