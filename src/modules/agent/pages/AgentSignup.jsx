// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   AlertCircle,
//   Briefcase,
//   CreditCard,
//   Home,
//   X,
//   Navigation,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Cookies from "js-cookie";
// import { useAgentSignup } from "../agenthooks/useAgentSignup";

// const AgentSignup = () => {
//   const {
//     currentStep,
//     totalSteps,
//     formData,
//     errors,
//     loading,
//     handleChange: hookHandleChange,
//     nextStep,
//     prevStep,
//     goToStep,
//     states,
//     statesLoading,
//     permanentCities,
//     permanentCitiesLoading,
//     currentCities,
//     currentCitiesLoading,
//   } = useAgentSignup({
//     onSuccess: () => console.log("Registration completed!"),
//   });

//   const handleChange = (field, value) => hookHandleChange(field, value);

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

//   const formatPhoneDisplay = (value) => {
//     const digits = value.replace(/\D/g, "").slice(0, 10);
//     const part1 = digits.slice(0, 3),
//       part2 = digits.slice(3, 7),
//       part3 = digits.slice(7, 10);
//     return `${part1}${part2 ? "-" + part2 : ""}${part3 ? "-" + part3 : ""}`;
//   };

//   const stepTitles = [
//     "Basic Info",
//     "Personal Details",
//     "KYC",
//     "Permanent Address",
//     "Work Details",
//     "Additional & Location", // Combined step
//   ];

//   const stepIcons = [
//     <User size={18} />,
//     <User size={18} />,
//     <CreditCard size={18} />,
//     <Home size={18} />,
//     <Briefcase size={18} />,
//     <Navigation size={18} />,
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
//               Basic Information
//             </h2>
//             <p className="text-gray-600">
//               Let's start with your basic details.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="John"
//                   />
//                 </div>
//                 {errors.first_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.first_name}
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
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="Doe"
//                   />
//                 </div>
//                 {errors.last_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.last_name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email Address <span className="text-red-500">*</span>
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
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="agent@example.com"
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
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.phone}
//                     onChange={(e) =>
//                       handleChange("phone", formatPhoneDisplay(e.target.value))
//                     }
//                     disabled={loading}
//                     maxLength={12}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.phone ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="XXX-XXXX-XXX"
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.phone}
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
//               Personal Details
//             </h2>
//             <p className="text-gray-600">Tell us a bit more about yourself.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Middle Name</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input type="text" value={formData.middle_name} onChange={(e) => handleChange("middle_name", e.target.value)} disabled={loading}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400" placeholder="Middle" />
//                 </div>
//               </div> */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Gender <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleChange("gender", e.target.value)}
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gender ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 {errors.gender && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.gender}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Date of Birth <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="date"
//                     max={new Date().toISOString().split("T")[0]}
//                     value={formData.date_of_birth}
//                     onChange={(e) =>
//                       handleChange("date_of_birth", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.date_of_birth && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.date_of_birth}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Father's Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     maxLength={35}
//                     value={formData.father_name}
//                     onChange={(e) =>
//                       handleChange("father_name", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.father_name ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="Father's name"
//                   />
//                 </div>
//                 {errors.father_name && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.father_name}
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
//               Identity Verification (KYC)
//             </h2>
//             <p className="text-gray-600">
//               Provide your PAN and Aadhar details.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   PAN Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <CreditCard
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.pan_number}
//                     onChange={(e) =>
//                       handleChange("pan_number", e.target.value.toUpperCase())
//                     }
//                     disabled={loading}
//                     maxLength={10}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.pan_number ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="ABCDE1234F"
//                   />
//                 </div>
//                 {errors.pan_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.pan_number}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Aadhar Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <CreditCard
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     name="aadhaar_unique_number"
//                     value={formData.aadhar_number || ""}
//                     onChange={(e) =>
//                       handleChange(
//                         "aadhar_number",
//                         e.target.value.replace(/\D/g, ""),
//                       )
//                     }
//                     disabled={loading}
//                     maxLength={12}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.aadhar_number
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     placeholder="1234 1234 1234"
//                   />
//                 </div>
//                 {errors.aadhar_number && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.aadhar_number}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Permanent Address
//             </h2>
//             <p className="text-gray-600">Where are you permanently located?</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">
//                   Address / Location <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Home
//                     className="absolute left-3 top-3 text-gray-400"
//                     size={18}
//                   />
//                   <textarea
//                     value={formData.agent_location}
//                     onChange={(e) =>
//                       handleChange("agent_location", e.target.value)
//                     }
//                     disabled={loading}
//                     rows={2}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.agent_location ? "border-red-500" : "border-gray-300"}`}
//                     placeholder="Street, Area"
//                   />
//                 </div>
//                 {errors.agent_location && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.agent_location}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   State <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.state_id}
//                   onChange={(e) => handleChange("state_id", e.target.value)}
//                   disabled={loading || statesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.state_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select State</option>
//                   {states?.map((state) => (
//                     <option key={state.id} value={state.id}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.state_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.state_id}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   City <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.city_id}
//                   onChange={(e) => handleChange("city_id", e.target.value)}
//                   disabled={
//                     loading || permanentCitiesLoading || !formData.state_id
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.city_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select City</option>
//                   {permanentCities?.map((city) => (
//                     <option key={city.id} value={city.id}>
//                       {city.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.city_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.city_id}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   ZIP Code <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.zip}
//                   onChange={(e) =>
//                     handleChange(
//                       "zip",
//                       e.target.value.replace(/\D/g, "").slice(0, 6),
//                     )
//                   }
//                   disabled={loading}
//                   maxLength={6}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.zip ? "border-red-500" : "border-gray-300"}`}
//                   placeholder="380001"
//                 />
//                 {errors.zip && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" /> {errors.zip}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Work Details</h2>
//             <p className="text-gray-600">
//               Tell us about your professional background.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Work Location */}
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Work Location <span className="text-red-500">*</span>
//                 </label>

