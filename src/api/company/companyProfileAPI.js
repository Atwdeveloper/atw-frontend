import axiosInstance from "../axiosInstance";

// Change Password
export const changePasswordAPI = async (body) => {
  const response = await axiosInstance.post("/company/change-password", body);
  return response.data;
};

// Change Username
export const changeUsernameAPI = async (body) => {
  const response = await axiosInstance.post("/company/change-username", body);
  return response.data;
};

export const changeEmailAPI = async (body) => {
  return axiosInstance.post("/company/change-email", body);
};
