import { motion } from "framer-motion";
import {
  Edit2,
  Plus,
  Eye,
  CheckCircle,
  Building,
  Filter,
  ChevronRight,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useAgentCompanyListing } from "../../agenthooks/useAgentCompanyListing";
import AgentCompanyViewModal from "../../components/company/ViewCompanyAgentModel";
import { useState, useEffect, useRef, useCallback } from "react";
import { getIndustriesAPI } from "../../../../api/agent/agentCompanyAPI";
import {
  getStatesAPI,
  getCitiesByStateAPI,
} from "../../../../api/admin/adminStaffAPI";
import { useDateRangeFilter } from "../../../../common/hooks/useDateRangeFilter";
import DateRangeDropdown from "../../../../common/components/DateRangeDropdown.jsx";

const AgentCompanyListing = () => {
  const navigate = useNavigate();
  const {
    companies,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    defaultFilters,
    setFilters,
    totalRecords,
    handleSearch,
    handleDelete,
  } = useAgentCompanyListing();

  const {
    dateRange,
    applyPreset,
    setCustomRange,
    presets,
    formatDateForDisplay,
  } = useDateRangeFilter();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCompanyTypeDropdown, setShowCompanyTypeDropdown] = useState(false);
  const [companyType, setCompanyType] = useState("all");
  const [industrySearch, setIndustrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const industryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const companyTypeRef = useRef(null);

  const companyTypeOptions = [
    { key: "all", label: "All Companies" },
    { key: "1", label: "Active Companies" },
    { key: "0", label: "Pending Companies" },
    // { key: "incomplete", label: "Incomplete Companies" },
  ];

  // Fetch states
  const fetchStates = async () => {
    try {
      const response = await getStatesAPI();
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]);
    }
  };

  // Fetch cities by state
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

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const response = await getIndustriesAPI();
      setIndustries(response.data || []);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
      setIndustries([]);
    }
  };

  // Handle state selection
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

  // Handle city selection
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
      dor_from: range.from || "",
      dor_to: range.to || "",
    }));

    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    const allPreset = presets.find((p) => p.id === "all");
    if (allPreset) {
      const range = allPreset.action();
      applyPreset("all");
      setFilters((prev) => ({
        ...prev,
        dor_from: range.from || "",
        dor_to: range.to || "",
      }));
    }
    setPage(1);
  };

  // Handle click outside
  const handleClickOutside = useCallback((event) => {
    if (industryRef.current && !industryRef.current.contains(event.target)) {
      setShowIndustryDropdown(false);
      setIndustrySearch("");
    }
    if (stateRef.current && !stateRef.current.contains(event.target)) {
      setShowStateDropdown(false);
      setStateSearch("");
    }
    if (cityRef.current && !cityRef.current.contains(event.target)) {
      setShowCityDropdown(false);
      setCitySearch("");
    }
    if (
      companyTypeRef.current &&
      !companyTypeRef.current.contains(event.target)
    ) {
      setShowCompanyTypeDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
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

  const openViewModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
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
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div ref={companyTypeRef} className="relative w-full md:w-auto">
            <button
              onClick={() =>
                setShowCompanyTypeDropdown(!showCompanyTypeDropdown)
              }
              className="flex items-center justify-between space-x-4 text-2xl !font-bold px-4 py-2 border border-gray-300 rounded-lg bg-white border-none hover:border-none"
            >
              <span className="text-gray-800">
                {companyTypeOptions.find((o) => o.key === companyType)?.label}
              </span>
              <ChevronRight
                className={`w-5 h-5 !stroke-[3px] stroke-black transition-transform ${
                  showCompanyTypeDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {showCompanyTypeDropdown && (
              <div className="absolute !w-64 z-50 mt-0 ml-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {companyTypeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => {
                      setCompanyType(option.key);
                      setShowCompanyTypeDropdown(false);
                      setFilters((prev) => ({
                        ...prev,
                        company_type: option.key === "all" ? "" : option.key,
                      }));
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                      companyType === option.key
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{option.label}</span>
                    {companyType === option.key && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Company Name Filter */}
            <input
              type="text"
              placeholder="Search by name & code....."
              value={filters.companyname || ""}
              onChange={(e) =>
                setFilters({ ...filters, companyname: e.target.value })
              }
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {!filtersVisible && filters.companyname && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            )}
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

            <button
              onClick={() => navigate("/agent/add/company")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Company</span>
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
                onClick={handleClear}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-start">
              {/* Date Range */}
              <div className="relative w-56">
                {/* <DateRangeDropdown
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  presets={presets}
                  applyPreset={applyPreset}
                  formatDateForDisplay={formatDateForDisplay}
                /> */}
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

              {/* Industry Filter Dropdown */}
              <div
                ref={industryRef}
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
                      showIndustryDropdown
                        ? industrySearch
                        : filters.industry || ""
                    }
                    onChange={(e) => {
                      setIndustrySearch(e.target.value);
                      if (!showIndustryDropdown) setShowIndustryDropdown(true);
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
                          onClick={() => {
                            setFilters({ ...filters, industry: "" });
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
                              onClick={() => {
                                setFilters({
                                  ...filters,
                                  industry: industry.name,
                                });
                                setIndustrySearch("");
                                setShowIndustryDropdown(false);
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
                      setStateSearch(e.target.value);
                      if (!showStateDropdown) setShowStateDropdown(true);
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
                      setCitySearch(e.target.value);
                      if (!showCityDropdown) setShowCityDropdown(true);
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
                          onClick={() => {
                            setFilters({ ...filters, city: "", city_id: "" });
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
          <h2 className="text-lg font-medium text-gray-800">Company List</h2>
          <h2 className="flex items-center gap-1 text-lg font-medium text-gray-800">
            <p>Total Companies :</p> {totalRecords}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Company Name & Code", "Industry", "Status", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Building className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No companies found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first company by clicking "Add New Company"
                        above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                companies.map((company, index) => (
                  <motion.tr
                    key={`${company.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(company)}
                  >
                    <td className="px-6 cursor-pointer italic py-4 text-sm text-gray-900 font-medium">
                      {company.company_name} - {company.company_code}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-medium text-blue-600">
                        {company.industry?.name || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          company.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {company.status === 1 ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={() => openViewModal(company)}
                          className="text-gray-600 hover:text-green-600"
                          title="View Company"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/agent/company/edit/${company.id}`)
                          }
                          className="text-gray-600 hover:text-blue-600"
                          title="Edit Company"
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(company.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete Company"
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
      {companies.length > 0 && (
        <motion.div className="flex items-center justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${
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
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition ${
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
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            Next
          </button>
        </motion.div>
      )}

      <AgentCompanyViewModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={closeViewModal}
      />
    </motion.div>
  );
};

export default AgentCompanyListing;
