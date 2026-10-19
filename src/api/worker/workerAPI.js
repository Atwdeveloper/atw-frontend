import axiosInstance from "../axiosInstance";

// Get worker profile
export const getWorkerProfileAPI = async () => {
  const response = await axiosInstance.get("/worker/profile");
  return response.data;
};

// Update worker profile — same URL as the GET above, POST to update.
export const updateWorkerProfileAPI = async (payload) => {
  const response = await axiosInstance.post("/worker/profile", payload);
  return response.data;
};

// Change worker password
export const changeWorkerPasswordAPI = async (payload) => {
  const response = await axiosInstance.post("/worker/change-password", payload);
  return response.data;
};


// Get worker statistics
export const getWorkerStatsAPI = async () => {
  const response = await axiosInstance.get("/worker/stats");
  return response.data;
};

// Get departments
export const getDepartmentsAPI = async () => {
  const response = await axiosInstance.get("/get-departments");
  return response.data;
};

// Get designations
// export const getDesignationsAPI = async () => {
//   const response = await axiosInstance.get("/get-designations");
//   return response.data;
// };
export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

// Get states
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

// Get worker documents
export const getWorkerDocumentsAPI = async () => {
  const response = await axiosInstance.get("/worker/documents");
  return response.data;
};

// Upload worker document
export const uploadWorkerDocumentAPI = async (formData) => {
  const response = await axiosInstance.post("/worker/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Upload worker photo
// export const uploadWorkerPhotoAPI = async (formData) => {
//   const response = await axiosInstance.post("/worker/upload-photo", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// Get cities by state
// export const getCitiesByStateAPI = async (stateId) => {
//   const response = await axiosInstance.get(`/get-cities/${stateId}`);
//   return response.data;
// };
// Salary Slips
export const getWorkerSalarySlipsAPI = async () => {
  const response = await axiosInstance.get("/worker/salary-slips");
  return response.data;
};

export const getSalarySlipDownloadAPI = async (year, month) => {
  const response = await axiosInstance.post(`/worker/salary-slips/print`, {
    year,
    month,
  }, {
    responseType: 'blob'
  });
  return response;
};

export const verifyBankAccountAPI = async (data) => {
  const response = await axiosInstance.post("/worker/verify-bank-account", data);
  return response.data;
};

