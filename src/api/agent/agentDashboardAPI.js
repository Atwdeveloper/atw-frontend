import axiosInstance from "../axiosInstance"; 

export const globalSearchAPI = async (search) => {
  const response = await axiosInstance.get("/agent/global-search", {
    params: { search },
  });
  return response.data;
};