import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  MapPin,
  Calendar,
  Hash,
  FileText,
  Shield,
  Users,
  Trash2,
  Fingerprint,
  ShieldCheck,
  PhoneCall,
  Smartphone as SmartphoneIcon,
  Star,
  History,
  ChevronDown,
  ChevronUp,
  FileEdit,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAdminPermissions } from "../../../../common/hooks/useAdminPermissions";

const StaffViewModal = ({
  staff,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Function to get actor name
  const getActorName = (actorType, actorId) => {
    switch (actorType) {
      case "admin":
        return `Admin #${actorId}`;
      case "company":
        return `Company #${actorId}`;
      case "worker":
        return `Worker #${actorId}`;
      default:
        return `User #${actorId}`;
    }
  };
  // Function to render compact changes summary
  const renderCompactChanges = (changes) => {
    if (!changes || Object.keys(changes).length === 0) return "No changes";

    const changeCount = Object.keys(changes).length;
    if (changeCount === 1) {
      const [field] = Object.keys(changes);
      return `Updated ${field.replace(/_/g, " ")}`;
    }
    return `${changeCount} fields updated`;
  };

  // Function to get action icon and color
  const getActionInfo = (action) => {
    switch (action) {
      case "created":
        return {
          icon: <FileEdit className="w-4 h-4" />,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
          label: "Created",
        };
      case "updated":
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          label: "Updated",
        };
      case "deleted":
        return {
          icon: <Trash2 className="w-4 h-4" />,
          color: "text-rose-600 dark:text-rose-400",
          bgColor: "bg-rose-100 dark:bg-rose-900/20",
          label: "Deleted",
        };
      default:
        return {
          icon: <FileEdit className="w-4 h-4" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          label: action,
        };
    }
  };

  const renderHistoryDetails = () => {
    if (!selectedHistory) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHistory(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Change Details
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(selectedHistory.performed_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                {/* Action Info */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div
                    className={`p-2 rounded-lg ${getActionInfo(selectedHistory.action).bgColor}`}
                  >
                    {getActionInfo(selectedHistory.action).icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {getActionInfo(selectedHistory.action).label}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      By{" "}
                      {getActorName(
                        selectedHistory.actor_type,
                        selectedHistory.actor_id,
                      )}
                    </p>
                  </div>
                </div>

                {/* Changes */}
                {selectedHistory.changes &&
                Object.keys(selectedHistory.changes).length > 0 ? (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Changes ({Object.keys(selectedHistory.changes).length})
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedHistory.changes).map(
                        ([field, change], index) => (
                          <div
                            key={index}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                          >
                            <div className="bg-slate-50 dark:bg-slate-700/50 px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                              <span className="font-medium text-sm text-slate-700 dark:text-slate-300 capitalize">
                                {change.field.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                              <div className="px-3 py-2">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                  Previous Value
                                </div>
                                <div className="text-sm">
                                  {change.old || (
                                    <span className="text-slate-400 italic">
                                      Empty
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="px-3 py-2">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                  New Value
                                </div>
                                <div className="text-sm">
                                  {change.new || (
                                    <span className="text-slate-400 italic">
                                      Empty
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                    No specific changes recorded
                  </div>
                )}

                {/* Batch Info */}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Batch ID:{" "}
                  <span className="font-mono">{selectedHistory.batch_id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  if (!staff) return null;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to format KYC numbers
  const formatKYC = (number) => {
    if (!number) return "Not Provided";
    return number;
  };

  // Helper function to mask bank account number
  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "Not Provided";
    return `****${accountNumber.slice(-4)}`;
  };
  const renderRating = () => {
    const rating = staff.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            if (index < fullStars) {
              return (
                <Star
                  key={index}
                  className="w-4 h-4 text-amber-500 fill-amber-500"
                />
              );
            } else if (index === fullStars && hasHalfStar) {
              return (
                <Star
                  key={index}
                  className="w-4 h-4 text-amber-500 fill-amber-500"
                />
              );
            } else {
              return <Star key={index} className="w-4 h-4 text-gray-300" />;
            }
          })}
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {rating.toFixed(1)}
        </span>
        {staff.review_count && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({staff.review_count} reviews)
          </span>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && staff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {staff.name} {staff.staff_code}
                    </h3>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        staff.status === 1
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {staff.status === 1 ? "Active" : "Inactive"}
                    </span>

                    {/* Rating display */}
                    {staff.rating !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg">
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-semibold">
                            {staff.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Details */}
                  <Card
                    title="Personal Details"
                    icon={<User className="text-indigo-500" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        icon={<User size={16} />}
                        label="Full Name"
                        value={staff.name || "Not Provided"}
                      />
                      <DetailItem
                        icon={<Hash size={16} />}
                        label="Staff ID"
                        value={staff.staff_code || "Not Provided"}
                      />
                      <DetailItem
                        icon={<Mail size={16} />}
                        label="Email Address"
                        value={staff.email || "Not Provided"}
                      />
                      <DetailItem
                        icon={<PhoneCall size={16} />}
                        label="Contact Number"
                        value={staff.phone || "Not Provided"}
                      />
                      {/* <DetailItem
                        icon={<Briefcase size={16} />}
                        label="Designation"
                        value={staff.designation || "Not Provided"}
                      /> */}
                      <DetailItem
                        icon={<Shield size={16} />}
                        label="Role"
                        value={staff.permission_profile_name || "Not Assigned"}
                      />
                      <DetailItem
                        icon={<Calendar size={16} />}
                        label="Joining Date"
                        value={formatDate(staff.date_of_joining)}
                      />
                      <DetailItem
                        icon={<Calendar size={16} />}
                        label="Date of Birth"
                        value={formatDate(staff.date_of_birth)}
                      />
                      <DetailItem
                        icon={<Users size={16} />}
                        label="Gender"
                        value={staff.gender || "Not Provided"}
                      />
                      <DetailItem
                        icon={<MapPin size={16} />}
                        label="Location"
                        value={
                          staff.city && staff.state
                            ? `${staff.city}, ${staff.state}`
                            : staff.city || staff.state || "Not Provided"
                        }
                      />
                      {/* <DetailItem label="Rating" value={renderRating()} /> */}
                    </div>
                  </Card>

                  {/* KYC Details */}
                  <Card
                    title="KYC Details"
                    icon={<ShieldCheck className="text-green-500" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        icon={<Fingerprint size={16} />}
                        label="Aadhar Number"
                        value={formatKYC(staff.aadhar_number)}
                      />
                      <DetailItem
                        icon={<FileText size={16} />}
                        label="PAN Number"
                        value={formatKYC(staff.pan_number)}
                      />
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* History Information - Compact Version */}
                  <Card
                    title="Change History"
                    icon={<History className="text-amber-500" />}
                  >
                    <div className="space-y-2">
                      {staff.activity_history &&
                      staff.activity_history.length > 0 ? (
                        <>
                          {/* History List */}
                          <div
                            className={`space-y-1 ${expandedHistory ? "" : "max-h-48 overflow-y-auto"}`}
                          >
                            {staff.activity_history.map(
                              (historyItem, index) => (
                                <motion.div
                                  key={historyItem.batch_id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="group"
                                >
                                  <button
                                    onClick={() =>
                                      setSelectedHistory(historyItem)
                                    }
                                    className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`p-1 rounded ${getActionInfo(historyItem.action).bgColor}`}
                                        >
                                          <div
                                            className={`${getActionInfo(historyItem.action).color}`}
                                          >
                                            {
                                              getActionInfo(historyItem.action)
                                                .icon
                                            }
                                          </div>
                                        </div>
                                        <div className="text-left">
                                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {getActorName(
                                              historyItem.actor_type,
                                              historyItem.actor_id,
                                            )}
                                          </p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {renderCompactChanges(
                                              historyItem.changes,
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(
                                          historyItem.performed_at,
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </button>
                                </motion.div>
                              ),
                            )}
                          </div>

                          {/* Show More/Less Toggle */}
                          {staff.activity_history.length > 3 && (
                            <button
                              onClick={() =>
                                setExpandedHistory(!expandedHistory)
                              }
                              className="w-full flex items-center justify-center gap-1 p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              {expandedHistory ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show More ({
                                    staff.activity_history.length
                                  }{" "}
                                  records)
                                </>
                              )}
                            </button>
                          )}

                          {/* Summary */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-600 dark:text-slate-400">
                                Total records:
                              </span>
                              <span className="font-medium">
                                {staff.activity_history.length}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                Last updated:
                              </span>
                              <span className="font-medium">
                                {formatDate(
                                  staff.activity_history[0]?.performed_at,
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No history records found
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Last updated: {formatDate(staff.updated_at)}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                  {hasPermission("staff", "edit") && (
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/admin/staff/edit/${staff.id}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* History Details Modal */}
      {selectedHistory && renderHistoryDetails()}
    </AnimatePresence>
  );
};

// Reusable Components
const Card = ({ title, icon, children }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    {children}
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-slate-900 dark:text-slate-100 font-medium break-words">
      {value}
    </span>
  </div>
);

const StatCard = ({ icon, label, value, status }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </p>
        <p
          className={`text-lg font-medium break-all ${
            status !== undefined
              ? status
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
              : "text-slate-900 dark:text-slate-100"
          }`}
        >
          {value}
        </p>
      </div>
      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

export default StaffViewModal;
