import axiosInstance from "../axiosInstance";

// Get staff list
export const getStaffsAPI = (params) => {
  return axiosInstance.get("/company/staff-list", { params });
};

// Get single staff
export const getStaffAPI = (id) => {
  return axiosInstance.get(`/company/staff-update/${id}`);
};

// Create staff
export const createStaffAPI = (data) => {
  return axiosInstance.post("/company/staff-add", data);
};

// Update staff
export const updateStaffAPI = (id, data) => {
  return axiosInstance.put(`/company/staff-update/${id}`, data);
};

// Delete staff
export const deleteStaffAPI = (id) => {
  return axiosInstance.delete(`/company/staff-delete/${id}`);
};

// Toggle staff status
export const toggleStaffStatusAPI = (id, isActive) => {
  return axiosInstance.patch(`/company/staff-toggle/${id}`, { is_active: isActive });
};

// Get roles for dropdown
export const getRolesAPI = () => {
  return axiosInstance.get("/company/permission-profiles/list-all");
};

// Get designations for dropdown
export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};

// Add new designation
export const addDesignationAPI = (data) => {
  return axiosInstance.post("/company/designations", data);
};

// Get departments for dropdown
export const getDepartmentsAPI = () => {
  return axiosInstance.get("/get-departments");
};

// Add new department
export const addDepartmentAPI = (data) => {
  return axiosInstance.post("/company/departments", data);
};

// Get industries for dropdown
export const getIndustriesAPI = () => {
  return axiosInstance.get("/get-industries");
};

// Add states
export const getStatesAPI = () => {
  return axiosInstance.get("/get-states");
};

// Add cities by states
export const getCitiesByStateAPI = (state_id) => {
  return axiosInstance.post("/get-cities", {
     state_id,
  });
};

//chech username is unique
export const checkUsernameAPI = (username) => {
  return axiosInstance.get(`/company/check-username-unique/${username}`);
};