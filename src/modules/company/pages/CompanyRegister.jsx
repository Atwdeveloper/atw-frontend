// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Building,
//   User,
//   Mail,
//   Phone,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Trash2,
//   Home,
//   X,
//   Calculator,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

// const CompanyRegister = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     selectedIndustryId,
//     industries,
//     industriesLoading,
//     states,
//     token,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     handleIndustryChange,
//     addAddress,
//     updateAddress,
//     removeAddress,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//   } = useCompanyRegister();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   // Modal states for Terms & Conditions
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
//     useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
//     useState(false);
//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   // Sync modal checkbox with main form checkbox
//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   useEffect(() => {
//     setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
//   }, [formData.accepted_privacy]);
//   const stepTitles = [
//     "Company Info",
//     "Owner Details",
//     "KYC Details",
//     "Address",
//     "Terms & Privacy",
//   ];

//   const stepIcons = [
//     <Building size={18} />,
//     <User size={18} />,
//     <FileText size={18} />,
//     <Home size={18} />,
//     <CheckCircle size={18} />,
//   ];

//   // Scroll handler for modal content
//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) {
//       setHasScrolledToBottom(true);
//     }
//   };

//   // Reset scroll state when modal opens
//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };

//   const closeModal = () => {
//     setShowTermsModal(false);
//   };

//   // Handle checkbox change inside modal
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Basic Company Information
//             </h2>
//             <p className="text-gray-600">
//               Enter your company details and select an industry.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.company_name}
//                     onChange={(e) =>
//                       handleChange("company_name", e.target.value)
//                     }
//                     disabled={loading}
//                     placeholder="Enter company name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.company_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     // disabled={loading}
//                     disabled={loading || !!token}
//                     placeholder="Enter company email"
//                     // className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.company_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "company_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading || !!token}
//                     placeholder="Enter company phone"
//                     // className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_phone ? "border-red-500" : "border-gray-300"}`}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.company_phone
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.company_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_phone}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedIndustryId}
//                   onChange={(e) => handleIndustryChange(e.target.value)}
//                   disabled={loading || industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {/* FIXED: error key changed from industry_ids to industry_id */}
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.industry_id}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Owner / Contact Person Details
//             </h2>
//             <p className="text-gray-600">
//               Who is the primary contact for this company?
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.owner_name}
//                     onChange={(e) => handleChange("owner_name", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.owner_email}
//                     onChange={(e) =>
//                       handleChange("owner_email", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_email ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.owner_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "owner_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_phone ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_phone}
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
//               KYC / Tax Details
//             </h2>
//             <p className="text-gray-600">
//               Provide GST (required) and other tax identifiers.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   GST Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.gst_number}
//                     maxLength={15}
//                     onChange={(e) =>
//                       handleChange("gst_number", e.target.value.toUpperCase())
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gst_number ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.gst_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.gst_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   TAN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.pan_number}
//                     onChange={(e) => handleChange("pan_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.tan_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.tan_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   CIN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={21}
//                     value={formData.tin_number}
//                     onChange={(e) => handleChange("tin_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.cin_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.cin_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Working Addresses
//               </h2>
//               <button
//                 type="button"
//                 onClick={addAddress}
//                 className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
//               >
//                 <Plus size={16} /> Add Address
//               </button>
//             </div>
//             <p className="text-gray-600">
//               Add at least one address for your company.
//             </p>
//             {formData.addresses.length === 0 && (
//               <p className="text-gray-500 text-center py-4">
//                 No addresses added yet. Click "Add Address" to begin.
//               </p>
//             )}
//             {formData.addresses.map((addr, idx) => (
//               <div
//                 key={idx}
//                 className="border rounded-lg p-4 relative bg-gray-50/50"
//               >
//                 <button
//                   type="button"
//                   onClick={() => removeAddress(idx)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//                 <h4 className="font-medium mb-3">Address </h4>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Street Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={addr.address}
//                       onChange={(e) =>
//                         updateAddress(idx, "address", e.target.value)
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_address`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_address`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_address`]}
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.state_id}
//                         onChange={(e) => {
//                           updateAddress(idx, "state_id", e.target.value);
//                           fetchCities(e.target.value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_state_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select State</option>
//                         {states.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_state_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_state_id`]}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         City <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.city_id}
//                         onChange={(e) =>
//                           updateAddress(idx, "city_id", e.target.value)
//                         }
//                         disabled={
//                           !addr.state_id || citiesLoading[addr.state_id]
//                         }
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_city_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select City</option>
//                         {citiesMap[addr.state_id]?.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_city_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_city_id`]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       ZIP Code <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={addr.zip}
//                       onChange={(e) =>
//                         updateAddress(
//                           idx,
//                           "zip",
//                           e.target.value.replace(/\D/g, ""),
//                         )
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_zip`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_zip`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_zip`]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {errors.addresses && (
//               <p className="text-red-500 text-sm">
//                 <AlertCircle size={14} className="inline mr-1" />{" "}
//                 {errors.addresses}
//               </p>
//             )}
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <div className="mt-4">
//               <label className="block text-xl font-bold text-gray-800 mb-1">
//                 Referral Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 value={formData.agent_code || ""}
//                 maxLength={10}
//                 onChange={(e) => handleChange("agent_code", e.target.value)}
//                 disabled={loading}
//                 placeholder="Enter referral code (if any)"
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//               />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Terms & Conditions
//             </h2>
//             <p className="text-gray-600">
//               Review and accept to complete registration.
//             </p>
//             <div className="bg-gray-50 p-6 rounded-xl border">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_terms}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>
//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//               {errors.accepted_terms && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />{" "}
//                   {errors.accepted_terms}
//                 </p>
//               )}
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl border mt-4">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openPrivacyModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_privacy}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>

//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openPrivacyModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Privacy Policy
//                   </button>
//                 </label>
//               </div>

//               {errors.accepted_privacy && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />
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

//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;

//     setPrivacyModalCheckboxChecked(checked);

//     handleChange("accepted_privacy", checked);
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
//             <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
//           )}
//           <h1 className="text-3xl font-bold text-gray-800">
//             Company Registration
//           </h1>
//           <p className="text-gray-600">
//             Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToStep(idx + 1)}
//                   disabled={idx + 1 > currentStep || loading}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//                     ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
//                     ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
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
//           <div className="mb-8">{renderStepContent()}</div>
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
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
//                   {currentStep === 1 ? "Creating..." : "Saving..."}
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? "Create Company"
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
//               Already have a company account?{" "}
//               <Link
//                 to="/company/login"
//                 className="text-green-600 hover:text-green-800 font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Company Portal. All rights reserved.
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
//       <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Terms and Conditions for Company
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Content */}
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handleModalScroll}
//             >
//               <p>
//                 These Terms & Conditions govern your access to and use of the
//                 Anytime Work (ATW) Company Web Portal. By registering,
//                 accessing, or using the portal, your organization agrees to
//                 comply with these Terms.
//               </p>

//               <p className="font-semibold">1. Corporate Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>
//                   Only legally registered businesses and authorized
//                   representatives may create and manage Company accounts.
//                 </li>
//                 <li>
//                   Companies must provide accurate registration and compliance
//                   information.
//                 </li>
//               </ul>

//               <p className="font-semibold">2. Company Account</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Maintain accurate company information.</li>
//                 <li>Keep login credentials secure and confidential.</li>
//                 <li>
//                   The Company is responsible for all activities performed
//                   through its account.
//                 </li>
//               </ul>

//               <p className="font-semibold">3. Company Verification</p>
//               <p>Companies may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>GST Certificate</li>
//                 <li>PAN</li>
//                 <li>CIN (if applicable)</li>
//                 <li>Bank Account Details</li>
//                 <li>Authorized Signatory Details</li>
//                 <li>Company Address Proof</li>
//                 <li>Other documents requested by ATW</li>
//               </ul>
//               <p>
//                 Providing false or forged information may result in suspension,
//                 termination, or legal action.
//               </p>

//               <p className="font-semibold">4. Vacancy & Workforce Management</p>
//               <p>The Company Portal allows authorized users to:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Create and manage vacancies</li>
//                 <li>Hire and assign workers</li>
//                 <li>Manage attendance</li>
//                 <li>View workforce reports</li>
//                 <li>Manage company staff and roles</li>
//                 <li>Download reports and invoices</li>
//               </ul>
//               <p>
//                 All vacancies must comply with applicable labour laws, minimum
//                 wage regulations, and platform policies.
//               </p>

//               <p className="font-semibold">5. Billing & Payments</p>
//               <p>
//                 Invoices, service charges, payroll, statutory deductions, and
//                 other commercial transactions are processed according to the
//                 agreed business terms and applicable laws.
//               </p>

//               <p className="font-semibold">6. Data Protection</p>
//               <p>
//                 Companies must use worker information only for authorized
//                 business purposes.
//               </p>
//               <p>The Company must not:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Share worker information with unauthorized persons.</li>
//                 <li>Download or misuse confidential information.</li>
//                 <li>
//                   Sell, copy, or distribute platform data without authorization.
//                 </li>
//               </ul>

//               <p className="font-semibold">7. Website Usage</p>
//               <p>While using the portal, users may:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Upload company documents</li>
//                 <li>Upload compliance certificates</li>
//                 <li>Manage worker records</li>
//                 <li>Generate reports</li>
//                 <li>
//                   Use browser-based file upload and location features (where
//                   applicable)
//                 </li>
//               </ul>

//               <p className="font-semibold">8. Prohibited Activities</p>
//               <p>The following activities are strictly prohibited:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Fake company registration</li>
//                 <li>Fraudulent vacancy posting</li>
//                 <li>Fake attendance records</li>
//                 <li>Unauthorized access</li>
//                 <li>Data scraping</li>
//                 <li>Reverse engineering</li>
//                 <li>Sharing confidential worker information</li>
//                 <li>Misuse of platform data</li>
//               </ul>
//               <p>
//                 Violation may result in immediate suspension or permanent
//                 termination of the account.
//               </p>

//               <p className="font-semibold">9. Intellectual Property</p>
//               <p>
//                 All software, dashboards, reports, APIs, trademarks, logos,
//                 documents, and platform content are the exclusive property of
//                 Anytime Global Private Limited.
//               </p>

//               <p className="font-semibold">10. Suspension & Termination</p>
//               <p>
//                 ATW reserves the right to suspend or permanently terminate
//                 Company accounts for:
//               </p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Policy violations</li>
//                 <li>Fraudulent activities</li>
//                 <li>Non-payment</li>
//                 <li>Security risks</li>
//                 <li>Legal or regulatory requirements</li>
//               </ul>

//               <p className="font-semibold">11. Governing Law</p>
//               <p>
//                 These Terms are governed by the laws of India. Any disputes
//                 shall be subject to the jurisdiction of the competent courts at
//                 Jaipur, Rajasthan.
//               </p>

//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="border-t rounded 2xl p-5 flex items-center justify-between bg-white">
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

// export default CompanyRegister;
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Building,
//   User,
//   Mail,
//   Phone,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Trash2,
//   Home,
//   X,
//   Calculator,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

// const CompanyRegister = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     selectedIndustryId,
//     industries,
//     industriesLoading,
//     states,
//     token,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     handleIndustryChange,
//     addAddress,
//     updateAddress,
//     removeAddress,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//   } = useCompanyRegister();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   // Modal states for Terms & Conditions
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
//     useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
//     useState(false);

//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   // Sync modal checkbox with main form checkbox
//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   useEffect(() => {
//     setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
//   }, [formData.accepted_privacy]);

//   const stepTitles = [
//     "Company Info",
//     "Owner Details",
//     "KYC Details",
//     "Address",
//     "Terms & Privacy",
//   ];

//   const stepIcons = [
//     <Building size={18} />,
//     <User size={18} />,
//     <FileText size={18} />,
//     <Home size={18} />,
//     <CheckCircle size={18} />,
//   ];

//   // Scroll handler for Terms modal content
//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) {
//       setHasScrolledToBottom(true);
//     }
//   };

//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };

//   const closeModal = () => {
//     setShowTermsModal(false);
//   };

//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };

//   // Privacy modal handlers
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

//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setPrivacyModalCheckboxChecked(checked);
//     handleChange("accepted_privacy", checked);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Basic Company Information
//             </h2>
//             <p className="text-gray-600">
//               Enter your company details and select an industry.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.company_name}
//                     onChange={(e) =>
//                       handleChange("company_name", e.target.value)
//                     }
//                     disabled={loading}
//                     placeholder="Enter company name"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.company_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.company_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     disabled={loading || !!token}
//                     placeholder="Enter company email"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.company_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "company_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading || !!token}
//                     placeholder="Enter company phone"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.company_phone
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } ${
//                       !!token
//                         ? "bg-gray-100 cursor-not-allowed text-gray-500"
//                         : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.company_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.company_phone}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedIndustryId}
//                   onChange={(e) => handleIndustryChange(e.target.value)}
//                   disabled={loading || industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.industry_id}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Owner / Contact Person Details
//             </h2>
//             <p className="text-gray-600">
//               Who is the primary contact for this company?
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.owner_name}
//                     onChange={(e) => handleChange("owner_name", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formData.owner_email}
//                     onChange={(e) =>
//                       handleChange("owner_email", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_email ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_email}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.owner_phone}
//                     onChange={(e) =>
//                       handleChange(
//                         "owner_phone",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.owner_phone ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.owner_phone}
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
//               KYC / Tax Details
//             </h2>
//             <p className="text-gray-600">
//               Provide GST (required) and other tax identifiers.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   GST Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Building
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.gst_number}
//                     maxLength={15}
//                     onChange={(e) =>
//                       handleChange("gst_number", e.target.value.toUpperCase())
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gst_number ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.gst_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.gst_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   TAN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.pan_number}
//                     onChange={(e) => handleChange("pan_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.tan_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.tan_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   CIN Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Calculator
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={21}
//                     value={formData.tin_number}
//                     onChange={(e) => handleChange("tin_number", e.target.value)}
//                     disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                   />
//                 </div>
//                 {errors.cin_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.cin_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Working Addresses
//               </h2>
//               <button
//                 type="button"
//                 onClick={addAddress}
//                 className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
//               >
//                 <Plus size={16} /> Add Address
//               </button>
//             </div>
//             <p className="text-gray-600">
//               Add at least one address for your company.
//             </p>
//             {formData.addresses.length === 0 && (
//               <p className="text-gray-500 text-center py-4">
//                 No addresses added yet. Click "Add Address" to begin.
//               </p>
//             )}
//             {formData.addresses.map((addr, idx) => (
//               <div
//                 key={idx}
//                 className="border rounded-lg p-4 relative bg-gray-50/50"
//               >
//                 <button
//                   type="button"
//                   onClick={() => removeAddress(idx)}
//                   className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//                 <h4 className="font-medium mb-3">Address </h4>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Street Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={addr.address}
//                       onChange={(e) =>
//                         updateAddress(idx, "address", e.target.value)
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_address`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_address`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_address`]}
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.state_id}
//                         onChange={(e) => {
//                           updateAddress(idx, "state_id", e.target.value);
//                           fetchCities(e.target.value);
//                         }}
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_state_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select State</option>
//                         {states.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_state_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_state_id`]}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         City <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={addr.city_id}
//                         onChange={(e) =>
//                           updateAddress(idx, "city_id", e.target.value)
//                         }
//                         disabled={
//                           !addr.state_id || citiesLoading[addr.state_id]
//                         }
//                         className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_city_id`] ? "border-red-500" : "border-gray-300"}`}
//                       >
//                         <option value="">Select City</option>
//                         {citiesMap[addr.state_id]?.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors[`address_${idx}_city_id`] && (
//                         <p className="text-red-500 text-sm">
//                           <AlertCircle size={14} className="inline mr-1" />{" "}
//                           {errors[`address_${idx}_city_id`]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       ZIP Code <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={addr.zip}
//                       onChange={(e) =>
//                         updateAddress(
//                           idx,
//                           "zip",
//                           e.target.value.replace(/\D/g, ""),
//                         )
//                       }
//                       className={`w-full px-3 py-2 border rounded-lg bg-white ${errors[`address_${idx}_zip`] ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors[`address_${idx}_zip`] && (
//                       <p className="text-red-500 text-sm">
//                         <AlertCircle size={14} className="inline mr-1" />{" "}
//                         {errors[`address_${idx}_zip`]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {errors.addresses && (
//               <p className="text-red-500 text-sm">
//                 <AlertCircle size={14} className="inline mr-1" />{" "}
//                 {errors.addresses}
//               </p>
//             )}
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <div className="mt-4">
//               <label className="block text-xl font-bold text-gray-800 mb-1">
//                 Referral Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 value={formData.agent_code || ""}
//                 maxLength={10}
//                 onChange={(e) => handleChange("agent_code", e.target.value)}
//                 disabled={loading}
//                 placeholder="Enter referral code (if any)"
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//               />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Terms & Conditions
//             </h2>
//             <p className="text-gray-600">
//               Review and accept to complete registration.
//             </p>
//             <div className="bg-gray-50 p-6 rounded-xl border">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_terms}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>
//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//               {errors.accepted_terms && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />{" "}
//                   {errors.accepted_terms}
//                 </p>
//               )}
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl border mt-4">
//               <div className="flex items-start gap-3">
//                 <div
//                   className="flex items-start gap-3 cursor-pointer"
//                   onClick={openPrivacyModal}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.accepted_privacy}
//                     readOnly
//                     className="mt-1 w-5 h-5 text-green-600 rounded"
//                   />
//                 </div>

