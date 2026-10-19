import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Building2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useCompanyVacancyListing } from "../../companyhooks/useCompanyVacancyListing";
import {
  getDesignationsAPI,
  getStatesAPI,
} from "../../../../api/company/companyVacancyAPI";
import VacancyViewModal from "../../components/vacancy/VacancyViewModal";
import { useCompanyPermissions } from "../../../../common/hooks/useCompanyPermissions";
import Loader from "../../../../common/components/Loader";
import Cookies from "js-cookie";

const VacancyListing = () => {
  const navigate = useNavigate();

  // Designations state (industry is auto from cookie, so no industry dropdown)
  const [designations, setDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const designationRef = useRef(null);
  const industryId = Cookies.get("industry_id");
  // Other dropdown states
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);

  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Tab status filter – includes "expired"
  const [vacancyStatusFilter, setVacancyStatusFilter] = useState("all");

  const {
    vacancies,
    loading,
    page,
    totalRecords,
    totalPages,
    setPage,
    filters,
    setFilters,
    handleSearch,

    handleDelete,
    handleToggleStatus,
  } = useCompanyVacancyListing();

  const { hasPermission, loading: permissionsLoading } =
    useCompanyPermissions();

  // Status options (added "expired")
  const statusOptions = [
    { key: "all", label: "All Vacancies" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "expired", label: "Expired" },
  ];

  // Rate type options
  const rateTypeOptions = [
    { value: "", label: "Job Type" },
    { value: "salary", label: "Salary" },
    { value: "hourly", label: "Per Hour" },
    { value: "daily", label: "Daily" },
    { value: "pcs", label: "Per Pcs" },
    { value: "gram", label: "Per Gram" },
    { value: "kg", label: "Per KG" },
  ];

  useEffect(() => {
    const fetchDesignations = async () => {
      if (!industryId) {
        setDesignations([]);
        return;
      }

      try {
        setDesignationsLoading(true);

        const response = await getDesignationsAPI(industryId, {
          per_page: 1000,
        });

        setDesignations(response?.data?.data?.data || []);
      } catch (error) {
        setDesignations([]);
      } finally {
        setDesignationsLoading(false);
      }
    };

    fetchDesignations();
  }, [industryId]);
  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        const response = await getStatesAPI();
        const statesData = response.data.data || [];
        setStates(statesData);
      } catch (error) {
      } finally {
        setStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Sync status filter with filters object (send string)
  useEffect(() => {
    const newStatus = vacancyStatusFilter === "all" ? "" : vacancyStatusFilter;
    if (filters.status !== newStatus) {
      setFilters((prev) => ({ ...prev, status: newStatus }));
    }
  }, [vacancyStatusFilter]);

  // Trigger search when status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.status]);

  // Click outside for designation dropdown
  const handleClickOutside = useCallback((event) => {
    if (
      designationRef.current &&
      !designationRef.current.contains(event.target)
    ) {
      setShowDesignationDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleDesignationSelect = (designationId) => {
    setFilters({ ...filters, designation_id: designationId });
    setShowDesignationDropdown(false);
  };

  const handleRateTypeChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, rate_type: value });
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleClearAll = () => {
    setFilters({
      designation_id: "",
      rate_type: "",
      status: "",
      state_id: "",
      city_id: "",
      industry_id: parseInt(Cookies.get("industry_id") || ""), // preserve auto industry
    });
    // setSelectedStateName("");
    // setSelectedCityName("");
    setVacancyStatusFilter("all");
    setFiltersVisible(false);
    handleSearch();
  };

  const handleView = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedVacancy(null);
    setIsModalOpen(false);
  };

  const isVacancyActive = (vacancy) => vacancy.status === "active";

  const formatJobType = (vacancy) => {
    if (vacancy.rate_type === "salary") return "/ Month";
    const rateTypeMap = {
      hourly: "/ Hour",
      daily: "/ Day",
      pcs: "/ Pcs",
      gram: "/ Gram",
      kg: "/ KG",
    };
    return rateTypeMap[vacancy.rate_type] || vacancy.rate_type || "Rate";
  };

  const getStatusDetails = (vacancy) => {
    if (vacancy.status === "active") {
      return {
        label: "Active",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3 ml-1" />,
      };
    }
    if (vacancy.status === "expired") {
      return {
        label: "Expired",
        className: "bg-yellow-100 text-yellow-800",
        icon: <XCircle className="w-3 h-3 ml-1" />,
      };
    }
    return {
      label: "Inactive",
      className: "bg-red-100 text-red-800",
      icon: <XCircle className="w-3 h-3 ml-1" />,
    };
  };

  const calculateShiftHours = (vacancy) => {
    if (!vacancy.shift_start_time || !vacancy.shift_end_time) return "";
    const start = new Date(`1970-01-01T${vacancy.shift_start_time}`);
    let end = new Date(`1970-01-01T${vacancy.shift_end_time}`);
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    let diffMs = end - start;
    let diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (vacancy.break_type === "unpaid" && vacancy.break_duration_minutes) {
      diffMinutes -= vacancy.break_duration_minutes;
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatShift = (vacancy) => {
    if (vacancy.shift_start_time && vacancy.shift_end_time) {
      const start = vacancy.shift_start_time.substring(0, 5);
      const end = vacancy.shift_end_time.substring(0, 5);
      const workingHours = calculateShiftHours(vacancy);
      return `${start} - ${end} (${workingHours})`;
    }
    return "N/A";
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!hasPermission("vacancy", "view")) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <Building2 className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view vacancies.
          </p>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const canCreate = hasPermission("vacancy", "create");
  const canEdit = hasPermission("vacancy", "edit");
  const canDelete = hasPermission("vacancy", "delete");
  const canToggleStatus = hasPermission("vacancy", "toggle_status");

  return (
    <motion.div
      className="flex-1 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Search & Filter Card */}
      <motion.div
        className={`bg-white p-4 border border-gray-200 shadow-sm ${
          filtersVisible ? "rounded-t-2xl border-b-0" : "mb-4 rounded-2xl"
        }`}
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-1">
            {statusOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setVacancyStatusFilter(option.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200
                  ${
                    vacancyStatusFilter === option.key
                      ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                filtersVisible
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <div className="relative group">
              <button
                onClick={() => {
                  if (canCreate) {
                    navigate("/company/vacancy/add");
                  }
                }}
                disabled={!canCreate}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition
                  ${
                    canCreate
                      ? "bg-blue-900 hover:bg-blue-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <Plus className="w-4 h-4" />
                Add Vacancy
              </button>

              {/* message under button WITHOUT breaking layout */}
              {!canCreate && (
                <p className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">
                  Document Verification Pending.
                </p>
              )}

              {/* tooltip stays */}
              {!canCreate && (
                <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs px-3 py-2 rounded w-64 text-center shadow-lg hidden group-hover:block">
                  Your company documents are not approved or have expired. You
                  cannot add a new vacancy.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Filters */}
      {filtersVisible && (
        <motion.div
          className="bg-white p-4 mb-4 rounded-b-2xl border border-gray-200 shadow-sm"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                FILTER BY :
              </div>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-3 items-start">
              {/* No Industry Dropdown – industry is auto from cookie */}

              {/* Designation Dropdown (depends on auto industry) */}
              <div
                ref={designationRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      filters.designation_id
                        ? designations.find(
                            (d) => d.id.toString() === filters.designation_id,
                          )?.name || ""
                        : ""
                    }
                    onFocus={() => {
                      if (industryId) setShowDesignationDropdown(true);
                    }}
                    className={`w-full pl-10 pr-4 py-1.5 border border-gray-300 text-sm rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                      !industryId ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="Designation..."
                    readOnly
                  />
                  {designationsLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {showDesignationDropdown && industryId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {designationsLoading ? (
                      <div className="px-3 py-2 text-gray-500 text-center">
                        Loading...
                      </div>
                    ) : (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.designation_id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setFilters({ ...filters, designation_id: "" });
                            setShowDesignationDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              All Designations
                            </span>
                            {!filters.designation_id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>

                        {designations.length > 0 ? (
                          designations.map((des) => (
                            <div
                              key={des.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.designation_id === des.id.toString()
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={() =>
                                handleDesignationSelect(des.id.toString())
                              }
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span>{des.name}</span>
                                {filters.designation_id ===
                                  des.id.toString() && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-center">
                            No designations
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Rate Type Dropdown */}
              <div className="relative w-36">
                <select
                  value={filters.rate_type || ""}
                  onChange={handleRateTypeChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {rateTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Vacancy List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <span>Total Vacancies :</span> {totalRecords}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Designation",
                  "Workers",
                  "Shift",
                  "Rate",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : vacancies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No vacancies found
                  </td>
                </tr>
              ) : (
                vacancies.map((vacancy, index) => {
                  const status = getStatusDetails(vacancy);
                  return (
                    <motion.tr
                      key={vacancy.id}
                      className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleView(vacancy)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {vacancy.designation || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {vacancy.number_of_workers}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatShift(vacancy)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {`₹${vacancy.base_rate} ${formatJobType(vacancy)}`}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                          {status.icon}
                        </span>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 cursor-auto"
                      >
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleView(vacancy)}
                            className="text-gray-600 hover:text-blue-600"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/company/vacancy/applied-workers/${vacancy.id}`,
                                {
                                  state: {
                                    designationName: vacancy.designation,
                                    vacancyStatus: vacancy.status,
                                  },
                                },
                              )
                            }
                            disabled={
                              vacancy.status === "inactive" ||
                              vacancy.status === "expired"
                            }
                            className={`text-gray-600 hover:text-purple-600 
  ${
    vacancy.status === "inactive" || vacancy.status === "expired"
      ? "opacity-40 cursor-not-allowed"
      : ""
  }
  `}
                            title={
                              vacancy.status === "inactive"
                                ? "Vacancy is inactive"
                                : "Applied Workers"
                            }
                          >
                            <Users size={18} />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() =>
                                vacancy.status !== "expired" &&
                                navigate(`/company/vacancy/edit/${vacancy.id}`)
                              }
                              disabled={vacancy.status === "expired"}
                              className={`text-gray-600 hover:text-green-600 ${
                                vacancy.status === "expired"
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                vacancy.status === "expired"
                                  ? "Expired Vacancy cannot be edited"
                                  : "Edit"
                              }
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(vacancy.id)}
                              className="text-gray-600 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}

                          {canToggleStatus &&
                            vacancy.status?.toLowerCase().trim() !==
                              "expired" && (
                              <button
                                onClick={() =>
                                  handleToggleStatus(vacancy.id, vacancy.status)
                                }
                                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1
        ${
          isVacancyActive(vacancy)
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }
      `}
                                title={
                                  isVacancyActive(vacancy)
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {isVacancyActive(vacancy) ? (
                                  <>
                                    <XCircle size={14} />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={14} />
                                    Activate
                                  </>
                                )}
                              </button>
                            )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div className="flex items-center justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const p = index + 1;
            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition
                    ${
                      page === p
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    }`}
                >
                  {p}
                </button>
              );
            }
            if (p === page - 3 || p === page + 3) {
              return (
                <span key={p} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* View Modal */}
      <VacancyViewModal
        vacancy={selectedVacancy}
        isOpen={isModalOpen}
        onClose={closeViewModal}
        onEdit={(vacancy) => {
          closeViewModal();
          navigate(`/company/vacancy/edit/${vacancy.id}`);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />
    </motion.div>
  );
};

export default VacancyListing;
