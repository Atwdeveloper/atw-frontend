import { useAgentWallet } from "../../agenthooks/useAgentWallet";
import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Building,
  TrendingUp,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Briefcase,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const AgentWallet = () => {
  const { walletData, loading, error, refetch } = useAgentWallet();

  // Safe fallbacks
  const companyBreakdown = walletData?.companyBreakdown || [];
  const workerBreakdown = walletData?.workerBreakdown || [];
  const pendingCompanies = walletData?.pendingCompanies || [];
  const summary = walletData?.summary || {
    company_total: 0,
    worker_total: 0,
    grand_total: 0,
  };
  const totalEarnings = walletData?.totalEarnings || 0;
  const pendingAmount = walletData?.pendingAmount || 0;
  const currency = walletData?.currency || "INR";
  const lastUpdated = walletData?.lastUpdated || new Date().toISOString();

  const [pendingPage, setPendingPage] = React.useState(1);
  const [companyPage, setCompanyPage] = React.useState(1);
  const [workerPage, setWorkerPage] = React.useState(1);
  const ITEMS_PER_PAGE = 5;

  const displayedPending = pendingCompanies.slice(
    (pendingPage - 1) * ITEMS_PER_PAGE,
    pendingPage * ITEMS_PER_PAGE,
  );
  const displayedCompanies = companyBreakdown.slice(
    (companyPage - 1) * ITEMS_PER_PAGE,
    companyPage * ITEMS_PER_PAGE,
  );
  const displayedWorkers = workerBreakdown.slice(
    (workerPage - 1) * ITEMS_PER_PAGE,
    workerPage * ITEMS_PER_PAGE,
  );

  const renderPagination = (currentPage, totalItems, setPage) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-t border-gray-100">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const netReceived = totalEarnings - pendingAmount;
  const companyCount = companyBreakdown.length;
  const workerCount = workerBreakdown.length;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className=" mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    My Earning
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Track your earnings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3 text-red-700 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-sm">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition"
            >
              Retry
            </button>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Total Earnings (All Time)
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 tracking-tight">
                {formatCurrency(totalEarnings)}
              </h2>
              <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last updated: {formatDate(lastUpdated)}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-5 py-3 border border-amber-200 shadow-sm">
              <p className="text-sm text-amber-700 font-medium">
                Pending Clearance
              </p>
              <p className="text-3xl font-bold text-amber-600">
                {formatCurrency(pendingAmount)}
              </p>
              <p className="text-xs text-amber-500 mt-1">
                {pendingCompanies.length}{" "}
                {pendingCompanies.length === 1 ? "entry" : "entries"} awaiting
              </p>
            </div>
          </div>
        </motion.div>
        {/* Pending Section + Summary (side by side) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Payments Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Payments
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Awaiting Clearance
                </span>
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  <p className="text-gray-500 mt-3 text-sm">
                    Loading pending...
                  </p>
                </div>
              ) : pendingCompanies.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">All cleared!</p>
                  <p className="text-gray-400 text-sm">No pending earning</p>
                </div>
              ) : (
                <>
                  {displayedPending.map((pending, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">
                              {pending.name}
                            </p>
                            {pending.type && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                {pending.type}
                              </span>
                            )}
                          </div>
                          {/* Expected date removed */}
                        </div>
                        <p className="text-xl font-bold text-amber-600">
                          {formatCurrency(pending.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {renderPagination(
                    pendingPage,
                    pendingCompanies.length,
                    setPendingPage,
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Summary Card - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100 shadow-md"
          >
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Quick Summary
            </h4>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> Companies Commissioned:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {companyCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <UserCheck className="w-4 h-4" /> Workers Commissioned:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {workerCount}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-gray-700 font-medium">
                    Company Earnings:
                  </span>
                  <span className="font-semibold text-blue-700">
                    {formatCurrency(summary.company_total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Worker Earnings:
                  </span>
                  <span className="font-semibold text-purple-700">
                    {formatCurrency(summary.worker_total)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-200">
                  <span className="text-gray-800 font-bold">Net Received:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(netReceived)}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Paid Sections (Company & Worker) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paid Companies */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Commissions – Companies
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {companyCount}
                </span>
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-3 text-sm">
                    Loading companies...
                  </p>
                </div>
              ) : companyBreakdown.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Building className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  No company earning yet
                </div>
              ) : (
                <>
                  {displayedCompanies.map((company, idx) => (
                    <motion.div
                      key={company.companyId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {company.companyName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Commission: {formatDate(company.paidDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(company.amount)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {renderPagination(
                    companyPage,
                    companyBreakdown.length,
                    setCompanyPage,
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Paid Workers */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Commissions – Workers
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {workerCount}
                </span>
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-500 mt-3 text-sm">
                    Loading workers...
                  </p>
                </div>
              ) : workerBreakdown.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  No worker earning yet
                </div>
              ) : (
                <>
                  {displayedWorkers.map((worker, idx) => (
                    <motion.div
                      key={worker.workerId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {worker.workerName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Commission: {formatDate(worker.paidDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(worker.amount)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {renderPagination(
                    workerPage,
                    workerBreakdown.length,
                    setWorkerPage,
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentWallet;
