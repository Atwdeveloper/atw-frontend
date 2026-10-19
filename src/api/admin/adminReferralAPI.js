// src/api/admin/referralSettingsAPI.js
import axiosInstance from "../axiosInstance";

export const getReferralSettingsAPI = async () => {
  try {
    const response = await axiosInstance.get("/admin/referral-settings");
    return response;
  } catch (error) {
    console.error("Error fetching referral settings:", error);
    throw error;
  }
};

export const saveReferralSettingsAPI = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/referral-settings", data);
    return response;
  } catch (error) {
    console.error("Error saving referral settings:", error);
    throw error;
  }
};