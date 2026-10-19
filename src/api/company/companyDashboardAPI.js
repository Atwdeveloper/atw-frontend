import axiosInstance from "../axiosInstance"; 

// Dashboard API
export const getCompanyDashboardAPI = async () => {
  const response = await axiosInstance.get("/company/dashboard");
  return response.data;
};

// ✅ Worker Search API (for dropdown)
export const searchWorkersAPI = async (search = "") => {
  const response = await axiosInstance.get("/company/workers/search", {
    params: { search },
  });
  return response.data;
};

// ✅ Worker Detail API (for modal)
export const getWorkerDetailAPI = async (id) => {
  const response = await axiosInstance.get(`/company/workers/${id}`);
  return response.data;
};

export const globalSearchAPI = async (search) => {
  const response = await axiosInstance.get("/company/global-search", {
    params: { search },
  });
  return response.data;
};