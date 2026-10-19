import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  ChevronRight,
  X,
  LogOut,
  Shirt,
  User,
  ChevronLeft,
  Activity,
  Menu,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../common/hooks/useAuth";
import { showLogoutConfirmation } from "../../company/components/LogoutModal";
import Swal from "sweetalert2";

// Temporary permission hook – replace with your real agent permissions if needed
const useAgentPermissions = () => {
  return {
    hasPermission: () => true,
    loading: false,
    permissions: {},
  };
};

const menuItems = [
  // {
  //   id: "dashboard",
  //   label: "Dashboard",
  //   icon: LayoutDashboard,
  //   path: "/agent/dashboard",
  //   skipPermissionCheck: true,
  // },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/agent/profile",
    skipPermissionCheck: true,
  },
  {
    id: "company",
    label: "Companies",
    icon: Briefcase,
    path: "/agent/company/list",
    skipPermissionCheck: true,
  },
  {
    id: "worker",
    label: "Workers",
    icon: Users,
    path: "/agent/worker/list",
    skipPermissionCheck: true,
  },

  {
    id: "dress-order",
    label: "Dress Order",
    icon: Shirt,
    path: "/agent/dress-orders",
    skipPermissionCheck: true,
  },
  // {
  //   id: "wallet",
  //   label: "My Earning",
  //   icon: Wallet,
  //   path: "/agent/wallet",
  //   skipPermissionCheck: true,
  // },
];

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: "spring", duration: 0.2, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const sidebarWidthVariants = {
  expanded: {
    width: "256px",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  collapsed: {
    width: "80px",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function AgentSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { hasPermission, loading, permissions } = useAgentPermissions();

  // Collapse state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("agentSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("agentSidebarCollapsed", JSON.stringify(newState));
    if (newState) {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (id) => {
    if (isCollapsed) return;
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const isActivePath = (path) => location.pathname === path;

  // Permission checker – simplified for now
  const canAccess = (module, action) => {
    if (loading || !permissions) return false;
    if (!module || !action) return true;
    try {
      return hasPermission(module, action);
    } catch (error) {
      console.error("Permission check error:", error);
      return false;
    }
  };

  // Open dropdown based on current path
  useEffect(() => {
    if (isCollapsed) {
      setOpenDropdown(null);
      return;
    }

    // Special case for path-based dropdowns
    const activeParent = menuItems.find((item) =>
      item.subItems?.some((sub) => location.pathname.startsWith(sub.path)),
    );
    setOpenDropdown(activeParent ? activeParent.id : null);
  }, [location.pathname, isCollapsed]);

  // Check if a parent menu item should be considered active
  const isParentActive = (item) => {
    if (
      item.requiredPermission &&
      !canAccess(item.requiredPermission.module, item.requiredPermission.action)
    ) {
      return false;
    }
    const base = `/agent/${item.id}`;
    return location.pathname.startsWith(base);
  };

  // Skeleton loader while permissions are loading
  const renderSkeletonLoader = () => (
    <div className="space-y-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`h-12 bg-blue-500/30 dark:bg-gray-700/40 rounded animate-pulse ${isCollapsed ? "w-12 mx-auto" : ""}`}
        ></div>
      ))}
    </div>
  );

  // Tooltip component for collapsed state
  const Tooltip = ({ children, content }) => {
    if (!isCollapsed) return children;

    return (
      <div className="relative group">
        {children}
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {content}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    );
  };

  // Render all menu items with permission filtering
  const renderMenuItems = () => {
    return menuItems
      .filter((item) => {
        if (item.skipPermissionCheck) return true;
        if (item.requiredPermission) {
          return canAccess(
            item.requiredPermission.module,
            item.requiredPermission.action,
          );
        }
        return false;
      })
      .map((item) => {
        const Icon = item.icon;
        const isDropdown = !!item.subItems;
        const isDropdownOpen = openDropdown === item.id && !isCollapsed;
        const isActive = isParentActive(item);

        const filteredSubItems =
          item.subItems?.filter((sub) => {
            if (sub.requiredPermission) {
              return canAccess(
                sub.requiredPermission.module,
                sub.requiredPermission.action,
              );
            }
            return true;
          }) || [];

        if (isDropdown && filteredSubItems.length === 0) {
          return null;
        }

        return (
          <motion.div key={item.id}>
            <Tooltip content={item.label}>
              <motion.button
                variants={itemVariants}
                initial="hidden"
                onClick={() => {
                  if (isDropdown) {
                    toggleDropdown(item.id);
                  } else {
                    navigate(item.path);
                  }
                }}
                whileHover={{
                  scale: isCollapsed ? 1.1 : 1.05,
                  x: isCollapsed ? 0 : 5,
                }}
                animate={[
                  "visible",
                  isActive
                    ? {
                        scale: isCollapsed ? 1.1 : 1.05,
                        x: isCollapsed ? 0 : 5,
                      }
                    : {
                        scale: 1,
                        x: 0,
                      },
                ]}
                className={`w-full flex items-center justify-between ${isCollapsed ? "px-4" : "px-6"} py-4 mb-2 transition-colors ${
                  isActive
                    ? "bg-orange-500 shadow-lg"
                    : "hover:bg-blue-700 dark:hover:bg-gray-800 bg-transparent"
                }`}
                style={{
                  borderTopRightRadius: "0.5rem",
                  borderBottomRightRadius: "0.5rem",
                  justifyContent: isCollapsed ? "center" : "space-between",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {isDropdown && filteredSubItems.length > 0 && !isCollapsed && (
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                )}
              </motion.button>
            </Tooltip>

            <AnimatePresence>
              {isDropdownOpen &&
                filteredSubItems.length > 0 &&
                !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8 mt-2 space-y-1"
                  >
                    {filteredSubItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = location.pathname === sub.path;

                      return (
                        <Tooltip key={sub.path} content={sub.label}>
                          <motion.button
                            onClick={() => navigate(sub.path)}
                            whileHover={{ scale: 1.05, x: 5 }}
                            animate={
                              isSubActive
                                ? { scale: 1.05, x: 5 }
                                : { scale: 1, x: 0 }
                            }
                            className={`w-full flex items-center gap-3 py-2 pl-4 pr-2 mb-1 rounded-md ${
                              isSubActive
                                ? "bg-orange-500 text-white"
                                : "hover:bg-blue-700 dark:hover:bg-gray-800 text-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <SubIcon size={18} />
                              {!isCollapsed && (
                                <span className="font-medium">{sub.label}</span>
                              )}
                            </div>
                          </motion.button>
                        </Tooltip>
                      );
                    })}
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        );
      });
  };

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
          background: "#ffffff",
          color: "#333333",
        }).then(() => {
          navigate("/agent/login", { replace: true });
          onClose(); // Close mobile sidebar
        });
      } catch (error) {
        console.error("Logout error:", error);
        Swal.fire({
          title: "Logout Failed",
          text: "There was an error logging out. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#ffffff",
          color: "#333333",
        });
      }
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarWidthVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="hidden md:flex flex-col bg-gradient-to-b from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-950 text-white h-full shadow-lg relative z-20 shrink-0"
      >
        {/* Header with Agent Panel and Toggle Button */}
        <div className="relative p-4 border-b border-blue-500/30 dark:border-gray-700/60 flex items-center justify-between gap-1">
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold whitespace-nowrap"
              >
                Agent Panel
              </motion.span>
            )}
          </div> */}

          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          style={{ height: "calc(100% - 40px)" }}
          className="flex-1 overflow-y-auto overflow-x-hidden py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {renderMenuItems()}
        </motion.div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-64 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-950 text-white min-h-screen shadow-lg flex flex-col"
            >
              {/* Mobile Header */}
              <div className="p-4 border-b border-blue-500/30 dark:border-gray-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">Agent Panel</span>
                </div>
                <button onClick={onClose} className="text-white p-1">
                  <X size={24} />
                </button>
              </div>

              <motion.div
                className="mt-4 flex-grow"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
              >
                {renderMenuItems()}
              </motion.div>

              {/* Logout Button for Mobile */}
              {!loading && permissions && (
                <motion.button
                  variants={itemVariants}
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="md:hidden w-full flex items-center justify-between px-6 py-4 mb-2 hover:bg-red-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </div>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar with Menu Toggle (only show when sidebar is closed) */}
      {!isOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-950 text-white p-4 shadow-lg z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onClose(true)}
              className="p-2 hover:bg-blue-700/50 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Agent Panel</h1>
            <div className="w-10"></div>
          </div>
        </div>
      )}
    </>
  );
}
