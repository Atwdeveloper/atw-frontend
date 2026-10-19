// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import {
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   Calendar,
//   FileText,
//   Home,
//   CreditCard,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   AlertCircle,
//   X,
//   Building2,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useWorkerSignup } from "../workerhooks/useWorkerSignup";

// const WorkerSignup = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     industries,
//     industriesLoading,

//     designations,
//     designationsLoading,
//     states,
//     statesLoading,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     fetchCities,
//     nextStep,
//     prevStep,
//     goToStep,
//     verifyReferralCode,
//   } = useWorkerSignup();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verifying, setVerifying] = useState(false);
//   // Modal state for terms
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
//     useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
//     useState(false);

//   const hasToken = !!Cookies.get("token");
//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   const stepTitles = [
//     "Basic Info",
//     "Work Details",
//     "Personal Details",
//     "Address",
//     "Bank & Terms",
//   ];

//   const stepIcons = [
//     <User size={18} />,
//     <Briefcase size={18} />,
//     <FileText size={18} />,
//     <Home size={18} />,
//     <CreditCard size={18} />,
//   ];

//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
//   };

//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };

//   const closeModal = () => setShowTermsModal(false);
//   const openPrivacyModal = () => {
//     setShowPrivacyModal(true);
//     setPrivacyHasScrolledToBottom(false);
//   };

//   const closePrivacyModal = () => {
//     setShowPrivacyModal(false);
//   };

//   const handlePrivacyModalScroll = (e) => {
//     const target = e.target;

//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

//     if (bottom && !privacyHasScrolledToBottom) {
//       setPrivacyHasScrolledToBottom(true);
//     }
//   };
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };
//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;

//     setPrivacyModalCheckboxChecked(checked);

//     handleChange("accepted_privacy", checked);
//   };
//   const handleVerifyReferral = async () => {
//     if (!formData.referral_code) return;

//     setVerifying(true);

//     const res = await verifyReferralCode();

//     setVerifying(false);

//     if (!res.success) {
//       alert(res.message || "Invalid referral code");
//     }
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Basic Information
//             </h2>
//             <p className="text-gray-600">
//               Enter your personal and contact details.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   {/* <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.mobile_number}
//                     onChange={(e) =>
//                       handleChange(
//                         "mobile_number",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     placeholder="Enter your mobile number"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.mobile_number ? "border-red-500" : "border-gray-300"}`}
//                   /> */}
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.mobile_number}
//                     disabled={hasToken}
//                     onChange={(e) =>
//                       handleChange(
//                         "mobile_number",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     placeholder="Enter your mobile number"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400
//     ${errors.mobile_number ? "border-red-500" : "border-gray-300"}
//     ${hasToken ? "bg-gray-100 cursor-not-allowed" : ""}
//   `}
//                   />
//                 </div>
//                 {errors.mobile_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.mobile_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   First Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={35}
//                     value={formData.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     placeholder="Enter your first name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.first_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.first_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Last Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={35}
//                     value={formData.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     placeholder="Enter your last name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.last_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.last_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.work_email}
//                     onChange={(e) => handleChange("work_email", e.target.value)}
//                     placeholder="Enter your work email"
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//                 {/* {errors.work_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.work_email}
//                   </p>
//                 )} */}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Work Details</h2>
//             <p className="text-gray-600">
//               Tell us about your professional background.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.industry_id}
//                   onChange={(e) => {
//                     handleChange("industry_id", e.target.value);
//                     handleChange("designation_id", "");
//                   }}
//                   disabled={industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm  flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.industry_id}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Designation <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.designation_id}
//                   onChange={(e) =>
//                     handleChange("designation_id", e.target.value)
//                   }
//                   disabled={designationsLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.designation_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Designation</option>
//                   {designations.map((des) => (
//                     <option key={des.id} value={des.id}>
//                       {des.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.designation_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.designation_id}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Personal Details
//             </h2>
//             <p className="text-gray-600">KYC and identification information.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Date of Birth <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   {/* <input
//                     type="date"
//                     value={formData.date_of_birth}
//                     onChange={(e) =>
//                       handleChange("date_of_birth", e.target.value)
//                     }
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
//                   /> */}
//                   <input
//                     type="date"
//                     max={new Date().toISOString().split("T")[0]}
//                     value={formData.date_of_birth}
//                     onChange={(e) =>
//                       handleChange("date_of_birth", e.target.value)
//                     }
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
//                       errors.date_of_birth
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>
//                 {errors.date_of_birth && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.date_of_birth}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Father's Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.father_name}
//                   onChange={(e) => handleChange("father_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.father_name ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.father_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.father_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Aadhar Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={12}
//                   value={formData.aadhar_number}
//                   onChange={(e) =>
//                     handleChange(
//                       "aadhar_number",
//                       e.target.value.replace(/\D/g, ""),
//                     )
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.aadhar_number ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.aadhar_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.aadhar_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Work Address</h2>
//             <p className="text-gray-600">Where do you currently reside?</p>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Work Address <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   rows={2}
//                   value={formData.address_line}
//                   onChange={(e) => handleChange("address_line", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.address_line ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.address_line && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.address_line}
//                   </p>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Work State <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.state_id}
//                     onChange={(e) => {
//                       handleChange("state_id", e.target.value);
//                       handleChange("city_id", ""); // reset city
//                       fetchCities(e.target.value);
//                     }}
//                     disabled={statesLoading}
//                     className={`w-full px-3 py-2.5 border rounded-lg ${errors.state_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select State</option>
//                     {states.map((state) => (
//                       <option key={state.id} value={state.id}>
//                         {state.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.state_id && (
//                     <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                       <AlertCircle size={14} /> {errors.state_id}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Work City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.city_id}
//                     onChange={(e) => handleChange("city_id", e.target.value)}
//                     disabled={
//                       !formData.state_id || citiesLoading[formData.state_id]
//                     }
//                     className={`w-full px-3 py-2.5 border rounded-lg ${errors.city_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select City</option>
//                     {citiesMap[formData.state_id]?.map((city) => (
//                       <option key={city.id} value={city.id}>
//                         {city.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.city_id && (
//                     <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                       <AlertCircle size={14} /> {errors.city_id}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Bank Details & Terms
//             </h2>
//             <p className="text-gray-600">For salary processing and payments.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Account Holder Name <span className="text-red-500">*</span></label>
//                 <input type="text" value={formData.account_holder_name} onChange={(e) => handleChange("account_holder_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_holder_name ? "border-red-500" : "border-gray-300"}`} />
//                 {errors.account_holder_name && <p className="text-red-500 text-sm flex items-center mt-1 gap-1"><AlertCircle size={14} /> {errors.account_holder_name}</p>}
//               </div> */}
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Bank Name <span className="text-red-500">*</span></label>
//                 <input type="text" value={formData.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.bank_name ? "border-red-500" : "border-gray-300"}`} />
//                 {errors.bank_name && <p className="text-red-500 text-sm flex items-center mt-1 gap-1"><AlertCircle size={14} /> {errors.bank_name}</p>}
//               </div> */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Account Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={16}
//                   value={formData.account_number}
//                   onChange={(e) =>
//                     handleChange(
//                       "account_number",
//                       e.target.value.replace(/\D/g, ""),
//                     )
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_number ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.account_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.account_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   IFSC Code <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={15}
//                   value={formData.ifsc_code}
//                   onChange={(e) =>
//                     handleChange("ifsc_code", e.target.value.toUpperCase())
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.ifsc_code ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 {errors.ifsc_code && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.ifsc_code}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Account Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.account_type}
//                   onChange={(e) => handleChange("account_type", e.target.value)}
//                   className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_type ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="savings">Savings</option>
//                   <option value="current">Current</option>
//                   <option value="salary">Salary</option>
//                 </select>
//                 {errors.account_type && (
//                   <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                     <AlertCircle size={14} /> {errors.account_type}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* Referral Code Section */}
//             <div className="bg-gray-50 p-4 rounded-xl border">
//               <label className="block text-sm font-medium mb-2">
//                 Referral Code <span className="text-gray-400">(Optional)</span>
//               </label>

