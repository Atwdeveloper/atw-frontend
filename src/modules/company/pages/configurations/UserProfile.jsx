import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  Award,
  Building,
  UserCircle,
  Badge,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCompanyUserProfile } from "../../companyhooks/useCompanyUserProfile";
import Loader from "../../../../common/components/Loader";

const UserProfile = () => {
  const { formData, formLoading, designations } = useCompanyUserProfile();
  const [activeTab, setActiveTab] = useState("personal");
  const showDesignation = formData.user_type !== "owner";
  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get designation name
  const getDesignationName = () => {
    if (formData.designation) return formData.designation;
    if (formData.designation_id && designations.length > 0) {
      const designation = designations.find(
        (d) => d.id == formData.designation_id,
      );
      return designation?.name || "Not specified";
    }
    return "Not specified";
  };
  const getStaffTitle = () => {
    return formData.staff_title || "Not specified";
  };
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
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            View and manage your personal and professional information
          </p>
        </div>
        <Link
          to="/company/configuration/user-profile/edit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit2 size={18} />
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <UserCircle className="w-20 h-20 text-indigo-600" />
              </div>
              {showDesignation && formData.designation_id && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {getStaffTitle()}
                </div>
              )}
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
                  <Mail size={18} />
                  <span>{formData.email}</span>
                </div>
                {showDesignation && formData.designation_id && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={18} />
                    <span>{getStaffTitle()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
              {showDesignation && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  ID: {formData.id || "N/A"}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("personal")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "personal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Personal Info
              </button>
              {showDesignation && (
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "professional"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Professional Info
                </button>
              )}
              <button
                onClick={() => setActiveTab("contact")}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "contact"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Contact Details
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "personal" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                      </div>
                      {showDesignation && (
                        <div className="flex items-center gap-3">
                          <Badge className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Employee ID</p>
                            <p className="font-medium">
                              {formData.id || "Not assigned"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Joining Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Joining</p>
                        <p className="font-medium">
                          {formatDate(formData.date_of_joining)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-green-600">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "professional" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Professional Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {showDesignation && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Staff Title
                          </h4>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            {getStaffTitle()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your current role and responsibilities
                      </p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Employee ID
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {formData.id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your unique identification number
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Email Address
                        </h4>
                        <p className="text-gray-900 font-medium mt-1">
                          {formData.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Primary contact email
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Phone Number
                        </h4>
                        <p className="text-gray-900 font-medium mt-1">
                          {formData.phone}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Primary contact number
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Need to update your information?
                      </h4>
                      <p className="text-gray-600 mt-1">
                        Keep your contact details up to date to ensure smooth
                        communication.
                      </p>
                      <Link
                        to="/company/configuration/user-profile/edit"
                        className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit Profile
                        <Edit2 size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
