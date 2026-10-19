import { motion } from "framer-motion";
import {
  MapPin,
  Edit2,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Download,
  Filter,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useStaffListing } from "../../adminhooks/useStaffListing";
import StaffViewModal from "../../components/staff/ViewStaffModal";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminPermissions } from "../../../../common/hooks/useAdminPermissions";
import {
  getDesignationsAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  getIndustriesAPI,
  getRolesAPI,
} from "../../../../api/admin/adminStaffAPI";
import { useDateRangeFilter } from "../../../../common/hooks/useDateRangeFilter";
import DateRangeDropdown from "../../../../common/components/DateRangeDropdown.jsx";
import { useSortableData } from "../../../../common/hooks/useSortableData";
import SortableHeader from "../../../../common/components/SortableHeader";

const StaffListing = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: permissionsLoading } = useAdminPermissions();

  const {
    staffs,
    loading,
    page,
    totalPages = 1,
    setPage,
    filters,
    setFilters,
    totalRecords = staffs.length,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
  } = useStaffListing();

  const {
    dateRange,
    applyPreset,
    setCustomRange,
    presets,
    formatDateForDisplay,
  } = useDateRangeFilter();

  const { sortedItems: sortedStaffs, sortConfig, requestSort } =
    useSortableData(staffs);

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Industries & Designations
  const [industries, setIndustries] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const industryRef = useRef(null);

  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designationSearch, setDesignationSearch] = useState("");
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const designationRef = useRef(null);

  // Roles
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const roleRef = useRef(null);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const stateRef = useRef(null);
  const cityRef = useRef(null);

  // Status tab state (replaces workerType dropdown)
  const [statusTab, setStatusTab] = useState("all");

  const statusTabOptions = [
    { key: "all", label: "All Staff" },
    { key: "1", label: "Active Staff" },
    { key: "0", label: "Inactive Staff" },
    { key: "incomplete", label: "Incomplete Staff" },
  ];

  // Safe fetch industries
  const fetchIndustries = async () => {
    try {
      const response = await getIndustriesAPI();
      let industriesArray = [];
      if (response.data && Array.isArray(response.data.data)) {
        industriesArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        industriesArray = response.data;
      } else {
        console.warn("Unexpected industries response format:", response);
        industriesArray = [];
      }
      setIndustries(industriesArray);
      setFilteredIndustries(industriesArray);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
      setIndustries([]);
      setFilteredIndustries([]);
    }
  };

  // Safe fetch designations
  const fetchDesignations = async (industryId) => {
    setDesignationsLoading(true);
    try {
      const response = await getDesignationsAPI(industryId, { per_page: 1000 });
      let designationsArray = [];
      if (response.data && Array.isArray(response.data.data.data)) {
        designationsArray = response.data.data.data;
      } else if (Array.isArray(response.data.data.data)) {
        designationsArray = response.data.data.data;
      } else {
        console.warn("Unexpected designations response format:", response);
        designationsArray = [];
      }
      setDesignations(designationsArray);
      setFilteredDesignations(designationsArray);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      setDesignations([]);
      setFilteredDesignations([]);
    } finally {
      setDesignationsLoading(false);
    }
  };

  // Safe fetch roles (API returns { id, profile_name })
  const fetchRoles = async () => {
    try {
      const response = await getRolesAPI();
      let rolesArray = [];
      if (response.data && Array.isArray(response.data.data)) {
        rolesArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        rolesArray = response.data;
      } else {
        console.warn("Unexpected roles response format:", response);
        rolesArray = [];
      }
      setRoles(rolesArray);
      setFilteredRoles(rolesArray);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles([]);
      setFilteredRoles([]);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]);
    }
  };

  const fetchCitiesByState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      setLoadingCities(true);
      const response = await getCitiesByStateAPI(stateId);
      setCities(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
    fetchStates();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (filters.industry_id) {
      fetchDesignations(filters.industry_id);
    } else {
      setDesignations([]);
      setFilteredDesignations([]);
    }
  }, [filters.industry_id]);

  useEffect(() => {
    if (filters.state_id) {
      fetchCitiesByState(filters.state_id);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  // Sync statusTab with filters.status
  useEffect(() => {
    // Map filters.status to tab key (all, "1", "0", "incomplete")
    let newTab = "all";
    if (filters.status === "1") newTab = "1";
    else if (filters.status === "0") newTab = "0";
    else if (filters.status === "incomplete") newTab = "incomplete";
    if (newTab !== statusTab) {
      setStatusTab(newTab);
    }
  }, [filters.status]);

  // Update filters.status when tab changes
  useEffect(() => {
    const newStatus = statusTab === "all" ? "" : statusTab;
    if (filters.status !== newStatus) {
      setFilters((prev) => ({ ...prev, status: newStatus }));
      // Trigger search after state update
      setTimeout(() => handleSearch(), 100);
    }
  }, [statusTab]);

  const safeFilteredIndustries = Array.isArray(filteredIndustries)
    ? filteredIndustries
    : [];
  const safeFilteredDesignations = Array.isArray(filteredDesignations)
    ? filteredDesignations
    : [];
  const safeFilteredRoles = Array.isArray(filteredRoles) ? filteredRoles : [];

  const filteredIndustriesList = safeFilteredIndustries.filter((i) =>
    i.name?.toLowerCase().includes(industrySearch.toLowerCase()),
  );

  const filteredDesignationsList = safeFilteredDesignations.filter((d) =>
    d.name?.toLowerCase().includes(designationSearch.toLowerCase()),
  );

  // Filter roles using profile_name
  const filteredRolesList = safeFilteredRoles.filter((r) =>
    r.profile_name?.toLowerCase().includes(roleSearch.toLowerCase()),
  );

  const handleIndustrySelect = (industry) => {
    setFilters({
      ...filters,
      industry: industry.name,
      industry_id: industry.id,
      designation: "",
      designation_id: "",
    });
    setShowIndustryDropdown(false);
    setIndustrySearch("");
  };

  const handleDesignationSelect = (designation) => {
    setFilters({
      ...filters,
      designation: designation.name,
      designation_id: designation.id,
    });
    setShowDesignationDropdown(false);
    setDesignationSearch("");
  };

  // Role select: set only permission_profile_id, separate display name
  const handleRoleSelect = (role) => {
    setSelectedRoleName(role.profile_name);
    setFilters({
      ...filters,
      permission_profile_id: role.id,
    });
    setShowRoleDropdown(false);
    setRoleSearch("");
  };

  const handleStateSelect = async (state) => {
    setFilters({
      ...filters,
      state: state.name,
      state_id: state.id,
      city: "",
      city_id: "",
    });
    setStateSearch("");
    setShowStateDropdown(false);
    await fetchCitiesByState(state.id);
  };

  const handleCitySelect = (city) => {
    setFilters({
      ...filters,
      city: city.name,
      city_id: city.id,
    });
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const handleDateRangeChange = (range) => {
    if (range.preset === "custom") {
      setCustomRange(range.from, range.to);
    } else {
      applyPreset(range.preset);
    }

    setFilters((prev) => ({
      ...prev,
      joining_date_from: range.from || "",
      joining_date_to: range.to || "",
    }));

    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleClearAll = () => {
    setFilters({
      name: "",
      state: "",
      state_id: "",
      city: "",
      city_id: "",
      dor_from: "",
      dor_to: "",
      designation: "",
      designation_id: "",
      industry: "",
      industry_id: "",
      permission_profile_id: "",
      status: "",
    });
    setSelectedRoleName("");
    setStatusTab("all"); // reset tabs
    const allPreset = presets.find((p) => p.id === "all");
    if (allPreset) {
      applyPreset("all");
    }
    handleSearch();
  };

  const handleClickOutside = useCallback((event) => {
    if (industryRef.current && !industryRef.current.contains(event.target)) {
      setShowIndustryDropdown(false);
      setIndustrySearch("");
    }
    if (
      designationRef.current &&
      !designationRef.current.contains(event.target)
    ) {
      setShowDesignationDropdown(false);
      setDesignationSearch("");
    }
    if (roleRef.current && !roleRef.current.contains(event.target)) {
      setShowRoleDropdown(false);
      setRoleSearch("");
    }
    if (stateRef.current && !stateRef.current.contains(event.target)) {
      setShowStateDropdown(false);
      setStateSearch("");
    }
    if (cityRef.current && !cityRef.current.contains(event.target)) {
      setShowCityDropdown(false);
      setCitySearch("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close the per-row "more actions" menu on outside click
  useEffect(() => {
    const handleActionMenuOutsideClick = (event) => {
      if (!event.target.closest(".action-menu-container")) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleActionMenuOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleActionMenuOutsideClick);
    };
  }, []);

  const openViewModal = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(false);
  };

  const handleExportClick = async () => {
    try {
      setIsExporting(true);
      await handleExportDownload();
    } finally {
      setIsExporting(false);
    }
  };
  const closeAllDropdowns = () => {
    setShowDateDropdown(false);
    setShowIndustryDropdown(false);
    setShowStateDropdown(false);
    setShowCityDropdown(false);
    setShowRoleDropdown(false);
  };

  const canView = hasPermission("staff", "view");
  const canCreate = hasPermission("staff", "create");
  const canEdit = hasPermission("staff", "edit");
  const canDelete = hasPermission("staff", "delete");
  const canExport = hasPermission("staff", "export");
  const canToggleStatus = hasPermission("staff", "toggle_status");

  if (!permissionsLoading && !canView) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <User className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view staff.
          </p>
          <button
            onClick={() => navigate("/admin/dashboard")}
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
      {/* HEADER WITH FILTER TOGGLE */}
      <motion.div
        className={`bg-white p-4 border border-gray-200 shadow-sm ${
          filtersVisible ? "rounded-t-2xl border-b-0" : "mb-4 rounded-2xl"
        }`}
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-1">
            {statusTabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setStatusTab(option.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200
                  ${
                    statusTab === option.key
                      ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name & code..."
              value={filters.name || ""}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {!filtersVisible && filters.staff_name && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition
                ${
                  filtersVisible
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }
              `}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {canExport && (
              <button
                onClick={handleExportClick}
                disabled={isExporting || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isExporting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                `}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </>
                )}
              </button>
            )}

            {canCreate && (
              <button
                onClick={() => navigate("/admin/staff/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Staff</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* FILTER SECTION */}
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
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-3 items-start">
              {/* Date Range Filter */}
              <div className="relative w-56">
                <DateRangeDropdown
                  showDateDropdown={showDateDropdown}
                  setShowDateDropdown={setShowDateDropdown}
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  presets={presets}
                  applyPreset={applyPreset}
                  formatDateForDisplay={formatDateForDisplay}
                />
              </div>

              {/* Role Filter */}
              <div
                ref={roleRef}
                className="relative w-48"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showRoleDropdown ? roleSearch : selectedRoleName || ""
                    }
                    onChange={(e) => {
                      setRoleSearch(e.target.value);

                      closeAllDropdowns();
                      setShowRoleDropdown(true);
                    }}
                    onFocus={() => {
                      closeAllDropdowns();
                      setRoleSearch("");
                      setShowRoleDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search role"
                  />
                </div>

                {showRoleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        !selectedRoleName ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedRoleName("");
                        setFilters({
                          ...filters,
                          permission_profile_id: "",
                        });
                        setRoleSearch("");
                        setShowRoleDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All Roles</span>
                        {!selectedRoleName && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>

                    {filteredRolesList.map((role) => (
                      <div
                        key={role.id}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          selectedRoleName === role.profile_name
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>{role.profile_name}</span>
                          {selectedRoleName === role.profile_name && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}

                    {roleSearch && filteredRolesList.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                        No roles found for "{roleSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* State Filter */}
              <div
                ref={stateRef}
                className="relative w-40"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={
                      showStateDropdown ? stateSearch : filters.state || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setStateSearch(value);

                      closeAllDropdowns();
                      setShowStateDropdown(true);
                    }}
                    onFocus={() => {
                      closeAllDropdowns();
                      setStateSearch("");
                      setShowStateDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search state"
                  />
                </div>

                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        !filters.state_id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          state: "",
                          state_id: "",
                          city: "",
                          city_id: "",
                        });
                        setStateSearch("");
                        setShowStateDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All States</span>
                        {!filters.state_id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>

                    {(states || [])
                      .filter(
                        (state) =>
                          !stateSearch ||
                          state.name
                            ?.toLowerCase()
                            .includes(stateSearch.toLowerCase()),
                      )
                      .map((state) => (
                        <div
                          key={state.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            filters.state_id === state.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleStateSelect(state)}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>{state.name}</span>
                            {filters.state_id === state.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}

                    {stateSearch &&
                      (states || []).filter((s) =>
                        s.name
                          ?.toLowerCase()
                          .includes(stateSearch.toLowerCase()),
                      ).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                          No states found for "{stateSearch}"
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* City Filter */}
              <div
                ref={cityRef}
                className="relative w-40"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={showCityDropdown ? citySearch : filters.city || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCitySearch(value);

                      closeAllDropdowns();
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => {
                      if (filters.state_id) {
                        closeAllDropdowns();
                        setCitySearch("");
                        setShowCityDropdown(true);
                      }
                    }}
                    disabled={!filters.state_id}
                    className={`w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      !filters.state_id ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder={
                      !filters.state_id ? "Select state first" : "Search city"
                    }
                  />
                  {loadingCities && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {showCityDropdown && filters.state_id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        !filters.city_id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          city: "",
                          city_id: "",
                        });
                        setCitySearch("");
                        setShowCityDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All Cities</span>
                        {!filters.city_id && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>

                    {(cities || [])
                      .filter(
                        (city) =>
                          !citySearch ||
                          city.name
                            ?.toLowerCase()
                            .includes(citySearch.toLowerCase()),
                      )
                      .map((city) => (
                        <div
                          key={city.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            filters.city_id === city.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleCitySelect(city)}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>{city.name}</span>
                            {filters.city_id === city.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}

                    {citySearch &&
                      (cities || []).filter((c) =>
                        c.name
                          ?.toLowerCase()
                          .includes(citySearch.toLowerCase()),
                      ).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                          No cities found for "{citySearch}"
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* MAIN TABLE */}
      <motion.div
        className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Staff List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <p>Total Staff : </p> {totalRecords}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader
                  label="Staff Name & Code"
                  sortKey="name"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="Email"
                  sortKey="email"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="Phone"
                  sortKey="phone"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <SortableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
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
              ) : !sortedStaffs || sortedStaffs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No staff found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first staff by clicking "Add New Staff"
                        above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedStaffs.map((staffMember, index) => (
                  <motion.tr
                    key={`${staffMember.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(staffMember)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {staffMember.name} - {staffMember.staff_code}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staffMember.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staffMember.phone || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          staffMember.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {staffMember.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="relative inline-block action-menu-container">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(
                              openActionMenuId === staffMember.id
                                ? null
                                : staffMember.id,
                            )
                          }
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          title="Actions"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openActionMenuId === staffMember.id && (
                          <div className="absolute right-0 z-20 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden text-left">
                            {canView && (
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  openViewModal(staffMember);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                            )}

                            {canEdit && (
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  navigate(
                                    `/admin/staff/edit/${staffMember.id}`,
                                  );
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                                Edit Staff
                              </button>
                            )}

                            {canToggleStatus && (
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  handleToggleStatus(
                                    staffMember.id,
                                    staffMember.status,
                                  );
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm border-t border-gray-100 ${
                                  staffMember.status === 1
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {staffMember.status === 1 ? (
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

                            {canDelete && (
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  handleDelete(staffMember.id);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                              >
                                <Trash2 size={16} />
                                Delete Staff
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* PAGINATION */}
      {staffs && staffs.length > 0 && (
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

      {/* View Staff Modal */}
      {canView && (
        <StaffViewModal
          staff={selectedStaff}
          isOpen={isModalOpen}
          onClose={closeViewModal}
        />
      )}
    </motion.div>
  );
};

export default StaffListing;