//                 <label className="text-sm text-gray-800">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={openPrivacyModal}
//                     className="text-green-600 hover:underline font-semibold focus:outline-none"
//                   >
//                     Privacy Policy
//                   </button>
//                 </label>
//               </div>

//               {errors.accepted_privacy && (
//                 <p className="text-red-500 text-sm flex items-center mt-3">
//                   <AlertCircle size={14} className="mr-1" />
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
//             <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl mx-auto mb-3" />
//           )}
//           <h1 className="text-3xl font-bold text-gray-800">
//             Company Registration
//           </h1>
//           <p className="text-gray-600">
//             Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToStep(idx + 1)}
//                   disabled={idx + 1 > currentStep || loading}
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//                     ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
//                     ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
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
//           <div className="mb-8">{renderStepContent()}</div>
//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
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
//                   {currentStep === 1 ? "Creating..." : "Saving..."}
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? "Create Company"
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
//               Already have a company account?{" "}
//               <Link
//                 to="/company/login"
//                 className="text-green-600 hover:text-green-800 font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//         <div className="text-center mt-6 text-white text-sm">
//           <p>
//             © {new Date().getFullYear()} Company Portal. All rights reserved.
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
//       <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

//       {/* Terms Modal */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Terms and Conditions for Company
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Content */}
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handleModalScroll}
//             >
//               <p>
//                 These Terms & Conditions govern your access to and use of the
//                 Anytime Work (ATW) Company Web Portal. By registering,
//                 accessing, or using the portal, your organization agrees to
//                 comply with these Terms.
//               </p>

//               <p className="font-semibold">1. Corporate Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>
//                   Only legally registered businesses and authorized
//                   representatives may create and manage Company accounts.
//                 </li>
//                 <li>
//                   Companies must provide accurate registration and compliance
//                   information.
//                 </li>
//               </ul>

//               <p className="font-semibold">2. Company Account</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Maintain accurate company information.</li>
//                 <li>Keep login credentials secure and confidential.</li>
//                 <li>
//                   The Company is responsible for all activities performed
//                   through its account.
//                 </li>
//               </ul>

//               <p className="font-semibold">3. Company Verification</p>
//               <p>Companies may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>GST Certificate</li>
//                 <li>PAN</li>
//                 <li>CIN (if applicable)</li>
//                 <li>Bank Account Details</li>
//                 <li>Authorized Signatory Details</li>
//                 <li>Company Address Proof</li>
//                 <li>Other documents requested by ATW</li>
//               </ul>
//               <p>
//                 Providing false or forged information may result in suspension,
//                 termination, or legal action.
//               </p>

//               <p className="font-semibold">4. Vacancy & Workforce Management</p>
//               <p>The Company Portal allows authorized users to:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Create and manage vacancies</li>
//                 <li>Hire and assign workers</li>
//                 <li>Manage attendance</li>
//                 <li>View workforce reports</li>
//                 <li>Manage company staff and roles</li>
//                 <li>Download reports and invoices</li>
//               </ul>
//               <p>
//                 All vacancies must comply with applicable labour laws, minimum
//                 wage regulations, and platform policies.
//               </p>

//               <p className="font-semibold">5. Billing & Payments</p>
//               <p>
//                 Invoices, service charges, payroll, statutory deductions, and
//                 other commercial transactions are processed according to the
//                 agreed business terms and applicable laws.
//               </p>

//               <p className="font-semibold">6. Data Protection</p>
//               <p>
//                 Companies must use worker information only for authorized
//                 business purposes.
//               </p>
//               <p>The Company must not:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Share worker information with unauthorized persons.</li>
//                 <li>Download or misuse confidential information.</li>
//                 <li>
//                   Sell, copy, or distribute platform data without authorization.
//                 </li>
//               </ul>

//               <p className="font-semibold">7. Website Usage</p>
//               <p>While using the portal, users may:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Upload company documents</li>
//                 <li>Upload compliance certificates</li>
//                 <li>Manage worker records</li>
//                 <li>Generate reports</li>
//                 <li>
//                   Use browser-based file upload and location features (where
//                   applicable)
//                 </li>
//               </ul>

//               <p className="font-semibold">8. Prohibited Activities</p>
//               <p>The following activities are strictly prohibited:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Fake company registration</li>
//                 <li>Fraudulent vacancy posting</li>
//                 <li>Fake attendance records</li>
//                 <li>Unauthorized access</li>
//                 <li>Data scraping</li>
//                 <li>Reverse engineering</li>
//                 <li>Sharing confidential worker information</li>
//                 <li>Misuse of platform data</li>
//               </ul>
//               <p>
//                 Violation may result in immediate suspension or permanent
//                 termination of the account.
//               </p>

