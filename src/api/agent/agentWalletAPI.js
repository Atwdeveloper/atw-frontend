import axiosInstance from "../axiosInstance";

export const getAgentWallet = async () => {
  const response = await axiosInstance.get("/agent/wallet");
  return response.data;
};