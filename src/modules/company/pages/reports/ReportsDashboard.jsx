import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Receipt,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react";

import { useCompanyReportsManagement } from "../../companyhooks/useCompanyReportsManagement";
import Swal from "sweetalert2";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const ReportsDashboard = () => {
  const {
    invoices,
    salarySheets,
    loading,
    statistics,
    recentReports,
    filters,
    handleFilterChange,
    handleDeleteReport,
    handleExportReports,
    fetchInvoiceDetails,
    complianceDocs,
    fetchComplianceDocs,
  } = useCompanyReportsManagement();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Refresh compliance docs when date changes
  React.useEffect(() => {
    fetchComplianceDocs({
      from_date: filters.from_date,
      to_date: filters.to_date,
    });
  }, [filters.from_date, filters.to_date, fetchComplianceDocs]);

  // Tab configuration
  const tabs = [
    { id: "all", label: "All Reports", icon: FileText },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "salary-sheets", label: "Salary Sheets", icon: FileSpreadsheet },
    { id: "statutory", label: "Statutory Reports", icon: FileCheck },
  ];

  // Status options
  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { id: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-800" },
    {
      id: "available",
      label: "Available",
      color: "bg-green-100 text-green-800",
    },
    { id: "overdue", label: "Overdue", color: "bg-red-100 text-red-800" },
  ];

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleFilterChange("searchQuery", value);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    handleFilterChange("status", status);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    handleFilterChange("type", tabId);
  };

  // Handle view report
  const handleViewReport = async (report) => {
    if (report.invoice_number) {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const details = await fetchInvoiceDetails(report.id);
      Swal.close();

      if (!details) return;

      const itemsHtml =
        details.items && details.items.length > 0
          ? `
                <div class="border-t pt-3 mt-3">
                    <p class="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">Service Breakdown</p>
                    <div class="space-y-3">
                        ${details.items
                          .map(
                            (item) => `
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <p class="text-sm font-bold text-gray-800">${item.designation_name || "Designation"}</p>
                                        ${
                                          item.vacancy_workers_needed
                                            ? `
                                            <span class="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                Vacancy: ${item.vacancy_workers_needed} Workers • ${item.vacancy_rate_details}
                                            </span>
                                        `
                                            : ""
                                        }
                                    </div>
                                    <p class="text-[10px] text-gray-500 uppercase">${item.worker_count} Workers • ${item.total_days_worked} Days</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-black text-gray-700">₹${item.total_ctc?.toLocaleString()}</p>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `
          : "";

      Swal.fire({
        title: `Invoice #${report.invoice_number}`,
        html: `
            <div class="text-left space-y-4 font-sans">
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                    <p class="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Billing Period</p>
                    <p class="font-bold text-sm text-gray-800">${new Date(report.month_year).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Status</p>
                    <span class="px-2 py-0.5 text-[9px] font-black uppercase rounded-lg ${report.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">${report.status}</span>
                </div>
              </div>

              ${itemsHtml}
              
              <div class="border-t pt-3 space-y-2">
                <p class="text-[10px] text-gray-500 mb-1 font-black uppercase tracking-widest">Financial Summary</p>
                <div class="flex justify-between text-xs text-gray-500"><span>Gross Subtotal</span><span class="font-bold">₹${details.total_gross?.toLocaleString()}</span></div>
                <div class="flex justify-between text-xs text-gray-500"><span>Employer PF</span><span class="font-bold">₹${(details.total_pf ?? 0).toLocaleString()}</span></div>
                <div class="flex justify-between text-xs text-gray-500"><span>Employer ESI</span><span class="font-bold">₹${(details.total_esi ?? 0).toLocaleString()}</span></div>
                <div class="flex justify-between text-xs text-gray-500"><span>Employer Gratuity</span><span class="font-bold">₹${(details.total_gratuity ?? 0).toLocaleString()}</span></div>
                <div class="flex justify-between text-xs text-gray-500"><span>Service Charge</span><span class="font-bold">₹${details.service_charge_amount?.toLocaleString()}</span></div>
                <div class="flex justify-between text-xs text-gray-500"><span>GST (18%)</span><span class="font-bold">₹${details.tax_amount?.toLocaleString()}</span></div>
                <div class="flex justify-between font-black text-blue-600 pt-3 mt-1 border-t text-lg"><span>Grand Total</span><span>₹${details.total_amount?.toLocaleString()}</span></div>
              </div>
            </div>
          `,
        showCloseButton: true,
        showConfirmButton: false,
        width: "500px",
        customClass: {
          container: "font-sans",
          popup: "rounded-[2rem]",
        },
      });
    }
  };

  // Handle delete report
  const handleDelete = async (report, type) => {
    await handleDeleteReport(type, report.id);
  };

  // Get reports for current tab
  const getCurrentReports = () => {
    switch (activeTab) {
      case "invoices":
        return invoices;
      case "salary-sheets":
        return salarySheets;
      case "statutory":
        return complianceDocs;
      default:
        return [...invoices, ...salarySheets, ...complianceDocs];
    }
  };

  // Filter reports based on status
  const getFilteredReports = () => {
    let reports = getCurrentReports();

    if (selectedStatus !== "all") {
      reports = reports.filter((report) => {
        const isStatutory =
          !report.invoice_number &&
          report.file_path &&
          report.type !== "salary-sheet";
        if (selectedStatus === "available") {
          return report.status === "available" || isStatutory;
        }
        return report.status === selectedStatus;
      });
    }

    if (searchQuery) {
      reports = reports.filter(
        (report) =>
          (report.title &&
            report.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (report.invoice_number &&
            report.invoice_number
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (report.description &&
            report.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (report.type &&
            report.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (report.file_name &&
            report.file_name.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    return reports;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stats data
  const stats = [
    {
      title: "Total Invoices",
      value: statistics.totalInvoices || 0,
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      type: "invoices",
    },
    {
      title: "Salary Sheets",
      value: statistics.totalSalarySheets || 0,
      icon: FileSpreadsheet,
      color: "text-green-600",
      bgColor: "bg-green-100",
      type: "salary-sheets",
    },
    {
      title: "Company Expenses",
      value: formatCurrency(statistics.monthlyRevenue || 0),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      type: "revenue",
    },
  ];

  const filteredReports = getFilteredReports();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full px-4 md:px-8 py-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Company Reports
            </h1>
            <p className="text-gray-600 mt-2">
              Manage invoices, salary sheets, GST reports, and financial
              documents
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 border border-gray-200 rounded-xl shadow-sm">
            <div className="relative w-full sm:w-auto">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                From
              </span>
              <input
                type="date"
                value={filters.from_date || ""}
                onChange={(e) =>
                  handleFilterChange("from_date", e.target.value)
                }
                className="pl-14 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-[185px]"
              />
            </div>
            <div className="h-[1px] w-3 bg-gray-300 hidden sm:block" />
            <div className="relative w-full sm:w-auto">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                To
              </span>
              <input
                type="date"
                value={filters.to_date || ""}
                onChange={(e) => handleFilterChange("to_date", e.target.value)}
                className="pl-10 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-[175px]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    {/* <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span> */}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Reports List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs and Search */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Report
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading.invoices || loading.complianceDocs ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Loading reports...</p>
                      </td>
                    </tr>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const statusColor =
                        statusOptions.find((s) => s.id === report.status)
                          ?.color || "bg-gray-100 text-gray-800";
                      const isSalarySheet = report.type === "salary-sheet";
                      const isStatutory =
                        activeTab === "statutory" ||
                        (!isSalarySheet &&
                          !report.invoice_number &&
                          report.file_path);

                      return (
                        <tr
                          key={`${report.type || "report"}-${report.id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              {report.invoice_number ? (
                                <button
                                  onClick={() => handleViewReport(report)}
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all focus:outline-none text-left"
                                >
                                  {report.invoice_number}
                                </button>
                              ) : isStatutory ? (
                                <button
                                  onClick={() =>
                                    window.open(report.file_url, "_blank")
                                  }
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all focus:outline-none text-left"
                                >
                                  {report.file_name ||
                                    report.label ||
                                    "Untitled Document"}
                                </button>
                              ) : isSalarySheet ? (
                                <button
                                  onClick={() =>
                                    handleExportReports("salary-sheet", report)
                                  }
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all focus:outline-none text-left"
                                >
                                  {report.label ||
                                    report.file_name ||
                                    "Untitled Report"}
                                </button>
                              ) : (
                                <p className="font-medium text-gray-900">
                                  {report.label ||
                                    report.file_name ||
                                    "Untitled Report"}
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                {isStatutory
                                  ? report.type?.replace("_", " ")
                                  : report.type === "salary-sheet"
                                    ? "Salary Sheet"
                                    : "Invoice Report"}{" "}
                                •{" "}
                                {report.description ||
                                  (report.month_year
                                    ? `Period: ${new Date(report.month_year).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                                    : `Period: ${report.month}/${report.year}`)}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm">
                              {new Date(
                                report.report_date || report.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">
                              {report.total_amount
                                ? `₹${report.total_amount.toLocaleString()}`
                                : "-"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full capitalize ${isStatutory ? "bg-green-100 text-green-800" : statusColor}`}
                            >
                              {isStatutory ? "Available" : report.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {isStatutory ? (
                                <button
                                  onClick={() =>
                                    window.open(report.file_url, "_blank")
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Download Document"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              ) : isSalarySheet ? (
                                <button
                                  onClick={() =>
                                    handleExportReports("salary-sheet", report)
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Download Excel"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleViewReport(report)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No reports found</p>
                        {searchQuery && (
                          <p className="text-sm text-gray-400 mt-1">
                            Try changing your search query
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Showing {filteredReports.length} reports
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Summary and Recent Activity */}
        <div className="space-y-8">
          {/* Quick Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Invoices</p>
                    <p className="font-semibold">
                      {statistics.pendingInvoices || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Month's Salary</p>
                    <p className="font-semibold">Processed</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">✓ Done</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Expenses</p>
                    <p className="font-semibold">
                      {formatCurrency(statistics.monthlyRevenue || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {recentReports.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "invoice"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "invoice" && (
                        <Receipt className="w-4 h-4 text-blue-600" />
                      )}
                      {activity.type === "salary-sheet" && (
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          By: {activity.user || "System"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {recentReports.length === 0 && (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsDashboard;
