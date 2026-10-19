import axiosInstance from "../axiosInstance";

// Get company profile
export const getCompanyProfileAPI = async () => {
  const response = await axiosInstance.get("/company/profile");
  return response.data;
};

// Update company profile
export const updateCompanyProfileAPI = async (payload) => {
  const response = await axiosInstance.put("/company/profile", payload);
  return response.data;
};

// Change company password
export const changeCompanyPasswordAPI = async (payload) => {
  const response = await axiosInstance.post("/company/change-password", payload);
  return response.data;
};

// Upload company logo
export const uploadCompanyLogoAPI = async (formData) => {
  const response = await axiosInstance.post("/company/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

// Get states
export const getStatesAPI = () => {
  return axiosInstance.get("/get-states");
};

// Get cities by state
export const getCitiesByStateAPI = (state_id) => {
  return axiosInstance.post("/get-cities", { state_id });
};

// Get company statistics
export const getCompanyStatsAPI = async () => {
  const response = await axiosInstance.get("/company/stats");
  return response.data;
};