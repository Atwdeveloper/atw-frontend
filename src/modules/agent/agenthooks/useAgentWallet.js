import { useState, useEffect, useCallback, useRef } from "react";
import { getAgentWallet } from "../../../api/agent/agentWalletAPI";

export const useAgentWallet = () => {
  const [walletData, setWalletData] = useState({
    totalEarnings: 0,
    currency: "INR",
    lastUpdated: new Date().toISOString(),
    companyBreakdown: [],
    workerBreakdown: [],
    pendingAmount: 0,
    pendingCompanies: [],
    summary: {
      company_total: 0,
      worker_total: 0,
      grand_total: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const abortPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Format ISO date to YYYY-MM-DD
  const formatDateFromApi = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  };

  // Safely convert amount to number
  const normalizeAmount = (val) => parseFloat(val || 0);

  // Transform API response into component-friendly shape
  const transformWalletData = (apiResponse) => {
    const { commissions = [], summary = {} } = apiResponse;

    // ✅ CORRECT
    const pendingItems = commissions.filter(
      (item) => item.status === "pending",
    );
    const paidItems = commissions.filter((item) => item.status === "paid");

    // Calculate totals
    const paidAmount = paidItems.reduce(
      (sum, item) => sum + normalizeAmount(item.amount),
      0,
    );
    const pendingAmount = pendingItems.reduce(
      (sum, item) => sum + normalizeAmount(item.amount),
      0,
    );
    const totalEarnings = paidAmount + pendingAmount;

    // Company breakdown (paid companies)
    const companyBreakdown = paidItems
      .filter((item) => item.type === "company")
      .map((item) => ({
        companyId: item.id,
        companyName: item.name,
        amount: normalizeAmount(item.amount),
        paidDate: formatDateFromApi(item.created_at) || "N/A",
      }));

    // Worker breakdown (paid workers)
    const workerBreakdown = paidItems
      .filter((item) => item.type === "worker")
      .map((item) => ({
        workerId: item.id,
        workerName: item.name,
        amount: normalizeAmount(item.amount),
        paidDate: formatDateFromApi(item.created_at) || "N/A",
      }));

    // Pending items (both company and worker)
    const pendingCompanies = pendingItems.map((item) => ({
      name: item.name,
      amount: normalizeAmount(item.amount),
      expectedDate: formatDateFromApi(item.created_at) || "TBD",
      type: item.type,
    }));

    const company_total = companyBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const worker_total = workerBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const grand_total = paidAmount;

    return {
      totalEarnings,
      currency: "INR",
      lastUpdated: new Date().toISOString(),
      companyBreakdown,
      workerBreakdown,
      pendingAmount,
      pendingCompanies,
      summary: {
        company_total,
        worker_total,
        grand_total,
        available_balance: normalizeAmount(summary.available_balance),
      },
    };
  };

  const fetchWallet = useCallback(async () => {
    abortPreviousRequest();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setError(null);

    try {
      // Pass signal to the API function (if supported)
      const response = await getAgentWallet({ signal });

      if (!isMountedRef.current || signal.aborted) return;

      const transformed = transformWalletData(response);
      setWalletData(transformed);
    } catch (err) {
      if (err.name !== "AbortError" && isMountedRef.current) {
        console.error("Error fetching wallet:", err);
        setError(
          err.message || "Failed to load wallet data. Please try again.",
        );
      }
    } finally {
      if (isMountedRef.current && !signal.aborted) {
        setLoading(false);
      }
    }
  }, [abortPreviousRequest]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchWallet();

    return () => {
      isMountedRef.current = false;
      abortPreviousRequest();
    };
  }, [fetchWallet, abortPreviousRequest]);

  const refetch = useCallback(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    walletData,
    loading,
    error,
    refetch,
  };
};
