import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  PhoneCall,
  Mail,
  FileText,
  ChevronDown,
  Weight,
  IndianRupee,
  Circle,
  Layers2,
  Shield,
  Receipt,
  FileSignature,
  FileCheck,
  Download,
  X,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  File,
  Image,
  Upload,
  Wallet,
  User,
  Trash2,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../common/utils/motionVariants";
import { useWorkerJob } from "../workerhooks/useWorkerJob";
import { useWorkerDocuments } from "../workerhooks/useWorkerDocuments";
import Swal from "sweetalert2";

import { useWorkerWallet } from "../workerhooks/useWorkerWallet";
import Loader from "../../../common/components/Loader";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../common/hooks/useAuth";
import JobDetailsModal from "../components/JobDetailsModal";
import ConfirmApplicationModal from "../components/ConfirmApplicationModal";
import { getSalarySlipDownloadAPI } from "../../../api/worker/workerAPI";
import { getWorkerFaceStatusAPI } from "../../../api/worker/workerAuthAPI";

// Remind once per browser session, so skipping doesn't nag on every visit.
const FACE_REMINDER_KEY = "faceReminderShown";

const WorkerDashboard = () => {
  const {
    jobs,
    appliedJobIds,
    appliedJobs,
    loading,
    cities,
    loadingFilters,
    filters,
    nearby,
    setFilter,
    clearFilters,
    handleApply,
    refreshAppliedJobs,
    sortOrder,
    setSortOrder,
  } = useWorkerJob();

  // Documents hook
  const {
    loading: docsLoading,
    combinedData,
    uploadingId,
    previewModal,
    handleUpload,
    handleDelete,
    openPreview,
    closePreview,
    handleWorkerPreview,
    handleWorkerDownload,
  } = useWorkerDocuments();

  // Wallet hook
  const {
    summary: walletSummary,
    transactions: walletTransactions,
    loading: walletLoading,
    fetchWalletSummary,
    fetchWalletHistory,
  } = useWorkerWallet();

  const navigate = useNavigate();
  const { profile } = useOutletContext();
  const { user } = useAuth();

  // Face enrolment is optional, so anyone who skipped it during registration
  // gets one nudge per session with a direct way to finish it.
  useEffect(() => {
    if (sessionStorage.getItem(FACE_REMINDER_KEY)) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getWorkerFaceStatusAPI();
        const enrolled = res?.data?.enrolled ?? res?.enrolled;
        if (cancelled || enrolled !== false) return;

        sessionStorage.setItem(FACE_REMINDER_KEY, "1");
        const result = await Swal.fire({
          icon: "info",
          title: "Verify your face",
          text: "Register your face to mark attendance instantly at work. It only takes a few seconds.",
          showCancelButton: true,
          confirmButtonText: "Verify now",
          cancelButtonText: "Maybe later",
          confirmButtonColor: "#2563eb",
        });
        if (result.isConfirmed) navigate("/worker/face-registration");
      } catch {
        /* a failed status check should never block the dashboard */
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [jobToConfirm, setJobToConfirm] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const filterDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentUploadingTypeId, setCurrentUploadingTypeId] = useState(null);

  const triggerUpload = (typeId) => {
    setCurrentUploadingTypeId(typeId);
    setTimeout(() => {
      if (fileInputRef.current) fileInputRef.current.click();
    }, 100);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUploadingTypeId) {
      await handleUpload(currentUploadingTypeId, file);
      e.target.value = "";
      setCurrentUploadingTypeId(null);
    }
  };

  // Active tab: "jobs", "wallet", "documents"
  const [activeTab, setActiveTab] = useState("jobs");
  const [docTab, setDocTab] = useState("professional");
  // const [profile, setProfile] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11 for initial, but I'll use 1-12 for logic
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const isMonthDisabled = (monthValue) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && monthValue > currentMonth) return true;

    if (profile?.date_of_joining) {
      const joiningDate = new Date(profile.date_of_joining);
      const joiningYear = joiningDate.getFullYear();
      const joiningMonth = joiningDate.getMonth() + 1;

      if (selectedYear < joiningYear) return true;

      if (selectedYear === joiningYear && monthValue < joiningMonth)
        return true;
    }

    return false;
  };
  const handleViewPayslip = async () => {
    try {
      const response = await getSalarySlipDownloadAPI(
        selectedYear,
        selectedMonth,
      );

      if (response.data instanceof Blob) {
        const text = await response.data.text();

        try {
          const json = JSON.parse(text);
          if (!json.success) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: json.message || "Salary slip not found",
            });
            return;
          }

          if (json.data && typeof json.data === "string") {
            const blob = new Blob([json.data], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 100);
            return;
          }
        } catch (e) {
          if (
            text.trim().startsWith("<!DOCTYPE") ||
            text.trim().startsWith("<html")
          ) {
            const blob = new Blob([text], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 100);
            return;
          }
        }

        // If we reach here, unknown blob content
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid response from server",
        });
        return;
      }

      if (!response.success) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.message || "Salary slip not found",
        });
        return;
      }

      const htmlContent = response.data;
      if (!htmlContent || typeof htmlContent !== "string") {
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: "No payslip content received.",
        });
        return;
      }

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error fetching payslip:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };
  useEffect(() => {
    if (activeTab === "wallet") {
      fetchWalletSummary();
      fetchWalletHistory({ limit: 5 });
    }
  }, [activeTab, fetchWalletSummary, fetchWalletHistory]);

  // Status filter (All / Applied)
  const [statusFilter, setStatusFilter] = useState("all");
  const statusOptions = [
    { key: "all", label: "All Jobs" },
    { key: "applied", label: "Applied" },
  ];

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput.length >= 2 || searchInput.length === 0) {
        setFilter("search", searchInput);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchInput, setFilter]);

  // Work types
  const workTypes = [
    { id: "hourly", label: "Hourly", icon: <Clock size={16} /> },
    { id: "daily", label: "Daily", icon: <Calendar size={16} /> },
    { id: "salary", label: "Monthly", icon: <IndianRupee size={16} /> },
    { id: "kg", label: "Per Kg", icon: <Weight size={16} /> },
    { id: "gram", label: "Per Gram", icon: <Circle size={16} /> },
    { id: "pcs", label: "Per Piece", icon: <Layers2 size={16} /> },
  ];

  const getFilteredJobs = () => {
    if (statusFilter === "applied") {
      return appliedJobs
        .filter((item) => item.vacancy_details !== null)
        .map((item) => ({
          ...item.vacancy_details,
          application_status: item.status,
          is_applied: true,
          applied_at: item.applied_at,
          application_id: item.id,
        }));
    }
    return jobs;
  };
  const filteredJobs = getFilteredJobs();

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyClick = (job) => {
    setJobToConfirm(job);
    setShowConfirmModal(true);
  };

  const confirmApplication = async () => {
    if (!jobToConfirm) return;
    setShowConfirmModal(false);
    await handleApply(jobToConfirm.id);
    setJobToConfirm(null);
  };

  const cancelConfirmation = () => {
    setShowConfirmModal(false);
    setJobToConfirm(null);
  };

  const handleClearAll = () => {
    setFilter("jobType", "all");
    setFilter("place", "all");
    setFilter("search", "");
    setFilter("nearby", false);
    setFilter("nearby", false);
    setStatusFilter("all");
    setSortOrder("newest");
    setShowFilterDropdown(false);
  };

  const formatRate = (job) => {
    if (!job.base_rate) return "N/A";
    if (job.rate_type === "salary") return `₹${job.base_rate} / Month`;
    const unitMap = {
      hourly: "Hour",
      daily: "Day",
      pcs: "Pcs",
      gram: "Gram",
      kg: "Kg",
    };
    const unit = unitMap[job.rate_type] || job.rate_type;
    return `₹${job.base_rate} / ${unit}`;
  };
  const formatShift = (vacancy) => {
    if (vacancy.shiftStart && vacancy.shiftEnd) {
      const start = vacancy.shiftStart.substring(0, 5);
      const end = vacancy.shiftEnd.substring(0, 5);
      return `${start} – ${end}`;
    }
    return "N/A";
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return File;
    const extension = fileUrl.split(".").pop().toLowerCase();
    const iconMap = {
      jpg: Image,
      jpeg: Image,
      png: Image,
      gif: Image,
      svg: Image,
      webp: Image,
      pdf: FileText,
      doc: FileText,
      docx: FileText,
      txt: FileText,
      rtf: FileText,
      xls: FileSpreadsheet,
      xlsx: FileSpreadsheet,
      csv: FileSpreadsheet,
      ppt: File,
      pptx: File,
      mp3: FileAudio,
      wav: FileAudio,
      ogg: FileAudio,
      mp4: FileVideo,
      avi: FileVideo,
      mov: FileVideo,
      mkv: FileVideo,
      zip: FileArchive,
      rar: FileArchive,
      "7z": FileArchive,
      tar: FileArchive,
      gz: FileArchive,
    };
    return iconMap[extension] || File;
  };

  // Render Jobs view
  const renderJobsView = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="border-b border-gray-300 mb-4 w-full">
          <div className="flex items-center gap-8">
            {/* NEAR ME */}
            <button
              onClick={() => {
                setFilter("nearby", true);
                setStatusFilter("all");
              }}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                nearby
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              NEAR ME
            </button>
            {/* ALL JOBS */}
            <button
              onClick={() => {
                setFilter("nearby", false);
                setStatusFilter("all");
              }}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                !nearby && statusFilter === "all"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ALL JOBS
            </button>

            {/* APPLIED JOBS */}
            <button
              onClick={async () => {
                setStatusFilter("applied");
                setFilter("nearby", false);
                await refreshAppliedJobs();
              }}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                statusFilter === "applied"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              APPLIED JOBS
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div ref={filterDropdownRef} className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition ${
                showFilterDropdown
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              <span>Filter</span>
              {(filters.jobType !== "all" ||
                filters.place !== "all" ||
                filters.search ||
                nearby ||
                statusFilter !== "all") && (
                <span className="ml-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {(filters.jobType !== "all" ? 1 : 0) +
                    (filters.place !== "all" ? 1 : 0) +
                    (filters.search ? 1 : 0) +
                    (nearby ? 1 : 0) +
                    (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showFilterDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Dropdown Panel */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Filter Jobs</h3>
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Status Toggle */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-2">
                      Application Status
                    </label>
                    <div className="flex gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => setStatusFilter(option.key)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            statusFilter === option.key
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Work Type */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-2">
                      Job Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {workTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFilter(
                              "jobType",
                              filters.jobType === type.id ? "all" : type.id,
                            )
                          }
                          className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                            filters.jobType === type.id
                              ? "bg-blue-100 border border-blue-300 text-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {type.icon}
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-2">
                      Sort By
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortOrder("newest")}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-sm ${
                          sortOrder === "newest"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        Newest
                      </button>

                      <button
                        onClick={() => setSortOrder("oldest")}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-sm ${
                          sortOrder === "oldest"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        Oldest
                      </button>
                    </div>
                  </div>

                  {/* City (disabled when nearby active) */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      Location
                    </label>
                    <select
                      value={filters.place !== "all" ? filters.place : ""}
                      onChange={(e) =>
                        setFilter("place", e.target.value || "all")
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={loadingFilters || nearby}
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {nearby && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ Showing jobs near your location
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}

      {/* Job Cards */}
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try changing your filters or search term
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                profile={profile}
                onApply={handleApplyClick}
                applied={appliedJobIds.includes(job.id)}
                setSelectedJob={setSelectedJob}
                setShowJobDetails={setShowJobDetails}
                formatShift={formatShift}
                formatRate={formatRate}
              />
            ))
          )}
        </div>
      </div>
    </>
  );

  // Render Wallet view
  const renderWalletView = () => {
    if (walletLoading && !walletSummary) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    const earnings = walletSummary?.thisMonthEarnings || 0;
    const paid = walletSummary?.thisMonthPaid || 0;
    const balance = walletSummary?.withdrawableBalance ?? 0;
    const holdAmount = walletSummary?.holdAmount || 0;
    return (
      <>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <p className="text-sm font-medium opacity-90">
              Total Earnings (This Month)
            </p>
            <p className="text-3xl font-bold mt-1">
              ₹{earnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs opacity-80 mt-2">Updated just now</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹
                    {paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wallet size={18} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Wallet Balance</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹
                    {balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {holdAmount > 0 && (
                    <p className="text-[10px] text-amber-600 font-bold mt-0.5">
                      (₹
                      {holdAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      on hold)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {walletSummary?.activeHolds?.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <Shield size={14} className="text-amber-600" />
                <span>On-Hold Fund Details</span>
              </div>
              <div className="space-y-1.5">
                {walletSummary.activeHolds.map((hold) => (
                  <div
                    key={hold.id}
                    className="flex justify-between items-center bg-white border border-amber-100/60 rounded-lg p-3 text-xs shadow-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-700">{hold.reason}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                        {hold.created_at}
                      </p>
                    </div>
                    <span className="font-black text-amber-700 pl-3 shrink-0">
                      -₹
                      {hold.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Recent Earnings</h3>
              <button
                onClick={() => navigate("/worker/wallet")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {walletTransactions.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">
                  No recent transactions
                </div>
              ) : (
                walletTransactions.map((txn, idx) => (
                  <div
                    key={txn.id || idx}
                    className="px-6 py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {txn.type === "credit"
                          ? txn.source === "daily_wage"
                            ? "Daily Earning"
                            : "Wallet Credit"
                          : txn.source === "permanent_deduction"
                            ? "Deduction"
                            : txn.source === "auto_payout_fee"
                              ? "Processing Fee"
                              : "Wallet Withdrawal"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {txn.source === "permanent_deduction"
                          ? txn.hold_reason
                            ? `Reason: ${txn.hold_reason}`
                            : "Held Funds Deduction"
                          : new Date(txn.transaction_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                      </p>
                      {txn.source === "permanent_deduction" && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(txn.transaction_date).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {txn.company_name && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-medium">
                            <span className="mr-1">CMP:</span>
                            {txn.company_name}
                          </span>
                        )}

                        {txn.reference_id && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                            <span className="mr-1">TXN:</span>
                            {txn.reference_id}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${txn.type === "credit" ? "text-gray-800" : "text-red-600"}`}
                      >
                        {txn.type === "credit" ? "+" : "-"} ₹
                        {parseFloat(txn.amount).toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          txn.source === "permanent_deduction"
                            ? "bg-red-50 text-red-700"
                            : txn.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : txn.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.source === "permanent_deduction"
                          ? "Deducted"
                          : txn.status.charAt(0).toUpperCase() +
                            txn.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/worker/wallet")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <IndianRupee size={18} /> Go to Full Wallet
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <FileText size={18} /> View Payslip
            </button>
          </div>
        </div>
      </>
    );
  };

  // Documents view (unchanged)
  // Documents view
  const renderDocumentsView = () => {
    // Filter by category and exclude those that are handled as automatic
    const automaticNames = [
      "Pay Slip",
      "Offer Letter",
      "ESIC TIC Report",
      "FORM 26AS",
    ];

    const getUploadedDocByName = (name) => {
      return (
        combinedData.find((item) => item.type?.name === name)?.document || null
      );
    };

    const professionalDocs = [
      { type: { name: "Pay Slip", isAutomatic: true, id: "auto_payslip" } },
      {
        type: { name: "Offer Letter", isAutomatic: true, id: "auto_offer" },
        document: getUploadedDocByName("Offer Letter"),
      },
      {
        type: { name: "ESIC TIC Report", isAutomatic: true, id: "auto_esic" },
        document: getUploadedDocByName("ESIC TIC Report"),
      },
      {
        type: { name: "FORM 26AS", isAutomatic: true, id: "auto_form26as" },
        document: getUploadedDocByName("FORM 26AS"),
      },
      ...combinedData.filter(
        (item) =>
          item.type?.category?.toLowerCase() === "professional" &&
          !automaticNames.includes(item.type?.name) &&
          item.type?.name !== "Annual Salary Report",
      ),
    ];

    const personalDocs = combinedData.filter(
      (item) =>
        item.type?.category?.toLowerCase() === "personal" &&
        item.type?.name !== "Annual Salary Report",
    );

    if (docsLoading && !combinedData.length) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
          <p className="text-gray-600 text-sm">
            Manage your personal and professional documents
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setDocTab("professional")}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                docTab === "professional"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Briefcase size={18} />
              Professional Documents ({professionalDocs.length})
            </button>
            <button
              onClick={() => setDocTab("personal")}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                docTab === "personal"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User size={18} />
              Personal Documents ({personalDocs.length})
            </button>
          </nav>
        </div>

        {/* Content based on sub-tab */}
        {docTab === "professional" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Document Type
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {professionalDocs.map((item) => (
                    <tr
                      key={item.type.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${item.type.isAutomatic ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            {item.type.name === "Pay Slip" ? (
                              <Receipt size={18} />
                            ) : item.type.name === "Offer Letter" ? (
                              <FileSignature size={18} />
                            ) : item.type.name === "ESIC TIC Report" ? (
                              <FileCheck size={18} />
                            ) : item.type.name === "FORM 26AS" ? (
                              <FileText size={18} />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {item.type.name}
                            </p>
                            {item.type.isAutomatic && (
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                Generated Document
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.type.name === "Pay Slip" ? (
                          <div className="flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                              <select
                                value={selectedYear}
                                onChange={(e) =>
                                  setSelectedYear(parseInt(e.target.value))
                                }
                                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                              >
                                {years.map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                              <div className="w-[1px] h-3 bg-gray-200" />
                              <select
                                value={selectedMonth}
                                onChange={(e) =>
                                  setSelectedMonth(parseInt(e.target.value))
                                }
                                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                              >
                                <option value="">Month</option>
                                {months.map((m) => (
                                  <option
                                    key={m.value}
                                    value={m.value}
                                    disabled={isMonthDisabled(m.value)}
                                  >
                                    {m.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={handleViewPayslip}
                              disabled={
                                !selectedMonth || isMonthDisabled(selectedMonth)
                              }
                              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-200 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95"
                            >
                              <Eye size={14} /> View
                            </button>
                          </div>
                        ) : item.type.isAutomatic && !item.document ? (
                          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            Not Uploaded
                          </span>
                        ) : item.document ? (
                          <button
                            onClick={() => openPreview(item.document.file_url)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-blue-600 hover:text-blue-800 hover:border-blue-200 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                          >
                            <Eye size={14} />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => triggerUpload(item.type.id)}
                            disabled={uploadingId === item.type.id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-green-600 hover:text-green-800 hover:border-green-200 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                          >
                            {uploadingId === item.type.id ? (
                              <Loader size={14} />
                            ) : (
                              <Upload size={14} />
                            )}
                            <span>
                              {uploadingId === item.type.id
                                ? "Uploading..."
                                : "Upload"}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Document Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {personalDocs.map((item) => (
                    <tr
                      key={item.type.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {item.type.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.document ? (
                          item.document.status === "approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : item.document.status === "rejected" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not Uploaded
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {item.document && (
                            <button
                              // onClick={() =>
                              //   openPreview(item.document.file_url)
                              // }
                              onClick={() =>
                                handleWorkerPreview(item.document.id)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => triggerUpload(item.type.id)}
                            disabled={uploadingId === item.type.id}
                            className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                            title={item.document ? "Replace" : "Upload"}
                          >
                            {uploadingId === item.type.id ? (
                              <Loader size={18} />
                            ) : (
                              <Upload size={18} />
                            )}
                          </button>
                          {item.document && (
                            <button
                              onClick={() => handleDelete(item.document.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <Shield size={16} />
            <strong>Note:</strong> Uploaded documents are securely stored and
            only shared with verified employers when you apply.
          </p>
        </div>
      </div>
    );
  };

  const renderPreviewModal = () => {
    if (!previewModal.isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <button
              onClick={closePreview}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {previewModal.fileType === "image" ? (
              <img
                src={previewModal.fileUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] mx-auto object-contain"
              />
            ) : previewModal.fileType === "pdf" ? (
              <iframe
                src={`${previewModal.fileUrl}#view=FitH`}
                title="PDF Preview"
                className="w-full h-[70vh]"
              />
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  Preview not available for this file type.
                </p>
                <a
                  href={previewModal.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  <Download size={18} /> Download File
                </a>
              </div>
            )}
          </div>
          <div className="p-4 border-t flex justify-end">
            {/* <a
              href={previewModal.fileUrl}
              download
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <Download size={16} /> Download
            </a> */}
            <button
              onClick={() => handleWorkerDownload(previewModal.documentId)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <Download size={16} /> Download
            </button>{" "}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !jobs.length && activeTab === "jobs") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className=" bg-gray-50 p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Worker greeting + profile photo */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-md shrink-0">
            {profile?.worker?.enroll_image ||
            profile?.enroll_image ||
            profile?.photo ? (
              <img
                src={
                  profile.worker?.enroll_image ||
                  profile.enroll_image ||
                  profile.photo
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={26} className="text-white" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Hi, {profile?.first_name || user?.first_name || "Worker"}
            </p>
            {profile?.worker_code && (
              <p className="text-xs text-gray-500">{profile.worker_code}</p>
            )}
          </div>
        </div>

        {/* Persistent Tab Bar */}
        <div className="mb-8 border-b border-gray-200 gap-12">
          {/* <div className="flex justify-center space-x-12"> */}
          <div className="flex justify-between sm:justify-center gap-2 sm:gap-12 overflow-x-auto">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`py-3 px-4 text-lg font-medium border-b-2 transition-all w-full flex items-center justify-center ${
                activeTab === "jobs"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase size={22} /> Available Jobs
              </div>
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`py-3 px-4 text-lg font-medium border-b-2 transition-all w-full flex items-center justify-center ${
                activeTab === "wallet"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <IndianRupee size={22} /> Wallet
              </div>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-3 px-4 text-lg font-medium border-b-2 transition-all w-full flex items-center justify-center ${
                activeTab === "documents"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={22} /> Documents
              </div>
            </button>
          </div>
        </div>

        {activeTab === "jobs" && renderJobsView()}
        {/* {activeTab === "jobs" &&
          (profile?.kyc_approved ? (
            renderJobsView()
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white border border-red-200 rounded-2xl shadow-sm px-8 py-10 text-center max-w-md">
                <XCircle size={50} className="text-red-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Access Denied
                </h2>

                <p className="text-gray-600">
                  To access the application, the worker must upload all the
                  required documents for KYC verification. Once the documents
                  are reviewed and approved by the Admin, full access to the
                  application will be granted.
                </p>
              </div>
            </div>
          ))} */}
        {activeTab === "wallet" && renderWalletView()}
        {/* {activeTab === "wallet" &&
          (profile?.kyc_approved ? (
            renderWalletView()
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white border border-red-200 rounded-2xl shadow-sm px-8 py-10 text-center max-w-md">
                <XCircle size={50} className="text-red-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Access Denied
                </h2>

                <p className="text-gray-600">
                  To access the application, the worker must upload all the
                  required documents for KYC verification. Once the documents
                  are reviewed and approved by the Admin, full access to the
                  application will be granted.
                </p>
              </div>
            </div>
          ))} */}
        {activeTab === "documents" && renderDocumentsView()}
      </div>

      <AnimatePresence>
        {showJobDetails && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setShowJobDetails(false)}
            onApply={handleApplyClick}
            applied={appliedJobIds.includes(selectedJob?.id)}
          />
        )}
        {showConfirmModal && (
          <ConfirmApplicationModal
            job={jobToConfirm}
            onConfirm={confirmApplication}
            onCancel={cancelConfirmation}
            formatRate={formatRate}
          />
        )}
        {renderPreviewModal()}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
      />
    </motion.div>
  );
};

const JobCard = ({
  job,
  profile,
  onApply,
  applied,
  setSelectedJob,
  setShowJobDetails,
  formatRate,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate net working hours after subtracting unpaid break duration
  const calculateNetShiftHours = (
    shiftStart,
    shiftEnd,
    breakType,
    breakDurationMinutes,
  ) => {
    if (!shiftStart || !shiftEnd) return "";

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    let startMinutes = toMinutes(shiftStart);
    let endMinutes = toMinutes(shiftEnd);
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    let totalShiftMinutes = endMinutes - startMinutes;

    // Subtract break only if unpaid and breakDurationMinutes is a positive number
    if (
      breakType === "unpaid" &&
      breakDurationMinutes &&
      breakDurationMinutes > 0
    ) {
      totalShiftMinutes -= breakDurationMinutes;
    }

    const hours = Math.floor(totalShiftMinutes / 60);
    const minutes = totalShiftMinutes % 60;
    if (minutes === 0) return `${hours} hr${hours !== 1 ? "s" : ""}`;
    return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min`;
  };
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";

    return new Date(dateTime).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const isFull = job.accepted_count >= job.number_of_workers;
  const remainingWorkers =
    (job.number_of_workers || 0) - (job.accepted_count || 0);
  const netHours = calculateNetShiftHours(
    job.shift_start_time,
    job.shift_end_time,
    job.break_type,
    job.break_duration_minutes,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            {/* <h3 className="text-xl font-bold text-gray-900 mb-2">
              {job.designation}
            </h3> */}
            <h3 className="flex items-center flex-wrap gap-2 text-xl font-bold text-gray-900 mb-2">
              <span>{job.designation}</span>

              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                VAC-{job.id}
              </span>
            </h3>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {job.company_name || "N/A"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Clock size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="text-sm font-medium">
                    {job.shift_start_time && job.shift_end_time
                      ? `${job.shift_start_time.slice(0, 5)} - ${job.shift_end_time.slice(0, 5)}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Clock size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Hours</p>
                  <p className="text-sm font-medium">{netHours}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <DollarSign size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rate</p>
                  <p className="text-sm font-medium">{formatRate(job)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Users size={14} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Workers</p>
                  <p className="text-sm font-medium">{job.number_of_workers}</p>
                  <p
                    className={`text-xs font-medium ${remainingWorkers > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {remainingWorkers > 0
                      ? `${remainingWorkers} left`
                      : "filled"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <MapPin size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{job.city}</p>
                </div>
              </div>
            </div>
            {job.notes_to_workers && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Job Description
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {job.notes_to_workers}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              {job.schedules?.[0]?.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Start: {formatDate(job.schedules[0].start_date)}
                </span>
              )}

              {job.is_applied && job.applied_at && (
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} />
                  Applied: {formatDateTime(job.applied_at)}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[120px]">
            {isFull ? (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                <p className="text-gray-600 font-medium text-sm">
                  Positions Filled
                </p>
              </div>
            ) : !applied ? (
              <button
                onClick={() => {
                  setSelectedJob(job);
                  setShowJobDetails(true);
                }}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Apply Now
              </button>
            ) : (
              <div className="bg-green-50 border flex items-center justify-center border-green-200 rounded-lg p-3 text-center">
                <CheckCircle size={20} className="text-green-600 mr-2" />
                <p className="text-green-700 font-medium text-sm">Applied</p>
              </div>
            )}
            <button
              onClick={() => {
                if (profile?.support_phone) {
                  window.location.href = `tel:${profile.support_phone}`;
                }
              }}
              className="w-full border border-blue-300 hover:bg-blue-50 text-blue-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} /> Call
            </button>
            {/* <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Confirmation via:
              </p>
              <div className="flex justify-center gap-2 mt-1">
                <MessageCircle size={14} className="text-green-600" />
                <PhoneCall size={14} className="text-blue-600" />
                <Mail size={14} className="text-purple-600" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerDashboard;
