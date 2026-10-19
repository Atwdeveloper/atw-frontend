import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Shield,
  Award,
  Activity,
  Clock,
} from "lucide-react";

const StaffViewModal = ({
  staff,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  if (!staff) return null;

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status display
  const isActive = staff.status === true; // status is a boolean
  const statusText = isActive ? "Active" : "Inactive";

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
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
          >
            {/* ---------- Header ---------- */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {staff.name}
                    </h3>
                    {staff.email && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {staff.email} • Staff ID: {staff.id}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {/* Status badge */}
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {statusText}
                      </span>
                      {/* Designation badge */}
                      {/* {staff.designation && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {staff.designation}
                        </span>
                      )} */}
                      {/* Permission Profile badge */}
                      {staff.permission_profile && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                          {staff.permission_profile}
                        </span>
                      )}
                    </div>
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

            {/* ---------- Content ---------- */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Quick Stats - 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* <StatCard
                  icon={<Mail className="text-blue-500" />}
                  label="Email"
                  value={staff.email || "Not Provided"}
                /> */}
                <StatCard
                  icon={<Phone className="text-green-500" />}
                  label="Phone"
                  value={staff.phone || "Not Provided"}
                />
                <StatCard
                  icon={<Briefcase className="text-orange-500" />}
                  label="Designation"
                  value={staff.designation || "Not Assigned"}
                />
                <StatCard
                  icon={<Activity className="text-purple-500" />}
                  label="Status"
                  value={statusText}
                  status={isActive}
                />
              </div>

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <Card
                  styling="col-span-1"
                  title="Personal Information"
                  icon={<User className="text-indigo-500" />}
                >
                  <div className="space-y-4">
                    <DetailItem
                      icon={<User size={16} />}
                      label="Full Name"
                      value={staff.name}
                    />

                    <DetailItem
                      icon={<Mail size={16} />}
                      label="Email Address"
                      value={staff.email || "Not Provided"}
                    />
                    <DetailItem
                      icon={<Phone size={16} />}
                      label="Phone Number"
                      value={staff.phone || "Not Provided"}
                    />
                    <DetailItem
                      icon={<Calendar size={16} />}
                      label="Date of Joining"
                      value={formatDate(staff.date_of_joining)}
                    />
                    <DetailItem
                      icon={<Clock size={16} />}
                      label="Last Updated"
                      value={formatDate(staff.updated_at) || "N/A"}
                    />
                  </div>
                </Card>

                {/* Role & Permissions Card */}
                <Card
                  styling="col-span-1"
                  title="Role & Permissions"
                  icon={<Shield className="text-green-500" />}
                >
                  <div className="space-y-4">
                    {/* <DetailItem
                      icon={<Briefcase size={16} />}
                      label="Designation"
                      value={staff.designation || "Not Assigned"}
                    />
                */}
                    <DetailItem
                      icon={<Award size={16} />}
                      label="Role"
                      value={staff.role || "staff"}
                    />
                    <DetailItem
                      icon={<Shield size={16} />}
                      label="Permission Profile"
                      value={staff.permission_profile || "Not Assigned"}
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* ---------- Footer ---------- */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Staff since: {formatDate(staff.created_at)}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(staff);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ---------- Reusable Components ----------
const Card = ({ title, icon, children, styling }) => (
  <div
    className={`bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 ${styling}`}
  >
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
      {value || "—"}
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
