import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Edit2,
  Plus,
  Eye,
  CheckCircle,
  User,
  Building2,
  Filter,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useWorkerListing } from "../../agenthooks/useAgentWorkerListing";
import ViewWorkerAgentModel from "../../components/worker/ViewWorkerAgentModel.jsx";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getDesignationsAPI,
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../../api/agent/agentWorkerAPI.js";
import { getIndustriesAPI } from "../../../../api/agent/agentWorkerAPI";
import { useDateRangeFilter } from "../../../../common/hooks/useDateRangeFilter";
import DateRangeDropdown from "../../../../common/components/DateRangeDropdown.jsx";

const WorkerListByAgent = () => {
  const navigate = useNavigate();

  const {
    workers,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    totalRecords,
    handleSearch,
    handleClear,
    handleDelete,
    handleToggleStatus,
    handleExportDownload,
  } = useWorkerListing();

  const {
    dateRange,
    applyPreset,
    setCustomRange,
    presets,
    formatDateForDisplay,
  } = useDateRangeFilter();

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationSearch, setDesignationSearch] = useState("");
  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);

  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showWorkerTypeDropdown, setShowWorkerTypeDropdown] = useState(false);
  const [workerType, setWorkerType] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const designationRef = useRef(null);
  const industryRef = useRef(null);
  const workerTypeRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  const workerTypeOptions = [
    { key: "all", label: "All Workers" },
    { key: "1", label: "Active Workers" },
    { key: "0", label: "Pending Workers" },
    // { key: "incomplete", label: "Incomplete Workers" },
  ];

  const fetchDesignations = async () => {
    try {
      const response = await getDesignationsAPI();
      setDesignations(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      setDesignations([]);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await getIndustriesAPI();
      setIndustries(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
      setIndustries([]);
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

  useEffect(() => {
    fetchDesignations();
    fetchIndustries();
    fetchStates();
  }, []);

  useEffect(() => {
    if (filters.state_id) {
      fetchCitiesByState(filters.state_id);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  const filteredDesignations = designations.filter((d) =>
    d.name.toLowerCase().includes(designationSearch.toLowerCase()),
  );

  const filteredIndustries = industries.filter((i) =>
    i.name.toLowerCase().includes(industrySearch.toLowerCase()),
  );

  const handleDesignationSelect = async (designation) => {
    setFilters({
      ...filters,
      designation: designation.name,
      designation_id: designation.id,
    });
    setShowDesignationDropdown(false);
  };

  const handleIndustrySelect = (industry) => {
    setFilters({
      ...filters,
      industry: industry.name,
      industry_id: industry.id,
    });
    setShowIndustryDropdown(false);
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
      worker_name: "",
      worker_code: "",
      department: "",
      designation: "",
      work_location: "",
      joining_date_from: "",
      joining_date_to: "",
      status: "",
      worker_type: "",
      industry: "",
      industry_id: "",
      state: "",
      state_id: "",
      city: "",
      city_id: "",
    });

    const allPreset = presets.find((p) => p.id === "all");
    if (allPreset) {
      applyPreset("all");
    }

    setShowWorkerTypeDropdown(false);
    handleSearch();
  };

  const handleClickOutside = useCallback((event) => {
    if (
      workerTypeRef.current &&
      !workerTypeRef.current.contains(event.target)
    ) {
      setShowWorkerTypeDropdown(false);
    }

    if (
      designationRef.current &&
      !designationRef.current.contains(event.target)
    ) {
      setShowDesignationDropdown(false);
    }

    if (industryRef.current && !industryRef.current.contains(event.target)) {
      setShowIndustryDropdown(false);
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

  const openViewModal = (worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedWorker(null);
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

  // Helper to determine status display
  const getStatusDisplay = (status) => {
    // If status is 1 or "active", show "Active", otherwise "Pending"
    return status === 1 || status === "active" ? "Active" : "Pending";
  };

  const getStatusClass = (status) => {
    const isActive = status === 1 || status === "active";
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div ref={workerTypeRef} className="relative w-full md:w-auto">
            <button
              onClick={() => setShowWorkerTypeDropdown(!showWorkerTypeDropdown)}
              className="flex w-full md:w-auto items-center justify-between gap-4 text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-white"
            >
              <span className="text-gray-800 truncate">
                {workerTypeOptions.find((o) => o.key === workerType)?.label}
              </span>
              <ChevronRight
                className={`w-5 h-5 !stroke-[3px] stroke-black transition-transform ${
                  showWorkerTypeDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {showWorkerTypeDropdown && (
              <div className="absolute left-0 mt-2 w-full sm:w-56 md:w-64 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {workerTypeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => {
                      setWorkerType(option.key);
                      setShowWorkerTypeDropdown(false);
                      setFilters((prev) => ({
                        ...prev,
                        worker_type: option.key === "all" ? "" : option.key,
                      }));
                      setTimeout(handleSearch, 100);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm
              hover:bg-gray-100
              ${
                workerType === option.key
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700"
              }
            `}
                  >
                    <span>{option.label}</span>
                    {workerType === option.key && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name & code..."
              value={filters.worker_name || ""}
              onChange={(e) =>
                setFilters({ ...filters, worker_name: e.target.value })
              }
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* Clear */}
            {!filtersVisible && filters.worker_name && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}

            {/* Filters Button */}
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

            {/* Export */}

            {/* Add Worker */}
            <button
              onClick={() => navigate("/agent/add/worker")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Worker</span>
              <span className="sm:hidden">Add</span>
            </button>
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

            <div className="flex flex-wrap gap-3 items-start ">
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
                {/* <DateRangeDropdown
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  presets={presets}
                  applyPreset={applyPreset}
                  formatDateForDisplay={formatDateForDisplay}
                /> */}
              </div>

              {/* Industry Filter Dropdown */}
              <div
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
                        : filters.industry || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setIndustrySearch(value);
                      if (!showIndustryDropdown) {
                        setShowIndustryDropdown(true);
                      }
                    }}
                    onFocus={() => {
                      setIndustrySearch("");
                      setShowIndustryDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search industry"
                  />
                </div>

                {showIndustryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {industries.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.industry ? "bg-blue-50" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters({
                              ...filters,
                              industry: "",
                              industry_id: "",
                            });
                            setIndustrySearch("");
                            setShowIndustryDropdown(false);
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              All Industries
                            </span>
                            {!filters.industry && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>

                        {industries
                          .filter(
                            (industry) =>
                              !industrySearch ||
                              industry.name
                                .toLowerCase()
                                .includes(industrySearch.toLowerCase()),
                          )
                          .map((industry) => (
                            <div
                              key={industry.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.industry === industry.name
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIndustrySelect(industry);
                              }}
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span>{industry.name}</span>
                                {filters.industry === industry.name && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}

                        {industrySearch &&
                          industries.filter((industry) =>
                            industry.name
                              .toLowerCase()
                              .includes(industrySearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No industries found for "{industrySearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        Loading industries...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Designation Filter */}
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
                    value={filters.designation || designationSearch}
                    onChange={(e) => setDesignationSearch(e.target.value)}
                    onFocus={() => setShowDesignationDropdown(true)}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 text-sm rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    placeholder="Designation....."
                  />
                </div>

                {showDesignationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        !filters.designation ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          designation: "",
                          designation_id: "",
                        });
                        setShowDesignationDropdown(false);
                        setDesignationSearch("");
                      }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">All Designations</span>
                        {!filters.designation && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>

                    {filteredDesignations.length > 0 ? (
                      filteredDesignations.map((designation) => (
                        <div
                          key={designation.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            filters.designation === designation.name
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDesignationSelect(designation);
                            setDesignationSearch("");
                          }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>{designation.name}</span>
                            {filters.designation === designation.name && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* State Filter Dropdown */}
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
                      if (!showStateDropdown) {
                        setShowStateDropdown(true);
                      }
                    }}
                    onFocus={() => {
                      setStateSearch("");
                      setShowStateDropdown(true);
                    }}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search state"
                  />
                </div>

                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {states.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.state_id ? "bg-blue-50" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
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

                        {states
                          .filter(
                            (state) =>
                              !stateSearch ||
                              state.name
                                .toLowerCase()
                                .includes(stateSearch.toLowerCase()),
                          )
                          .map((state) => (
                            <div
                              key={state.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.state_id === state.id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStateSelect(state);
                              }}
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
                          states.filter((state) =>
                            state.name
                              .toLowerCase()
                              .includes(stateSearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No states found for "{stateSearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        Loading states...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* City Filter Dropdown */}
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
                      if (!showCityDropdown) {
                        setShowCityDropdown(true);
                      }
                    }}
                    onFocus={() => {
                      if (filters.state_id) {
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
                    {cities.length > 0 ? (
                      <>
                        <div
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                            !filters.city_id ? "bg-blue-50" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
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

                        {cities
                          .filter(
                            (city) =>
                              !citySearch ||
                              city.name
                                .toLowerCase()
                                .includes(citySearch.toLowerCase()),
                          )
                          .map((city) => (
                            <div
                              key={city.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                filters.city_id === city.id ? "bg-blue-50" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCitySelect(city);
                              }}
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
                          cities.filter((city) =>
                            city.name
                              .toLowerCase()
                              .includes(citySearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center border-t border-gray-200 text-sm">
                              No cities found for "{citySearch}"
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-center text-sm">
                        {loadingCities
                          ? "Loading cities..."
                          : "No cities found for this state"}
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
          <h2 className="text-lg font-medium text-gray-800">Worker List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <p>Total Workers : </p> {totalRecords}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Worker Name & Code",
                  "Designation",
                  "Work Location",
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
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No workers found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first worker by clicking "Add New Worker"
                        above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                workers.map((worker, index) => (
                  <motion.tr
                    key={`${worker.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(worker)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 italic font-medium">
                      {worker.worker_name} - {worker.worker_code}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {worker.designation || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {worker.current_city_name || worker.current_state_name
                        ? [worker.current_city_name, worker.current_state_name]
                            .filter(Boolean)
                            .join(", ")
                        : worker.work_location || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          worker.status,
                        )}`}
                      >
                        {getStatusDisplay(worker.status)}
                      </span>
                    </td>

                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={() => openViewModal(worker)}
                          className="text-gray-600 hover:text-green-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/agent/worker/edit/${worker.id}`)
                          }
                          className="text-gray-600 hover:text-blue-600"
                          title="Edit Worker"
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* 
                        <button
                          onClick={() => handleDelete(worker.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete Worker"
                        >
                          <Trash2 size={18} />
                        </button> */}
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
      {workers.length > 0 && (
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

      {/* View Worker Modal */}
      <ViewWorkerAgentModel
        worker={selectedWorker}
        isOpen={isModalOpen}
        onClose={closeViewModal}
      />
    </motion.div>
  );
};

export default WorkerListByAgent;
