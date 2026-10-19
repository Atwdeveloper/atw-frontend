import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  Menu,
  Key,
  ChevronDown,
  Search,
  X,
  Loader,
  Users,
  Building2,
  Package,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../common/hooks/useAuth";
import { useNavigate, generatePath } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { showLogoutConfirmation } from "../../company/components/LogoutModal";
import { getUnreadCountAPI } from "../../../api/agent/agentNotificationAPI";
import { globalSearchAPI } from "../../../api/agent/agentDashboardAPI";
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

// Icon mapping per result type
const typeIcons = {
  worker: Users,
  company: Building2,
  dress_order: Package,
};

const AgentHeader = ({ toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCountAPI();
        const count =
          response?.data?.count || response?.data?.unread_count || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close dropdowns
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleLogout = () => {
    showLogoutConfirmation(() => {
      try {
        logout();
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/agent/login", { replace: true });
        });
      } catch (error) {
        console.error("Logout error:", error);
        Swal.fire({
          title: "Logout Failed",
          text: "There was an error logging out. Please try again.",
          icon: "error",
        });
      }
    });
    setIsDropdownOpen(false);
  };

  const handleResultClick = (result) => {
    const routeMap = {
      worker: "/agent/workers/edit/:id",
      company: "/agent/companies/edit/:id",
      dress_order: "/agent/dress-orders/edit/:id", // adjust if different
    };

    if (routeMap[result.type]) {
      const path = generatePath(routeMap[result.type], { id: result.id });
      setSearchQuery("");
      setShowResults(false);
      navigate(path);
    } else {
      Swal.fire({
        icon: "info",
        title: "Navigation Unavailable",
        text: `Direct detail page for ${result.type} is not implemented yet.`,
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
    navigate("/agent/change-password");
    setIsDropdownOpen(false);
  };

  const handleUserProfile = () => {
    navigate("/agent/profile");
    setIsDropdownOpen(false);
  };

  const handleNotificationClick = () => {
    navigate("/agent/notifications");
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
        className="text-2xl font-bold text-gray-800 cursor-pointer flex items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        onClick={() => navigate("/agent/dashboard")}
      >
        <img
          src="/images/Anytime_Work_logo.png"
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
            placeholder="Search workers, companies, dress orders..."
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNotificationClick}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          {/* <Bell size={22} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -translate-y-1/2 translate-x-1/2">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )} */}
        </motion.button>

        {/* User Profile Dropdown */}
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
                {user?.full_name ||
                  `${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute overflow-hidden right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition">
                    <div className="flex flex-col leading-tight">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user?.agent_code || ""}
                      </p>
                      <span className="text-[12px] text-gray-500">
                        Agent Code
                      </span>
                    </div>
                  </div>
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

export default AgentHeader;
