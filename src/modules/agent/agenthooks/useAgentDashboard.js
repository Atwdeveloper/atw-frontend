// hooks/useAgentDashboard.js
import { useState, useEffect } from "react";
import { getAgentDashboardAPI } from "../../../api/agent/agentCompanyAPI"; // adjust path

export const useAgentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(false);
        const response = await getAgentDashboardAPI();
        // response = { success: true, data: {...}, message }
        setData(response.data); // extract the actual dashboard data
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
