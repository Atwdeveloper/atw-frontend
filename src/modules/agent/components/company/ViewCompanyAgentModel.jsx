import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  Building2,
  User,
  MapPin,
  ClipboardList,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  IndianRupee,
  Star,
  TrendingUp,
} from "lucide-react";

const AgentCompanyViewModal = ({ company, isOpen, onClose }) => {
  const navigate = useNavigate();

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

  const getIndustryName = () => {
    if (!company?.industry) return "Not specified";
    if (Array.isArray(company.industry)) {
      return (
        company.industry[0]?.name || company.industry[0] || "Not specified"
      );
    } else {
      return company.industry.name || "Not specified";
    }
  };
  const maskValue = (value) => {
    if (!value) return "Not Provided";

    const str = value.toString();
    return "*".repeat(Math.max(0, str.length - 4)) + str.slice(-4);
  };
  const renderRating = () => {
    const rating = company?.rating || 0;
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
        <span className="text-sm font-semibold text-slate-700">
          {rating.toFixed(1)}
        </span>
        {company?.review_count && (
          <span className="text-xs text-slate-500">
            ({company.review_count} reviews)
          </span>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && company && (
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {company.company_code} - {company.company_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium">
                        {getIndustryName()}
                      </span>
                      {company.rating !== undefined && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg">
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-semibold">
                            {company.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Company Information */}
                  <Card
                    title="Company Information"
                    icon={<ClipboardList className="text-indigo-500" />}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <DetailItem
                        label="Company Code"
                        value={company.company_code}
                      />
                      <DetailItem label="Email" value={company.email} />
                      <DetailItem
                        label="Phone"
                        value={maskValue(company.phone) || "—"}
                      />
                      <DetailItem
                        label="Status"
                        value={
                          <span
                            className={`inline-flex items-center gap-2 ${
                              company.status
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {company.status ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {company.status ? "Active" : "Pending"}
                          </span>
                        }
                      />
                    </div>
                  </Card>

                  {/* Contact Person */}
                  {company.company_owner && (
                    <Card
                      title="Contact Person"
                      icon={<User className="text-green-500" />}
                    >
                      <div className="space-y-3">
                        <DetailItem
                          label="Name"
                          value={company.company_owner.owner_name}
                        />
                        <DetailItem
                          label="Email"
                          value={company.company_owner.owner_email}
                        />
                        <DetailItem
                          label="Phone"
                          value={
                            maskValue(company.company_owner.owner_phone) || "—"
                          }
                        />
                      </div>
                    </Card>
                  )}

                  {/* Tax Information */}
                  <Card
                    title="Tax Information"
                    icon={<FileText className="text-red-500" />}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <DetailItem
                        label="GST Number"
                        value={company.gst_number || "—"}
                      />
                      <DetailItem
                        label="TAN Number"
                        value={company.pan_number || "—"}
                      />
                      <DetailItem
                        label="CIN Number"
                        value={company.tin_number || "—"}
                      />
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Addresses */}
                  {company.addresses && company.addresses.length > 0 && (
                    <Card
                      title="Addresses"
                      icon={<MapPin className="text-purple-500" />}
                    >
                      <div className="space-y-4">
                        {company.addresses.map((addr, idx) => (
                          <div
                            key={idx}
                            className="border-b last:border-0 pb-3 last:pb-0"
                          >
                            <p className="font-medium text-slate-900">
                              {addr.address || "—"}
                              {addr.address_type && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-slate-200 rounded">
                                  {addr.address_type}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-slate-600">
                              {[addr.city, addr.state, addr.zip, addr.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Service Charges */}
                  <Card
                    title="Service Charges"
                    icon={<Activity className="text-amber-500" />}
                  >
                    <div className="space-y-3">
                      <DetailItem
                        label="Charge Type"
                        value={company.service_charge_type || "—"}
                      />
                      <DetailItem
                        label="Service Charge"
                        value={
                          <span className="flex items-center gap-1">
                            {company.service_charge_type === "fixed" && (
                              <IndianRupee className="w-4 h-4" />
                            )}
                            {company.service_charge || "—"}
                            {company.service_charge_type === "percentage" &&
                              "%"}
                          </span>
                        }
                      />
                    </div>
                  </Card>

                  {/* Quick Summary */}
                  <Card
                    title="Quick Summary"
                    icon={<TrendingUp className="text-green-500" />}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Created</span>
                        <span className="text-sm font-medium">
                          {formatDate(company.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(company.updated_at)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 rounded-b-2xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/agent/company/edit/${company.id}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Reusable Components
const Card = ({ title, icon, children }) => (
  <div className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    {children}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-slate-900 font-medium break-words">{value}</span>
  </div>
);

export default AgentCompanyViewModal;
