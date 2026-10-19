import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Building,
  FileText,
  Shield,
  CreditCard,
  Home,
  Users,
  Activity,
  CheckCircle,
  Trash2,
  Gift,
  TrendingUp,
  Star,
  Shirt,
  Clock,
  FileEdit,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ViewWorkerAgentModel = ({
  worker,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  if (!worker) return null;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const maskValue = (value) => {
    if (!value) return "Not Provided";

    const str = value.toString();
    return "*".repeat(Math.max(0, str.length - 4)) + str.slice(-4);
  };
  // Helper function to format currency
  const formatCurrency = (amount, bonusType = null) => {
    if (!amount) return "Not Provided";

    // If bonus type is percentage, show as percentage
    if (bonusType === "percentage") {
      return `${parseFloat(amount).toFixed(2)}%`;
    }

    // If bonus type is amount, format as currency
    if (bonusType === "amount") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }

    // Default to amount formatting if no bonus type specified
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderRating = () => {
    const rating = worker.rating || 0;
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
        {worker.review_count && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({worker.review_count} reviews)
          </span>
        )}
      </div>
    );
  };

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

  // Function to render history details modal
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
                                {field.replace(/_/g, " ")}
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
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
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
                      {worker.first_name}{" "}
                      {worker.middle_name ? worker.middle_name + " " : ""}
                      {worker.last_name} - {worker.worker_code}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium">
                        {worker.industry}
                      </span>
                    </div>
                    {/* Rating display */}
                    {worker.rating !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg">
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-semibold">
                            {worker.rating.toFixed(1)}
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
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={<Mail className="text-blue-500" />}
                  label="Work Email"
                  value={worker.work_email || "Not Provided"}
                />
                <StatCard
                  icon={<Phone className="text-green-500" />}
                  label="Mobile"
                  value={maskValue(worker.mobile_number) || "Not Provided"}
                />
                <StatCard
                  icon={<Building className="text-orange-500" />}
                  label="Designation"
                  value={worker.designation || "Not Assigned"}
                />
                <StatCard
                  icon={<Activity className="text-purple-500" />}
                  label="Status"
                  value={worker.status === "active" ? "Active" : "Inactive"}
                  status={worker.status === "active"}
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card
                    title="Basic Information"
                    icon={<User className="text-indigo-500" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        icon={<User size={16} />}
                        label="Full Name"
                        value={`${worker.first_name} ${
                          worker.middle_name ? worker.middle_name + " " : ""
                        }${worker.last_name}`}
                      />
                      <DetailItem
                        icon={<Hash size={16} />}
                        label="Employee Code"
                        value={worker.worker_code || "Not Provided"}
                      />
                      <DetailItem
                        icon={<Calendar size={16} />}
                        label="Date of Joining"
                        value={formatDate(worker.created_at)}
                      />
                      <DetailItem
                        icon={<Calendar size={16} />}
                        label="Date of Birth"
                        value={formatDate(worker.date_of_birth)}
                      />
                      <DetailItem
                        icon={<Users size={16} />}
                        label="Gender"
                        value={worker.gender || "Not Provided"}
                      />
                      <DetailItem
                        icon={<MapPin size={16} />}
                        label="Work Location"
                        value={
                          [worker.current_city_name, worker.current_state_name]
                            .filter(Boolean)
                            .join(", ") || "Not Provided"
                        }
                      />
                      {/* <DetailItem
                        icon={<Briefcase size={16} />}
                        label="Designation"
                        value={worker.designation || "Not Provided"}
                      /> */}

                      {/* Add Experience Field */}
                      <DetailItem
                        icon={<Clock size={16} />}
                        label="Work Experience"
                        value={
                          worker.work_experience
                            ? `${worker.work_experience} ${
                                worker.work_experience === 1 ? "year" : "years"
                              }`
                            : "Not Provided"
                        }
                      />
                      {/* Add Dress Size Field */}
                      <DetailItem
                        icon={<Shirt size={16} />}
                        label="Dress Size"
                        value={worker.dress_size || "Not Provided"}
                      />

                      {/* Rating */}
                      <DetailItem label="Rating" value={renderRating()} />
                    </div>
                  </Card>

                  {/* Personal Details */}
                  <Card
                    title="Personal Details"
                    icon={<Home className="text-blue-500" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        icon={<Users size={16} />}
                        label="Father's Name"
                        value={worker.father_name || "Not Provided"}
                      />
                      <DetailItem
                        icon={<FileText size={16} />}
                        label="PAN Number"
                        value={maskValue(worker.pan_number) || "Not Provided"}
                      />
                      <DetailItem
                        icon={<Shield size={16} />}
                        label="Aadhaar Number"
                        value={maskValue(worker.aadhar_number)}
                      />
                      <div className="md:col-span-2">
                        <DetailItem
                          icon={<MapPin size={16} />}
                          label="Residential Address"
                          value={worker.address || "Not Provided"}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card
                    title="Statutory Details"
                    icon={<Shield className="text-purple-500" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                          <Hash size={16} />
                          <span className="text-sm font-medium">
                            UAN Number
                          </span>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {worker.uan_number || "Not provided"}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-medium">
                          <CheckCircle size={12} />
                          Employee's Provident Fund (EPF)
                        </div>
                      </div>

                      <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                          <Hash size={16} />
                          <span className="text-sm font-medium">
                            ESIC Number
                          </span>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {worker.esic_number || "Not provided"}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-medium">
                          <CheckCircle size={12} />
                          Employee's State Insurance (ESI)
                        </div>
                      </div>

                      {worker.bonus_type && worker.statutory_bonus && (
                        <div className="md:col-span-2">
                          <DetailItem
                            icon={<Gift size={16} />}
                            label="Statutory Bonus"
                            value={`${formatCurrency(
                              worker.statutory_bonus,
                              worker.bonus_type,
                            )} ${
                              worker.bonus_frequency
                                ? ` (${
                                    worker.bonus_frequency
                                      .charAt(0)
                                      .toUpperCase() +
                                    worker.bonus_frequency.slice(1)
                                  })`
                                : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <Card
                    title="Linked Bank Accounts"
                    icon={<CreditCard className="text-purple-500" />}
                  >
                    <div className="space-y-4">
                      {worker.bank_accounts &&
                      worker.bank_accounts.length > 0 ? (
                        <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-700/50">
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                                  Bank Details
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {worker.bank_accounts.map((bank, index) => (
                                <tr
                                  key={bank.id || index}
                                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                                >
                                  <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                      {bank.account_holder_name ||
                                        "Account Holder"}
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      Account No: ••••
                                      {bank.account_number?.slice(-4)}
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      IFSC: {bank.ifsc_code || "N/A"}
                                    </div>

                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase">
                                      {bank.account_type || "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {bank.is_primary ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                                        Primary
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-medium uppercase tracking-wider">
                                        Secondary
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                          <CreditCard className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-500 font-medium">
                            No bank accounts linked
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Quick Summary */}
                  <Card
                    title="Quick Summary"
                    icon={<TrendingUp className="text-green-500" />}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {formatDate(worker.updated_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Created On
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {formatDate(worker.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Location
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {worker.city_name}, {worker.state_name}
                        </span>
                      </div>
                      {worker.zip && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            ZIP Code
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {worker.zip}
                          </span>
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
                  Showing {worker.worker_history?.length || 0} history records
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
                      navigate(`/agent/worker/edit/${worker.id}`);
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

export default ViewWorkerAgentModel;