//               <p className="font-semibold">9. Intellectual Property</p>
//               <p>
//                 All software, dashboards, reports, APIs, trademarks, logos,
//                 documents, and platform content are the exclusive property of
//                 Anytime Global Private Limited.
//               </p>

//               <p className="font-semibold">10. Suspension & Termination</p>
//               <p>
//                 ATW reserves the right to suspend or permanently terminate
//                 Company accounts for:
//               </p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Policy violations</li>
//                 <li>Fraudulent activities</li>
//                 <li>Non-payment</li>
//                 <li>Security risks</li>
//                 <li>Legal or regulatory requirements</li>
//               </ul>

//               <p className="font-semibold">11. Governing Law</p>
//               <p>
//                 These Terms are governed by the laws of India. Any disputes
//                 shall be subject to the jurisdiction of the competent courts at
//                 Jaipur, Rajasthan.
//               </p>

//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
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

//       {/* Privacy Modal */}
//       {showPrivacyModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Privacy Policy
//               </h3>
//               <button
//                 onClick={closePrivacyModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Content */}
//             <div
//               className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
//               onScroll={handlePrivacyModalScroll}
//             >
//               <p>
//                 Anytime Work (&quot;ATW&quot;) is committed to protecting your
//                 company&#39;s information and maintaining the confidentiality of
//                 business and workforce data.
//               </p>

//               <p className="font-semibold">1. Information We Collect</p>
//               <p>We may collect:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Company Name</li>
//                 <li>GST Number</li>
//                 <li>PAN</li>
//                 <li>CIN (if applicable)</li>
//                 <li>Company Address</li>
//                 <li>Authorized Representative Details</li>
//                 <li>Mobile Number</li>
//                 <li>Email Address</li>
//                 <li>Bank Account Details</li>
//                 <li>Company Documents</li>
//                 <li>Vacancy Information</li>
//                 <li>Worker Records</li>
//                 <li>Attendance Records</li>
//                 <li>Payroll &amp; Invoice Details</li>
//                 <li>Device &amp; Browser Information</li>
//                 <li>IP Address</li>
//                 <li>Login Activity</li>
//               </ul>

//               <p className="font-semibold">
//                 2. Information Submitted Through the Website
//               </p>
//               <p>Users may submit information through:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Company Registration</li>
//                 <li>Company Profile Updates</li>
//                 <li>KYC Document Uploads</li>
//                 <li>Vacancy Creation</li>
//                 <li>Worker Management</li>
//                 <li>Staff Management</li>
//                 <li>Report Downloads</li>
//                 <li>Support Requests</li>
//               </ul>

//               <p className="font-semibold">3. How We Use Your Information</p>
//               <p>Your information is used to:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Verify company identity</li>
//                 <li>Manage company accounts</li>
//                 <li>Create and manage vacancies</li>
//                 <li>Process worker onboarding</li>
//                 <li>Manage attendance and payroll</li>
//                 <li>Generate invoices and reports</li>
//                 <li>Comply with statutory and legal obligations</li>
//                 <li>Improve platform security</li>
//                 <li>Provide customer support</li>
//               </ul>

//               <p className="font-semibold">4. Data Sharing</p>
//               <p>Information may be shared only with:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Assigned Workers</li>
//                 <li>Banking &amp; Payment Partners</li>
//                 <li>KYC Verification Providers</li>
//                 <li>Government Authorities (where legally required)</li>
//               </ul>
//               <p>We do not sell company or worker information.</p>

//               <p className="font-semibold">5. Data Security</p>
//               <p>We protect your information using:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>HTTPS Secure Encryption</li>
//                 <li>Encrypted Storage</li>
//                 <li>Role-Based Access Control (RBAC)</li>
//                 <li>Private Document Storage</li>
//                 <li>Activity Logging &amp; Audit Records</li>
//                 <li>
//                   Masking of sensitive information after verification
//                   <br />
//                   <span className="text-sm text-gray-500">
//                     Examples: GST: 27ABCDE1234F1Z5 · PAN: ABCDE****F · Bank
//                     Account: XXXXXXXX4567 · Mobile Number: 98XXXXXX10
//                   </span>
//                 </li>
//               </ul>

//               <p className="font-semibold">6. Data Retention</p>
//               <p>
//                 Company information is retained only for the period required by
//                 applicable laws, taxation rules, employment regulations,
//                 contractual obligations, and legitimate business purposes.
//               </p>

//               <p className="font-semibold">7. Your Rights</p>
//               <p>Authorized Company users may request to:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>View company information</li>
//                 <li>Update company profile</li>
//                 <li>Replace verification documents</li>
//                 <li>
//                   Request account deletion (subject to legal and contractual
//                   obligations)
//                 </li>
//               </ul>

//               <p className="font-semibold">8. Contact Us</p>
//               <p>
//                 <strong>Compliance Department</strong>
//                 <br />
//                 Anytime Global Private Limited
//                 <br />
//                 Address: KH-04, Dabara, Didwana, Nagaur – 341506, Rajasthan,
//                 India
//                 <br />
//                 Email: compliance@anytimeglobal.com
//               </p>

//               <p className="text-sm text-gray-500 italic">
//                 By accessing or using the Anytime Work Company Web Portal, you
//                 acknowledge that you have read, understood, and agreed to these
//                 Terms &amp; Conditions and Privacy Policy.
//               </p>

//               <p className="text-sm text-gray-500 mt-4 italic">
//                 (Scroll to the end to accept)
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={privacyModalCheckboxChecked}
//                   onChange={handlePrivacyModalCheckboxChange}
//                   disabled={!privacyHasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I have read and agree to the Privacy Policy
//                 </span>
//               </label>

//               <button
//                 onClick={closePrivacyModal}
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

// export default CompanyRegister;

// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Building,
//   User,
//   Mail,
//   Phone,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Briefcase,
//   Home,
//   CreditCard,
//   Lock,
//   X,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

// const CompanyRegister = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     states,
//     token,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     industries,
//     handleIndustryChange,
//     selectedIndustryId,
//     industriesLoading,
//     profileCompleted,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//     // NOTE: this function is expected to live on useCompanyRegister and hit your
//     // real GST-lookup endpoint, returning { company_name, company_phone, email, gst_number }.
//     // If your hook doesn't have it yet, add something like:
//     //
//     //   const verifyGstNumber = async (gst) => {
//     //     const res = await api.post("/company/gst-verify", { gst_number: gst });
//     //     return { success: true, data: res.data };
//     //   };
//     //
//     // Until then, this component falls back to a local mock so the UI is fully testable.
//     verifyGstNumber,
//   } = useCompanyRegister();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   // ======================= GST GATE (mirrors the Aadhaar gate pattern in WorkerSignup) =======================
//   const hasToken = !!token || !!Cookies.get("token");
//   const [gstStage, setGstStage] = useState(hasToken ? "done" : "input"); // "input" | "verifying" | "done"
//   const [gstInput, setGstInput] = useState("");
//   const [gstError, setGstError] = useState("");
//   const [gstBusy, setGstBusy] = useState(false);
//   const [showGstSuccessToast, setShowGstSuccessToast] = useState(false);
//   const [locationFetching, setLocationFetching] = useState(false);
//   const [locationError, setLocationError] = useState("");
//   const [manualLocationMode, setManualLocationMode] = useState(false);
//   const privacyContentRef = useRef(null);


//   useEffect(() => {
//     if (currentStep === 3 && !formData.address_line && !manualLocationMode && !locationFetching) {
//       detectCurrentLocation();
//     }
//   }, [currentStep]);

//   const detectCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       setLocationError("Location is not supported by your browser.");
//       return;
//     }

//     setLocationFetching(true);
//     setLocationError("");

//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=${coords.latitude}&lon=${coords.longitude}`
//           );
//           const data = await res.json();
//           const address = data.address || {};

//           const stateName = address.state || "";
//           const districtName =
//             address.state_district ||
//             address.county ||
//             address.city ||
//             address.town ||
//             "";
//           const pincode = address.postcode || "";

//           updatePrimaryAddress("address", data.display_name || "");
//           updatePrimaryAddress("zip", pincode);

//           if (stateName) {
//             const state = states.find(
//               (s) => s.name?.toLowerCase() === stateName.toLowerCase()
//             );

//             if (state) {
//               updatePrimaryAddress("state_id", state.id);
//               const cities = await fetchCities(state.id);

//               if (districtName && cities?.length) {
//                 const city = cities.find(
//                   (c) => c.name?.toLowerCase() === districtName.toLowerCase()
//                 );
//                 if (city) updatePrimaryAddress("city_id", city.id);
//               }
//             }
//           }

//           if (!data.display_name) {
//             setLocationError("Could not detect full address. Please try refreshing or enter manually.");
//           }
//         } catch (e) {
//           console.log("Reverse geocoding error:", e);
//           setLocationError("Failed to fetch address details. Please try again or enter manually.");
//         } finally {
//           setLocationFetching(false);
//         }
//       },
//       (err) => {
//         console.log("Geolocation error code:", err.code, "message:", err.message);
//         setLocationFetching(false);

//         if (err.code === 1) {
//           setLocationError("Location access denied. Please enable location permission in your browser and refresh, or enter manually.");
//         } else if (err.code === 2) {
//           setLocationError("Location unavailable. Please check your device's GPS/location is turned on, or enter manually.");
//         } else if (err.code === 3) {
//           setLocationError("Location request timed out. Please try again or enter manually.");
//         } else {
//           setLocationError("Unable to get your location. Please try again or enter manually.");
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//       }
//     );
//   };

//   const onSubmitGst = async (e) => {
//     e.preventDefault();
//     const value = gstInput.trim().toUpperCase();
//     if (value.length !== 15) {
//       setGstError("Enter a valid 15-digit GST number");
//       return;
//     }
//     setGstError("");
//     setGstStage("verifying");

//     const res = await verifyGstNumber(value);

//     if (res?.success) {
//       setShowGstSuccessToast(true);
//       setTimeout(() => {
//         setShowGstSuccessToast(false);
//         setGstStage("done");
//       }, 1500);
//     } else {
//       setGstStage("input");
//       setGstError(res?.message || "Could not verify this GST number");
//     }
//   };

//   // ======================= WIZARD CONFIG =======================
//   const stepTitles = ["Review Details", "Owner Details", "Working Address", "Tax Details"];
//   const stepIcons = [
//     <Building size={18} />,
//     <Briefcase size={18} />,
//     <Home size={18} />,
//     <CreditCard size={18} />,
//   ];

//   // ---- Terms modal state ----
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] = useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] = useState(false);

//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   useEffect(() => {
//     setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
//   }, [formData.accepted_privacy]);

//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
//   };
//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };
//   const closeModal = () => setShowTermsModal(false);
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };

//   const openPrivacyModal = () => {
//     setShowPrivacyModal(true);
//     setPrivacyHasScrolledToBottom(false);
//     setTimeout(() => {
//       const el = privacyContentRef.current;
//       if (el && el.scrollHeight <= el.clientHeight) {
//         setPrivacyHasScrolledToBottom(true);
//       }
//     }, 0);
//   };
//   const closePrivacyModal = () => setShowPrivacyModal(false);
//   const handlePrivacyModalScroll = (e) => {
//     const target = e.target;
//     const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !privacyHasScrolledToBottom) setPrivacyHasScrolledToBottom(true);
//   };
//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setPrivacyModalCheckboxChecked(checked);
//     handleChange("accepted_privacy", checked);
//   };