//                 <div className="relative">
//                   <MapPin
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formData.work_location}
//                     onChange={(e) =>
//                       handleChange("work_location", e.target.value)
//                     }
//                     disabled={loading}
//                     className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                       errors.work_location
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     placeholder="City or region"
//                   />
//                 </div>

//                 {errors.work_location && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.work_location}
//                   </p>
//                 )}
//               </div> */}

//               {/* Work Experience */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Work Experience (years){" "}
//                   <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="number"
//                   min="0"
//                   step="0.5"
//                   value={formData.work_experience}
//                   onChange={(e) =>
//                     handleChange("work_experience", e.target.value)
//                   }
//                   disabled={loading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
//                     errors.work_experience
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="e.g., 2.5"
//                 />

//                 {errors.work_experience && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />
//                     {errors.work_experience}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 6:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               Additional Information & Current Location
//             </h2>
//             <p className="text-gray-600">
//               Optional details and where you currently reside.
//             </p>

//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Dress Size
//                 </label>
//                 <select
//                   value={formData.dress_size}
//                   onChange={(e) => handleChange("dress_size", e.target.value)}
//                   disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
//                 >
//                   <option value="">Select Size</option>
//                   <option value="S">S</option>
//                   <option value="M">M</option>
//                   <option value="L">L</option>
//                   <option value="XL">XL</option>
//                 </select>
//               </div>
//               {/* <div>
//                 <label className="block text-sm font-medium mb-1">Bonus Frequency</label>
//                 <select value={formData.bonus_frequency} onChange={(e) => handleChange("bonus_frequency", e.target.value)} disabled={loading}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400">
//                   <option value="">Select Frequency</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="quarterly">Quarterly</option>
//                   <option value="annually">Annually</option>
//                 </select>
//               </div> */}
//             </div>

//             <div className="border-t border-gray-200 my-4"></div>

