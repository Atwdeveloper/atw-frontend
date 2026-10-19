import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAgentProfile } from "../../agenthooks/useAgentProfile";

import Loader from "../../../../common/components/Loader";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Edit2,
  Home,
  Building,
  Building2,
  Hash,
  CreditCard,
  FileText,
  MapPinned,
  IdCard,
  Award,
  Shirt,
  Landmark,
  Shield,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatWorkExperience = (years) => {
  if (!years) return "—";
  const num = parseFloat(years);
  return num % 1 === 0
    ? `${num} year${num !== 1 ? "s" : ""}`
    : `${years} years`;
};

const formatBonusFrequency = (freq) => {
  if (!freq) return "—";
  const map = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    half_yearly: "Half Yearly",
    yearly: "Yearly",
  };
  return map[freq] || freq;
};
const maskValue = (value) => {
  if (!value) return "Not Provided";

  const str = value.toString();
  return "*".repeat(Math.max(0, str.length - 4)) + str.slice(-4);
};
const formatPaymentMethod = (method) => {
  return method === "bank" ? "Bank Transfer" : method === "cash" ? "Cash" : "—";
};

const AgentProfile = () => {
  const { formData: user, formLoading: loading } = useAgentProfile();

  // Calculate full name
  const fullName =
    user?.full_name ||
    `${user?.first_name || ""} ${user?.middle_name || ""} ${user?.last_name || ""}`.trim();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full sm:px-6 md:px-8 py-0 md:py-4 flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full "
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Agent Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View your personal and professional information
          </p>
        </div>
        <Link
          to="/agent/profile/edit"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
        >
          <Edit2 size={18} />
          Edit Profile
        </Link>
      </motion.div>

      {/* Profile Summary Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 w-full "
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {fullName || "Agent"}
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  Agent Code: {user.agent_code}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Building size={18} className="text-blue-600" />
                <span className="font-medium">
                  {user.city || user.agent_location || "Location not set"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <MapPin size={18} className="text-green-600" />
                <span className="font-medium">
                  {user.state || "State not set"}
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  user.status === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full ">
        {/* Personal Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>First Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.first_name || "-"}
                  </p>
                </div>
                {user.middle_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={14} />
                      <span>Middle Name</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {user.middle_name}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Last Name</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.last_name || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.agent_email || user.email || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={14} />
                    <span>Mobile Number</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {maskValue(user.mobile_number || user.phone) || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>Gender</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.gender || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>Date of Birth</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formatDate(user.date_of_birth)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>Date of Joining</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formatDate(user.date_of_joining)}
                  </p>
                </div> */}

                {user.father_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Home size={14} />
                      <span>Father's Name</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {user.father_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-purple-600" />
              Work Details
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building2 size={14} />
                    <span>Working City</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.current_city || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={14} />
                    <span>Working State</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.current_state || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Award size={14} />
                    <span>Experience</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formatWorkExperience(user.work_experience)}
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building2 size={14} />
                    <span>Industry</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.industry || "-"}
                  </p>
                </div> */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Briefcase size={14} />
                    <span>Designation</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.designation || "-"}
                  </p>
                </div> */}
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building size={14} />
                    <span>Department</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.department || "-"}
                  </p>
                </div> */}

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Shirt size={14} />
                    <span>Dress Size</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.dress_size || "-"}
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Gift size={14} />
                    <span>Bonus Frequency</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formatBonusFrequency(user.bonus_frequency)}
                  </p>
                </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Address Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-green-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Home size={20} className="text-green-600" />
              Address Details
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Home size={14} />
                  <span>Residential Address</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {user.agent_location || "-"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPinned size={14} />
                    <span>City</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.city || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPinned size={14} />
                    <span>State</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.state || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    {/* <Hash size={14} /> */}
                    <MapPinned size={14} />
                    <span>Pincode</span>
                  </div>
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {user.zip || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Information Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-amber-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {/* <Bank size={20} className="text-amber-600" /> */}
              Payment Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method - always shown */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CreditCard size={14} />
                  <span>Payment Method</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {formatPaymentMethod(user.payment_method)}
                </p>
              </div>

              {/* Bank fields */}
              {user.payment_method === "bank" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={14} />
                      <span>Account Holder Name</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {user.account_holder_name || "-"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Hash size={14} />
                      <span>Account Number</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {user.account_number
                        ? "****" + user.account_number.slice(-4)
                        : "-"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Hash size={14} />
                      <span>IFSC Code</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                      {user.ifsc_code || "-"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Landmark size={14} />
                      <span>Account Type</span>
                    </div>
                    <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg capitalize">
                      {user.account_type || "-"}
                    </p>
                  </div>
                </>
              )}

              {/* Cash message */}
              {user.payment_method === "cash" && (
                <div className="space-y-2">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Cash Payment:</strong> Salary will be disbursed
                      manually in cash. Ensure proper documentation and receipt
                      collection for each payment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Identification Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" />
              Identification
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FileText size={14} />
                  <span>PAN Number</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {maskValue(user.pan_number) || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <IdCard size={14} />
                  <span>Aadhaar Number</span>
                </div>
                <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {maskValue(user.aadhar_number) || "-"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer with Agent ID */}
      {/* <motion.div
        variants={itemVariants}
        className="w-full  px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 text-sm text-gray-500"
      >
        Agent ID: {user.agent_id} • Last updated: {new Date().toLocaleDateString()}
      </motion.div> */}
    </motion.div>
  );
};

export default AgentProfile;
