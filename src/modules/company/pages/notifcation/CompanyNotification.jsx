import React, { useState } from "react";
import {
  Bell,
  Building,
  Users,
  Briefcase,
  AlertCircle,
  Filter,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useCompanyNotification } from "../../companyhooks/useCompanyNotification";

const CompanyNotification = () => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    currentPage,
    lastPage,
    totalItems,
    perPage,
    goToPage,
    nextPage,
    prevPage,
  } = useCompanyNotification();

  // State for left column filter (All or Unread)
  const [leftFilter, setLeftFilter] = useState("all");

  // Helper: Determine if a notification is a "request notification"
  const isRequestNotification = (notification) => {
    const type = notification.type?.toLowerCase() || "";
    return (
      type.includes("withdrawal") ||
      type.includes("approval") ||
      type.includes("request")
    );
  };

  // Split notifications: left (non‑request) and right (request)
  const leftNotifications = notifications.filter(
    (n) => !isRequestNotification(n),
  );
  const rightNotifications = notifications.filter((n) =>
    isRequestNotification(n),
  );

  // Filter left notifications based on read status
  const filteredLeftNotifications = leftNotifications.filter((n) => {
    if (leftFilter === "all") return true;
    return !n.read;
  });

  // Helper to get icon and color by notification type
  const getIconByType = (type) => {
    if (type.includes("company")) return <Building className="w-5 h-5" />;
    if (type.includes("worker")) return <Users className="w-5 h-5" />;
    if (type.includes("job")) return <Briefcase className="w-5 h-5" />;
    if (type.includes("withdrawal") || type.includes("approval"))
      return <AlertCircle className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  const getColorByType = (type) => {
    if (type.includes("company")) return "text-blue-600 bg-blue-100";
    if (type.includes("worker")) return "text-green-600 bg-green-100";
    if (type.includes("job")) return "text-purple-600 bg-purple-100";
    if (type.includes("withdrawal")) return "text-red-600 bg-red-100";
    if (type.includes("approval")) return "text-orange-600 bg-orange-100";
    return "text-gray-600 bg-gray-100";
  };

  // Render a single notification item
  const NotificationItem = ({ notification, onMarkRead, onDelete }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
        !notification.read ? "bg-blue-50/50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${getColorByType(notification.type)}`}>
          {getIconByType(notification.type)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{notification.description}</p>

              {/* Additional details from payload */}
              <div className="flex flex-wrap gap-3 mt-2">
                {notification.companyName && (
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Company: {notification.companyName}
                  </span>
                )}
                {notification.workerName && (
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Worker: {notification.workerName}
                  </span>
                )}
                {notification.jobTitle && (
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Job: {notification.jobTitle}
                  </span>
                )}
                {notification.amount && (
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Amount: {notification.amount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-gray-500">{notification.time}</span>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Pagination controls
  const renderPagination = () => {
    if (totalItems === 0) return null;

    const pageNumbers = [];
    for (let i = 1; i <= lastPage; i++) {
      pageNumbers.push(i);
    }

    // Show limited page numbers with ellipsis if many pages
    const maxVisible = 5;
    let visiblePages = pageNumbers;
    if (pageNumbers.length > maxVisible) {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(lastPage, start + maxVisible - 1);
      visiblePages = pageNumbers.slice(start - 1, end);
      if (start > 1) visiblePages = [1, "...", ...visiblePages];
      if (end < lastPage) visiblePages = [...visiblePages, "...", lastPage];
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * perPage + 1} to{" "}
          {Math.min(currentPage * perPage, totalItems)} of {totalItems} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {visiblePages.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={nextPage}
            disabled={currentPage === lastPage}
            className={`p-2 rounded-md ${
              currentPage === lastPage
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4 md:p-6 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER */}
      <motion.div
        className="relative overflow-hidden rounded-2xl mb-6 w-full mx-auto"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-2">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Notifications
              </motion.h1>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-lg text-slate-600 font-medium">
                Stay updated with platform activities
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* TWO‑COLUMN LAYOUT */}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN – All / Unread Notifications (non‑request) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Left Column Header with Toggle */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Notifications</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLeftFilter("all")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    leftFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({leftNotifications.length})
                </button>
                <button
                  onClick={() => setLeftFilter("unread")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    leftFilter === "unread"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread ({leftNotifications.filter((n) => !n.read).length})
                </button>
              </div>
            </div>

            {/* Left Column Content */}
            <div className="divide-y">
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notifications...</p>
                  </motion.div>
                ) : filteredLeftNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {leftFilter === "unread"
                        ? "All notifications are read"
                        : "No notifications in this list"}
                    </p>
                  </motion.div>
                ) : (
                  filteredLeftNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyNotification;
