import axiosInstance from "../axiosInstance";

export const getAgentProfile = async () => {
  const response = await axiosInstance.get("/agent/profile");
  return response.data;
};
export const changeAgentPassword = async (data) => {
  const response = await axiosInstance.post(
    "/agent/change-password",
    data
  );
  return response;
};

// Get departments
export const getDepartmentsAPI = async () => {
  const response = await axiosInstance.get("/get-departments");
  return response.data;
};


export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};
export const updateAgentProfile = async (body) => {
  const response = await axiosInstance.put("/agent/edit", body);
  return response.data;
};
export const getStatesAPI = async () => {
  const response = await axiosInstance.get("/get-states");
  return response.data;
};
export const getCitiesByStateAPI = async (state_id) => {
  const response = await axiosInstance.post("/get-cities", {
    state_id,
  });

  return response.data;
};