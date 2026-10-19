import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building2, MapPin, ArrowRight } from "lucide-react";
import Loader from "../../../../common/components/Loader";
import { useAgentDashboard } from "../../agenthooks/useAgentDashboard";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const AgentDashboard = () => {
  const { data, loading, error } = useAgentDashboard();

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-sm text-center">
          <p className="font-semibold text-red-600 text-lg">
            Error loading dashboard
          </p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm bg-red-100 px-4 py-1.5 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Safe destructuring with fallbacks
  const {
    agent = {},
    stats = {
      total_companies: 0,
      active_companies: 0,
      inactive_companies: 0,
    },
    recent_companies = [],
    state_distribution = [],
    worker_stats = {
      total_workers: 0,
      active_workers: 0,
      inactive_workers: 0,
    },
    recent_workers = [],
  } = data || {};

  // Helper to safely check active status (handles number or string)
  const isActive = (status) => status === 1 || status === "1";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full px-4 md:px-8 py-6"
    >
      {/* Simplified Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Companies Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Companies</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.total_companies}
              </p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.active_companies}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.inactive_companies}
              </p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/agent/company/list"
              className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
            >
              Manage Companies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Workers Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Workers</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {worker_stats.total_workers}
              </p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {worker_stats.active_workers}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {worker_stats.inactive_workers}
              </p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/agent/worker/list"
              className="text-sm text-purple-600 hover:underline flex items-center justify-center gap-1"
            >
              Manage Workers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Companies & Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Companies */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Recent Companies ({recent_companies.length})
            </h2>
            <Link
              to="/agent/company/list"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent_companies.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No companies found.
              </p>
            ) : (
              recent_companies.map((company) => (
                <div
                  key={company.id || company.company_name}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {company.company_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {company.industry} • {company.city}, {company.state}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isActive(company.status)
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive(company.status) ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Workers */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Workers ({recent_workers.length})
            </h2>
            <Link
              to="/agent/worker/list"
              className="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent_workers.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No workers found.
              </p>
            ) : (
              recent_workers.map((worker) => (
                <div
                  key={worker.id || worker.worker_name}
                  className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {worker.worker_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {worker.designation} • {worker.department} •{" "}
                        {worker.industry}
                      </p>
                      <p className="text-xs text-gray-400">
                        {worker.city}, {worker.state}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isActive(worker.status)
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive(worker.status) ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* State Distribution */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          State Distribution
        </h2>
        <div className="flex flex-wrap gap-3">
          {state_distribution.length === 0 ? (
            <p className="text-gray-500">No state data available.</p>
          ) : (
            state_distribution.map((state, idx) => (
              <div
                key={state.state || idx}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium"
              >
                {state.state} • {state.count}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AgentDashboard;
