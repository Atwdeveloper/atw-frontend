import axiosInstance from "../axiosInstance";

export const addCompanyAPI = async (payload) => {
  const response = await axiosInstance.post("/agent/addcompany", payload);
  return response.data;
};
export const getAgentCompanyDetailsAPI = async (companyId) => {
  const response = await axiosInstance.get(
    `/agent/edit-company-details/${companyId}`,
  );

  return response;
};
export const editCompanyAPI = async (companyId, payload) => {
  const response = await axiosInstance.post(
    `/agent/edit-company/${companyId}`,
    payload,
  );
  return response.data;
};

export const getAgentCompaniesAPI = async (params = {}, options = {}) => {
  try {
    const response = await axiosInstance.get("/agent/list", {
      params,
      signal: options.signal,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      throw error;
    }
    throw error;
  }
};
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

export const getStatesAPI = () => {
  return axiosInstance.get("/get-states");
};

export const getCitiesByStateAPI = (state_id) => {
  return axiosInstance.post("/get-cities", {
    state_id,
  });
};

export const deleteAgentCompanyAPI = async (companyId) => {
  const response = await axiosInstance.delete(`/agent/company/${companyId}`);
  return response.data;
};

export const getAgentCompanyAPI = async (companyId) => {
  const response = await axiosInstance.get(`/agent/company/${companyId}`);
  return response.data;
};

export const updateAgentCompanyAPI = async (companyId, payload) => {
  const response = await axiosInstance.put(
    `/agent/company/${companyId}`,
    payload,
  );
  return response.data;
};

// /agent/dashbord
export const getAgentDashboardAPI = async () => {
  const response = await axiosInstance.get("/agent/dashboard");
  return response.data;
};
