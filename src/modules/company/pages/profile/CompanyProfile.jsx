import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Briefcase,
  FileText,
  Shield,
  Award,
  Calendar,
  IndianRupee,
  Percent,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useViewCompanyProfile } from "../../companyhooks/useViewCompanyProfile";
import Loader from "../../../../common/components/Loader";
import { useCompanyPermissions } from "../../../../common/hooks/useCompanyPermissions";
const CompanyProfile = () => {
  const navigate = useNavigate();
  const { formData, formLoading } = useViewCompanyProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const { hasPermission, loading: permissionsLoading } =
    useCompanyPermissions();
  if (formLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const canEdit = hasPermission("company_profile", "edit");
  const maskValue = (value) => {
    if (!value) return "";

    return "*".repeat(Math.max(0, value.length - 4)) + value.slice(-4);
  };
  if (!hasPermission("company_profile", "view")) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <Building2 className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view the company profile.
          </p>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your company information and settings
          </p>
        </div>
        {canEdit && (
          <Link
            to="/company/profile/edit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 size={18} />
            Edit Profile
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-blue-100 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.name}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={18} />
                  <span>Industry: {formData.industry || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>
                    Member since:{" "}
                    {formData.created_at
                      ? new Date(formData.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("service")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "service"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Service Charge
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "addresses"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab("tax")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "tax"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Tax Information
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "overview" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Company Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Company Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Industry Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="font-medium">
                          {formData?.industry || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Code
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Company Code</p>
                        <p className="font-medium text-lg">{formData.code}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Work Type</p>
                        <p className="font-medium">{formData.work_type || "Not specified"}</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "service" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Service Charge Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          formData.service_charge_type === "fixed"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {formData.service_charge_type === "fixed" ? (
                          <IndianRupee className="w-6 h-6 text-green-600" />
                        ) : (
                          <Percent className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Service Charge Type
                        </h4>
                        <p className="text-gray-600 capitalize">
                          {formData.service_charge_type || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        {formData.service_charge_type === "fixed" ? (
                          <IndianRupee className="w-6 h-6 text-orange-600" />
                        ) : (
                          <Percent className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Service Charge Amount
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {formData.service_charge || "0"}
                          {formData.service_charge_type === "percentage" && "%"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Work Addresses
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {formData.addresses?.map((address, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          Address
                          {index === 0 && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Primary
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{address.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="font-medium">{address.city}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">State</p>
                            <p className="font-medium">{address.state}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">ZIP Code</p>
                            <p className="font-medium">{address.zip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "tax" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Tax Information
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {formData.gst_number && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">
                          GST Number
                        </h4>
                      </div>
                      <p className="font-mono text-lg font-bold">
                        {maskValue(formData.gst_number)}
                      </p>
                    </div>
                  )}

                  {formData.pan_number && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">
                          TAN Number
                        </h4>
                      </div>
                      <p className="font-mono text-lg font-bold">
                        {maskValue(formData.pan_number)}
                      </p>
                    </div>
                  )}

                  {formData.tin_number && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">
                          CIN Number
                        </h4>
                      </div>
                      <p className="font-mono text-lg font-bold">
                        {maskValue(formData.tin_number)}
                      </p>
                    </div>
                  )}

                  {!formData.gst_number &&
                    !formData.pan_number &&
                    !formData.tin_number && (
                      <div className="col-span-3 text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No tax information added yet
                        </p>
                        {canEdit && (
                          <Link
                            to="/company/edit-profile"
                            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            Add tax information
                            <Edit2 size={16} />
                          </Link>
                        )}
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyProfile;
