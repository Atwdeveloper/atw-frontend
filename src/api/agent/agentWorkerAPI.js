import axiosInstance from "../axiosInstance";

// Get Workers List (search + pagination)
// export const getWorkersAPI = async (workerData) => {
//   const response = await axiosInstance.get("/agent/workers", workerData);
//   return response.data;
// };
export const getWorkersAPI = async (params, options = {}) => {
  const response = await axiosInstance.get("/agent/workers", {
    params,
    signal: options.signal,
  });

  return response.data;
};
// // Add new worker
export const addWorkerAPI = async (workerData) => {
  const response = await axiosInstance.post("/agent/add/workers", workerData);
  return response.data;
};

// // Get single worker details
export const getWorkerByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/agent/get-workers/${id}`);
  return response.data;
};

// // Update worker
export const updateWorkerAPI = async (id, workerData) => {
  const response = await axiosInstance.put(`/agent/workers/${id}`, workerData);
  return response.data;
};

// // Delete Worker
export const deleteWorkerAPI = async (id) => {
  const response = await axiosInstance.delete(`/agent/delete/workers/${id}`);
  return response.data;
};

export const getIndustriesWithDesignationsAPI = () => {
  return axiosInstance.get("/industries-with-designations");
};

export const getDesignationsByIndustryAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
export const getDesignationsAPI = () => {
  return axiosInstance.get("/get-designations");
};

export const addDesignationAPI = (data) => {
  return axiosInstance.post("/designations", data);
};

// Department APIs
export const getDepartmentsAPI = () => {
  return axiosInstance.get("/get-departments");
};

export const addDepartmentAPI = (data) => {
  return axiosInstance.post("/departments", data);
};

// Industry APIs
export const getIndustriesAPI = () => {
  return axiosInstance.get("/get-industries");
};

// State and City APIs
export const getStatesAPI = () => {
  return axiosInstance.get("/get-states");
};

export const getCitiesByStateAPI = (state_id) => {
  return axiosInstance.post("/get-cities", {
    state_id,
  });
};
