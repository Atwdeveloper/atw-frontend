import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  Menu,
  Key,
  ChevronDown,
  Bell,
  Search,
  X,
  Loader,
  Users,
  Briefcase,
  UserCog,
  Award,
  Factory,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../common/hooks/useAuth";
import { logoutAPI } from "../../../api/company/companyAuthAPI";
import { useNavigate, generatePath } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { showLogoutConfirmation } from "./LogoutModal";
import Cookies from "js-cookie";
import { getUnreadCountAPI } from "../../../api/company/companyNotificationAPI";
import { globalSearchAPI } from "../../../api/company/companyDashboardAPI";
import ThemeToggle from "../../../common/components/ThemeToggle";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const typeIcons = {
  worker: Users,
  vacancy: Briefcase,
  staff: UserCog,
  designation: Award,
  industry: Factory,
};

const Header = ({ toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const isOwner = user?.role === "owner";
  // Logo from cookie
  useEffect(() => {
    const logoFromCookie = Cookies.get("logo_url");
    if (logoFromCookie) setLogoUrl(logoFromCookie);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCountAPI();
      const count = response?.data?.unread_count ?? 0;
      setNotificationCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      setIsSearching(true);
      try {
        const response = await globalSearchAPI({ search: debouncedSearch });
        const results = response?.data?.data || response?.data || [];
        setSearchResults(Array.isArray(results) ? results : []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedSearch]);

  // const handleLogout = () => {
  //   showLogoutConfirmation(() => {
  //     try {
  //       logout();
  //       Cookies.remove("industry_id");
  //       Swal.fire({
  //         title: "Logged Out!",
  //         text: "You have been successfully logged out.",
  //         icon: "success",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       }).then(() => {
  //         navigate("/company/login", { replace: true });
  //       });
  //     } catch (error) {
  //       console.error("Logout error:", error);
  //       Swal.fire({
  //         title: "Logout Failed",
  //         text: "There was an error logging out. Please try again.",
  //         icon: "error",
  //       });
  //     }
  //   });
  //   setIsDropdownOpen(false);
  // };
  const handleLogout = () => {
    showLogoutConfirmation(async () => {
      try {
        await logoutAPI();

        logout();

        Cookies.remove("industry_id");

        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/company/login", { replace: true });
        });
      } catch (error) {
        console.error("Logout error:", error);

        Swal.fire({
          title: "Logout Failed",
          text: error?.response?.data?.message || "Please try again.",
          icon: "error",
        });
      }
    });

    setIsDropdownOpen(false);
  };
  const handleResultClick = (result) => {
    // Clear search and close dropdown
    setSearchQuery("");
    setShowResults(false);

    // Define correct route mapping for company
    const routeMap = {
      vacancy: "/company/vacancy/edit/:id", // ✅ correct path from router
      staff: "/company/staff/edit/:id", // ✅ correct path from router
    };

    if (routeMap[result.type]) {
      const path = generatePath(routeMap[result.type], { id: result.id });
      navigate(path);
    } else if (result.type === "worker") {
      // No individual worker edit page for company; go to listing
      Swal.fire({
        icon: "info",
        title: "Worker Details",
        text: "Worker details can be viewed from the All Workers page.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/company/all-workers");
    } else {
      // For designation, industry, etc.
      Swal.fire({
        icon: "warning",
        title: "Navigation Unavailable",
        text: `No direct page for ${result.type}. You can filter from the relevant listing page.`,
      });
    }
  };
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === "active" || status === "1") {
      return (
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
        Inactive
      </span>
    );
  };

  const handleChangePassword = () => {
    navigate("/company/configuration/change-password");
    setIsDropdownOpen(false);
  };

  const handleUserProfile = () => {
    navigate("/company/configuration/user-profile");
    setIsDropdownOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm"
    >
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={toggleSidebar}
        className="md:hidden text-gray-700 hover:text-blue-600"
      >
        <Menu size={24} />
      </motion.button>

      {/* Logo */}
      <motion.div
        className="cursor-pointer flex items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        onClick={() => navigate("/company/dashboard")}
      >
        <img
          src={logoUrl || "/images/Anytime_Work_logo.png"}
          alt="Anytime Work Logo"
          className="h-14 w-auto"
        />
      </motion.div>

      {/* Global Search Bar */}
      <div
        className="hidden md:block flex-1 max-w-xl mx-6 relative"
        ref={searchContainerRef}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search workers, vacancies, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader size={16} className="animate-spin text-gray-400" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
            >
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found
                </div>
              ) : (
                <div className="py-1">
                  {searchResults.map((result, idx) => {
                    const IconComponent = typeIcons[result.type] || FileText;
                    return (
                      <motion.button
                        key={`${result.type}-${result.id}-${idx}`}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-3 text-left flex items-start gap-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <IconComponent size={18} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 truncate">
                              {result.label}
                            </span>
                            {result.code && (
                              <span className="text-xs text-gray-500 truncate">
                                ({result.code})
                              </span>
                            )}
                            {getStatusBadge(result.status)}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 capitalize">
                              {result.type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            onClick={() => {
              Swal.fire({
                title: "Search",
                input: "text",
                inputPlaceholder: "Search...",
                showCancelButton: true,
              }).then((result) => {
                if (result.isConfirmed && result.value) {
                  setSearchQuery(result.value);
                }
              });
            }}
          >
            <Search size={20} />
          </button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle showLabel={false} variant="minimal" size="sm" />

        {/* Notification Bell */}
        {isOwner && (
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/company/notifications")}
              className="relative p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={26} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </motion.button>
          </div>
        )}

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-md"
            >
              <User size={20} className="text-white" />
            </motion.div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {/* {user?.name || "Company User"} */}
                {user?.user?.name || "Company User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "Administrator"}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute overflow-hidden right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.user?.name || "Company User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.user?.email || "company@example.com"}
                  </p>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUserProfile}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">User Profile</p>
                    <p className="text-xs text-gray-500">
                      View/Update your profile
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Key size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-xs text-gray-500">
                      Update your login credentials
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 mt-1 border-t border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <LogOut size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Logout</p>
                    <p className="text-xs text-red-400">
                      Sign out from your account
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
