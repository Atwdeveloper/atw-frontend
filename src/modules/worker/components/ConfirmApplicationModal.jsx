import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

const ConfirmApplicationModal = ({ job, onConfirm, onCancel }) => {
  if (!job) return null;

  // ✅ Format Rate properly
  const formatRate = (job) => {
    if (!job?.base_rate) return "N/A";

    if (job.rate_type === "salary") {
      return `₹${job.base_rate} / Month`;
    }

    const unitMap = {
      hourly: "Hour",
      daily: "Day",
      pcs: "Pcs",
      gram: "Gram",
      kg: "Kg",
    };

    const unit = unitMap[job.rate_type] || job.rate_type;
    return `₹${job.base_rate} / ${unit}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-blue-600" size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Confirm Application
          </h3>

          <p className="text-gray-600">
            Are you sure you want to apply for{" "}
            <span className="font-semibold">{job.jobTitle}</span>?
          </p>
        </div>

        {/* Job Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Designation:</span>{" "}
            {job.designation || "N/A"}
          </p>

          <p className="text-sm text-gray-700">
            <span className="font-medium">Location:</span>{" "}
            {job.place || job.city || "N/A"}
          </p>

          {/* ✅ FIXED RATE */}
          <p className="text-sm text-gray-700">
            <span className="font-medium">Rate:</span> {formatRate(job)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Yes, Apply
          </button>

          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmApplicationModal;
