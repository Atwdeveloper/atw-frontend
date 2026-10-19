import axiosInstance from "../axiosInstance";

/**
 * 🔐 Login Agent
 * @param {Object} credentials - { agent_email, password }
 */
export const loginAgent = async (credentials) => {
  const response = await axiosInstance.post("/agent/login", credentials);
  return response.data;
};


export const getAgentProfile = async () => {
  const response = await axiosInstance.get("/agent/profile");
  return response.data;
};

/**
 * 🚪 Logout Agent
 */
export const logoutAgent = async () => {
  const response = await axiosInstance.post("/agent/logout");
  return response.data;
};
export const registerAgent = async (data) => {
  const response = await axiosInstance.post("/agent/register", data);
  return response.data;
};

/**
 * 📥 Get Saved Registration Data (Prefill Form)
 * 👉 Used when user comes back to continue registration
 */



export const getRegisterData = async () => {
  const response = await axiosInstance.get("/agent/registeredit");
  return response.data;
};

/**
 * 💾 Save Step Data (All Steps)
 * 👉 Works for step 2, 3, 4... (partial updates)
 *
 * Example:
 * updateRegisterData({ middle_name: "K", gender: "male" })
 */
export const updateRegisterData = async (data) => {
  const response = await axiosInstance.post("/agent/registeredit", data);
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
export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};



export const requestPasswordResetAPI = async (email) => {
  const response = await axiosInstance.post('/agent/forgot-password', { email });
  return response.data;
};

// Reset password with token
export const resetPasswordAPI = async ({ token, email, password }) => {
  const response = await axiosInstance.post('/agent/reset-password', {
    token,
    email,
    password,
  });
  return response.data;
};