import { useState, useEffect } from "react";
import { getCompanyDashboardAPI } from "../../../api/company/companyDashboardAPI";

const useCompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getCompanyDashboardAPI();

        if (response.status === 200) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { dashboardData, loading, error };
};

export default useCompanyDashboard;
