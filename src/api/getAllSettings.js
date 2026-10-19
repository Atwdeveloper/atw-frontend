import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://anytimework.in/anytimework/public/api/",
});

// Get company profile
export const getAllSettingsAPI = async () => {
  const response = await axiosInstance.get("/get-all-settings");
  return response.data;
};