import axiosInstance from "../axiosInstance";

// Get job vacancies with optional filters
export const getJobsAPI = (params) => {
  return axiosInstance.get("/worker/vacancies", { params });
};

// Apply for a vacancy
export const applyJobAPI = (jobId) => {
  return axiosInstance.post(`/worker/vacancies/${jobId}/apply`);
};

export const getAppliedJobsAPI = () => {
  return axiosInstance.get("/worker/vacancies/applied");
};

// NEW ✅ Get single applied job detail
export const getAppliedJobDetailAPI = (applicationId) => {
  return axiosInstance.get(`/worker/vacancies/applied/${applicationId}`);
};

// NEW ✅ Cancel application
export const cancelApplicationAPI = (applicationId) => {
  return axiosInstance.post(
    `/worker/vacancies/applied/${applicationId}/cancel`,
  );
};

// Get cities that have job vacancies
export const getCitiesWithVacanciesAPI = () => {
  return axiosInstance.get("/worker/vacancies/cities-with-vacancies");
};

// Get detailed information about a single job
export const getJobDetailsAPI = (jobId) => {
  return axiosInstance.get(`/worker/jobs/${jobId}`);
};

// Fetch all departments
export const getDepartmentsAPI = () => {
  return axiosInstance.get("/get-departments");
};

// Fetch all states
export const getStatesAPI = () => {
  return axiosInstance.get("/get-states");
};

// Fetch cities for a given state
export const getCitiesAPI = (stateId) => {
  return axiosInstance.post("/get-cities", { state_id: stateId });
};
export const terminateJobAPI = (vacancy_id) => {
  return axiosInstance.post("/worker/termination", {
    vacancy_id,
  });
};
