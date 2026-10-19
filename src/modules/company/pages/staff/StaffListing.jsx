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
  Download,
  Filter,
  UserCircle,
  ChevronRight,
  Building2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useStaffListing } from "../../companyhooks/useCompanyStaffListing";
import { getIndustriesAPI } from "../../../../api/company/companyStaffAPI";
import StaffViewModal from "../../components/staff/ViewCompanyStaffModal";
import { useCompanyPermissions } from "../../../../common/hooks/useCompanyPermissions";
import Loader from "../../../../common/components/Loader";
import Cookies from "js-cookie";
const StaffListing = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: permissionsLoading } =
    useCompanyPermissions();

  const {
    staffs,
    loading,
    page,
    totalPages,
    totalRecords,
    setPage,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
  } = useStaffListing();

  // ✅ Industry states
  const [industries, setIndustries] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const industryRef = useRef(null);
  const industryId = Cookies.get("industry_id");

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Staff type dropdown
  const [showStaffTypeDropdown, setShowStaffTypeDropdown] = useState(false);
  const staffTypeRef = useRef(null);

  const staffTypeOptions = [
    { key: "all", label: "All Staff" },
    { key: "active", label: "Active Staff" },
    { key: "inactive", label: "Inactive Staff" },
    // { key: "incomplete", label: "Incomplete Staff" },
  ];

  const getCurrentStaffType = () => {
    if (!filters.status) return "all";
    if (filters.status === "active") return "active";
    if (filters.status === "inactive") return "inactive";
    if (filters.status === "incomplete") return "incomplete";
    return "all";
  };
  const [staffType, setStaffType] = useState(getCurrentStaffType());

  useEffect(() => {
    setStaffType(getCurrentStaffType());
  }, [filters.status]);

  // Click outside handler for all dropdowns
  const handleClickOutside = useCallback((event) => {
    if (staffTypeRef.current && !staffTypeRef.current.contains(event.target)) {
      setShowStaffTypeDropdown(false);
    }
    if (industryRef.current && !industryRef.current.contains(event.target)) {
      setShowIndustryDropdown(false);
      setIndustrySearch("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // ✅ Industry handlers
  const handleIndustrySelect = (industry) => {
    setFilters({
      ...filters,
      industry_id: industry.id,
      designation_id: "", // clear designation when industry changes
    });
    setShowIndustryDropdown(false);
    setIndustrySearch("");
  };

  const handleIndustrySearch = (value) => {
    setIndustrySearch(value);
    if (!value.trim()) {
      setFilteredIndustries(industries);
    } else {
      const filtered = industries.filter((i) =>
        i.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredIndustries(filtered);
    }
    setShowIndustryDropdown(true);
  };

  // ✅ Designation handlers
  // const handleDesignationSelect = (designationId) => {
  //   setFilters({ ...filters, designation_id: designationId });
  //   setShowDesignationDropdown(false);
  // };
  const handleEdit = (staff) => {
    navigate(`/company/staff/edit/${staff.id}`);
  };
  const openViewModal = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(false);
  };

  const handleExportClick = async () => {
    if (!handleExportDownload) return;
    try {
      setIsExporting(true);
      await handleExportDownload();
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAll = () => {
    setFilters({
      name: "",
      email: "",
      phone: "",
      status: "",
      designation_id: "",
      industry_id: "", // ✅ include industry
    });
    setFiltersVisible(false);
    handleSearch();
  };

  const canView = hasPermission("staff", "view");
  const canCreate = hasPermission("staff", "create");
  const canEdit = hasPermission("staff", "edit");
  const canDelete = hasPermission("staff", "delete");
  const canToggleStatus = hasPermission("staff", "toggle_status");
  const canExport = hasPermission("staff", "export") && !!handleExportDownload;

  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <UserCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view staff members.
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

  return (
    <motion.div
      className="flex-1 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className={`bg-white p-4 border border-gray-200 shadow-sm ${
          filtersVisible ? "rounded-t-2xl border-b-0" : "mb-4 rounded-2xl"
        }`}
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          {/* Staff Type Dropdown */}
          <div ref={staffTypeRef} className="relative w-full md:w-auto">
            <button
              onClick={() => setShowStaffTypeDropdown(!showStaffTypeDropdown)}
              className="flex items-center justify-between space-x-4 text-2xl font-bold px-4 py-2 border border-gray-300 rounded-lg bg-white border-none hover:border-none"
            >
              <span className="text-gray-800">
                {staffTypeOptions.find((o) => o.key === staffType)?.label}
              </span>
              <ChevronRight
                className={`w-5 h-5 stroke-[3px] stroke-black transition-transform ${
                  showStaffTypeDropdown ? "rotate-90" : ""
                }`}
              />
            </button>
            {showStaffTypeDropdown && (
              <div className="absolute w-64 z-50 mt-0 ml-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {staffTypeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => {
                      setStaffType(option.key);
                      setShowStaffTypeDropdown(false);
                      const statusValue =
                        option.key === "all"
                          ? ""
                          : option.key === "active"
                            ? "active"
                            : option.key === "inactive"
                              ? "inactive"
                              : "incomplete";
                      setFilters((prev) => ({ ...prev, status: statusValue }));
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                      staffType === option.key
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    {staffType === option.key && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search and action buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name "
              value={filters.name || ""}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
            {canExport && (
              <button
                onClick={handleExportClick}
                disabled={isExporting || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isExporting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export as CSV</span>
                  </>
                )}
              </button>
            )}

            {canCreate && (
              <button
                onClick={() => navigate("/company/staff/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Staff</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Panel */}
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
              {/* ✅ Industry Dropdown */}
              {/* <div
                ref={industryRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showIndustryDropdown
                        ? industrySearch
                        : filters.industry_id
                        ? industries.find(i => i.id === filters.industry_id)?.name || ""
                        : ""
                    }
                    onChange={(e) => handleIndustrySearch(e.target.value)}
                    onFocus={() => {
                      setIndustrySearch("");
                      setShowIndustryDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 text-sm rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    placeholder="Industry..."
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

                {showIndustryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        !filters.industry_id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setFilters({ ...filters, industry_id: "", designation_id: "" });
                        setShowIndustryDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All Industries</span>
                        {!filters.industry_id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    {filteredIndustries.map((industry) => (
                      <div
                        key={industry.id}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          filters.industry_id === industry.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleIndustrySelect(industry)}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>{industry.name}</span>
                          {filters.industry_id === industry.id && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    {industrySearch && filteredIndustries.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                        No industries found for "{industrySearch}"
                      </div>
                    )}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </motion.div>
      )}

      {/* Staff Table */}
      <motion.div
        className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Staff List</h2>
          <h2 className="flex items-center gap-1 text-lg font-medium text-gray-800">
            <span>Total Staff :</span> {totalRecords || 0}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Staff Name",
                  "Email",
                  "Phone",
                  "Role",

                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : staffs.length > 0 ? (
                staffs.map((staff, index) => (
                  <motion.tr
                    key={staff.id}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(staff)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 italic font-medium">
                      {staff.name}
                      {staff.staff_code && `-${staff.staff_code}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.permission_profile || "N/A"}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.designation || "N/A"}
                    </td> */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          staff.status === true || staff.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {staff.status === true || staff.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        {canView && (
                          <button
                            onClick={() => openViewModal(staff)}
                            className="text-gray-600 hover:text-green-600"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() =>
                              navigate(`/company/staff/edit/${staff.id}`)
                            }
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit Staff"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(staff.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete Staff"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {canToggleStatus && (
                          <button
                            onClick={() =>
                              handleToggleStatus(staff.id, staff.status)
                            }
                            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1
                              ${
                                staff.status === true ||
                                staff.status === "active"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }
                            `}
                            title={
                              staff.status === true || staff.status === "active"
                                ? "Deactivate Staff"
                                : "Activate Staff"
                            }
                          >
                            {staff.status === true ||
                            staff.status === "active" ? (
                              <>
                                <XCircle size={16} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <UserCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No staff members found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first staff member by clicking "Add New
                        Staff" above.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {staffs.length > 0 && totalPages > 1 && (
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
      <StaffViewModal
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={closeViewModal}
        onEdit={handleEdit}
      />
    </motion.div>
  );
};

export default StaffListing;
