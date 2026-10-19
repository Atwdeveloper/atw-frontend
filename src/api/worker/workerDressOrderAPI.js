import axiosInstance from "../axiosInstance";

export const getDressOrdersAPI = (params) => {
  return axiosInstance.get("/worker/dress-orders-list", { params });
};

export const createDressOrderAPI = (payload) => {
  return axiosInstance.post("/worker/dress-orders", payload);
};

export const getDressOrderByIdAPI = (id) => {
  return axiosInstance.get(`/worker/dress-orders/${id}`);
};
export const getWorkerProfileAPI = async () => {
  const response = await axiosInstance.get("/worker/profile");
  return response.data;
};