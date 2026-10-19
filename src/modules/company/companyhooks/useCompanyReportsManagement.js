import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getInvoicesAPI,
  getSalarySheetsAPI,
  deleteInvoiceAPI,
  deleteSalarySheetAPI,
  getReportStatisticsAPI,
  getRecentReportsAPI,
  exportSalarySheetAPI,
  getInvoiceByIdAPI,
  downloadInvoiceAPI,
  getComplianceDocumentsAPI,
} from "../../../api/company/companyReportsAPI";

/**
 * Custom hook for managing company reports
 * Handles fetching, filtering, and basic operations for all report types
 */
export const useCompanyReportsManagement = () => {
  // State for all reports
  const [invoices, setInvoices] = useState([]);
  const [salarySheets, setSalarySheets] = useState([]);
  const [complianceDocs, setComplianceDocs] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({
    invoices: false,
    salarySheets: false,
    statistics: false,
    complianceDocs: false,
  });

  // Statistics and recent reports
  const [statistics, setStatistics] = useState({
    totalInvoices: 0,
    totalSalarySheets: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
  });

  const [recentReports, setRecentReports] = useState([]);

  const getFirstDayOfMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-01`;
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;
  };

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    type: "all",
    status: "all",
    searchQuery: "",
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    year: new Date().getFullYear().toString(),
    from_date: getFirstDayOfMonth(),
    to_date: getLastDayOfMonth(),
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    invoices: { page: 1, totalPages: 1, totalItems: 0 },
    salarySheets: { page: 1, totalPages: 1, totalItems: 0 },
  });

  // Fetch all types of reports
  const fetchAllReports = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, invoices: true, salarySheets: true }));

      const [invoicesRes, salarySheetsRes] = await Promise.all([
        getInvoicesAPI({ page: pagination.invoices.page, ...filters }),
        getSalarySheetsAPI({ page: pagination.salarySheets.page, ...filters }),
      ]);

      setInvoices(invoicesRes.data?.data || []);
      setSalarySheets(salarySheetsRes.data || []);

      // Update pagination info
      setPagination((prev) => ({
        ...prev,
        invoices: {
          ...prev.invoices,
          totalPages: invoicesRes.data?.last_page || 1,
          totalItems: invoicesRes.data?.total || 0,
        },
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load reports. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, invoices: false, salarySheets: false }));
    }
  }, [pagination.invoices.page, pagination.salarySheets.page, filters]);

  // Fetch dashboard statistics and recent reports
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, statistics: true }));

      const [statsRes, recentRes] = await Promise.all([
        getReportStatisticsAPI(filters),
        getRecentReportsAPI({ ...filters, limit: 10 }),
      ]);

      setStatistics(statsRes.data || {});
      setRecentReports(recentRes.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, statistics: false }));
    }
  }, [filters]);

  // Handle report deletion
  const handleDeleteReport = useCallback(
    async (type, id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `This ${type} will be permanently deleted!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return false;

      try {
        let response;
        switch (type) {
          case "invoice":
            response = await deleteInvoiceAPI(id);
            setInvoices((prev) => prev.filter((item) => item.id !== id));
            break;
          case "salary-sheet":
            response = await deleteSalarySheetAPI(id);
            setSalarySheets((prev) => prev.filter((item) => item.id !== id));
            break;
          default:
            throw new Error("Invalid report type");
        }

        // Update statistics after deletion
        fetchDashboardData();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${type.replace("-", " ")} has been deleted.`,
          timer: 2000,
          showConfirmButton: false,
        });

        return true;
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to delete ${type}. Please try again.`,
        });
        return false;
      }
    },
    [fetchDashboardData],
  );

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback((reportType, page) => {
    setPagination((prev) => ({
      ...prev,
      [reportType]: {
        ...prev[reportType],
        page,
      },
    }));
  }, []);

  // Export reports
  const handleExportReports = useCallback(async (type, report = null) => {
    try {
      if (type === "salary-sheet" && report) {
        Swal.fire({
          title: "Generating Report...",
          text: "Please wait while we prepare your salary sheet.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await exportSalarySheetAPI({
          year: report.year,
          month: report.month,
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const fileName = `SalarySheet_${report.label.replace(/\s+/g, "_")}.xlsx`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        Swal.close();
        return true;
      }

      if (type === "invoice" && report) {
        Swal.fire({
          title: "Downloading Invoice...",
          text: "Please wait while we prepare your PDF.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await downloadInvoiceAPI(report.id);

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" }),
        );
        const link = document.createElement("a");
        link.href = url;
        const fileName = `Invoice_${report.invoice_number}.pdf`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        Swal.close();
        return true;
      }

      // Default export logic
      Swal.fire({
        icon: "info",
        title: "Exporting...",
        text: `Preparing ${type} export`,
        showConfirmButton: false,
        timer: 1500,
      });

      return true;
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Failed to generate export. Please try again.",
      });
      return false;
    }
  }, []);

  // Fetch specific invoice details
  const fetchInvoiceDetails = useCallback(async (id) => {
    try {
      const response = await getInvoiceByIdAPI(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      return null;
    }
  }, []);

  // Fetch compliance documents
  const fetchComplianceDocs = useCallback(async (params = {}) => {
    try {
      setLoading((prev) => ({ ...prev, complianceDocs: true }));

      const response = await getComplianceDocumentsAPI(params);

      const docs = response.data || [];
      setComplianceDocs(docs);
      return docs;
    } catch (error) {
      console.error("Error fetching compliance docs:", error);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, complianceDocs: false }));
    }
  }, []);

  // Effects to fetch data
  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // State
    invoices,
    salarySheets,
    loading,
    statistics,
    recentReports,
    filters,
    pagination,

    // Actions
    fetchAllReports,
    fetchDashboardData,
    handleDeleteReport,
    handleFilterChange,
    handlePageChange,
    handleExportReports,
    fetchInvoiceDetails,
    complianceDocs,
    fetchComplianceDocs,
  };
};
