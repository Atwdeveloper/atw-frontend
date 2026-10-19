import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getWalletSummaryAPI,
  getWalletHistoryAPI,
  requestWithdrawalAPI,
  updateBankDetailAPI,
  setActiveBankAPI,
  getAutoWithdrawalSettingsAPI,
  updateAutoWithdrawalSettingsAPI,
} from "../../../api/worker/workerWalletAPI";
export const useWorkerWallet = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [autoWithdrawSettings, setAutoWithdrawSettings] = useState({
    enabled: true,
    frequency: "monthly",
    threshold: 100,
  });
  const [transactions, setTransactions] = useState([]);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchWalletSummary = useCallback(
    async (params = {}, silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await getWalletSummaryAPI(params);
        if (data.status === 200) {
          setSummary(data.data);
        } else {
          toast.error(data.message || "Failed to load wallet summary");
        }
      } catch (error) {
        console.error("Error fetching wallet summary:", error);
        toast.error("Failed to load wallet summary");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [],
  );

  const fetchWalletHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await getWalletHistoryAPI(params);
      if (data.status === 200) {
        const historyData = data.data;
        setHistory(historyData.data);
        setPagination({
          current_page: historyData.current_page,
          last_page: historyData.last_page,
          total: historyData.total,
          per_page: historyData.per_page,
        });

        // Only update dashboard transactions if we're on the first page with no filters
        if (!params.page || params.page === 1) {
          setTransactions(historyData.data.slice(0, 5));
        }
      } else {
        toast.error(data.message || "Failed to load transaction history");
      }
    } catch (error) {
      console.error("Error fetching wallet history:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  }, []);

  // const requestWithdrawal = async (amount) => {
  //   setLoading(true);
  //   try {
  //     const data = await requestWithdrawalAPI(amount);
  //     if (data.status === 200) {
  //       toast.success("Withdrawal request processed successfully");
  //       await fetchWalletSummary(); // Refresh summary/balance
  //       return true;
  //     } else {
  //       toast.error(data.message || "Withdrawal failed");
  //       return false;
  //     }
  //   } catch (error) {
  //     const message = error.response?.data?.message || "Withdrawal failed";
  //     toast.error(message);
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const requestWithdrawal = async (amount) => {
    setLoading(true);

    try {
      const response = await requestWithdrawalAPI(amount);

      if (response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Withdrawal Failed",
          text:
            response?.message ||
            "You have already made a withdrawal today. Only one withdrawal is allowed per day.",
        });

        return false;
      }

      if (response?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Withdrawal request processed successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        await fetchWalletSummary();
        return true;
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: response?.message || "Withdrawal failed",
      });

      return false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };
  const updateBankDetails = async (details) => {
    setLoading(true);
    try {
      const data = await updateBankDetailAPI(details);
      if (data.status === 200) {
        toast.success("Bank details updated successfully");
        await fetchWalletSummary(); // Refresh summary/bank view
        return true;
      } else {
        toast.error(data.message || "Update failed");
        return false;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      console.error("Error updating bank details:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const switchActiveBank = async (bankId) => {
    setLoading(true);
    try {
      const data = await setActiveBankAPI(bankId);
      if (data.status === 200) {
        toast.success("Active bank updated successfully");
        await fetchWalletSummary();
        return true;
      } else {
        toast.error(data.message || "Switch failed");
        return false;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Switch failed";
      toast.error(message);
      console.error("Error switching bank:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAutoWithdrawalSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAutoWithdrawalSettingsAPI();
      if (data.status === 200) {
        setAutoWithdrawSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching auto-withdrawal settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAutoWithdrawalSettings = async (settings) => {
    setLoading(true);
    try {
      const data = await updateAutoWithdrawalSettingsAPI(settings);
      if (data.status === 200) {
        toast.success("Auto-withdrawal settings updated");
        setAutoWithdrawSettings(data.data);
        return true;
      } else {
        toast.error(data.message || "Update failed");
        return false;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    summary,
    transactions,
    history,
    pagination,
    fetchWalletSummary,
    fetchWalletHistory,
    requestWithdrawal,
    updateBankDetails,
    switchActiveBank,
    autoWithdrawSettings,
    fetchAutoWithdrawalSettings,
    updateAutoWithdrawalSettings,
  };
};
