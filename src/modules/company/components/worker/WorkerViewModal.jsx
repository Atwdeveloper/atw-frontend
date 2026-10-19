import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Briefcase,
  Shield,
  Building,
  Award,
  Activity,
  MapPin,
  CreditCard,
  FileText,
  UserCircle,
} from "lucide-react";

const WorkerViewModal = ({ worker, isOpen, onClose }) => {
  if (!worker) return null;

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

  const isActive = worker.status === 1 || worker.status === true;
  const statusText = isActive ? "Active" : "Inactive";

  return (
    <AnimatePresence>
      {isOpen && worker && (
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
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {worker.full_name ||
                        `${worker.first_name} ${worker.last_name}`}
                    </h3>
                    {worker.worker_code && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Worker Code: {worker.worker_code}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {statusText}
                      </span>
                      {worker.designation?.name && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {worker.designation.name}
                        </span>
                      )}
                      {worker.industry?.name && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                          {worker.industry.name}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard
                  icon={<Mail className="text-blue-500" />}
                  label="Email"
                  value={worker.work_email || worker.email || "Not Provided"}
                />
                <StatCard
                  icon={<Phone className="text-green-500" />}
                  label="Phone"
                  value={
                    worker.mobile_number || worker.mobile || "Not Provided"
                  }
                />
              </div>

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card
                  title="Personal Information"
                  icon={<User className="text-indigo-500" />}
                >
                  <div className="space-y-4">
                    <DetailItem
                      icon={<User size={16} />}
                      label="Full Name"
                      value={
                        worker.full_name ||
                        `${worker.first_name} ${worker.last_name}`.trim()
                      }
                    />
                    <DetailItem
                      icon={<Hash size={16} />}
                      label="Worker Code"
                      value={worker.worker_code || "N/A"}
                    />
                    <DetailItem
                      icon={<Mail size={16} />}
                      label="Email"
                      value={
                        worker.work_email || worker.email || "Not Provided"
                      }
                    />
                    <DetailItem
                      icon={<Phone size={16} />}
                      label="Mobile"
                      value={
                        worker.mobile_number || worker.mobile || "Not Provided"
                      }
                    />
                    <DetailItem
                      icon={<MapPin size={16} />}
                      label="Work Location"
                      value={worker.work_location || "Not Provided"}
                    />
                  </div>
                </Card>

                {/* Work & Experience */}
                <Card
                  title="Work Details"
                  icon={<Briefcase className="text-green-500" />}
                >
                  <div className="space-y-4">
                    <DetailItem
                      icon={<Building size={16} />}
                      label="Industry"
                      value={worker.industry?.name || "N/A"}
                    />
                    <DetailItem
                      icon={<Briefcase size={16} />}
                      label="Designation"
                      value={worker.designation?.name || "N/A"}
                    />
                    <DetailItem
                      icon={<Award size={16} />}
                      label="Experience"
                      value={
                        worker.experience ? `${worker.experience} yrs` : "N/A"
                      }
                    />
                    <DetailItem
                      icon={<Building size={16} />}
                      label="Department"
                      value={worker.department?.name || "N/A"}
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Reusable Components
const Card = ({ title, icon, children }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    {children}
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    {icon && (
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
    )}
    {!icon && (
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
    )}
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

export default WorkerViewModal;