//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={formData.referral_code || ""}
//                   onChange={(e) =>
//                     handleChange("referral_code", e.target.value)
//                   }
//                   placeholder="Enter referral code"
//                   className="flex-1 px-3 py-2.5 border rounded-lg"
//                 />

//                 {/* <button
//       type="button"
//       onClick={handleVerifyReferral}
//       disabled={verifying}
//       className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//     >
//       {verifying ? "Verifying..." : "Verify"}
//     </button> */}
//               </div>

//               {formData.referral_verified && (
//                 <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
//                   <CheckCircle size={14} /> Referral code verified
//                 </p>
//               )}
//             </div>
//             {/* Terms & Conditions */}
//             <div className="bg-gray-50 p-6 rounded-xl border">
//               <div
//                 className="flex items-start gap-3 cursor-pointer"
//                 onClick={openModal}
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.accepted_terms}
//                   readOnly
//                   className="mt-1 w-5 h-5 text-green-600 rounded"
//                 />
//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openModal}
//                     className="text-green-600 hover:underline font-semibold"
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//               {errors.accepted_terms && (
//                 <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                   <AlertCircle size={14} /> {errors.accepted_terms}
//                 </p>
//               )}
//             </div>

//             {/* Privacy Policy */}
//             <div className="bg-gray-50 p-6 rounded-xl border mt-4">
//               <div
//                 className="flex items-start gap-3 cursor-pointer"
//                 onClick={openPrivacyModal}
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.accepted_privacy}
//                   readOnly
//                   className="mt-1 w-5 h-5 text-green-600 rounded"
//                 />

//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openPrivacyModal}
//                     className="text-green-600 hover:underline font-semibold"
//                   >
//                     Privacy Policy
//                   </button>
//                 </label>
//               </div>

//               {errors.accepted_privacy && (
//                 <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                   <AlertCircle size={14} />
//                   {errors.accepted_privacy}
//                 </p>
//               )}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center"
//       style={{
//         backgroundImage: "url('/images/admin/Login-Bg.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="text-center mb-4">
//           {logoUrl ? (
//             <img src={logoUrl} alt="Logo" className="max-h-20 mx-auto mb-3" />
//           ) : (
//             <Building2 className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
//           )}
//           <h1 className="text-3xl font-bold text-gray-800">
//             Worker Registration
//           </h1>
//           <p className="text-gray-600">
//             Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToStep(idx + 1)}
//                   disabled={idx + 1 > currentStep || loading}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//     ${
//       idx + 1 === currentStep
//         ? "bg-green-600 text-white"
//         : idx + 1 < currentStep
//           ? "bg-green-500 text-white"
//           : "bg-gray-200 text-gray-600"
//     }
//     ${
//       idx + 1 > currentStep
//         ? "cursor-not-allowed opacity-50"
//         : "cursor-pointer hover:bg-green-400"
//     }`}
//                 >
//                   {stepIcons[idx]}
//                 </button>
//               ))}
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//               />
//             </div>
//           </div>

//           {/* Step Content */}
//           <div className="mb-8">{renderStepContent()}</div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep <= 1 || loading}
//               className={`flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 ${currentStep === 1 && "cursor-not-allowed"}`}
//             >
//               <ChevronLeft size={18} /> Previous
//             </button>
//             <button
//               onClick={nextStep}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{" "}
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? Cookies.get("token")
//                       ? "Next"
//                       : "Create Account"
//                     : currentStep === totalSteps
//                       ? "Submit"
//                       : "Next"}{" "}
//                   <ChevronRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Help & Support */}
//           {(whatsappNumber || phoneNumber) && (
//             <div className="pt-6 mt-6 border-t border-gray-200">
//               <p className="text-sm font-semibold text-gray-500 text-center mb-3">
//                 Need Help?
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 {whatsappNumber && (
//                   <a
//                     href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
//                   >
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                       alt="WhatsApp"
//                       className="w-5 h-5"
//                     />
//                     <span>WhatsApp</span>
//                   </a>
//                 )}
//                 {phoneNumber && (
//                   <a
//                     href={`tel:${phoneNumber}`}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
//                   >
//                     <Phone size={18} /> <span>Call Us</span>
//                   </a>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="text-center mt-6">
//             <p className="text-gray-500 text-sm">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-green-600 hover:text-green-800 font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Worker Portal. All rights reserved.
//           </p>
//           <p className="mt-1">
//             Need help?{" "}
//             <a
//               href={`mailto:${supportEmail}`}
//               className="text-amber-300 hover:underline"
//             >
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* Background Blobs */}
//       <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

//       {/* Terms Modal */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 AWT Worker Terms & Condition
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handleModalScroll}
//             >
//               <p>
//                 These Terms & Conditions govern your access to and use of the
//                 Anytime Work (ATW) website. By registering, accessing, or using
//                 the platform, you agree to comply with these Terms.
//               </p>
//               <p className="font-semibold">1. Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Users must be 18 years of age or older.</li>
//                 <li>Users must be legally eligible to work in India.</li>
//               </ul>
//               <p className="font-semibold">2. Account Registration</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Users must provide accurate and up-to-date information.</li>
//                 <li>
//                   You are responsible for maintaining the confidentiality of
//                   your login credentials.
//                 </li>
//               </ul>
//               <p className="font-semibold">3. KYC Verification</p>
//               <p>Users may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Aadhaar Card</li>
//                 <li>PAN Card</li>
//                 <li>Bank Account Details</li>
//                 <li>Other employment-related documents</li>
//               </ul>
//               <p>
//                 Providing false or forged documents may result in account
//                 suspension or termination.
//               </p>
//               <p className="font-semibold">4. Job Applications</p>
//               <p>
//                 Workers may apply for vacancies available on the platform
//                 subject to platform policies and company requirements.
//               </p>
//               <p className="font-semibold">5. Payments</p>
//               <p>
//                 Salary and other payments are processed after attendance
//                 verification, company approval, and applicable statutory
//                 deductions.
//               </p>
//               <p className="font-semibold">6. User Responsibilities</p>
//               <p>Users must:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Provide genuine information.</li>
//                 <li>Follow workplace and platform policies.</li>
//                 <li>Avoid fraudulent, abusive, or unlawful activities.</li>
//                 <li>Maintain confidentiality of company information.</li>
//               </ul>
//               <p className="font-semibold">7. Account Suspension</p>
//               <p>
//                 ATW reserves the right to suspend or terminate any account that
//                 violates these Terms, submits fraudulent information, or misuses
//                 the platform.
//               </p>
//               <p className="font-semibold">8. Governing Law</p>
//               <p>
//                 These Terms are governed by the laws of India. Any disputes
//                 shall be subject to the jurisdiction of the competent courts at
//                 Jaipur, Rajasthan.
//               </p>
//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={modalCheckboxChecked}
//                   onChange={handleModalCheckboxChange}
//                   disabled={!hasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I have read and agree to the Terms and Conditions
//                 </span>
//               </label>
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Lock,
  X,
  Building2,
  UserPlus,
  Award,
} from "lucide-react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {
  useWorkerSignup,
  normalizeDobToISO,
  normalizeGender,
} from "../workerhooks/useWorkerSignup";