//   // ---- Working address: mockups show a single address, not a repeatable list ----
//   useEffect(() => {
//     if (!formData.addresses || formData.addresses.length === 0) {
//       handleChange("addresses", [{ address: "", state_id: "", city_id: "", zip: "" }]);
//     }
//   }, [formData.addresses]);

//   const primaryAddress = (formData.addresses && formData.addresses[0]) || {
//     address: "",
//     state_id: "",
//     city_id: "",
//     zip: "",
//   };

//   const updatePrimaryAddress = (field, value) => {
//     const next = [{ ...primaryAddress, [field]: value }];
//     handleChange("addresses", next);
//   };

//   // ---- Small readonly field used in the "Review Details" step ----
//   const ReadonlyField = ({ icon, label, value, verified }) => (
//     <div>
//       <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>
//       <div className="relative">
//         {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">{icon}</span>}
//         <input
//           type="text"
//           readOnly
//           value={value || ""}
//           className={`w-full ${icon ? "pl-10" : "pl-3"} pr-9 py-2.5 border rounded-lg bg-blue-50/40 border-blue-200 text-gray-700 cursor-default`}
//         />
//         {verified ? (
//           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 flex items-center gap-1">
//             Verified <CheckCircle size={14} />
//           </span>
//         ) : (
//           <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         )}
//       </div>
//     </div>
//   );

//   const maskedGst = formData.gst_number
//     ? `${formData.gst_number.slice(0, 3)}${"*".repeat(Math.max(formData.gst_number.length - 5, 0))}${formData.gst_number.slice(-2)}`
//     : "";

//   // ======================= STEP CONTENT =======================
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-gray-800">Basic Company Details</h2>
//               <p className="text-gray-500 text-sm mt-1">
//                 Company name has been retrieved from your GST number.
//                 <br />
//                 Please add your phone number, email, and industry to continue.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <ReadonlyField icon={<Building size={16} />} label="Company Name" value={formData.company_name} />
//               <ReadonlyField icon={<FileText size={16} />} label="GST No" value={maskedGst} verified />

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.company_phone}
//                     onChange={(e) => handleChange("company_phone", e.target.value.replace(/\D/g, ""))}
//                     disabled={loading}
//                     placeholder="10-digit phone number"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.company_phone ? "border-red-500" : "border-gray-300"
//                       }`}
//                   />
//                 </div>
//                 {errors.company_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.company_phone}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     disabled={loading}
//                     placeholder="Enter company email"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
//                       }`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.email}
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">
//                   Industry <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedIndustryId}
//                   onChange={(e) => handleIndustryChange(e.target.value)}
//                   disabled={loading || industriesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"
//                     }`}
//                 >
//                   <option value="">Select Industry</option>
//                   {industries.map((ind) => (
//                     <option key={ind.id} value={ind.id}>
//                       {ind.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.industry_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.industry_id}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-gray-800">Owner / Contact Person Detail</h2>
//               <p className="text-gray-500 text-sm mt-1">Add primary contact number of the company owner or Contact Person</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     value={formData.owner_name}
//                     onChange={(e) => handleChange("owner_name", e.target.value)}
//                     disabled={loading}
//                     placeholder="Ram Kumar"
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.owner_name ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.owner_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Contact Phone <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     maxLength={10}
//                     value={formData.owner_phone}
//                     onChange={(e) => handleChange("owner_phone", e.target.value.replace(/\D/g, ""))}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.owner_phone ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.owner_phone}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Company Role <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <select
//                     value={formData.owner_role || ""}
//                     onChange={(e) => handleChange("owner_role", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 appearance-none ${errors.owner_role ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select Role</option>
//                     <option value="owner">Owner</option>
//                     <option value="hr">HR</option>
//                     <option value="manager">Manager</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 {errors.owner_role && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.owner_role}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="email"
//                     value={formData.owner_email}
//                     onChange={(e) => handleChange("owner_email", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.owner_email ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.owner_email && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.owner_email}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-gray-800">Add Company's Working Address</h2>
//               <p className="text-gray-500 text-sm mt-1">This is the working address that is used during vacancy creation</p>
//             </div>
//             {!manualLocationMode && (
//               <div className="flex justify-end mb-4">
//                 <button
//                   type="button"
//                   onClick={detectCurrentLocation}
//                   disabled={locationFetching}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg"
//                 >
//                   {locationFetching ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Detecting...
//                     </>
//                   ) : (
//                     "📍 Refresh Current Location"
//                   )}
//                 </button>
//               </div>
//             )}
//             {locationError && !manualLocationMode && (
//               <div className="space-y-2">
//                 <p className="text-red-500 text-sm flex items-center gap-1">
//                   <AlertCircle size={14} /> {locationError}
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setManualLocationMode(true);
//                     setLocationError("");
//                   }}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Enter address manually instead
//                 </button>
//               </div>
//             )}
//             {!manualLocationMode ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReadonlyField label="Street Address" value={primaryAddress.address} />
//                   <ReadonlyField label="PIN Code" value={primaryAddress.zip} />
//                   <ReadonlyField label="State" value={states.find((s) => s.id == primaryAddress.state_id)?.name} />
//                   <ReadonlyField label="District" value={citiesMap[primaryAddress.state_id]?.find((c) => c.id == primaryAddress.city_id)?.name || ""} />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Street Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={primaryAddress.address}
//                       onChange={(e) => updatePrimaryAddress("address", e.target.value)}
//                       className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_address ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.address_0_address && (
//                       <p className="text-red-500 text-sm mt-1">
//                         <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_address}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       PIN Code <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={primaryAddress.zip}
//                       onChange={(e) => updatePrimaryAddress("zip", e.target.value.replace(/\D/g, ""))}
//                       className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_zip ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.address_0_zip && (
//                       <p className="text-red-500 text-sm mt-1">
//                         <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_zip}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       State <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={primaryAddress.state_id}
//                       onChange={(e) => {
//                         updatePrimaryAddress("state_id", e.target.value);
//                         fetchCities(e.target.value);
//                       }}
//                       className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_state_id ? "border-red-500" : "border-gray-300"}`}
//                     >
//                       <option value="">Select State</option>
//                       {states.map((s) => (
//                         <option key={s.id} value={s.id}>
//                           {s.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.address_0_state_id && (
//                       <p className="text-red-500 text-sm mt-1">
//                         <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_state_id}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       District <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={primaryAddress.city_id}
//                       onChange={(e) => updatePrimaryAddress("city_id", e.target.value)}
//                       disabled={!primaryAddress.state_id || citiesLoading[primaryAddress.state_id]}
//                       className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_city_id ? "border-red-500" : "border-gray-300"}`}
//                     >
//                       <option value="">Select District</option>
//                       {citiesMap[primaryAddress.state_id]?.map((c) => (
//                         <option key={c.id} value={c.id}>
//                           {c.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.address_0_city_id && (
//                       <p className="text-red-500 text-sm mt-1">
//                         <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_city_id}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setManualLocationMode(false);
//                     detectCurrentLocation();
//                   }}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   ← Try detecting location again
//                 </button>
//               </>
//             )}

//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-gray-800">KYC / Tax Details</h2>
//               <p className="text-gray-500 text-sm mt-1">Provide optional tax identifiers and a referral code, if you have one</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">TAN Number (Optional)</label>
//                 <input
//                   type="text"
//                   maxLength={10}
//                   value={formData.pan_number}
//                   onChange={(e) => handleChange("pan_number", e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">CIN Number (Optional)</label>
//                 <input
//                   type="text"
//                   maxLength={21}
//                   value={formData.tin_number}
//                   onChange={(e) => handleChange("tin_number", e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Referral Code (Optional)</label>
//                 <input
//                   type="text"
//                   value={formData.agent_code || ""}
//                   maxLength={10}
//                   onChange={(e) => handleChange("agent_code", e.target.value)}
//                   disabled={loading}
//                   placeholder="Enter the referral code"
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div className="space-y-3 flex flex-col justify-center">
//                 <div className="flex items-start gap-3 cursor-pointer" onClick={openModal}>
//                   <input type="checkbox" checked={formData.accepted_terms} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
//                   <label className="text-sm text-gray-800">
//                     I agree to the{" "}
//                     <button type="button" onClick={openModal} className="text-blue-600 hover:underline font-semibold">
//                       Terms &amp; Conditions
//                     </button>
//                   </label>
//                 </div>
//                 <div className="flex items-start gap-3 cursor-pointer" onClick={openPrivacyModal}>
//                   <input type="checkbox" checked={formData.accepted_privacy} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
//                   <label className="text-sm text-gray-800">
//                     I agree to the{" "}
//                     <button type="button" onClick={openPrivacyModal} className="text-blue-600 hover:underline font-semibold">
//                       Privacy Policy
//                     </button>
//                   </label>
//                 </div>
//               </div>
//             </div>
//             {errors.accepted_terms && (
//               <p className="text-red-500 text-sm flex items-center">
//                 <AlertCircle size={14} className="mr-1" /> {errors.accepted_terms}
//               </p>
//             )}
//             {errors.accepted_privacy && (
//               <p className="text-red-500 text-sm flex items-center">
//                 <AlertCircle size={14} className="mr-1" /> {errors.accepted_privacy}
//               </p>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const helpFooter = (whatsappNumber || phoneNumber) && (
//     <div className="pt-6 mt-6 border-t border-gray-200">
//       <p className="text-sm font-semibold text-gray-400 text-center mb-3">Help &amp; Support</p>
//       <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//         {whatsappNumber && (
//           <a
//             href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition text-sm font-medium"
//           >
//             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4" />
//             WhatsApp Help
//           </a>
//         )}
//         {phoneNumber && (
//           <a
//             href={`tel:${phoneNumber}`}
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition text-sm font-medium"
//           >
//             <Phone size={16} /> Call Support
//           </a>
//         )}
//       </div>
//     </div>
//   );

//   // ======================= GST GATE SCREEN =======================
//   if (gstStage !== "done") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
//         <div className="w-full max-w-5xl">
//           <div className="flex justify-center mb-6">
//             {logoUrl ? (
//               <img src={logoUrl} alt="Logo" className="max-h-16" />
//             ) : (
//               <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
//             )}
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="grid grid-cols-1 md:grid-cols-2">
//               <div className="p-8 sm:p-10 flex flex-col justify-center">
//                 <h1 className="text-2xl font-bold text-blue-700">Let's Create Your Company Account</h1>
//                 <p className="text-gray-500 text-sm mt-2 leading-relaxed">
//                   Your GST Number has to verified.
//                   <br />
//                   Complete your profile to start using Anytime Work.
//                 </p>