//             {/* Current Location */}
//             <h3 className="text-lg font-semibold text-gray-800">
//               Working Location <span className="text-red-500">*</span>
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   State <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.current_state_id}
//                   onChange={(e) =>
//                     handleChange("current_state_id", e.target.value)
//                   }
//                   disabled={loading || statesLoading}
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.current_state_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select State</option>
//                   {states?.map((state) => (
//                     <option key={state.id} value={state.id}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.current_state_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.current_state_id}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   City <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.current_city_id}
//                   onChange={(e) =>
//                     handleChange("current_city_id", e.target.value)
//                   }
//                   disabled={
//                     loading ||
//                     currentCitiesLoading ||
//                     !formData.current_state_id
//                   }
//                   className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.current_city_id ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select City</option>
//                   {currentCities?.map((city) => (
//                     <option key={city.id} value={city.id}>
//                       {city.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.current_city_id && (
//                   <p className="text-red-500 text-sm flex items-center mt-1">
//                     <AlertCircle size={14} className="mr-1" />{" "}
//                     {errors.current_city_id}
//                   </p>
//                 )}
//               </div>
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
//       style={{
//         backgroundImage: "url('/images/admin/Login-Bg.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4"
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
//       <div className="relative z-10 w-full max-w-4xl">
//         <div className="text-center mb-3">
//           <div className="flex justify-center mb-4">
//             {logoUrl ? (
//               <img src={logoUrl} alt="Agent Logo" className="max-h-24" />
//             ) : (
//               <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl">
//                 <User className="w-10 h-10 text-white" />
//               </div>
//             )}
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Agent Registration
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
//                   className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
//                     ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
//                     ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
//                   title={title}
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
//               type="button"
//               onClick={prevStep}
//               disabled={currentStep === 1 || loading}
//               className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={18} /> Previous
//             </button>
//             <button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   {currentStep === 1 ? "Creating Account..." : "Saving..."}
//                 </>
//               ) : (
//                 <>
//                   {currentStep === 1
//                     ? "Create Account"
//                     : currentStep === totalSteps
//                       ? "Submit"
//                       : "Next"}
//                   <ChevronRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>
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
//                 to="/agent/login"
//                 className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//         <div className="text-center mt-6 text-white text-sm">
//           <p>© {new Date().getFullYear()} Agent Portal. All rights reserved.</p>
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
//                 AWT Terms and Conditions for Agent
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
//                 Anytime Work (ATW) Agent Website Portal. By registering,
//                 accessing, or using the portal, you agree to comply with these
//                 Terms.
//               </p>
//               <p className="font-semibold">1. Eligibility</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Agents must be 18 years of age or older.</li>
//                 <li>Agents must be legally authorized to work in India.</li>
//               </ul>
//               <p className="font-semibold">2. Agent Account</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Maintain accurate profile information.</li>
//                 <li>Keep your login credentials secure and confidential.</li>
//                 <li>Do not share your account with any other person.</li>
//               </ul>
//               <p className="font-semibold">3. KYC & Verification</p>
//               <p>Agents may be required to submit:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Aadhaar Card</li>
//                 <li>PAN Card</li>
//                 <li>Bank Account Details</li>
//                 <li>Profile Photo</li>
//                 <li>Other documents requested by ATW</li>
//               </ul>
//               <p>
//                 Providing false or forged documents may result in suspension,
//                 termination, or legal action.
//               </p>
//               <p className="font-semibold">4. Agent Responsibilities</p>
//               <p>Agents are responsible for:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Worker Registration</li>
//                 <li>Company Registration</li>
//                 <li>Uploading KYC Documents</li>
//                 <li>Verifying onboarding information</li>
//                 <li>Maintaining accurate records</li>
//                 <li>Following Anytime Work policies</li>
//               </ul>
//               <p className="font-semibold">5. Commission & Payments</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>
//                   Commission is payable only after successful verification and
//                   company payment confirmation.
//                 </li>
//                 <li>
//                   Payments are processed according to the applicable commission
//                   policy and statutory requirements.
//                 </li>
//               </ul>
//               <p className="font-semibold">6. Data Protection</p>
//               <p>Agents must not:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>
//                   Share worker or company information outside the ATW platform.
//                 </li>
//                 <li>Copy, download, or misuse confidential information.</li>
//                 <li>Use platform data for unauthorized purposes.</li>
//               </ul>
//               <p className="font-semibold">7. Website Usage</p>
//               <p>
//                 While using the website, users may upload documents and use
//                 browser features where required, including:
//               </p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>File Upload</li>
//                 <li>Camera (if supported by browser)</li>
//                 <li>Location (if enabled by the user)</li>
//               </ul>
//               <p className="font-semibold">8. Prohibited Activities</p>
//               <p>The following activities are strictly prohibited:</p>
//               <ul className="list-disc pl-5 space-y-2">
//                 <li>Fake registrations</li>
//                 <li>Fake KYC submissions</li>
//                 <li>Fraudulent onboarding</li>
//                 <li>Account sharing</li>
//                 <li>Unauthorized access</li>
//                 <li>Reverse engineering</li>
//                 <li>Misuse of platform data</li>
//               </ul>
//               <p>
//                 Violation may result in immediate account suspension or
//                 permanent termination.
//               </p>
//               <p className="font-semibold">9. Intellectual Property</p>
//               <p>
//                 All software, trademarks, logos, content, designs, and
//                 intellectual property available on the ATW platform are the
//                 exclusive property of Anytime Global Private Limited.
//               </p>
//               <p className="font-semibold">10. Suspension & Termination</p>
//               <p>
//                 ATW reserves the right to suspend or terminate any account that
//                 violates these Terms or applicable laws.
//               </p>
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

