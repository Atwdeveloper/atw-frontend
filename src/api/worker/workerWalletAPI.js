import axiosInstance from "../axiosInstance";

/**
 * Get the worker's wallet summary (balance, monthly earnings, etc.)
 */
export const getWalletSummaryAPI = async (params = {}) => {
  const response = await axiosInstance.get("/worker/wallet/summaries", {
    params,
  });
  return response.data;
};

/**
 * Get the worker's wallet transaction history
 * @param {Object} params - optional filtering parameters (year, month, limit)
 */
export const getWalletHistoryAPI = async (params = {}) => {
  const response = await axiosInstance.get("/worker/wallet/history", {
    params,
  });
  return response.data;
};

/**
 * Request a manual withdrawal from the wallet
 * @param {number} amount - the amount to withdraw
 */
export const requestWithdrawalAPI = async (amount) => {
  const response = await axiosInstance.post("/worker/wallet/withdraw", {
    amount,
  });
  return response.data;
};
/**
 * Add or update worker bank details
 * @param {Object} details - bank account details
 */
export const updateBankDetailAPI = async (details) => {
  const response = await axiosInstance.post(
    "/worker/wallet/bank-detail",
    details,
  );
  return response.data;
};

/**
 * Set active/primary bank for worker
 * @param {number} bankId - bank record id
 */
export const setActiveBankAPI = async (bankId) => {
  const response = await axiosInstance.post("/worker/wallet/set-active-bank", {
    bank_id: bankId,
  });
  return response.data;
};
/**
 * Get auto-withdrawal settings
 */
export const getAutoWithdrawalSettingsAPI = async () => {
  const response = await axiosInstance.get("/worker/wallet/auto-withdrawal");
  return response.data;
};

/**
 * Update auto-withdrawal settings
 * @param {Object} settings - { enabled, frequency, threshold }
 */
export const updateAutoWithdrawalSettingsAPI = async (settings) => {
  const response = await axiosInstance.post(
    "/worker/wallet/auto-withdrawal",
    settings,
  );
  return response.data;
};