//                 <form onSubmit={onSubmitGst} className="space-y-4 mt-8">
//                   <div>
//                     <label className="block text-sm font-medium mb-1 text-gray-800">Verify GST Number</label>
//                     <input
//                       type="text"
//                       maxLength={15}
//                       value={gstInput}
//                       onChange={(e) => setGstInput(e.target.value.toUpperCase())}
//                       placeholder="Enter your 15-digit company GST number"
//                       disabled={gstStage === "verifying"}
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${gstError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
//                         }`}
//                     />
//                     {gstError && (
//                       <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                         <AlertCircle size={14} /> {gstError}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={gstStage === "verifying"}
//                     className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
//                   >
//                     {gstStage === "verifying" ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Verifying...
//                       </>
//                     ) : (
//                       "Continue"
//                     )}
//                   </button>

//                   <p className="text-center text-xs text-gray-400">By entering, you agree to our Terms of Service</p>

//                   {(whatsappNumber || phoneNumber) && (
//                     <div className="pt-4 border-t border-gray-200">
//                       <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
//                       <div className="flex items-center justify-center gap-3">
//                         {whatsappNumber && (
//                           <a
//                             href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
//                           >
//                             <img
//                               src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                               alt="WhatsApp"
//                               className="w-4 h-4"
//                             />
//                             WhatsApp Help
//                           </a>
//                         )}
//                         {phoneNumber && (
//                           <a
//                             href={`tel:${phoneNumber}`}
//                             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
//                           >
//                             <Phone size={16} />
//                             Call Support
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               </div>
//               <div className="hidden md:flex items-center justify-center bg-blue-50/40 p-8">
//                 <img src="/images/company/registration_portal.png" alt="Company Registration Portal" />
//               </div>
//             </div>

//             <div className="border-t border-gray-100 py-4 text-center">
//               <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Anytime Work – Company Portal</p>
//               <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
//             </div>
//           </div>
//         </div>

//         {showGstSuccessToast && (
//           <div className="fixed bottom-6 right-6 z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
//                 <CheckCircle size={14} className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-800 font-medium leading-snug">Your GST number has been verified successfully.</p>
//                 <p className="text-xs text-gray-500 mt-0.5">Retrieving your company details...</p>
//               </div>
//             </div>
//             <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
//               <div className="h-full bg-green-500 rounded-full" style={{ animation: "gst-progress 1.5s linear forwards" }} />
//             </div>
//             <style>{`
//               @keyframes gst-progress {
//                 from { width: 0%; }
//                 to { width: 100%; }
//               }
//             `}</style>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (profileCompleted) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="w-full max-w-6xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10" /> : <img src="/images/logo.png" alt="Logo" className="h-10" />}
//             </div>
//             <div className="flex items-center gap-3 text-gray-800 font-semibold">
//               <span>Hi, {formData.owner_name || "Company"}</span>
//               <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
//                 <User size={20} className="text-blue-500" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-6xl mx-auto px-6 pb-10">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[520px]">
//             <div className="flex flex-col justify-center">
//               <h1 className="text-3xl font-bold text-green-600 leading-tight">Account Created Successfully!</h1>
//               <p className="text-gray-600 mt-3 max-w-md">
//                 Your worker account is ready.
//                 <br />
//                 Start applying for jobs and managing your work.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => navigate("/company/dashboard")}
//                 className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-64"
//               >
//                 Find Jobs <ChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center justify-center">
//               <img
//                 src="/images/company/company_wizard_complete.png"
//                 alt="Company"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ======================= WIZARD SCREEN =======================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="mb-4">
//           {logoUrl ? (
//             <img src={logoUrl} alt="Logo" className="max-h-20" />
//           ) : (
//             <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
//           )}
//         </div>
//         <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Company Registration</h1>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <div key={idx} className="flex flex-col items-center flex-1">
//                   <button
//                     onClick={() => goToStep(idx + 1)}
//                     disabled={idx + 1 > currentStep || loading}
//                     className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition
//                       ${idx + 1 === currentStep ? "bg-green-600 text-white ring-4 ring-green-100" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
//                       ${idx + 1 > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-green-400"}`}
//                   >
//                     {stepIcons[idx]}
//                   </button>
//                   <span className="text-[11px] text-gray-500 mt-1 hidden sm:block">{title}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//               />
//             </div>
//           </div>

//           <div className="mb-8">{renderStepContent()}</div>

//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft size={18} /> Back
//             </button>
//             <button
//               onClick={nextStep}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...
//                 </>
//               ) : (
//                 <>
//                   {currentStep === totalSteps ? "Submit" : "Continue"} <ChevronRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>

//           {helpFooter}

//           <div className="text-center mt-6">
//             <p className="text-gray-500 text-sm">
//               Already have a company account?{" "}
//               <Link to="/company/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-gray-500 text-sm">
//           <p>© {new Date().getFullYear()} Anytime Work – Company Portal. All rights reserved.</p>
//           <p className="mt-1">
//             Need help?{" "}
//             <a href={`mailto:${supportEmail}`} className="text-amber-600 hover:underline">
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* Terms Modal */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">Terms and Conditions for Company</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handleModalScroll}>
//               <p>
//                 These Terms &amp; Conditions govern your access to and use of the Anytime Work (ATW) Company Web
//                 Portal. By registering, accessing, or using the portal, your organization agrees to comply with
//                 these Terms.
//               </p>
//               <p className="font-semibold">1. Corporate Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Only legally registered businesses and authorized representatives may create and manage Company accounts.</li>
//                 <li>Companies must provide accurate registration and compliance information.</li>
//               </ul>
//               <p className="font-semibold">2. Company Verification</p>
//               <p>Companies may be required to submit GST Certificate, PAN, CIN (if applicable), Bank Account Details, and other documents requested by ATW.</p>
//               <p className="font-semibold">3. Data Protection</p>
//               <p>Companies must use worker information only for authorized business purposes and must not share, sell, or misuse platform data.</p>
//               <p className="font-semibold">4. Governing Law</p>
//               <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts at Jaipur, Rajasthan.</p>
//               <p className="text-sm text-gray-500 mt-4 italic">(Scroll to the end to accept)</p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={modalCheckboxChecked}
//                   onChange={handleModalCheckboxChange}
//                   disabled={!hasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
//               </label>
//               <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Privacy Modal */}
//       {showPrivacyModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">Privacy Policy</h3>
//               <button onClick={closePrivacyModal} className="text-gray-500 hover:text-gray-700">
//                 <X size={24} />
//               </button>
//             </div>
//             <div ref={privacyContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handlePrivacyModalScroll}>
//               <p>
//                 Anytime Work ("ATW") is committed to protecting your company's information and maintaining the
//                 confidentiality of business and workforce data.
//               </p>
//               <p className="font-semibold">Information We Collect</p>
//               <p>Company Name, GST Number, PAN, CIN, Address, Authorized Representative Details, Bank Account Details, and related documents.</p>
//               <p className="font-semibold">Data Security</p>
//               <p>We protect your information using HTTPS encryption, encrypted storage, role-based access control, and audit logging. Sensitive fields are masked after verification.</p>
//               <p className="font-semibold">Contact Us</p>
//               <p>
//                 Compliance Department, Anytime Global Private Limited
//                 <br />
//                 Email: compliance@anytimeglobal.com
//               </p>
//               <p className="text-sm text-gray-500 mt-4 italic">(Scroll to the end to accept)</p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={privacyModalCheckboxChecked}
//                   onChange={handlePrivacyModalCheckboxChange}
//                   disabled={!privacyHasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">I have read and agree to the Privacy Policy</span>
//               </label>
//               <button onClick={closePrivacyModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyRegister;

// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Building,
//   User,
//   Mail,
//   Phone,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   Lock,
//   X,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

// const CompanyRegister = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     states,
//     token,
//     citiesMap,
//     citiesLoading,
//     handleChange,
//     industries,
//     handleIndustryChange,
//     selectedIndustryId,
//     industriesLoading,
//     profileCompleted,
//     nextStep,
//     prevStep,
//     goToStep,
//     fetchCities,
//     // NOTE: this function is expected to live on useCompanyRegister and hit your
//     // real GST-lookup endpoint, returning { company_name, company_phone, email, gst_number }.
//     // If your hook doesn't have it yet, add something like:
//     //
//     //   const verifyGstNumber = async (gst) => {
//     //     const res = await api.post("/company/gst-verify", { gst_number: gst });
//     //     return { success: true, data: res.data };
//     //   };
//     //
//     // Until then, this component falls back to a local mock so the UI is fully testable.
//     verifyGstNumber,
//   } = useCompanyRegister();

//   const [logoUrl, setLogoUrl] = useState("");
//   const [supportEmail, setSupportEmail] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLogoUrl(Cookies.get("logo_url") || "");
//     setSupportEmail(Cookies.get("support_email") || "");
//     setWhatsappNumber(Cookies.get("whatsapp_number") || "");
//     setPhoneNumber(Cookies.get("phone_number") || "");
//   }, []);

//   // ======================= GST GATE (mirrors the Aadhaar gate pattern in WorkerSignup) =======================
//   const hasToken = !!token || !!Cookies.get("token");
//   const [gstStage, setGstStage] = useState(hasToken ? "done" : "input"); // "input" | "verifying" | "done"
//   const [gstInput, setGstInput] = useState("");
//   const [gstError, setGstError] = useState("");
//   const [gstBusy, setGstBusy] = useState(false);
//   const [showGstSuccessToast, setShowGstSuccessToast] = useState(false);
//   const privacyContentRef = useRef(null);

//   const onSubmitGst = async (e) => {
//     e.preventDefault();
//     const value = gstInput.trim().toUpperCase();
//     if (value.length !== 15) {
//       setGstError("Enter a valid 15-digit GST number");
//       return;
//     }
//     setGstError("");
//     setGstStage("verifying");

//     const res = await verifyGstNumber(value);

//     if (res?.success) {
//       setShowGstSuccessToast(true);
//       setTimeout(() => {
//         setShowGstSuccessToast(false);
//         setGstStage("done");
//       }, 1500);
//     } else {
//       setGstStage("input");
//       setGstError(res?.message || "Could not verify this GST number");
//     }
//   };

//   // ======================= WIZARD CONFIG =======================
//   // FIX: Owner Details step removed, and Working Address step removed and
//   // merged into step 1 per client request. Wizard is now 2 steps.
//   const stepTitles = ["Company Details", "Tax Details"];
//   const stepIcons = [
//     <Building size={18} />,
//     <CreditCard size={18} />,
//   ];

//   // ---- Terms modal state ----
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
//   const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] = useState(false);
//   const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] = useState(false);

//   useEffect(() => {
//     setModalCheckboxChecked(formData.accepted_terms);
//   }, [formData.accepted_terms]);

//   useEffect(() => {
//     setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
//   }, [formData.accepted_privacy]);

//   const handleModalScroll = (e) => {
//     const target = e.target;
//     const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
//   };
//   const openModal = () => {
//     setShowTermsModal(true);
//     setHasScrolledToBottom(false);
//   };
//   const closeModal = () => setShowTermsModal(false);
//   const handleModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setModalCheckboxChecked(checked);
//     handleChange("accepted_terms", checked);
//   };

//   const openPrivacyModal = () => {
//     setShowPrivacyModal(true);
//     setPrivacyHasScrolledToBottom(false);
//     setTimeout(() => {
//       const el = privacyContentRef.current;
//       if (el && el.scrollHeight <= el.clientHeight) {
//         setPrivacyHasScrolledToBottom(true);
//       }
//     }, 0);
//   };
//   const closePrivacyModal = () => setShowPrivacyModal(false);
//   const handlePrivacyModalScroll = (e) => {
//     const target = e.target;
//     const bottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
//     if (bottom && !privacyHasScrolledToBottom) setPrivacyHasScrolledToBottom(true);
//   };
//   const handlePrivacyModalCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setPrivacyModalCheckboxChecked(checked);
//     handleChange("accepted_privacy", checked);
//   };

//   // ---- Working address: single address, entered manually (no geolocation) ----
//   useEffect(() => {
//     if (!formData.addresses || formData.addresses.length === 0) {
//       handleChange("addresses", [{ address: "", state_id: "", city_id: "", zip: "" }]);
//     }
//   }, [formData.addresses]);

//   const primaryAddress = (formData.addresses && formData.addresses[0]) || {
//     address: "",
//     state_id: "",
//     city_id: "",
//     zip: "",
//   };

//   const updatePrimaryAddress = (field, value) => {
//     const next = [{ ...primaryAddress, [field]: value }];
//     handleChange("addresses", next);
//   };

//   // ---- Small readonly field used for GST-verified company info ----
//   const ReadonlyField = ({ icon, label, value, verified }) => (
//     <div>
//       <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>
//       <div className="relative">
//         {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">{icon}</span>}
//         <input
//           type="text"
//           readOnly
//           value={value || ""}
//           className={`w-full ${icon ? "pl-10" : "pl-3"} pr-9 py-2.5 border rounded-lg bg-blue-50/40 border-blue-200 text-gray-700 cursor-default`}
//         />
//         {verified ? (
//           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 flex items-center gap-1">
//             Verified <CheckCircle size={14} />
//           </span>
//         ) : (
//           <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         )}
//       </div>
//     </div>
//   );

//   const maskedGst = formData.gst_number
//     ? `${formData.gst_number.slice(0, 3)}${"*".repeat(Math.max(formData.gst_number.length - 5, 0))}${formData.gst_number.slice(-2)}`
//     : "";

//   // ======================= STEP CONTENT =======================
//   const renderStepContent = () => {
//     switch (currentStep) {
//       // FIX: Working Address fields merged directly into step 1, entered
//       // manually (no geolocation auto-detect). Owner Details step removed.
//       case 1:
//         return (
//           <div className="space-y-8">
//             <div className="space-y-6">
//               <div className="text-center">
//                 <h2 className="text-xl font-bold text-gray-800">Basic Company Details</h2>
//                 <p className="text-gray-500 text-sm mt-1">
//                   Company name has been retrieved from your GST number.
//                   <br />
//                   Please add your phone number, email, and industry to continue.
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <ReadonlyField icon={<Building size={16} />} label="Company Name" value={formData.company_name} />
//                 <ReadonlyField icon={<FileText size={16} />} label="GST No" value={maskedGst} verified />

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Company Phone <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="text"
//                       maxLength={10}
//                       value={formData.company_phone}
//                       onChange={(e) => handleChange("company_phone", e.target.value.replace(/\D/g, ""))}
//                       disabled={loading}
//                       placeholder="10-digit phone number"
//                       className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.company_phone ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                   </div>
//                   {errors.company_phone && (
//                     <p className="text-red-500 text-sm flex items-center mt-1">
//                       <AlertCircle size={14} className="mr-1" /> {errors.company_phone}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Company Email <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleChange("email", e.target.value)}
//                       disabled={loading}
//                       placeholder="Enter company email"
//                       className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-red-500 text-sm flex items-center mt-1">
//                       <AlertCircle size={14} className="mr-1" /> {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium mb-1">
//                     Industry <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={selectedIndustryId}
//                     onChange={(e) => handleIndustryChange(e.target.value)}
//                     disabled={loading || industriesLoading}
//                     className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"
//                       }`}
//                   >
//                     <option value="">Select Industry</option>
//                     {industries.map((ind) => (
//                       <option key={ind.id} value={ind.id}>
//                         {ind.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.industry_id && (
//                     <p className="text-red-500 text-sm flex items-center mt-1">
//                       <AlertCircle size={14} className="mr-1" /> {errors.industry_id}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 pt-6 border-t border-gray-200">
//               {/* <div className="text-center">
//                 <h2 className="text-xl font-bold text-gray-800">Company's Working Address</h2>
//                 <p className="text-gray-500 text-sm mt-1">This is the working address that is used during vacancy creation</p>
//               </div> */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Street Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={primaryAddress.address}
//                     onChange={(e) => updatePrimaryAddress("address", e.target.value)}
//                     disabled={loading}
//                     className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_address ? "border-red-500" : "border-gray-300"}`}
//                   />
//                   {errors.address_0_address && (
//                     <p className="text-red-500 text-sm mt-1">
//                       <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_address}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     PIN Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     maxLength={6}
//                     value={primaryAddress.zip}
//                     onChange={(e) => updatePrimaryAddress("zip", e.target.value.replace(/\D/g, ""))}
//                     disabled={loading}
//                     className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_zip ? "border-red-500" : "border-gray-300"}`}
//                   />
//                   {errors.address_0_zip && (
//                     <p className="text-red-500 text-sm mt-1">
//                       <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_zip}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={primaryAddress.state_id}
//                     onChange={(e) => {
//                       updatePrimaryAddress("state_id", e.target.value);
//                       fetchCities(e.target.value);
//                     }}
//                     disabled={loading}
//                     className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_state_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select State</option>
//                     {states.map((s) => (
//                       <option key={s.id} value={s.id}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.address_0_state_id && (
//                     <p className="text-red-500 text-sm mt-1">
//                       <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_state_id}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     District <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={primaryAddress.city_id}
//                     onChange={(e) => updatePrimaryAddress("city_id", e.target.value)}
//                     disabled={loading || !primaryAddress.state_id || citiesLoading[primaryAddress.state_id]}
//                     className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.address_0_city_id ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select District</option>
//                     {citiesMap[primaryAddress.state_id]?.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.address_0_city_id && (
//                     <p className="text-red-500 text-sm mt-1">
//                       <AlertCircle size={14} className="inline mr-1" /> {errors.address_0_city_id}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       // FIX: Tax Details is now step 2, the final step (Owner Details and
//       // Working Address steps removed)
//       case 2:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-gray-800">KYC / Tax Details</h2>
//               <p className="text-gray-500 text-sm mt-1">Provide optional tax identifiers and a referral code, if you have one</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">TAN Number (Optional)</label>
//                 <input
//                   type="text"
//                   maxLength={10}
//                   value={formData.tan_number}
//                   onChange={(e) => handleChange("tan_number", e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">CIN Number (Optional)</label>
//                 <input
//                   type="text"
//                   maxLength={21}
//                   value={formData.tin_number}
//                   onChange={(e) => handleChange("tin_number", e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Referral Code (Optional)</label>
//                 <input
//                   type="text"
//                   value={formData.agent_code || ""}
//                   maxLength={10}
//                   onChange={(e) => handleChange("agent_code", e.target.value)}
//                   disabled={loading}
//                   placeholder="Enter the referral code"
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div className="space-y-3 flex flex-col justify-center">
//                 <div className="flex items-start gap-3 cursor-pointer" onClick={openModal}>
//                   <input type="checkbox" checked={formData.accepted_terms} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
//                   <label className="text-sm text-gray-800">
//                     I agree to the{" "}
//                     <button type="button" onClick={openModal} className="text-blue-600 hover:underline font-semibold">
//                       Terms &amp; Conditions
//                     </button>
//                   </label>
//                 </div>
//                 <div className="flex items-start gap-3 cursor-pointer" onClick={openPrivacyModal}>
//                   <input type="checkbox" checked={formData.accepted_privacy} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
//                   <label className="text-sm text-gray-800">
//                     I agree to the{" "}
//                     <button type="button" onClick={openPrivacyModal} className="text-blue-600 hover:underline font-semibold">
//                       Privacy Policy
//                     </button>
//                   </label>
//                 </div>
//               </div>
//             </div>
//             {errors.accepted_terms && (
//               <p className="text-red-500 text-sm flex items-center">
//                 <AlertCircle size={14} className="mr-1" /> {errors.accepted_terms}
//               </p>
//             )}
//             {errors.accepted_privacy && (
//               <p className="text-red-500 text-sm flex items-center">
//                 <AlertCircle size={14} className="mr-1" /> {errors.accepted_privacy}
//               </p>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const helpFooter = (whatsappNumber || phoneNumber) && (
//     <div className="pt-6 mt-6 border-t border-gray-200">
//       <p className="text-sm font-semibold text-gray-400 text-center mb-3">Help &amp; Support</p>
//       <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//         {whatsappNumber && (
//           <a
//             href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition text-sm font-medium"
//           >
//             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4" />
//             WhatsApp Help
//           </a>
//         )}
//         {phoneNumber && (
//           <a
//             href={`tel:${phoneNumber}`}
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition text-sm font-medium"
//           >
//             <Phone size={16} /> Call Support
//           </a>
//         )}
//       </div>
//     </div>
//   );

//   // ======================= GST GATE SCREEN =======================
//   if (gstStage !== "done") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
//         <div className="w-full max-w-5xl">
//           <div className="flex justify-center mb-6">
//             {logoUrl ? (
//               <img src={logoUrl} alt="Logo" className="max-h-16" />
//             ) : (
//               <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
//             )}
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="grid grid-cols-1 md:grid-cols-2">
//               <div className="p-8 sm:p-10 flex flex-col justify-center">
//                 <h1 className="text-2xl font-bold text-blue-700">Let's Create Your Company Account</h1>
//                 <p className="text-gray-500 text-sm mt-2 leading-relaxed">
//                   Your GST Number has to verified.
//                   <br />
//                   Complete your profile to start using Anytime Work.
//                 </p>

//                 <form onSubmit={onSubmitGst} className="space-y-4 mt-8">
//                   <div>
//                     <label className="block text-sm font-medium mb-1 text-gray-800">Verify GST Number</label>
//                     <input
//                       type="text"
//                       maxLength={15}
//                       value={gstInput}
//                       onChange={(e) => setGstInput(e.target.value.toUpperCase())}
//                       placeholder="Enter your 15-digit company GST number"
//                       disabled={gstStage === "verifying"}
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${gstError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
//                         }`}
//                     />
//                     {gstError && (
//                       <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
//                         <AlertCircle size={14} /> {gstError}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={gstStage === "verifying"}
//                     className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
//                   >
//                     {gstStage === "verifying" ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Verifying...
//                       </>
//                     ) : (
//                       "Continue"
//                     )}
//                   </button>

//                   <p className="text-center text-xs text-gray-400">By entering, you agree to our Terms of Service</p>

//                   {(whatsappNumber || phoneNumber) && (
//                     <div className="pt-4 border-t border-gray-200">
//                       <p className="text-xs font-semibold text-gray-500 text-center mb-3">Help &amp; Support</p>
//                       <div className="flex items-center justify-center gap-3">
//                         {whatsappNumber && (
//                           <a
//                             href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
//                           >
//                             <img
//                               src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                               alt="WhatsApp"
//                               className="w-4 h-4"
//                             />
//                             WhatsApp Help
//                           </a>
//                         )}
//                         {phoneNumber && (
//                           <a
//                             href={`tel:${phoneNumber}`}
//                             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
//                           >
//                             <Phone size={16} />
//                             Call Support
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </form>
//               </div>
//               <div className="hidden md:flex items-center justify-center bg-blue-50/40 p-8">
//                 <img src="/images/company/registration_portal.png" alt="Company Registration Portal" />
//               </div>
//             </div>

//             <div className="border-t border-gray-100 py-4 text-center">
//               <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Anytime Work – Company Portal</p>
//               <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
//             </div>
//           </div>
//         </div>

//         {showGstSuccessToast && (
//           <div className="fixed bottom-6 right-6 z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
//                 <CheckCircle size={14} className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-800 font-medium leading-snug">Your GST number has been verified successfully.</p>
//                 <p className="text-xs text-gray-500 mt-0.5">Retrieving your company details...</p>
//               </div>
//             </div>
//             <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
//               <div className="h-full bg-green-500 rounded-full" style={{ animation: "gst-progress 1.5s linear forwards" }} />
//             </div>
//             <style>{`
//               @keyframes gst-progress {
//                 from { width: 0%; }
//                 to { width: 100%; }
//               }
//             `}</style>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (profileCompleted) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="w-full max-w-6xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10" /> : <img src="/images/logo.png" alt="Logo" className="h-10" />}
//             </div>
//             <div className="flex items-center gap-3 text-gray-800 font-semibold">
//               <span>Hi, {formData.company_name || "Company"}</span>
//               <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
//                 <User size={20} className="text-blue-500" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-6xl mx-auto px-6 pb-10">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[520px]">
//             <div className="flex flex-col justify-center">
//               <h1 className="text-3xl font-bold text-green-600 leading-tight">Account Created Successfully!</h1>
//               <p className="text-gray-600 mt-3 max-w-md">
//                 Your worker account is ready.
//                 <br />
//                 Start applying for jobs and managing your work.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => navigate("/company/dashboard")}
//                 className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-64"
//               >
//                 Find Jobs <ChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center justify-center">
//               <img
//                 src="/images/company/company_wizard_complete.png"
//                 alt="Company"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ======================= WIZARD SCREEN =======================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="mb-4">
//           {logoUrl ? (
//             <img src={logoUrl} alt="Logo" className="max-h-20" />
//           ) : (
//             <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
//           )}
//         </div>
//         <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Company Registration</h1>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {stepTitles.map((title, idx) => (
//                 <div key={idx} className="flex flex-col items-center flex-1">
//                   <button
//                     onClick={() => goToStep(idx + 1)}
//                     disabled={idx + 1 > currentStep || loading}
//                     className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition
//                       ${idx + 1 === currentStep ? "bg-green-600 text-white ring-4 ring-green-100" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}
//                       ${idx + 1 > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-green-400"}`}
//                   >
//                     {stepIcons[idx]}
//                   </button>
//                   <span className="text-[11px] text-gray-500 mt-1 hidden sm:block">{title}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all duration-500"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//               />
//             </div>
//           </div>

//           <div className="mb-8">{renderStepContent()}</div>

//           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//             <button
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft size={18} /> Back
//             </button>
//             <button
//               onClick={nextStep}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...
//                 </>
//               ) : (
//                 <>
//                   {currentStep === totalSteps ? "Submit" : "Continue"} <ChevronRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>

//           {helpFooter}

//           <div className="text-center mt-6">
//             <p className="text-gray-500 text-sm">
//               Already have a company account?{" "}
//               <Link to="/company/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-gray-500 text-sm">
//           <p>© {new Date().getFullYear()} Anytime Work – Company Portal. All rights reserved.</p>
//           <p className="mt-1">
//             Need help?{" "}
//             <a href={`mailto:${supportEmail}`} className="text-amber-600 hover:underline">
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* Terms Modal */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">Terms and Conditions for Company</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handleModalScroll}>
//               <p>
//                 These Terms &amp; Conditions govern your access to and use of the Anytime Work (ATW) Company Web
//                 Portal. By registering, accessing, or using the portal, your organization agrees to comply with
//                 these Terms.
//               </p>
//               <p className="font-semibold">1. Corporate Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Only legally registered businesses and authorized representatives may create and manage Company accounts.</li>
//                 <li>Companies must provide accurate registration and compliance information.</li>
//               </ul>
//               <p className="font-semibold">2. Company Verification</p>
//               <p>Companies may be required to submit GST Certificate, PAN, CIN (if applicable), Bank Account Details, and other documents requested by ATW.</p>
//               <p className="font-semibold">3. Data Protection</p>
//               <p>Companies must use worker information only for authorized business purposes and must not share, sell, or misuse platform data.</p>
//               <p className="font-semibold">4. Governing Law</p>
//               <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts at Jaipur, Rajasthan.</p>
//               <p className="text-sm text-gray-500 mt-4 italic">(Scroll to the end to accept)</p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={modalCheckboxChecked}
//                   onChange={handleModalCheckboxChange}
//                   disabled={!hasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
//               </label>
//               <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Privacy Modal */}
//       {showPrivacyModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-xl font-bold text-gray-800">Privacy Policy</h3>
//               <button onClick={closePrivacyModal} className="text-gray-500 hover:text-gray-700">
//                 <X size={24} />
//               </button>
//             </div>
//             <div ref={privacyContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handlePrivacyModalScroll}>
//               <p>
//                 Anytime Work ("ATW") is committed to protecting your company's information and maintaining the
//                 confidentiality of business and workforce data.
//               </p>
//               <p className="font-semibold">Information We Collect</p>
//               <p>Company Name, GST Number, PAN, CIN, Address, Authorized Representative Details, Bank Account Details, and related documents.</p>
//               <p className="font-semibold">Data Security</p>
//               <p>We protect your information using HTTPS encryption, encrypted storage, role-based access control, and audit logging. Sensitive fields are masked after verification.</p>
//               <p className="font-semibold">Contact Us</p>
//               <p>
//                 Compliance Department, Anytime Global Private Limited
//                 <br />
//                 Email: compliance@anytimeglobal.com
//               </p>
//               <p className="text-sm text-gray-500 mt-4 italic">(Scroll to the end to accept)</p>
//             </div>
//             <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={privacyModalCheckboxChecked}
//                   onChange={handlePrivacyModalCheckboxChange}
//                   disabled={!privacyHasScrolledToBottom}
//                   className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//                 <span className="text-sm text-gray-700">I have read and agree to the Privacy Policy</span>
//               </label>
//               <button onClick={closePrivacyModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyRegister;
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Lock,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { useCompanyRegister } from "../companyhooks/useCompanyRegister";

const CompanyRegister = () => {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    states,
    citiesMap,
    citiesLoading,
    fetchCities,
    token,
    handleChange,
    addAddress,
    updateAddress,
    removeAddress,
    industries,
    handleIndustryChange,
    selectedIndustryId,
    industriesLoading,
    profileCompleted,
    nextStep,
    prevStep,
    goToStep,
    // Hits your real GST-lookup endpoint (see verifyGstNumber in useCompanyRegister.js).
    // Returns { success, data: { company_name, trade_name, gst_number, pan_number,
    // gst_status, business_nature, constitution, taxpayer_type, registered_on,
    // full_address, company_phone, email } } and stores it directly into formData.
    verifyGstNumber,
  } = useCompanyRegister();

  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLogoUrl(Cookies.get("logo_url") || "");
    setSupportEmail(Cookies.get("support_email") || "");
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setPhoneNumber(Cookies.get("phone_number") || "");
  }, []);

  // ======================= GST GATE (mirrors the Aadhaar gate pattern in WorkerSignup) =======================
  const hasToken = !!token || !!Cookies.get("token");
  const [gstStage, setGstStage] = useState(hasToken ? "done" : "input"); // "input" | "verifying" | "done"
  const [gstInput, setGstInput] = useState("");
  const [gstError, setGstError] = useState("");
  const [showGstSuccessToast, setShowGstSuccessToast] = useState(false);
  const privacyContentRef = useRef(null);
  const termsContentRef = useRef(null);

  const onSubmitGst = async (e) => {
    e.preventDefault();
    const value = gstInput.trim().toUpperCase();
    if (value.length !== 15) {
      setGstError("Enter a valid 15-digit GST number");
      return;
    }
    setGstError("");
    setGstStage("verifying");

    const res = await verifyGstNumber(value);

    if (res?.success) {
      setShowGstSuccessToast(true);
      setTimeout(() => {
        setShowGstSuccessToast(false);
        setGstStage("done");
      }, 1500);
    } else {
      setGstStage("input");
      setGstError(res?.message || "Could not verify this GST number");
    }
  };

  // ======================= WIZARD CONFIG =======================
  // 2 steps: Company Details (GST-verified info) + Tax Details
  // (Working Address step removed per client request; Industry/Phone/Email
  // moved into the Tax Details step along with an optional extra address)
  const stepTitles = ["Company Details", "Tax Details"];
  const stepIcons = [<Building size={18} />, <CreditCard size={18} />];

  // ---- Terms modal state ----
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] = useState(false);
  const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] = useState(false);

  useEffect(() => {
    setModalCheckboxChecked(formData.accepted_terms);
  }, [formData.accepted_terms]);

  useEffect(() => {
    setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
  }, [formData.accepted_privacy]);

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
  const handleModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setModalCheckboxChecked(checked);
    handleChange("accepted_terms", checked);
    // Checking the box is always allowed — if they haven't scrolled to the
    // end yet, scroll the content into view for them instead of blocking.
    if (checked && !hasScrolledToBottom) {
      const el = termsContentRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

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
  const handlePrivacyModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPrivacyModalCheckboxChecked(checked);
    handleChange("accepted_privacy", checked);
    // Checking the box is always allowed — if they haven't scrolled to the
    // end yet, scroll the content into view for them instead of blocking.
    if (checked && !privacyHasScrolledToBottom) {
      const el = privacyContentRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  // ---- Modular Address section (Step 1), required, capped at 3 blocks ----
  const MAX_ADDRESSES = 3;

  useEffect(() => {
    if (!formData.addresses || formData.addresses.length === 0) {
      handleChange("addresses", [
        { address: "", state_id: "", city_id: "", zip: "", address_type: "" },
      ]);
    }
  }, [formData.addresses]);

  const handleAddressStateChange = (index, stateId) => {
    updateAddress(index, "state_id", stateId);
    updateAddress(index, "city_id", "");
    if (stateId) fetchCities(stateId);
  };

  // ---- Small readonly field used for GST-verified company info ----
  const ReadonlyField = ({ icon, label, value, verified, wide }) => (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">{icon}</span>}
        <input
          type="text"
          readOnly
          value={value || "—"}
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

  const maskedGst = formData.gst_number
    ? `${formData.gst_number.slice(0, 3)}${"*".repeat(Math.max(formData.gst_number.length - 5, 0))}${formData.gst_number.slice(-2)}`
    : "";

  // ======================= STEP CONTENT =======================
  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: GST-verified company details only (read-only).
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Company Details</h2>
              <p className="text-gray-500 text-sm mt-1">
                These details were retrieved from your GST number.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadonlyField icon={<Building size={16} />} label="Business Name" value={formData.company_name} />
              <ReadonlyField icon={<Building size={16} />} label="Trade Name" value={formData.trade_name} />
              <ReadonlyField icon={<FileText size={16} />} label="GSTIN" value={maskedGst} verified />
              <ReadonlyField icon={<FileText size={16} />} label="PAN Number" value={formData.pan_number} />
              <ReadonlyField icon={<CheckCircle size={16} />} label="GST Status" value={formData.gst_status} />
              <ReadonlyField icon={<Building size={16} />} label="Business Nature" value={formData.business_nature} />
              <ReadonlyField icon={<Building size={16} />} label="Constitution" value={formData.constitution} />
              <ReadonlyField icon={<FileText size={16} />} label="Taxpayer Type" value={formData.taxpayer_type} />
              <ReadonlyField icon={<FileText size={16} />} label="Registration Date" value={formData.registered_on} />
            </div>

            {/* Modular Address section — required, up to 3 blocks */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Address <span className="text-red-500">*</span>
                </h3>
                {formData.addresses.length < MAX_ADDRESSES && (
                  <button
                    type="button"
                    onClick={addAddress}
                    disabled={loading}
                    className="text-blue-600 text-sm font-medium hover:underline disabled:opacity-50"
                  >
                    + Add another address
                  </button>
                )}
              </div>

              {formData.addresses.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {index > 0 && (
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        disabled={loading}
                        className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
                      >
                        Remove Address
                      </button>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={item.address}
                        onChange={(e) => updateAddress(index, "address", e.target.value)}
                        disabled={loading}
                        placeholder="Enter address"
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                          errors[`address_${index}_address`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors[`address_${index}_address`] && (
                      <p className="text-red-500 text-sm mt-1">
                        <AlertCircle size={14} className="inline mr-1" /> {errors[`address_${index}_address`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Address Type</label>
                    <select
                      value={item.address_type || ""}
                      onChange={(e) => updateAddress(index, "address_type", e.target.value)}
                      disabled={loading}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Address Type</option>
                      <option value="billing">Billing Address</option>
                      <option value="working">Working Address</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP / PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={item.zip}
                      onChange={(e) => updateAddress(index, "zip", e.target.value.replace(/\D/g, ""))}
                      disabled={loading}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                        errors[`address_${index}_zip`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`address_${index}_zip`] && (
                      <p className="text-red-500 text-sm mt-1">
                        <AlertCircle size={14} className="inline mr-1" /> {errors[`address_${index}_zip`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.state_id}
                      onChange={(e) => handleAddressStateChange(index, e.target.value)}
                      disabled={loading}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                        errors[`address_${index}_state_id`] ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors[`address_${index}_state_id`] && (
                      <p className="text-red-500 text-sm mt-1">
                        <AlertCircle size={14} className="inline mr-1" /> {errors[`address_${index}_state_id`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.city_id}
                      onChange={(e) => updateAddress(index, "city_id", e.target.value)}
                      disabled={loading || !item.state_id}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                        errors[`address_${index}_city_id`] ? "border-red-500" : "border-gray-300"
                      } ${!item.state_id ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    >
                      <option value="">
                        {!item.state_id
                          ? "Select state first"
                          : citiesLoading[item.state_id]
                            ? "Loading cities..."
                            : "Select City"}
                      </option>
                      {(citiesMap[item.state_id] || []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors[`address_${index}_city_id`] && (
                      <p className="text-red-500 text-sm mt-1">
                        <AlertCircle size={14} className="inline mr-1" /> {errors[`address_${index}_city_id`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Step 2: Industry / Phone / Email (moved here) + Tax Details +
      // optional additional address + Terms & Privacy.
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Tax Details</h2>
              <p className="text-gray-500 text-sm mt-1">
                Add your contact info, tax identifiers, and accept our policies to finish.
              </p>
            </div>

            {/* Industry / Phone / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedIndustryId}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  disabled={loading || industriesLoading}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.industry_id ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
                {errors.industry_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.industry_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.company_phone}
                    onChange={(e) => handleChange("company_phone", e.target.value.replace(/\D/g, ""))}
                    disabled={loading}
                    placeholder="10-digit phone number"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.company_phone ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
                {errors.company_phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.company_phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={loading}
                    placeholder="Enter company email"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Tax identifiers + Referral */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium mb-1">TAN Number (Optional)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.tan_number}
                  onChange={(e) => handleChange("tan_number", e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                {errors.tan_number && (
                  <p className="text-red-500 text-sm mt-1">
                    <AlertCircle size={14} className="inline mr-1" /> {errors.tan_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CIN Number (Optional)</label>
                <input
                  type="text"
                  maxLength={21}
                  value={formData.tin_number}
                  onChange={(e) => handleChange("tin_number", e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                {errors.tin_number && (
                  <p className="text-red-500 text-sm mt-1">
                    <AlertCircle size={14} className="inline mr-1" /> {errors.tin_number}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Referral Code (Optional)</label>
                <input
                  type="text"
                  value={formData.agent_code || ""}
                  maxLength={10}
                  onChange={(e) => handleChange("agent_code", e.target.value)}
                  disabled={loading}
                  placeholder="Enter the referral code"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-start gap-3 cursor-pointer" onClick={openModal}>
                <input type="checkbox" checked={formData.accepted_terms} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openModal} className="text-blue-600 hover:underline font-semibold">
                    Terms &amp; Conditions
                  </button>
                </label>
              </div>
              <div className="flex items-start gap-3 cursor-pointer" onClick={openPrivacyModal}>
                <input type="checkbox" checked={formData.accepted_privacy} readOnly className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button type="button" onClick={openPrivacyModal} className="text-blue-600 hover:underline font-semibold">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.accepted_terms && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {errors.accepted_terms}
                </p>
              )}
              {errors.accepted_privacy && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {errors.accepted_privacy}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const helpFooter = (whatsappNumber || phoneNumber) && (
    <div className="pt-6 mt-6 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-400 text-center mb-3">Help &amp; Support</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition text-sm font-medium"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4" />
            WhatsApp Help
          </a>
        )}
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition text-sm font-medium"
          >
            <Phone size={16} /> Call Support
          </a>
        )}
      </div>
    </div>
  );

  // ======================= GST GATE SCREEN =======================
  if (gstStage !== "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl">
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-16" />
            ) : (
              <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-blue-700">Let's Create Your Company Account</h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Your GST Number has to be verified.
                  <br />
                  Complete your profile to start using Anytime Work.
                </p>

                <form onSubmit={onSubmitGst} className="space-y-4 mt-8">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">Verify GST Number</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstInput}
                      onChange={(e) => setGstInput(e.target.value.toUpperCase())}
                      placeholder="Enter your 15-digit company GST number"
                      disabled={gstStage === "verifying"}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${gstError ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                    {gstError && (
                      <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                        <AlertCircle size={14} /> {gstError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={gstStage === "verifying"}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {gstStage === "verifying" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Verifying...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">By entering, you agree to our Terms of Service</p>

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
              <div className="hidden md:flex items-center justify-center bg-blue-50/40 p-8">
                <img src="/images/company/registration_portal.png" alt="Company Registration Portal" />
              </div>
            </div>

            <div className="border-t border-gray-100 py-4 text-center">
              <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Anytime Work – Company Portal</p>
              <p className="text-gray-400 text-xs mt-0.5">All rights reserved</p>
            </div>
          </div>
        </div>

        {showGstSuccessToast && (
          <div className="fixed bottom-6 right-6 z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium leading-snug">Your GST number has been verified successfully.</p>
                <p className="text-xs text-gray-500 mt-0.5">Retrieving your company details...</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ animation: "gst-progress 1.5s linear forwards" }} />
            </div>
            <style>{`
              @keyframes gst-progress {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  if (profileCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10" /> : <img src="/images/logo.png" alt="Logo" className="h-10" />}
            </div>
            <div className="flex items-center gap-3 text-gray-800 font-semibold">
              <span>Hi, {formData.company_name || "Company"}</span>
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <User size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[520px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-green-600 leading-tight">Account Created Successfully!</h1>
              <p className="text-gray-600 mt-3 max-w-md">
                Your worker account is ready.
                <br />
                Start applying for jobs and managing your work.
              </p>

              <button
                type="button"
                onClick={() => navigate("/company/dashboard")}
                className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-64"
              >
                Find Jobs <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <img
                src="/images/company/company_wizard_complete.png"
                alt="Company"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======================= WIZARD SCREEN =======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-20" />
          ) : (
            <Building className="w-10 h-10 text-white bg-green-600 p-2 rounded-xl" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Company Registration</h1>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
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

          <div className="mb-8">{renderStepContent()}</div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={nextStep}
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
              Already have a company account?{" "}
              <Link to="/company/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Anytime Work – Company Portal. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a href={`mailto:${supportEmail}`} className="text-amber-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">Terms and Conditions for Company</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div ref={termsContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handleModalScroll}>
              <p>
                These Terms &amp; Conditions govern your access to and use of the Anytime Work (ATW) Company Web
                Portal. By registering, accessing, or using the portal, your organization agrees to comply with
                these Terms.
              </p>
              <p className="font-semibold">1. Corporate Eligibility</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Only legally registered businesses and authorized representatives may create and manage Company accounts.</li>
                <li>Companies must provide accurate registration and compliance information.</li>
              </ul>
              <p className="font-semibold">2. Company Verification</p>
              <p>Companies may be required to submit GST Certificate, PAN, CIN (if applicable), Bank Account Details, and other documents requested by ATW.</p>
              <p className="font-semibold">3. Data Protection</p>
              <p>Companies must use worker information only for authorized business purposes and must not share, sell, or misuse platform data.</p>
              <p className="font-semibold">4. Governing Law</p>
              <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts at Jaipur, Rajasthan.</p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">Privacy Policy</h3>
              <button onClick={closePrivacyModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div ref={privacyContentRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700" onScroll={handlePrivacyModalScroll}>
              <p>
                Anytime Work ("ATW") is committed to protecting your company's information and maintaining the
                confidentiality of business and workforce data.
              </p>
              <p className="font-semibold">Information We Collect</p>
              <p>Company Name, GST Number, PAN, CIN, Address, Authorized Representative Details, Bank Account Details, and related documents.</p>
              <p className="font-semibold">Data Security</p>
              <p>We protect your information using HTTPS encryption, encrypted storage, role-based access control, and audit logging. Sensitive fields are masked after verification.</p>
              <p className="font-semibold">Contact Us</p>
              <p>
                Compliance Department, Anytime Global Private Limited
                <br />
                Email: compliance@anytimeglobal.com
              </p>
            </div>
            <div className="border-t rounded-2xl p-5 flex items-center justify-between bg-white">
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
    </div>
  );
};

export default CompanyRegister;