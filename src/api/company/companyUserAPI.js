import axiosInstance from "../axiosInstance";

// Get user profile
export const getUserProfileAPI = async () => {
  const response = await axiosInstance.get("/company/user-profile");
  return response.data;
};

// Update user profile
export const updateUserProfileAPI = async (payload) => {
  const response = await axiosInstance.put("/company/user-profile", payload);
  return response.data;
};

// Get designations (for dropdown)
// export const getDesignationsAPI = async () => {
//   const response = await axiosInstance.get("/get-designations");
//   return response.data;
// };
export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};