const OTP_LENGTH = 6;
const MAX_DESIGNATIONS = 3;

// ============================================================================
// TEMP-AADHAAR-BYPASS — remove this flag, the handleDevBypassAadhaar function,
// and the "DEV ONLY" button below once the Aadhaar OTP provider credits are
// topped up. Added only so the rest of the wizard can be tested while OTP
// sending is blocked; grep "TEMP-AADHAAR-BYPASS" to find every piece to strip.
// Also disabled outside development so it can never appear in a production
// build even if removal is forgotten.
const AADHAAR_DEV_BYPASS = process.env.NODE_ENV !== "production";
// ============================================================================

// Large photo banner shown above the Designation/Skills grids, previewing
// whatever was picked one level up (Industry above Designation, Designation
// above Skills) — gives a semi-literate workforce a visual anchor for what
// they already chose before picking the next level.
const HERO_THEME = {
  blue: "from-blue-900/85",
  indigo: "from-indigo-900/85",
  emerald: "from-emerald-900/85",
};
const HeroBanner = ({ image, name, theme = "blue" }) => (
  <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100">
    {image ? (
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-gray-300">
        {String(name || "?").charAt(0).toUpperCase()}
      </div>
    )}
    <div
      className={`absolute inset-0 bg-gradient-to-t ${HERO_THEME[theme]} via-black/10 to-transparent`}
    />
    <div className="absolute bottom-3 left-4 right-4">
      <p className="text-white font-bold text-lg drop-shadow-md">{name}</p>
    </div>
  </div>
);