// export default AgentSignup;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Briefcase,
  CreditCard,
  Home,
  X,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Cookies from "js-cookie";
import { useAgentSignup } from "../agenthooks/useAgentSignup";

const AgentSignup = () => {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    handleChange: hookHandleChange,
    nextStep,
    prevStep,
    goToStep,
    states,
    statesLoading,
    permanentCities,
    permanentCitiesLoading,
    currentCities,
    currentCitiesLoading,
  } = useAgentSignup({
    onSuccess: () => console.log("Registration completed!"),
  });

  const handleChange = (field, value) => hookHandleChange(field, value);

  const [logoUrl, setLogoUrl] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Modal states for Terms & Conditions
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyHasScrolledToBottom, setPrivacyHasScrolledToBottom] =
    useState(false);
  const [privacyModalCheckboxChecked, setPrivacyModalCheckboxChecked] =
    useState(false);

  useEffect(() => {
    setLogoUrl(Cookies.get("logo_url") || "");
    setSupportEmail(Cookies.get("support_email") || "");
    setWhatsappNumber(Cookies.get("whatsapp_number") || "");
    setPhoneNumber(Cookies.get("phone_number") || "");
  }, []);

  // Sync modal checkbox with main form checkbox
  useEffect(() => {
    setModalCheckboxChecked(formData.accepted_terms);
  }, [formData.accepted_terms]);

  useEffect(() => {
    setPrivacyModalCheckboxChecked(formData.accepted_privacy || false);
  }, [formData.accepted_privacy]);

  const formatPhoneDisplay = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const part1 = digits.slice(0, 3),
      part2 = digits.slice(3, 7),
      part3 = digits.slice(7, 10);
    return `${part1}${part2 ? "-" + part2 : ""}${part3 ? "-" + part3 : ""}`;
  };

  const stepTitles = [
    "Basic Info",
    "Personal Details",
    "KYC",
    "Permanent Address",
    "Work Details",
    "Additional & Location", // Combined step
  ];

  const stepIcons = [
    <User size={18} />,
    <User size={18} />,
    <CreditCard size={18} />,
    <Home size={18} />,
    <Briefcase size={18} />,
    <Navigation size={18} />,
  ];
  // Scroll handler for Terms modal content
  const handleModalScroll = (e) => {
    const target = e.target;
    const bottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Reset scroll state when modal opens
  const openModal = () => {
    setShowTermsModal(true);
    setHasScrolledToBottom(false);
  };

  const closeModal = () => {
    setShowTermsModal(false);
  };

  // Handle checkbox change inside Terms modal
  const handleModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setModalCheckboxChecked(checked);
    handleChange("accepted_terms", checked);
  };

  // Privacy modal handlers
  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
    setPrivacyHasScrolledToBottom(false);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  const handlePrivacyModalScroll = (e) => {
    const target = e.target;
    const bottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
    if (bottom && !privacyHasScrolledToBottom) {
      setPrivacyHasScrolledToBottom(true);
    }
  };

  const handlePrivacyModalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPrivacyModalCheckboxChecked(checked);
    handleChange("accepted_privacy", checked);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Basic Information
            </h2>
            <p className="text-gray-600">
              Let's start with your basic details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={35}
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="John"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={35}
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Doe"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.last_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="agent@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", formatPhoneDisplay(e.target.value))
                    }
                    disabled={loading}
                    maxLength={12}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 transition ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    placeholder="XXX-XXXX-XXX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Personal Details
            </h2>
            <p className="text-gray-600">Tell us a bit more about yourself.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.gender}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.date_of_birth}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    maxLength={35}
                    value={formData.father_name}
                    onChange={(e) =>
                      handleChange("father_name", e.target.value)
                    }
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.father_name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Father's name"
                  />
                </div>
                {errors.father_name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.father_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Identity Verification (KYC)
            </h2>
            <p className="text-gray-600">
              Provide your PAN and Aadhar details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.pan_number}
                    onChange={(e) =>
                      handleChange("pan_number", e.target.value.toUpperCase())
                    }
                    disabled={loading}
                    maxLength={10}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.pan_number ? "border-red-500" : "border-gray-300"}`}
                    placeholder="ABCDE1234F"
                  />
                </div>
                {errors.pan_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.pan_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhar Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="aadhaar_unique_number"
                    value={formData.aadhar_number || ""}
                    onChange={(e) =>
                      handleChange(
                        "aadhar_number",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    disabled={loading}
                    maxLength={12}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                      errors.aadhar_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="1234 1234 1234"
                  />
                </div>
                {errors.aadhar_number && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.aadhar_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Permanent Address
            </h2>
            <p className="text-gray-600">Where are you permanently located?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address / Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    value={formData.agent_location}
                    onChange={(e) =>
                      handleChange("agent_location", e.target.value)
                    }
                    disabled={loading}
                    rows={2}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.agent_location ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Street, Area"
                  />
                </div>
                {errors.agent_location && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.agent_location}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state_id}
                  onChange={(e) => handleChange("state_id", e.target.value)}
                  disabled={loading || statesLoading}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.state_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select State</option>
                  {states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.state_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.city_id}
                  onChange={(e) => handleChange("city_id", e.target.value)}
                  disabled={
                    loading || permanentCitiesLoading || !formData.state_id
                  }
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.city_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select City</option>
                  {permanentCities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.city_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) =>
                    handleChange(
                      "zip",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  disabled={loading}
                  maxLength={6}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.zip ? "border-red-500" : "border-gray-300"}`}
                  placeholder="380001"
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.zip}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Work Details</h2>
            <p className="text-gray-600">
              Tell us about your professional background.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Work Experience */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Experience (years){" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.work_experience}
                  onChange={(e) =>
                    handleChange("work_experience", e.target.value)
                  }
                  disabled={loading}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                    errors.work_experience
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., 2.5"
                />

                {errors.work_experience && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.work_experience}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Additional Information & Current Location
            </h2>
            <p className="text-gray-600">
              Optional details and where you currently reside.
            </p>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dress Size
                </label>
                <select
                  value={formData.dress_size}
                  onChange={(e) => handleChange("dress_size", e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Current Location */}
            <h3 className="text-lg font-semibold text-gray-800">
              Working Location <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.current_state_id}
                  onChange={(e) =>
                    handleChange("current_state_id", e.target.value)
                  }
                  disabled={loading || statesLoading}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.current_state_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select State</option>
                  {states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.current_state_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.current_state_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.current_city_id}
                  onChange={(e) =>
                    handleChange("current_city_id", e.target.value)
                  }
                  disabled={
                    loading ||
                    currentCitiesLoading ||
                    !formData.current_state_id
                  }
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-400 ${errors.current_city_id ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select City</option>
                  {currentCities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.current_city_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" />{" "}
                    {errors.current_city_id}
                  </p>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Terms & Conditions
            </h2>
            <p className="text-gray-600">
              Review and accept to complete registration.
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border">
              <div className="flex items-start gap-3">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={openModal}
                >
                  <input
                    type="checkbox"
                    checked={formData.accepted_terms}
                    readOnly
                    className="mt-1 w-5 h-5 text-green-600 rounded"
                  />
                </div>
                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={openModal}
                    className="text-green-600 hover:underline font-semibold focus:outline-none"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.accepted_terms && (
                <p className="text-red-500 text-sm flex items-center mt-3">
                  <AlertCircle size={14} className="mr-1" />{" "}
                  {errors.accepted_terms}
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border mt-4">
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={openPrivacyModal}
              >
                <input
                  type="checkbox"
                  checked={formData.accepted_privacy}
                  readOnly
                  className="mt-1 w-5 h-5 text-green-600 rounded"
                />

                <label className="text-sm text-gray-800">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={openPrivacyModal}
                    className="text-green-600 hover:underline font-semibold"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {errors.accepted_privacy && (
                <p className="text-red-500 text-sm flex items-center mt-1 gap-1">
                  <AlertCircle size={14} />
                  {errors.accepted_privacy}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/admin/Login-Bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-3">
          <div className="flex justify-center mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Agent Logo" className="max-h-24" />
            ) : (
              <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agent Registration
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx + 1)}
                  disabled={idx + 1 > currentStep || loading}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${idx + 1 === currentStep ? "bg-green-600 text-white" : idx + 1 < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
                    ${idx + 1 > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-400"}`}
                  title={title}
                >
                  {stepIcons[idx]}
                </button>
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
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {currentStep === 1 ? "Creating Account..." : "Saving..."}
                </>
              ) : (
                <>
                  {currentStep === 1
                    ? "Create Account"
                    : currentStep === totalSteps
                      ? "Submit"
                      : "Next"}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
          {(whatsappNumber || phoneNumber) && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-500 text-center mb-3">
                Need Help?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      alt="WhatsApp"
                      className="w-5 h-5"
                    />
                    <span>WhatsApp</span>
                  </a>
                )}
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  >
                    <Phone size={18} /> <span>Call Us</span>
                  </a>
                )}
              </div>
            </div>
          )}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/agent/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-6 text-white text-sm">
          <p>© {new Date().getFullYear()} Agent Portal. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-amber-300 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                AWT Terms and Conditions for Agent
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
              onScroll={handleModalScroll}
            >
              <p>
                These Terms & Conditions govern your access to and use of the
                Anytime Work (ATW) Agent Website Portal. By registering,
                accessing, or using the portal, you agree to comply with these
                Terms.
              </p>
              <p className="font-semibold">1. Eligibility</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Agents must be 18 years of age or older.</li>
                <li>Agents must be legally authorized to work in India.</li>
              </ul>
              <p className="font-semibold">2. Agent Account</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintain accurate profile information.</li>
                <li>Keep your login credentials secure and confidential.</li>
                <li>Do not share your account with any other person.</li>
              </ul>
              <p className="font-semibold">3. KYC & Verification</p>
              <p>Agents may be required to submit:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aadhaar Card</li>
                <li>PAN Card</li>
                <li>Bank Account Details</li>
                <li>Profile Photo</li>
                <li>Other documents requested by ATW</li>
              </ul>
              <p>
                Providing false or forged documents may result in suspension,
                termination, or legal action.
              </p>
              <p className="font-semibold">4. Agent Responsibilities</p>
              <p>Agents are responsible for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Worker Registration</li>
                <li>Company Registration</li>
                <li>Uploading KYC Documents</li>
                <li>Verifying onboarding information</li>
                <li>Maintaining accurate records</li>
                <li>Following Anytime Work policies</li>
              </ul>
              <p className="font-semibold">5. Commission & Payments</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Commission is payable only after successful verification and
                  company payment confirmation.
                </li>
                <li>
                  Payments are processed according to the applicable commission
                  policy and statutory requirements.
                </li>
              </ul>
              <p className="font-semibold">6. Data Protection</p>
              <p>Agents must not:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Share worker or company information outside the ATW platform.
                </li>
                <li>Copy, download, or misuse confidential information.</li>
                <li>Use platform data for unauthorized purposes.</li>
              </ul>
              <p className="font-semibold">7. Website Usage</p>
              <p>
                While using the website, users may upload documents and use
                browser features where required, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>File Upload</li>
                <li>Camera (if supported by browser)</li>
                <li>Location (if enabled by the user)</li>
              </ul>
              <p className="font-semibold">8. Prohibited Activities</p>
              <p>The following activities are strictly prohibited:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fake registrations</li>
                <li>Fake KYC submissions</li>
                <li>Fraudulent onboarding</li>
                <li>Account sharing</li>
                <li>Unauthorized access</li>
                <li>Reverse engineering</li>
                <li>Misuse of platform data</li>
              </ul>
              <p>
                Violation may result in immediate account suspension or
                permanent termination.
              </p>
              <p className="font-semibold">9. Intellectual Property</p>
              <p>
                All software, trademarks, logos, content, designs, and
                intellectual property available on the ATW platform are the
                exclusive property of Anytime Global Private Limited.
              </p>
              <p className="font-semibold">10. Suspension & Termination</p>
              <p>
                ATW reserves the right to suspend or terminate any account that
                violates these Terms or applicable laws.
              </p>
              <p className="font-semibold">11. Governing Law</p>
              <p>
                These Terms are governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of the competent courts at
                Jaipur, Rajasthan.
              </p>
              <p className="text-sm text-gray-500 mt-4 italic">
                (Scroll to the end to accept)
              </p>
            </div>

            {/* Footer */}
            <div className="border-t rounded 2xl p-5 flex items-center justify-between bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalCheckboxChecked}
                  onChange={handleModalCheckboxChange}
                  disabled={!hasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Terms and Conditions
                </span>
              </label>

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal - Agent version */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Privacy Policy
              </h3>
              <button
                onClick={closePrivacyModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content - Agent Privacy Policy */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
              onScroll={handlePrivacyModalScroll}
            >
              <p>
                Anytime Work (&quot;ATW&quot;) respects your privacy and is
                committed to protecting your personal information while using
                the Agent Website Portal.
              </p>

              <p className="font-semibold">1. Information We Collect</p>
              <p>We may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Full Name</li>
                <li>Mobile Number</li>
                <li>Email Address</li>
                <li>Address</li>
                <li>Aadhaar Details</li>
                <li>PAN Details</li>
                <li>Bank Account Details</li>
                <li>Profile Photo</li>
                <li>Commission Information</li>
                <li>Registered Worker Details</li>
                <li>Registered Company Details</li>
                <li>Device &amp; Browser Information</li>
                <li>IP Address</li>
                <li>Login Activity</li>
              </ul>

              <p className="font-semibold">
                2. Information Submitted Through the Website
              </p>
              <p>Users may submit information through:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Agent Registration</li>
                <li>Worker Registration</li>
                <li>Company Registration</li>
                <li>KYC Upload Forms</li>
                <li>Profile Update Forms</li>
                <li>Support Requests</li>
              </ul>

              <p className="font-semibold">3. How We Use Your Information</p>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify your identity (KYC)</li>
                <li>Create and manage your Agent account</li>
                <li>Register workers and companies</li>
                <li>Verify documents</li>
                <li>Process commissions</li>
                <li>Maintain compliance records</li>
                <li>Improve website security</li>
                <li>Provide customer support</li>
              </ul>

              <p className="font-semibold">4. Data Sharing</p>
              <p>Your information may be shared only with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Authorized Client Companies</li>
                <li>Banking &amp; Payment Partners</li>
                <li>KYC Verification Providers</li>
                <li>Government Authorities (where legally required)</li>
              </ul>
              <p>We do not sell your personal information.</p>

              <p className="font-semibold">5. Data Security</p>
              <p>We protect your information through:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Secure HTTPS Encryption</li>
                <li>Encrypted Storage</li>
                <li>Role-Based Access Control</li>
                <li>Private Document Storage</li>
                <li>
                  Masking of sensitive information after verification
                  <br />
                  <span className="text-sm text-gray-500">
                    Examples: Aadhaar: XXXX XXXX 1234 · PAN: ABCDE****F · Bank
                    Account: XXXXXXXX4567 · Mobile Number: 98XXXXXX10
                  </span>
                </li>
              </ul>

              <p className="font-semibold">6. Data Retention</p>
              <p>
                Your information is retained only for as long as required by
                applicable laws, commission records, compliance obligations, and
                legitimate business purposes.
              </p>

              <p className="font-semibold">7. Your Rights</p>
              <p>You may request to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View your personal information</li>
                <li>Update or correct your information</li>
                <li>Replace KYC documents</li>
                <li>
                  Request account deletion (subject to legal and regulatory
                  obligations)
                </li>
              </ul>

              <p className="font-semibold">8. Contact Us</p>
              <p>
                <strong>Compliance Department</strong>
                <br />
                Anytime Global Private Limited
                <br />
                Address: KH-04, Dabara, Didwana, Nagaur – 341506
                <br />
                Rajasthan, India
                <br />
                Email: agent-support@anytimeglobal.com
              </p>

              <p className="text-sm text-gray-500 italic">
                By accessing or using the Anytime Work Agent Website Portal, you
                acknowledge that you have read, understood, and agreed to these
                Terms &amp; Conditions and Privacy Policy.
              </p>

              <p className="text-sm text-gray-500 mt-4 italic">
                (Scroll to the end to accept)
              </p>
            </div>

            {/* Footer */}
            <div className="border-t rounded 2xl p-5 flex items-center justify-between bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyModalCheckboxChecked}
                  onChange={handlePrivacyModalCheckboxChange}
                  disabled={!privacyHasScrolledToBottom}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Privacy Policy
                </span>
              </label>

              <button
                onClick={closePrivacyModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSignup;
