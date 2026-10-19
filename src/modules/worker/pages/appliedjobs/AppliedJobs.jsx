import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FileText,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  X,
  Ban,
  Coffee,
  Utensils,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useWorkerAppliedJobs } from "../../workerhooks/useWorkerAppliedJobs";
import Loader from "../../../../common/components/Loader";

const WorkerAppliedJobs = () => {
  const { applications, loading, cancelling, cancelApplication } =
    useWorkerAppliedJobs();

  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (activeSearch.trim() !== "") {
      const search = activeSearch.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.jobTitle?.toLowerCase().includes(search) ||
          app.place?.toLowerCase().includes(search) ||
          app.department?.toLowerCase().includes(search) ||
          app.designation?.toLowerCase().includes(search),
      );
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [applications, statusFilter, dateSort, activeSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // ---------- Modal Component (Updated) ----------
  const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-4 sm:inset-10 z-50"
        >
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Job Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-600">
                        {/* <div className="flex items-center gap-1">
                        <Award size={16} />
                        <span className="font-medium">{job.designation}</span>
                      </div> */}
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span className="font-medium">{job.companyName}</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">{job.jobId}</span>
                      </div> */}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        job.status === "confirmed"
                          ? "bg-green-50 text-green-700"
                          : job.status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {job.status === "confirmed" && <CheckCircle size={14} />}
                      {job.status === "pending" && <Clock size={14} />}
                      {job.status === "cancelled" && <XCircle size={14} />}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{job.place}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {job.workType === "salary"
                            ? "Monthly Salary"
                            : job.workType === "hourly"
                              ? "Hourly Rate"
                              : job.rateType === "pcs"
                                ? "Piece Rate"
                                : "Daily Wage"}
                        </p>
                        <p className="font-medium text-gray-900 text-lg">
                          {job.ratePerWorker}
                        </p>
                        {job.rateType && job.rateType !== job.workType && (
                          <p className="text-xs text-gray-500">
                            ({job.rateType} rate)
                          </p>
                        )}
                      </div>
                    </div>{" "}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Workers Required
                        </p>
                        <p className="font-medium text-gray-900">
                          {job.workersRequired} worker
                          {job.workersRequired !== 1 && "s"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Job Period</p>
                        {/* <p className="font-medium text-gray-900">
                          {formatDate(job.jobStartDate)} –
                          {formatDate(job.jobEndDate)}
                        </p> */}
                        <p className="font-medium text-gray-900">
                          {job.jobStartDate
                            ? formatDate(job.jobStartDate)
                            : "N/A"}
                          {job.jobEndDate
                            ? ` - ${formatDate(job.jobEndDate)}`
                            : " Onwards"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Applied On</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(job.appliedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                {job.scheduleDescription && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Work Schedule
                    </h4>

                    {job.scheduleDescription ? (
                      <div className="flex flex-wrap gap-2">
                        {/* Date Pills */}
                        {job.scheduleDescription.includes("Specific dates") &&
                          job.scheduleDescription
                            .replace("Specific dates:", "")
                            .split(",")
                            .map((date) => date.trim())
                            .filter(Boolean)
                            .map((date, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium"
                              >
                                {date}
                              </span>
                            ))}

                        {/* Weekday Pills */}
                        {job.scheduleDescription.includes("Weekly on") &&
                          job.scheduleDescription
                            .replace("Weekly on", "")
                            .split(",")
                            .map((day) => day.trim())
                            .filter(Boolean)
                            .map((day, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-medium"
                              >
                                {day}
                              </span>
                            ))}
                        {["Daily", "Monthly", "Monthly Job"].includes(
                          job.scheduleDescription,
                        ) && (
                          <span className="px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-sm font-medium">
                            {job.scheduleDescription}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No work schedule available.
                      </p>
                    )}
                  </div>
                )}

                {/* Work Conditions */}
                {(job.mealProvided || job.breakType) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Work Conditions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {job.mealProvided && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <Utensils size={20} className="text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Meal Provided
                            </p>
                            <p className="text-sm text-gray-600">Yes</p>
                          </div>
                        </div>
                      )}
                      {job.breakType && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <Coffee size={20} className="text-amber-600" />
                          <div>
                            <p className="font-medium text-gray-900">Break</p>
                            <p className="text-sm text-gray-600">
                              {job.breakType === "paid"
                                ? "Paid break"
                                : `Unpaid break, ${job.breakDuration} minutes`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Job Description
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-gray-700 leading-relaxed">
                      {job.jobDescription}
                    </p>
                  </div>
                </div>

                {/* Shift Details */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Shift Details
                  </h4>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{job.shift}</p>
                      <p className="text-sm text-gray-600">Working hours</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  {job.status === "pending" && (
                    <button
                      onClick={() => {
                        cancelApplication(job.applicationId, job.jobTitle);
                        onClose();
                      }}
                      disabled={cancelling}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Ban size={18} />
                      Cancel Application
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full sm:px-6 md:px-8 py-0 md:py-4 flex flex-col items-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 w-full max-w-7xl"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Track and manage your job applications
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 w-full max-w-7xl"
        variants={itemVariants}
      >
        <div className="mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-900" />
          <h2 className="text-lg font-semibold text-gray-800">
            Search & Filter Applications
          </h2>
        </div>
        {/* <div className="grid grid-cols-4 gap-4 w-full"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Job / City / Department
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type job title, city..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-end gap-2.5 w-full">
            <button
              onClick={() => setActiveSearch(searchText)}
              className="w-full sm:w-auto py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchText("");
                setActiveSearch("");
                setStatusFilter("all");
                setDateSort("newest");
              }}
              className="w-full sm:w-auto py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Applications List */}
      <div className="w-full max-w-7xl">
        {filteredAndSortedApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredAndSortedApplications.map((job) => (
              <motion.div
                key={job.applicationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {job.jobTitle}
                          </h3>
                          <div className="flex items-center gap-3 text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Briefcase size={16} />
                              <span className="font-medium">
                                {job.companyName}
                              </span>
                            </div>
                            {/* <div className="flex items-center gap-1">
                              <Briefcase size={16} />
                              <span>{job.department}</span>
                            </div> */}
                          </div>
                        </div>
                        {/* <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "confirmed"
                              ? "bg-green-50 text-green-700"
                              : job.status === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {job.status === "confirmed" && <CheckCircle size={14} />}
                          {job.status === "pending" && <Clock size={14} />}
                          {job.status === "cancelled" && <XCircle size={14} />}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span> */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            {job.workType === "hourly" && (
                              <Clock className="text-blue-600" size={16} />
                            )}
                            {job.workType === "daily" && (
                              <Calendar className="text-green-600" size={16} />
                            )}
                            {job.workType === "salary" && (
                              <DollarSign
                                className="text-amber-600"
                                size={16}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {job.workType === "hourly"
                                ? "Hourly Rate"
                                : job.workType === "daily"
                                  ? job.rateType === "pcs"
                                    ? "Piece Rate"
                                    : "Daily Wage"
                                  : "Monthly Salary"}
                            </p>
                            <p className="font-medium text-gray-900">
                              {job.ratePerWorker}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <MapPin className="text-blue-600" size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Place</p>
                            <p className="font-medium text-gray-900">
                              {job.place}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <Users className="text-green-600" size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Workers Required
                            </p>
                            <p className="font-medium text-gray-900">
                              {job.workersRequired}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <Calendar className="text-purple-600" size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Applied On</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(job.appliedDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          Shift: {job.shift}
                        </span>
                        {/* <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          Exp: {job.experience}
                        </span> */}
                      </div>
                    </div>

                    <div className="lg:w-56 flex flex-col gap-3">
                      {job.status === "pending" && (
                        <button
                          onClick={() =>
                            cancelApplication(job.applicationId, job.jobTitle)
                          }
                          disabled={cancelling}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Ban size={18} />
                          Cancel Application
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetails(true);
                        }}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      {job.status === "confirmed" && (
                        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center justify-center gap-2 text-green-700 ">
                            <CheckCircle size={18} />
                            <span className="font-medium">Confirmed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === "all"
                ? "You haven't applied to any jobs yet."
                : `You don't have any ${statusFilter} applications.`}
            </p>
            {statusFilter === "all" && (
              <a
                href="/worker/dashboard"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </a>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showJobDetails && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setShowJobDetails(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkerAppliedJobs;