// Tappable photo card used by the industry / designation / skill grids — a
// selected card fills its bottom label bar with the section's theme color,
// an unselected one stays white; both keep the photo full-bleed on top so
// the choice reads at a glance rather than through a checkbox.
const PICKER_THEME = {
  blue: { border: "border-blue-600", ring: "ring-blue-100", fill: "bg-blue-600" },
  indigo: {
    border: "border-indigo-600",
    ring: "ring-indigo-100",
    fill: "bg-indigo-600",
  },
  emerald: {
    border: "border-emerald-600",
    ring: "ring-emerald-100",
    fill: "bg-emerald-600",
  },
};
const PickerCard = ({ image, name, selected, muted, onClick, theme = "blue" }) => {
  const t = PICKER_THEME[theme];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={muted}
      title={name}
      className={`relative rounded-2xl overflow-hidden border-2 text-left transition ${
        selected
          ? `${t.border} ring-2 ${t.ring}`
          : muted
            ? "border-gray-200 opacity-40 cursor-not-allowed"
            : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-gray-400">
          {String(name || "?").charAt(0).toUpperCase()}
        </div>
        {image && (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {selected && (
          <span
            className={`absolute top-2 right-2 rounded-full ${t.fill} text-white p-1`}
          >
            <CheckCircle size={14} />
          </span>
        )}
      </div>
      <div
        className={`px-2 py-2.5 text-center text-sm font-semibold leading-tight ${
          selected ? `${t.fill} text-white` : "bg-white text-gray-800"
        }`}
      >
        {name}
      </div>
    </button>
  );
};

// Consistent card shell for each picker section on the Work Details step —
// an icon + title + optional badge/clear action, matching the app's card
// language rather than a bare label above a grid.
const SectionCard = ({
  icon,
  accent,
  title,
  required,
  hint,
  action,
  children,
}) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent}`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {title}
            {required && <span className="text-red-500"> *</span>}
          </p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      </div>
      {action}
    </div>
    {children}
  </section>
);

// ---- STUB: Aadhaar gate (UNDER DEVELOPMENT — replace with real API calls) ----

const WorkerSignup = () => {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    profileCompleted,
    industries,
    industriesLoading,
    designations,
    designationsLoading,
    skills,
    skillsLoading,
    states,
    citiesMap,
    handleChange,
    sendAadhaarOtp,
    resendAadhaarOtp,
    verifyAadhaarOtp,
    nextStep,
    prevStep,
    goToStep,
    verifyReferralCode,
    registerAccount,
    updateFormData,
  } = useWorkerSignup();

  const navigate = useNavigate();
  const [redirectingToFace, setRedirectingToFace] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Terms modal state (unchanged)
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] = useState(false);
  const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] = useState(false);

  const toggleSkill = (skill) => {
    const exists = formData.skills?.some((s) => s.id === skill.id);
    const next = exists ? formData.skills.filter((s) => s.id !== skill.id) : [...(formData.skills || []), skill];
    handleChange("skills", next);
  };

  // Saving the banking step completes the profile; face enrolment is the
  // optional last stop, so send them there rather than straight to the
  // dashboard.
  const handleWizardNext = async () => {
    const isFinalStep = currentStep === totalSteps;
    // Raise the flag before submitting: submitCurrentStep flips
    // profileCompleted, and without this the "Find Jobs" success screen would
    // render underneath the alert for a beat before we navigate away.
    if (isFinalStep) setRedirectingToFace(true);

    const success = await nextStep();
    if (!isFinalStep) return;

    if (!success) {
      setRedirectingToFace(false);
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Account details saved successfully",
      text: "One last optional step — let's verify your face.",
      timer: 2000,
      showConfirmButton: false,
    });
    // Replace, not push: the signup wizard is done and shouldn't be a "Back"
    // target from the face-registration page.
    navigate("/worker/face-registration", { replace: true });
  };

  // ---- Aadhaar gate local UI state (stub flow, see banner above) ----
  const hasToken = !!Cookies.get("token");
  const [aadhaarGateStage, setAadhaarGateStage] = useState(
    hasToken ? "done" : "number", // "number" | "otp" | "done" | "underage"
  );
  const [aadhaarNumberInput, setAadhaarNumberInput] = useState("");
  const [aadhaarOtpDigits, setAadhaarOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [aadhaarError, setAadhaarError] = useState("");
  const [aadhaarBusy, setAadhaarBusy] = useState(false);
  const [showAadhaarSuccessToast, setShowAadhaarSuccessToast] = useState(false);
  const [aadhaarResendTimer, setAadhaarResendTimer] = useState(45);
  const aadhaarOtpRefs = useRef([]);
  const [referenceId, setReferenceId] = useState("");
  const privacyContentRef = useRef(null);
  const termsContentRef = useRef(null);
  const submittedAadhaarOtpRef = useRef("");
  const submittedAadhaarNumberRef = useRef("");

  // Countdown for "Resend OTP in ..." on the Aadhaar OTP screen
  useEffect(() => {
    if (aadhaarGateStage !== "otp") return;
    if (aadhaarResendTimer <= 0) return;
    const t = setTimeout(() => setAadhaarResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [aadhaarGateStage, aadhaarResendTimer]);

  useEffect(() => {
    setLogoUrl(Cookies.get("logo_url") || "");
    setSupportEmail(Cookies.get("support_email") || "");
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setPhoneNumber(Cookies.get("phone_number") || "");
  }, []);

  // Review Details (step 1) is as far back as the wizard goes — anything
  // before it is the now-stale Aadhaar OTP gate, which shouldn't reappear
  // once the account exists. Catches the literal browser/device Back button;
  // the in-app Back button handles this itself in the onClick below.
  useEffect(() => {
    if (currentStep !== 1) return;
    const handlePopState = () => navigate("/worker/dashboard", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, navigate]);

  useEffect(() => {
    setModalCheckboxChecked(formData.accepted_terms);
  }, [formData.accepted_terms]);

  useEffect(() => {
    setPrivacyModalCheckboxChecked(formData.accepted_privacy);
  }, [formData.accepted_privacy]);

  // ---------------- 3-step wizard header config ----------------
  const stepTitles = ["Review Details", "Work Details", "Banking Details"];
  const stepIcons = [<UserPlus size={18} />, <Briefcase size={18} />, <CreditCard size={18} />];

  // ---------------- Terms modal handlers (unchanged) ----------------
  const handleModalScroll = (e) => {
    const target = e.target;
    const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
  };
  const openModal = () => {
    setShowTermsModal(true);
    setHasScrolledToBottom(false);
  };
  const closeModal = () => setShowTermsModal(false);
  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
    setPrivacyHasScrolledToBottom(false);
    setTimeout(() => {
    const el = privacyContentRef.current;
    if (el && el.scrollHeight <= el.clientHeight) {
      setPrivacyHasScrolledToBottom(true);
    }
  }, 0);
  };
  const closePrivacyModal = () => setShowPrivacyModal(false);
  const handlePrivacyModalScroll = (e) => {
    const target = e.target;
    const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !privacyHasScrolledToBottom) setPrivacyHasScrolledToBottom(true);
  };
  // Accepting is allowed straight away; ticking the box scrolls the text to
  // the end so the reader still lands on the full document.
  const scrollToEnd = (ref) => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const handleModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setModalCheckboxChecked(checked);
    handleChange("accepted_terms", checked);
    if (checked) {
      setHasScrolledToBottom(true);
      scrollToEnd(termsContentRef);
    }
  };
  const handlePrivacyModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    handleChange("accepted_privacy", checked);
    if (checked) {
      setPrivacyHasScrolledToBottom(true);
      scrollToEnd(privacyContentRef);
    }
  };
  const handleVerifyReferral = async () => {
    if (!formData.referral_code) return;
    setVerifying(true);
    const res = await verifyReferralCode();
    setVerifying(false);
    if (!res.success) alert(res.message || "Invalid referral code");
  };

  // ---------------- Aadhaar gate handlers ----------------
  const onSubmitAadhaarNumber = async (e) => {
  if (e) e.preventDefault();
  const digits = aadhaarNumberInput.replace(/\D/g, "");
  if (digits.length !== 12) {
    setAadhaarError("Enter a valid 12-digit Aadhaar number");
    return;
  }
  setAadhaarError("");
  setAadhaarBusy(true);
  const res = await sendAadhaarOtp(digits);
  setAadhaarBusy(false);

  if (res.success) {
    setReferenceId(res.reference_id);
    setAadhaarGateStage("otp");
    setAadhaarOtpDigits(Array(OTP_LENGTH).fill(""));
    setAadhaarResendTimer(45);
    setTimeout(() => aadhaarOtpRefs.current[0]?.focus(), 50);
  } else if (res.error_code === "OTP_COOLDOWN") {
    // Aadhaar OTP was already sent recently — move to OTP screen
    // and start the countdown at the server-specified wait time.
    setAadhaarGateStage("otp");
    setAadhaarResendTimer(res.wait_seconds || 45);
    setAadhaarError(res.message);
  } else {
    setAadhaarError(res.message || "Could not send OTP");
  }
};

  // TEMP-AADHAAR-BYPASS — see the flag declaration near the top of this file.
  // Skips OTP send/verify entirely and registers the account with placeholder
  // identity details so the rest of the wizard (work details, banking, face
  // registration) can still be exercised while the OTP provider is out of
  // credits. Delete this whole function when the bypass is removed.
  const handleDevBypassAadhaar = async () => {
    setAadhaarError("");
    setAadhaarBusy(true);
    const created = await registerAccount({
      first_name: "Test",
      last_name: "Worker",
      date_of_birth: "1995-01-01",
      gender: "male",
      father_name: "Test Father",
      aadhar_number: "234567890123",
      aadhaar_address: {
        house: "12",
        street: "Test Street",
        landmark: "Near Test Landmark",
        locality: "Test Locality",
        vtc: "Test City",
        subdistrict: "Test Subdistrict",
        district: "Test District",
        state: "Maharashtra",
        country: "India",
        post_office: "Test Post Office",
        pincode: "400001",
      },
    });
    setAadhaarBusy(false);
    if (created) {
      setAadhaarGateStage("done");
    } else {
      setAadhaarError("Dev bypass failed to create the account.");
    }
  };

  // 1234-5678-9012 — easier to read back off an Aadhaar card than 12 running digits.
  const formatAadhaar = (value) =>
    (value.match(/.{1,4}/g) || []).join("-");

  const handleAadhaarNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumberInput(digits);
    if (digits.length < 12) submittedAadhaarNumberRef.current = "";
    if (aadhaarError) setAadhaarError("");
  };

  // Send the OTP as soon as all 12 digits are in; editing re-arms it.
  useEffect(() => {
    if (aadhaarGateStage !== "number") return;
    const digits = aadhaarNumberInput.replace(/\D/g, "");
    if (digits.length !== 12) return;
    if (aadhaarBusy || submittedAadhaarNumberRef.current === digits) return;
    submittedAadhaarNumberRef.current = digits;
    onSubmitAadhaarNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aadhaarNumberInput, aadhaarGateStage]);

  // Keep the OTP boxes ready to type into whenever that screen appears.
  useEffect(() => {
    if (aadhaarGateStage !== "otp") return;
    const t = setTimeout(() => aadhaarOtpRefs.current[0]?.focus(), 60);
    return () => clearTimeout(t);
  }, [aadhaarGateStage]);

  const onResendAadhaarOtp = async () => {
  if (aadhaarResendTimer > 0) return;

  const digits = aadhaarNumberInput.replace(/\D/g, "");
  if (digits.length !== 12) {
    setAadhaarError("Aadhaar number missing — please go back and re-enter it.");
    return;
  }

  setAadhaarBusy(true);
  const res = await resendAadhaarOtp(digits);
  setAadhaarBusy(false);

  if (res.success) {
    setAadhaarError("");
    setAadhaarResendTimer(45);
    setAadhaarOtpDigits(Array(OTP_LENGTH).fill(""));
    aadhaarOtpRefs.current[0]?.focus();
  } else if (res.error_code === "OTP_COOLDOWN") {
    // Don't show a scary error — just restart the countdown
    // with the exact wait time the provider asked for.
    setAadhaarResendTimer(res.wait_seconds || 45);
    setAadhaarError(res.message);
  } else {
    setAadhaarError(res.message || "Unable to resend OTP");
  }
};

  const handleAadhaarOtpBoxChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...aadhaarOtpDigits];
    next[index] = digit;
    setAadhaarOtpDigits(next);
    if (aadhaarError) setAadhaarError("");
    if (digit && index < OTP_LENGTH - 1) aadhaarOtpRefs.current[index + 1]?.focus();
  };
  const handleAadhaarOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !aadhaarOtpDigits[index] && index > 0) {
      aadhaarOtpRefs.current[index - 1]?.focus();
    }
  };
  // Lets a copied OTP be pasted directly into any box instead of retyping it
  // digit by digit — spreads it across all 6 boxes and hands off to the
  // auto-submit effect below.
  const handleAadhaarOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (digits.length === 0) return;
    const next = Array(OTP_LENGTH).fill("");
    digits.forEach((d, i) => {
      next[i] = d;
    });
    setAadhaarOtpDigits(next);
    if (aadhaarError) setAadhaarError("");
    aadhaarOtpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  // Verify the moment the sixth box is filled; editing a digit re-arms it so
  // correcting and retyping the same code still submits.
  useEffect(() => {
    if (aadhaarGateStage !== "otp") return;
    const otp = aadhaarOtpDigits.join("");
    if (otp.length < OTP_LENGTH) {
      submittedAadhaarOtpRef.current = "";
      return;
    }
    if (aadhaarBusy || submittedAadhaarOtpRef.current === otp) return;
    submittedAadhaarOtpRef.current = otp;
    onSubmitAadhaarOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aadhaarOtpDigits, aadhaarGateStage]);

  const onSubmitAadhaarOtp = async (e) => {
    if (e) e.preventDefault();
    const otp = aadhaarOtpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      setAadhaarError("Please enter the full 6-digit OTP");
      return;
    }
    setAadhaarBusy(true);
    const res = await verifyAadhaarOtp(
    otp,
    aadhaarNumberInput.replace(/\D/g, "")
    );
    if (!res.success) {
      setAadhaarBusy(false);
      setAadhaarError(res.message || "Invalid OTP, please try again");
      return;
    }

    // Age gate — block registration if the Aadhaar DOB shows under 18. Read
    // straight off the response: formData hasn't re-rendered with it yet.
    const aadhaar = res.data || {};
    const age = calculateAge(normalizeDobToISO(aadhaar.dob));
    if (age !== null && age < 18) {
      setAadhaarBusy(false);
      setAadhaarGateStage("underage");
      return;
    }

    setShowAadhaarSuccessToast(true);

    // Create the account right away — this is what mints the bearer token
    // that every step of the wizard depends on. The Aadhaar payload is passed
    // explicitly rather than read from formData, which updates a render later.
    const names = String(aadhaar.name || "").trim().split(/\s+/).filter(Boolean);
    const created = await registerAccount({
      first_name: names[0] || "",
      last_name: names.slice(1).join(" "),
      date_of_birth: normalizeDobToISO(aadhaar.dob),
      gender: normalizeGender(aadhaar.gender),
      father_name: aadhaar.father_name || "",
      aadhar_number: aadhaarNumberInput.replace(/\D/g, ""),
      aadhaar_address: aadhaar.address_details,
    });

    setAadhaarBusy(false);
    setShowAadhaarSuccessToast(false);

    if (created) {
      setAadhaarGateStage("done");
    } else {
      setAadhaarError(
        "We verified your Aadhaar but couldn't create your account. Please try again.",
      );
    }
  };

  const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

  // ---------------- NEW: Review-screen readonly field ----------------
  const ReadonlyField = ({ icon, label, value, verified }) => (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">{icon}</span>}
        <input
          type="text"
          readOnly
          value={value || ""}
          className={`w-full ${icon ? "pl-10" : "pl-3"} pr-9 py-2.5 border rounded-lg bg-blue-50/40 border-blue-200 text-gray-700 cursor-default`}
        />
        {verified ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 flex items-center gap-1">
            Verified <CheckCircle size={14} />
          </span>
        ) : (
          <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
      </div>
    </div>
  );

  const stepperHeader = (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepTitles.map((title, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <button
              onClick={() => goToStep(idx + 1)}
              disabled={idx + 1 > currentStep || loading}
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition
                ${idx + 1 === currentStep ? "bg-green-600 text-white ring-4 ring-green-100" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
                ${idx + 1 > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-green-400"}`}
            >
              {stepIcons[idx]}
            </button>
            <span className="text-[11px] text-gray-500 mt-1 hidden sm:block">{title}</span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const helpFooter = (whatsappNumber || phoneNumber) && (
    <div className="pt-6 mt-6 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-500 text-center mb-3">Need Help?</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        )}
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
            <Phone size={18} /> <span>Call Us</span>
          </a>
        )}
      </div>
    </div>
  );

  // NEW: dynamic page title shown OUTSIDE the card (matches mockups) — one per wizard screen
  const pageTitle = (() => {
    switch (currentStep) {
      case 1:
        return "Review Your Basic Details";
      case 2:
        return "Select Your Work Details";
      case 3:
        return "Add Your Banking Details";
      default:
        return "Worker Registration";
    }
  })();

  const pageShell = (children) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-20 mb-3" />
          ) : (
            <Building2 className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mb-3" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">{pageTitle}</h1>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">{children}</div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Worker Portal. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a href={`mailto:${supportEmail}`} className="text-amber-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  // ======================= AADHAAR GATE SCREENS (stub, unchanged) =======================
  if (aadhaarGateStage === "number") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl">
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-16" />
            ) : (
              <img src="/images/logo.png" alt="Default Logo" className="max-h-16" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-blue-700">Let's Create Your Account</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Your mobile number has been verified.
                  <br />
                  Complete your profile to start using Anytime Work.
                </p>

                <form onSubmit={onSubmitAadhaarNumber} className="space-y-4 mt-8">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Verify Aadhaar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      maxLength={14}
                      value={formatAadhaar(aadhaarNumberInput)}
                      onChange={handleAadhaarNumberChange}
                      placeholder="1234-5678-9012"
                      className={`w-full px-4 py-3 border rounded-lg tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                        aadhaarError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    {aadhaarError && (
                      <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                        <AlertCircle size={14} /> {aadhaarError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={aadhaarBusy}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {aadhaarBusy ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Sending OTP...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">By entering, you agree to our Terms of Service</p>

                  {/* TEMP-AADHAAR-BYPASS — remove this button along with the
                      flag/handler once OTP provider credits are topped up. */}
                  {AADHAAR_DEV_BYPASS && (
                    <button
                      type="button"
                      onClick={handleDevBypassAadhaar}
                      disabled={aadhaarBusy}
                      className="w-full py-2.5 px-4 rounded-lg border-2 border-dashed border-amber-400 text-amber-700 text-sm font-medium hover:bg-amber-50 disabled:opacity-50 transition"
                    >
                      ⚠️ DEV ONLY: Skip Aadhaar (insufficient OTP credits)
                    </button>
                  )}

                  {(whatsappNumber || phoneNumber) && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
                      <div className="flex items-center justify-center gap-3">
                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                              alt="WhatsApp"
                              className="w-4 h-4"
                            />
                            WhatsApp Help
                          </a>
                        )}
                        {phoneNumber && (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <Phone size={16} />
                            Call Support
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
              <div className="hidden md:block relative overflow-visible">
            <img
              src="/images/worker/registration_worker.png"
              alt="Worker"
            />
          </div>
            </div>

            <div className="border-t border-gray-100 py-4 text-center">
              <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Anytime Work – Worker Portal</p>
              <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (aadhaarGateStage === "otp") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-14" />
            ) : (
              <img src="/images/logo.png" alt="Default Logo" className="max-h-14" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h1 className="text-xl font-bold text-blue-700">Verify Aadhar OTP</h1>
              <p className="text-gray-500 text-sm mt-2">
                Enter the 6-digit OTP sent to the mobile number
                <br />
                linked with your Aadhaar.
              </p>
            </div>

            <form onSubmit={onSubmitAadhaarOtp} className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-gray-700 text-center">Enter OTP</label>
              <div className="flex items-center justify-center gap-2">
                {aadhaarOtpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (aadhaarOtpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleAadhaarOtpBoxChange(i, e.target.value)}
                    onKeyDown={(e) => handleAadhaarOtpKeyDown(i, e)}
                    onPaste={handleAadhaarOtpPaste}
                    className={`w-11 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      aadhaarError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                ))}
              </div>
              {aadhaarError && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                  <AlertCircle size={14} /> {aadhaarError}
                </p>
              )}

              <div className="text-center text-sm">
                <span className="text-gray-500">Didn't receive the OTP? </span>
                {aadhaarResendTimer > 0 ? (
                  <span className="text-blue-600">Resend OTP in 0:{String(aadhaarResendTimer).padStart(2, "0")}</span>
                ) : (
                  <button type="button" onClick={onResendAadhaarOtp} className="text-blue-600 hover:underline font-medium">
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAadhaarGateStage("number")}
                  className="flex items-center gap-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={aadhaarBusy}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {aadhaarBusy ? "Verifying..." : "Continue →"}
                </button>
              </div>

              {(whatsappNumber || phoneNumber) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
                  <div className="flex items-center justify-center gap-3">
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                          alt="WhatsApp"
                          className="w-4 h-4"
                        />
                        WhatsApp Help
                      </a>
                    )}
                    {phoneNumber && (
                      <a
                        href={`tel:${phoneNumber}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <Phone size={16} />
                        Call Support
                      </a>
                    )}
                  </div>
                </div>
              )}
            </form>

            <div className="text-center pt-4 mt-2 border-t border-gray-200">
              <p className="text-gray-500 text-xs">By signing in, you agree to our Terms of Service</p>
              <p className="text-gray-400 text-xs mt-2">
                © {new Date().getFullYear()} Anytime Work – Worker Portal
                <br />
                All rights reserved
              </p>
            </div>
          </div>
        </div>

        {showAadhaarSuccessToast && (
          <div className="fixed bottom-6 right-6 z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium leading-snug">Your Aadhaar has been verified successfully.</p>
                <p className="text-xs text-gray-500 mt-0.5">Retrieving your details...</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  animation: "aadhaar-progress 1.8s linear forwards",
                }}
              />
            </div>
            <style>{`
              @keyframes aadhaar-progress {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  if (aadhaarGateStage === "underage") {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-14" />
          ) : (
            <img src="/images/logo.png" alt="Default Logo" className="max-h-14" />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={26} className="text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Registration Not Allowed</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Based on the date of birth linked to your Aadhaar, you are under 18 years of age.
            <br />
            You must be at least 18 years old to register as a worker on Anytime Work.
          </p>

          <button
            type="button"
            onClick={() => {
              setAadhaarGateStage("number");
              setAadhaarNumberInput("");
              setAadhaarOtpDigits(Array(OTP_LENGTH).fill(""));
              setAadhaarError("");
            }}
            className="mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Go Back
          </button>

          {(whatsappNumber || phoneNumber) && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-3">Help &amp; Support</p>
              <div className="flex items-center justify-center gap-3">
                {whatsappNumber && (
  <a
    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
      alt="WhatsApp"
      className="w-4 h-4"
    />
    WhatsApp Help
  </a>
)}

{phoneNumber && (
  <a
    href={`tel:${phoneNumber}`}
    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
  >
    <Phone size={16} />
    Call Support
  </a>
)}
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
  // ============================ END AADHAAR GATE ============================

  const aadhaarLocked = aadhaarGateStage === "done";

  // ======================= NEW 4-STEP WIZARD BODY =======================
  const renderStepContent = () => {
    switch (currentStep) {
      // -------- STEP 1: Review Details --------
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mt-1">
                The following details have been securely retrieved from your Aadhaar.
                <br />
                Please review them before continuing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReadonlyField icon={<User size={16} />} label="First name" value={formData.first_name} />
              <ReadonlyField icon={<User size={16} />} label="Last name" value={formData.last_name} />
              <ReadonlyField icon={<Phone size={16} />} label="Mobile No." value={formData.mobile_number} />
              <ReadonlyField
                icon={<FileText size={16} />}
                label="Aadhar No"
                value={
                  formData.aadhar_number
                    ? `${formData.aadhar_number.slice(0, 3)}${"*".repeat(6)}${formData.aadhar_number.slice(-2)}`
                    : ""
                }
                verified
              />
              <ReadonlyField icon={<User size={16} />} label="Father's Name" value={formData.father_name} />
              <ReadonlyField icon={<Calendar size={16} />} label="Date of Birth" value={formData.date_of_birth} />
              <ReadonlyField icon={<User size={16} />} label="Gender" value={formData.gender} verified />
            </div>

            {/* Address, folded into this same card below the identity fields
                — prefer the names Aadhaar returned, falling back to resolving
                the saved ids when a part-finished signup is resumed. */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 mt-4">
                Address
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReadonlyField
                  label="State"
                  value={
                    formData.permanent_state_name ||
                    states.find((s) => s.id === formData.permanent_state_id)?.name
                  }
                />
                <ReadonlyField
                  label="District"
                  value={
                    formData.permanent_city_name ||
                    citiesMap[formData.permanent_state_id]?.find(
                      (c) => c.id === formData.permanent_city_id,
                    )?.name
                  }
                />
                <ReadonlyField label="Pincode" value={formData.permanent_zip} />
              </div>
              <div className="mt-4">
                <ReadonlyField label="Address" value={formData.permanent_address_line} />
              </div>
            </div>
          </div>
        );

      // -------- STEP 2: Work Details --------
      case 2: {
        const atDesignationLimit =
          formData.designation_ids.length >= MAX_DESIGNATIONS;

        const toggleIndustry = (id) => {
          updateFormData({
            industry_id: formData.industry_id === id ? "" : id,
          });
        };

        const toggleDesignation = (id) => {
          const picked = formData.designation_ids.includes(id);
          if (!picked && atDesignationLimit) return;
          updateFormData({
            designation_ids: picked
              ? formData.designation_ids.filter((d) => d !== id)
              : [...formData.designation_ids, id],
          });
        };

        const industryItems = industries.map((ind) => ({
          id: ind.id,
          name: ind.name,
          image: ind.image_url,
        }));
        const designationItems = designations.map((des) => ({
          id: des.id,
          name: des.name,
          image: des.image_url,
        }));
        const skillItems = skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          image: skill.skill_image_url || skill.image_url || skill.skill_image,
        }));

        const selectedIndustry = industryItems.find(
          (i) => String(i.id) === String(formData.industry_id),
        );

        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mt-1">
                Tell us what you do — this is how employers will find you.
              </p>
            </div>

            <SectionCard
              icon={<Building2 size={18} className="text-blue-600" />}
              accent="bg-blue-50"
              title="Industry"
              hint="Optional — narrows the designations below to that industry"
              action={
                formData.industry_id !== "" && (
                  <button
                    type="button"
                    onClick={() => updateFormData({ industry_id: "" })}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )
              }
            >
              {industriesLoading ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                  Loading industries…
                </div>
              ) : industryItems.length === 0 ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                  No industries available
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {industryItems.map((item) => (
                    <PickerCard
                      key={item.id}
                      name={item.name}
                      image={item.image}
                      selected={String(formData.industry_id) === String(item.id)}
                      onClick={() => toggleIndustry(item.id)}
                      theme="blue"
                    />
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              icon={<Briefcase size={18} className="text-indigo-600" />}
              accent="bg-indigo-50"
              title="Designation"
              required
              hint={`You can select up to ${MAX_DESIGNATIONS} designations`}
              action={
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    atDesignationLimit
                      ? "bg-amber-50 text-amber-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {formData.designation_ids.length}/{MAX_DESIGNATIONS}
                </span>
              }
            >
              {selectedIndustry && (
                <HeroBanner
                  image={selectedIndustry.image}
                  name={selectedIndustry.name}
                  theme="blue"
                />
              )}
              {designationsLoading ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                  Loading designations…
                </div>
              ) : designationItems.length === 0 ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                  No designations available
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {designationItems.map((item) => {
                    const picked = formData.designation_ids.includes(item.id);
                    return (
                      <PickerCard
                        key={item.id}
                        name={item.name}
                        image={item.image}
                        selected={picked}
                        muted={!picked && atDesignationLimit}
                        onClick={() => toggleDesignation(item.id)}
                        theme="indigo"
                      />
                    );
                  })}
                </div>
              )}

              {errors.designation_ids && (
                <p className="text-red-500 text-sm flex items-center mt-2 gap-1">
                  <AlertCircle size={14} /> {errors.designation_ids}
                </p>
              )}
            </SectionCard>

            <SectionCard
              icon={<Award size={18} className="text-emerald-600" />}
              accent="bg-emerald-50"
              title="Skills"
              hint="Optional — you can select more than one skill"
              action={
                formData.skills.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                    {formData.skills.length} selected
                  </span>
                )
              }
            >
              {formData.designation_ids.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
                  Pick a designation above to see the skills for it.
                </div>
              ) : (
                <>
                  {skillsLoading ? (
                    <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                      Loading skills…
                    </div>
                  ) : skillItems.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-400">
                      No skills listed for these designations.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {skillItems.map((item) => (
                        <PickerCard
                          key={item.id}
                          name={item.name}
                          image={item.image}
                          selected={(formData.skills || []).some(
                            (s) => s.id === item.id,
                          )}
                          onClick={() =>
                            toggleSkill(skills.find((s) => s.id === item.id))
                          }
                          theme="emerald"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {errors.skills && (
                <p className="text-red-500 text-sm flex items-center mt-2 gap-1">
                  <AlertCircle size={14} /> {errors.skills}
                </p>
              )}
            </SectionCard>
          </div>
        );
      }


      // -------- STEP 3: Banking Details --------
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mt-1">
                You can add your bank details later, but they're required before receiving payments.
              </p>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.account_number}
                  onChange={(e) => handleChange("account_number", e.target.value.replace(/\D/g, ""))}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.account_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.account_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.account_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code</label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.ifsc_code}
                  onChange={(e) => handleChange("ifsc_code", e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.ifsc_code ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.ifsc_code && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.ifsc_code}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border-2 border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Statutory IDs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ESIC Number</label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.esic_number}
                  onChange={(e) => handleChange("esic_number", e.target.value.toUpperCase())}
                  placeholder="e.g. MH/12345/1234567"
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.esic_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.esic_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.esic_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">UAN Number</label>
                <input
                  type="text"
                  maxLength={12}
                  value={formData.uan_number}
                  onChange={(e) => handleChange("uan_number", e.target.value.replace(/\D/g, ""))}
                  placeholder="12-digit UAN"
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.uan_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.uan_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.uan_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PAN Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.pan_number}
                  onChange={(e) => handleChange("pan_number", e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className={`w-full px-3 py-2.5 border rounded-lg ${errors.pan_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.pan_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                    <AlertCircle size={14} /> {errors.pan_number}
                  </p>
                )}
              </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Referral code</label>
              <input
                type="text"
                value={formData.referral_code || ""}
                onChange={(e) => handleChange("referral_code", e.target.value)}
                placeholder="Enter the referral code"
                className="w-full px-3 py-2.5 border rounded-lg"
              />
              {formData.referral_verified && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <CheckCircle size={14} /> Referral code verified
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 cursor-pointer" onClick={openModal}>
                <input type="checkbox" checked={formData.accepted_terms} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openModal} className="text-blue-600 hover:underline font-semibold">
                    Terms &amp; Conditions
                  </button>
                </label>
              </div>
              {errors.accepted_terms && (
                <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                  <AlertCircle size={14} /> {errors.accepted_terms}
                </p>
              )}

              <div className="flex items-start gap-3 cursor-pointer" onClick={openPrivacyModal}>
                <input type="checkbox" checked={formData.accepted_privacy} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openPrivacyModal} className="text-blue-600 hover:underline font-semibold">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.accepted_privacy && (
                <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                  <AlertCircle size={14} /> {errors.accepted_privacy}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // ===================== END NEW 4-STEP WIZARD BODY =====================

  // Skipped while we're on our way to face registration — that page is the
  // real destination now, this screen is only the fallback.
  if (profileCompleted && !redirectingToFace) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10" /> : <img src="/images/logo.png" alt="Logo" className="h-10" />}
            </div>
            <div className="flex items-center gap-3 text-gray-800 font-semibold">
              <span>Hi, {formData.first_name || "Worker"}</span>
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <User size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[520px]">
            <div className="flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={22} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 leading-tight">Account Created Successfully!</h1>
              <p className="text-gray-600 mt-3 max-w-md">
                Your worker account is ready.
                <br />
                Start applying for jobs and managing your work.
              </p>

              <button
                type="button"
                onClick={() => navigate("/worker/dashboard")}
                className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-64"
              >
                Find Jobs <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <img
              src="/images/worker/registration_worker.png"
              alt="Worker"
            />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return pageShell(
    <>
      {/* Skip is only meaningful/enabled on the Banking step per the new design */}
      {currentStep === 4 && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => {
              // TODO(hook): wire to a real "skip banking" action once the hook supports optional KYC.
              nextStep();
            }}
            className="px-4 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Skip
          </button>
        </div>
      )}

      {stepperHeader}

      <div className="mb-8">{renderStepContent()}</div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            currentStep === 1
              ? navigate("/worker/dashboard", { replace: true })
              : prevStep()
          }
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          onClick={handleWizardNext}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...
            </>
          ) : (
            <>
              {currentStep === totalSteps ? "Submit" : "Continue"} <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>

      {helpFooter}

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Terms Modal (unchanged) */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">AWT Worker Terms &amp; Condition</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div ref={termsContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handleModalScroll}>
              <p>
                These Terms &amp; Conditions govern your access to and use of the Anytime Work (ATW) website. By
                registering, accessing, or using the platform, you agree to comply with these Terms.
              </p>
              <p className="font-semibold">1. Eligibility</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users must be 18 years of age or older.</li>
                <li>Users must be legally eligible to work in India.</li>
              </ul>
              <p className="font-semibold">2. Account Registration</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users must provide accurate and up-to-date information.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              </ul>
              <p className="font-semibold">3. KYC Verification</p>
              <p>Users may be required to submit:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aadhaar Card</li>
                <li>PAN Card</li>
                <li>Bank Account Details</li>
                <li>Other employment-related documents</li>
              </ul>
              <p>Providing false or forged documents may result in account suspension or termination.</p>
              <p className="font-semibold">4. Job Applications</p>
              <p>Workers may apply for vacancies available on the platform subject to platform policies and company requirements.</p>
              <p className="font-semibold">5. Payments</p>
              <p>Salary and other payments are processed after attendance verification, company approval, and applicable statutory deductions.</p>
              <p className="font-semibold">6. User Responsibilities</p>
              <p>Users must:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide genuine information.</li>
                <li>Follow workplace and platform policies.</li>
                <li>Avoid fraudulent, abusive, or unlawful activities.</li>
                <li>Maintain confidentiality of company information.</li>
              </ul>
              <p className="font-semibold">7. Account Suspension</p>
              <p>ATW reserves the right to suspend or terminate any account that violates these Terms, submits fraudulent information, or misuses the platform.</p>
              <p className="font-semibold">8. Governing Law</p>
              <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts at Jaipur, Rajasthan.</p>
              <p className="text-sm text-gray-500 mt-4 italic">(End of Terms and Conditions)</p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalCheckboxChecked}
                  onChange={handleModalCheckboxChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
              </label>
              <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[500px] flex flex-col relative z-10">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">Privacy Policy</h3>
              <button onClick={closePrivacyModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div ref={privacyContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handlePrivacyModalScroll}>
              <p>
                We collect the information you provide during registration (mobile number, name, Aadhaar, address,
                and bank details) solely to verify your identity, process job assignments, and enable salary payments.
              </p>
              <p>Your data is never sold to third parties and is shared only with employers you apply to work for.</p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between relative z-10 bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyModalCheckboxChecked}
                  onChange={handlePrivacyModalCheckboxChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">I have read and agree to the Privacy Policy</span>
              </label>
              <button onClick={closePrivacyModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
  );
};

export default WorkerSignup;