import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Briefcase,
  Target,
  Plus,
  Edit,
  XCircle,
  Mail,
  Phone,
  Building,
  CalendarDays,
  AlertCircle,
  User,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import GraphChart from "../../components/GraphChart";
import useCompanyDashboard from "../../companyhooks/useCompanyDashboard";
import { toggleVacancyStatusAPI } from "../../../../api/company/companyVacancyAPI";
import Swal from "sweetalert2";
import { useCompanyPermissions } from "../../../../common/hooks/useCompanyPermissions";

const Dashboard = () => {
  const navigate = useNavigate();
  // const { hasPermission } = useCompanyPermissions();
  const { hasPermission, loading: permissionsLoading } =
    useCompanyPermissions();
  const canViewDashboard = hasPermission("dashboard", "view");
  const canCreateVacancy = hasPermission("vacancy", "create");
  const { dashboardData, loading, error } = useCompanyDashboard();

  const [localVacancies, setLocalVacancies] = useState([]);
  const [workerTab, setWorkerTab] = useState("recent");
  const prevVacanciesRef = useRef();

  const counts = dashboardData?.counts || {
    total_staff: 0,
    total_workers: 0,
    total_vacancies: 0,
    active_vacancies: 0,
    inactive_vacancies: 0,
    company_document_approved: 0,
    document_will_expire_soon: 0,
  };

  const isDocumentApproved = counts.company_document_approved === 1;
  const hasExpiringDocuments = counts.document_will_expire_soon === 1;

  const staff = dashboardData?.staff || [];
  const vacanciesFromApi = dashboardData?.recent_active_vacancies || [];
  const recentWorkers = dashboardData?.recent_workers || [];
  const leftWorkers = dashboardData?.left_workers || [];
  const graph = dashboardData?.graph || [];

  useEffect(() => {
    const serialized = JSON.stringify(vacanciesFromApi);
    if (prevVacanciesRef.current !== serialized) {
      setLocalVacancies(vacanciesFromApi);
      prevVacanciesRef.current = serialized;
    }
  }, [vacanciesFromApi]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSchedule = (scheduleArray) => {
    if (!scheduleArray || scheduleArray.length === 0) {
      return {
        type: "none",
        items: [],
        extra: 0,
        label: "No schedule",
        full: "No schedule",
      };
    }

    const schedule = scheduleArray[0];
    // const formatDateShort = (date) => {
    //   if (!date) return null;
    //   return new Date(date).toLocaleDateString(undefined, {
    //     day: "numeric",
    //     month: "short",
    //   });
    // };
    const formatDateShort = (dateStr) => {
      if (!dateStr) return null;

      const dateOnly = dateStr.split("T")[0];

      return new Date(dateOnly).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
    };
    if (schedule.mode === "weekly") {
      const weekdayMap = {
        0: "Su",
        1: "M",
        2: "Tu",
        3: "W",
        4: "Th",
        5: "F",
        6: "Sa",
      };
      const validDays = (schedule.weekdays || []).filter(
        (d) => d >= 0 && d <= 6,
      );
      const items = validDays.map((d) => weekdayMap[d]);

      let label = "";
      if (schedule.start_date && schedule.end_date) {
        label = `${formatDateShort(schedule.start_date)} → ${formatDateShort(
          schedule.end_date,
        )}`;
      } else if (schedule.start_date) {
        label = `From ${formatDateShort(schedule.start_date)}`;
      } else if (schedule.end_date) {
        label = `Until ${formatDateShort(schedule.end_date)}`;
      } else {
        label = "Every";
      }

      const full = `${items.join(", ")} ${
        schedule.start_date
          ? "from " + formatDateShort(schedule.start_date)
          : ""
      } ${schedule.end_date ? "to " + formatDateShort(schedule.end_date) : ""}`;
      return { type: "weekly", items, extra: 0, label, full };
    }

    if (schedule.mode === "dates") {
      const allDates = (schedule.dates || [])
        .map((d) => formatDateShort(d))
        .filter(Boolean);
      const maxDisplay = 3;
      const items = allDates.slice(0, maxDisplay);
      const extra = allDates.length - maxDisplay;
      const full = allDates.join(", ");
      return { type: "dates", items, extra, label: "", full };
    }

    if (schedule.start_date && !schedule.end_date) {
      const label = `Starts ${formatDateShort(schedule.start_date)}`;
      return { type: "single", items: [], extra: 0, label, full: label };
    }

    if (!schedule.start_date && schedule.end_date) {
      const label = `Until ${formatDateShort(schedule.end_date)}`;
      return { type: "single", items: [], extra: 0, label, full: label };
    }

    return {
      type: "none",
      items: [],
      extra: 0,
      label: "No schedule",
      full: "No schedule",
    };
  };

  const formatRate = (rate, rateType) => {
    const currency = "₹";
    if (rateType === "pcs") return `${currency}${rate}/piece`;
    if (rateType === "salary") return `${currency}${rate}/month`;
    if (rateType === "hourly") return `${currency}${rate}/hour`;
    return `${currency}${rate}`;
  };
  const formatShift = (shift) => {
    if (!shift) return "N/A";

    const [start, end] = shift.split(" - ");

    const formatTime = (time) =>
      new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    return `${formatTime(start)} - ${formatTime(end)}`;
  };
  const handleRestrictedAction = () => {
    Swal.fire({
      icon: "warning",
      title: "Document Verification Pending",
      text: "You will be able to access these features after document verification.",
      confirmButtonText: "Go to Documents",
      confirmButtonColor: "#2563eb",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/company/company-documents");
      }
    });
  };

  const stats = [
    {
      title: "Total Staff",
      value: counts.total_staff,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      route: "/company/staff/listing",
    },
    {
      title: "Total Active Workers",
      value: counts.all_worker_count,
      icon: User,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      route: "/company/all-workers",
    },
    {
      title: "Total Vacancies",
      value: counts.total_vacancies,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      route: "/company/vacancy/listing",
    },
    {
      title: "Active Vacancies",
      value: counts.active_vacancies,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      route: "/company/vacancy/listing",
    },
  ];

  const handleToggleVacancy = async (vacancyId, currentStatus) => {
    const isActive = currentStatus === "active";
    const action = isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `This vacancy will be ${action}d.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await toggleVacancyStatusAPI(vacancyId, !isActive);
      if (response?.status === 200 || response?.status === 204) {
        setLocalVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Vacancy ${!isActive ? "activated" : "deactivated"}.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not update status.",
        });
      }
    } catch (error) {
      console.error("Toggle error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }
  if (!canViewDashboard) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view the dashboard.
          </p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading dashboard</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  const workersToShow = workerTab === "recent" ? recentWorkers : leftWorkers;
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full px-4 md:px-8 py-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Company Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your workforce, vacancies, and workers.
          </p>
        </div>
        <div className="relative group">
          <button
            onClick={() => {
              if (!isDocumentApproved) {
                handleRestrictedAction();
                return;
              }
              if (canCreateVacancy) {
                navigate("/company/vacancy/add");
              }
            }}
            disabled={!canCreateVacancy}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              canCreateVacancy
                ? "bg-blue-900 hover:bg-blue-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Vacancy
          </button>
          {!canCreateVacancy && (
            <>
              <p className="mt-1 text-xs text-red-500 text-center">
                Document Verification Pending.
              </p>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs px-3 py-2 rounded w-64 text-center shadow-lg hidden group-hover:block">
                Your company documents are not approved or have expired. You
                cannot add a new vacancy.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expiring Documents Warning Banner */}
      {hasExpiringDocuments && (
        <div className="mb-6 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-700" />
          <span>
            ⚠️ Your company documents will expire soon. Please update them in
            the{" "}
            <button
              onClick={() => navigate("/company/company-documents")}
              className="underline font-semibold hover:text-yellow-900"
            >
              Documents Section
            </button>{" "}
            to avoid service disruption.
          </span>
        </div>
      )}

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
              onClick={() => {
                if (!isDocumentApproved) {
                  handleRestrictedAction();
                  return;
                }
                navigate(stat.route);
              }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all hover:border-blue-300 active:scale-[0.98]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!isDocumentApproved) {
                    handleRestrictedAction();
                    return;
                  }
                  navigate(stat.route);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {graph.length > 0 && (
            <motion.div variants={itemVariants}>
              <GraphChart data={graph} />
            </motion.div>
          )}

          {/* Live Vacancies */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Live Vacancies ({localVacancies.length})
            </h2>

            <div className="space-y-4">
              {localVacancies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No active vacancies found.
                </p>
              ) : (
                localVacancies.map((vacancy) => {
                  const scheduleInfo = formatSchedule(vacancy.schedule);
                  return (
                    <div
                      key={vacancy.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {vacancy.designation}
                            </h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Active
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building size={16} />
                              <span>
                                {vacancy.city}, {vacancy.state}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Rate:</span>
                              <span>
                                {formatRate(vacancy.rate, vacancy.rate_type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Shift:</span>
                              <span>{formatShift(vacancy.shift)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-gray-500 text-xs">Required</p>
                              <p className="font-semibold">
                                {vacancy.workers_required}
                              </p>
                              <p className="text-xs text-gray-500">
                                ({vacancy.filled_workers} filled)
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-xs">Remaining</p>
                              <p className="font-semibold">
                                {vacancy.remaining_workers}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            Schedule:
                          </span>
                          {scheduleInfo.label && (
                            <span className="text-sm text-gray-600 font-medium">
                              {scheduleInfo.label}
                              {scheduleInfo.type === "weekly" &&
                                scheduleInfo.items.length > 0 &&
                                " •"}
                            </span>
                          )}
                          <div
                            className="flex flex-wrap gap-2"
                            title={scheduleInfo.full}
                          >
                            {scheduleInfo.items.map((item, i) => (
                              <div
                                key={i}
                                className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                  scheduleInfo.type === "weekly"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {item}
                              </div>
                            ))}
                            {scheduleInfo.extra > 0 && (
                              <div className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
                                +{scheduleInfo.extra}
                              </div>
                            )}
                            {scheduleInfo.items.length === 0 &&
                              scheduleInfo.label &&
                              !scheduleInfo.type.includes("single") && (
                                <span className="text-sm text-gray-500">
                                  {scheduleInfo.label}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (!isDocumentApproved) {
                                handleRestrictedAction();
                                return;
                              }
                              handleToggleVacancy(vacancy.id, "active");
                            }}
                            className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
                          >
                            <XCircle size={16} />
                            Deactivate
                          </button>
                          <button
                            onClick={() => {
                              if (!isDocumentApproved) {
                                handleRestrictedAction();
                                return;
                              }
                              navigate(`/company/vacancy/edit/${vacancy.id}`);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Staff Members ({staff.length})
            </h2>
            <div className="space-y-3">
              {staff.length === 0 ? (
                <p className="text-gray-500 text-sm">No staff members found.</p>
              ) : (
                staff.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {member.role}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{member.phone}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            {/* <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Recent Workers ({recentWorkers.length})
            </h2> */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Workers
              </h2>

              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => setWorkerTab("recent")}
                  className={`px-3 py-1 text-sm ${
                    workerTab === "recent"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  Joined ({recentWorkers.length})
                </button>

                <button
                  onClick={() => setWorkerTab("left")}
                  className={`px-3 py-1 text-sm ${
                    workerTab === "left"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  Left ({leftWorkers.length})
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {workersToShow.length === 0 ? (
                <p className="text-gray-500 text-sm">No workers added yet.</p>
              ) : (
                workersToShow.map((item) => {
                  const worker = item.worker;

                  return (
                    <div
                      key={worker.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base truncate">
                            {worker.full_name ||
                              [
                                worker.first_name,
                                worker.middle_name,
                                worker.last_name,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                          </h3>
                          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-100 text-blue-700">
                            VAC-{item.vacancy?.id || "N/A"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {worker.worker_code || "N/A"}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-gray-500 font-medium text-sm">
                            ⭐ {worker.averageRating || 0}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] text-gray-500 uppercase">
                            Designation
                          </p>
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {worker.designation?.name || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-500 uppercase">
                            Experience
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {worker.experience
                              ? `${worker.experience} Years`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
          >
            <h2 className="text-lg font-semibold mb-4">Quick Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Staff</span>
                <span className="font-bold">{counts.total_staff}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Workers</span>
                <span className="font-bold">{counts.total_workers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Vacancies</span>
                <span className="font-bold">{counts.active_vacancies}</span>
              </div>
            </div>
            {/* <div className="mt-6 pt-4 border-t border-blue-500">
              <p className="text-sm opacity-90">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div> */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
