import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  Wallet,
  Briefcase,
  FileText,
  Shirt,
  Bell,
  Star,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../../common/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { workerLogoutAPI } from "../../../api/worker/workerAuthAPI";
import { motion, AnimatePresence } from "framer-motion";
import { showLogoutConfirmation } from "../../company/components/LogoutModal";
import { getUnreadCountAPI } from "../../../api/worker/workerNotificationAPI";
import ThemeToggle from "../../../common/components/ThemeToggle";

const Header = ({ profile }) => {
  const { logout, user, role } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCountAPI();

      setNewNotifications(res?.data?.unread_count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    if (user && role === "worker") {
      fetchUnreadCount();
    }
  }, [user, role]);

  // const handleLogout = () => {
  //   showLogoutConfirmation(() => {
  //     logout();
  //     Swal.fire({
  //       title: "Logged Out!",
  //       text: "You have been successfully logged out.",
  //       icon: "success",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     }).then(() => {
  //       navigate("/login", { replace: true });
  //     });
  //   });
  //   setIsDropdownOpen(false);
  // };
  const handleLogout = () => {
    showLogoutConfirmation(async () => {
      try {
        // Call logout API
        await workerLogoutAPI();

        // Clear local authentication
        logout();

        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login", { replace: true });
        });
      } catch (error) {
        console.error("Logout Error:", error);

        Swal.fire({
          title: "Logout Failed",
          text:
            error?.response?.data?.message ||
            "Unable to logout. Please try again.",
          icon: "error",
        });
      }
    });

    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goTo = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogoClick = () => {
    // Redirect based on role
    if (role === "worker") {
      navigate("/worker/dashboard");
    } else if (role === "company") {
      navigate("/company/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const workerRating = profile?.average_rating || 0;
  const isKycApproved = profile?.kyc_approved;

  return (
    <div className="bg-white flex items-center justify-center border-b sticky top-0 z-50">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="bg-white w-full max-w-7xl px-4 py-3 flex justify-between items-center"
      >
        {/* LOGO - Clickable */}
        <motion.div
          className="text-2xl font-bold text-gray-800 cursor-pointer"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleLogoClick}
        >
          <img
            src="/images/worker/Anytime-Logo.png"
            alt="Anytime Work Logo"
            className="h-14 w-auto"
          />
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          className="flex items-center gap-3 ml-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Theme Toggle */}
          <ThemeToggle showLabel={false} variant="minimal" size="sm" />

          {/* LOGIN BUTTON IF NOT AUTHENTICATED */}
          {!user && (
            <button
              onClick={() => navigate("/login/user-select")}
              className="bg-gradient-to-r from-[#3885C9] to-[#661E84] font-semibold text-white px-6 py-2 rounded-lg"
            >
              Login
            </button>
          )}
          {user && role === "worker" && (
            <div className="flex items-center gap-3">
              {/* NOTIFICATION BUTTON */}
              <button
                onClick={() => navigate("/worker/notifications")}
                className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <Bell size={18} className="text-gray-600" />
                {newNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {newNotifications}
                  </span>
                )}
              </button>

              {/* WORKER DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-md"
                  >
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
                      <User size={20} className="text-white" />
                    )}
                  </motion.div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.first_name || "Worker"}
                    </p>
                    {/* <p className="text-xs text-gray-500">Worker</p> */}
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* DROPDOWN MENU */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 overflow-hidden"
                    >
                      {/* USER INFO HEADER WITH RATING */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {profile?.first_name} {profile?.last_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {profile?.worker_code}
                            </p>
                          </div>
                          {/* Rating badge */}
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star
                              size={12}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="text-xs font-semibold text-yellow-700">
                              {workerRating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PROFILE */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goTo("/worker/profile")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0">
                          {profile?.worker?.enroll_image ||
                          profile?.enroll_image ||
                          profile?.photo ? (
                            <img
                              src={
                                profile.worker?.enroll_image ||
                                profile.enroll_image ||
                                profile.photo
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Profile</p>
                          <p className="text-xs text-gray-500">
                            Manage your profile
                          </p>
                        </div>
                      </motion.button>

                      {/* DOCUMENTS */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goTo("/worker/documents")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FileText size={16} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">Documents</p>
                          <p className="text-xs text-gray-500">
                            Manage your documents
                          </p>
                        </div>
                      </motion.button>

                      {/* APPLIED VACANCIES */}
                      {!!isKycApproved && (
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goTo("/worker/vacancies")}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Briefcase size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Applied Vacancies</p>
                            <p className="text-xs text-gray-500">
                              Jobs you've applied for
                            </p>
                          </div>
                        </motion.button>
                      )}
                      {/* WALLET */}
                      {!!isKycApproved && (
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goTo("/worker/wallet")}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Wallet size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Wallet</p>
                            <p className="text-xs text-gray-500">
                              View your earnings
                            </p>
                          </div>
                        </motion.button>
                      )}
                      {/* DRESS ORDERS */}
                      {!!isKycApproved && (
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goTo("/worker/dress-orders")}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <Shirt size={16} className="text-pink-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dress Orders</p>
                            <p className="text-xs text-gray-500">
                              View your dress orders
                            </p>
                          </div>
                        </motion.button>
                      )}
                      {/* SUPPORT */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goTo("/worker/support")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-cyan-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                          <MessageCircle size={16} className="text-cyan-600" />
                        </div>

                        <div>
                          <p className="font-medium">Support</p>
                          <p className="text-xs text-gray-500">
                            Contact support team
                          </p>
                        </div>
                      </motion.button>

                      {/* LOGOUT */}
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
            </div>
          )}
        </motion.div>
      </motion.header>
    </div>
  );
};

export default Header;
