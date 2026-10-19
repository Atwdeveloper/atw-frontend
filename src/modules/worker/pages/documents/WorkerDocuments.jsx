import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  Upload,
  Download,
  X,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  File,
  Image,
  User,
  Briefcase,
  Receipt,
  FileSignature,
  FileCheck,
  Eye,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import Loader from "../../../../common/components/Loader";
import Swal from "sweetalert2";

import { useWorkerDocuments } from "../../workerhooks/useWorkerDocuments";
import React, { useState, useEffect } from "react";

import {
  getWorkerProfileAPI,
  getSalarySlipDownloadAPI,
} from "../../../../api/worker/workerAPI";
const WorkerDocuments = () => {
  const navigate = useNavigate();
  const {
    loading,
    combinedData,
    uploadingId,
    previewModal,
    handleUpload,
    handleDelete,
    handleWorkerPreview,
    handleWorkerDownload,
    openPreview,
    closePreview,
  } = useWorkerDocuments();

  const [activeTab, setActiveTab] = useState("professional");
  const [profile, setProfile] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 1-12

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getWorkerProfileAPI();
        if (res.success) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const isMonthDisabled = (monthValue) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Disable future months
    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && monthValue > currentMonth) return true;

    // Disable joining month
    if (profile?.date_of_joining) {
      const joiningDate = new Date(profile.date_of_joining);
      const joiningYear = joiningDate.getFullYear();
      const joiningMonth = joiningDate.getMonth() + 1;

      if (selectedYear === joiningYear && monthValue === joiningMonth)
        return true;

      // Also disable months before joining
      if (selectedYear < joiningYear) return true;
      if (selectedYear === joiningYear && monthValue < joiningMonth)
        return true;
    }

    return false;
  };

  const handleViewPayslip = async () => {
    try {
      const response = await getSalarySlipDownloadAPI(
        selectedYear,
        selectedMonth,
      );

      if (response.data instanceof Blob) {
        const text = await response.data.text();

        try {
          const json = JSON.parse(text);
          if (!json.success) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: json.message || "Salary slip not found",
            });
            return;
          }

          if (json.data && typeof json.data === "string") {
            const blob = new Blob([json.data], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 100);
            return;
          }
        } catch (e) {
          if (
            text.trim().startsWith("<!DOCTYPE") ||
            text.trim().startsWith("<html")
          ) {
            const blob = new Blob([text], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 100);
            return;
          }
        }

        // If we reach here, unknown blob content
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid response from server",
        });
        return;
      }

      // Case 2: Normal JSON response (if you ever remove responseType: 'blob')
      if (!response.success) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.message || "Salary slip not found",
        });
        return;
      }

      const htmlContent = response.data;
      if (!htmlContent || typeof htmlContent !== "string") {
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: "No payslip content received.",
        });
        return;
      }

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error fetching payslip:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  // Debug: log combinedData to see the structure
  useEffect(() => {
    if (combinedData.length) {
    }
  }, [combinedData]);

  const getUploadedDocByName = (name) => {
    return (
      combinedData.find((item) => item.type?.name === name)?.document || null
    );
  };

  // Filter by category and exclude those that are handled as automatic
  const automaticNames = [
    "Pay Slip",
    "Offer Letter",
    "ESIC TIC Report",
    "FORM 26AS",
  ];
  const rawProfessionalDocs = combinedData.filter(
    (item) =>
      item.type?.category?.toLowerCase() === "professional" &&
      !automaticNames.includes(item.type?.name) &&
      item.type?.name !== "Annual Salary Report",
  );

  // Inject Automatic Documents at the top
  const professionalDocs = [
    { type: { name: "Pay Slip", isAutomatic: true, id: "auto_payslip" } },
    {
      type: { name: "Offer Letter", isAutomatic: true, id: "auto_offer" },
      document: getUploadedDocByName("Offer Letter"),
    },
    {
      type: { name: "ESIC TIC Report", isAutomatic: true, id: "auto_esic" },
      document: getUploadedDocByName("ESIC TIC Report"),
    },
    {
      type: { name: "FORM 26AS", isAutomatic: true, id: "auto_form26as" },
      document: getUploadedDocByName("FORM 26AS"),
    },
    ...rawProfessionalDocs,
  ];

  const personalDocs = combinedData.filter(
    (item) =>
      item.type?.category?.toLowerCase() === "personal" &&
      item.type?.name !== "Annual Salary Report",
  );

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return File;
    const extension = fileUrl.split(".").pop().toLowerCase();
    const iconMap = {
      jpg: Image,
      jpeg: Image,
      png: Image,
      gif: Image,
      svg: Image,
      webp: Image,
      pdf: FileText,
      doc: FileText,
      docx: FileText,
      txt: FileText,
      rtf: FileText,
      xls: FileSpreadsheet,
      xlsx: FileSpreadsheet,
      csv: FileSpreadsheet,
      ppt: File,
      pptx: File,
      mp3: FileAudio,
      wav: FileAudio,
      ogg: FileAudio,
      mp4: FileVideo,
      avi: FileVideo,
      mov: FileVideo,
      mkv: FileVideo,
      zip: FileArchive,
      rar: FileArchive,
      "7z": FileArchive,
      tar: FileArchive,
      gz: FileArchive,
    };
    return iconMap[extension] || File;
  };

  const triggerFileInput = (typeId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleUpload(typeId, file);
    };
    input.click();
  };

  if (loading && !combinedData.length) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col bg-gray-50 p-4 w-full items-center min-h-[70vh]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-200 mb-6 w-full max-w-7xl"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <p className="text-gray-600">
                Manage professional & personal documents
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="w-full max-w-7xl mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("professional")}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "professional"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Briefcase size={18} />
              Professional Documents ({professionalDocs.length})
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "personal"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User size={18} />
              Personal Documents ({personalDocs.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Professional Tab */}
      {activeTab === "professional" && (
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-7xl"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Document Type
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {professionalDocs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500">
                      No professional document types found
                    </td>
                  </tr>
                ) : (
                  professionalDocs.map((item) => (
                    <motion.tr
                      key={item.type.id}
                      variants={itemVariants}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${item.type.isAutomatic ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            {item.type.name === "Pay Slip" ? (
                              <Receipt size={18} />
                            ) : item.type.name === "Offer Letter" ? (
                              <FileSignature size={18} />
                            ) : item.type.name === "ESIC TIC Report" ? (
                              <FileCheck size={18} />
                            ) : item.type.name === "FORM 26AS" ? (
                              <FileText size={18} />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {item.type.name}
                            </p>
                            {item.type.isAutomatic && (
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                Generated Document
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {item.type.name === "Pay Slip" ? (
                          <div className="flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                              <select
                                value={selectedYear}
                                onChange={(e) =>
                                  setSelectedYear(parseInt(e.target.value))
                                }
                                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                              >
                                {years.map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                              <div className="w-[1px] h-3 bg-gray-200" />
                              <select
                                value={selectedMonth}
                                onChange={(e) =>
                                  setSelectedMonth(parseInt(e.target.value))
                                }
                                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                              >
                                <option value="">Month</option>
                                {months.map((m) => (
                                  <option
                                    key={m.value}
                                    value={m.value}
                                    disabled={isMonthDisabled(m.value)}
                                  >
                                    {m.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={handleViewPayslip}
                              disabled={
                                !selectedMonth || isMonthDisabled(selectedMonth)
                              }
                              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-200 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95"
                            >
                              <Eye size={14} /> View
                            </button>
                          </div>
                        ) : item.type.isAutomatic && !item.document ? (
                          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            Not Uploaded
                          </span>
                        ) : item.document ? (
                          <button
                            onClick={() => openPreview(item.document.file_url)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-blue-600 hover:text-blue-800 hover:border-blue-200 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                          >
                            <Eye size={14} />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            Not Uploaded
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Personal Tab */}
      {activeTab === "personal" && (
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-7xl"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Document Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    File
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {personalDocs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      No personal document types found
                    </td>
                  </tr>
                ) : (
                  personalDocs.map((item) => (
                    <motion.tr key={item.type.id} variants={itemVariants}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {item.type.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.document ? (
                          item.document.status === "approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : item.document.status === "rejected" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Missing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.document ? (
                          <button
                            // onClick={() => openPreview(item.document.file_url)}
                            onClick={() =>
                              handleWorkerPreview(item.document.id)
                            }
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {React.createElement(
                              getFileIcon(item.document.file_url),
                              { size: 16 },
                            )}
                            <span>Preview</span>
                          </button>
                        ) : (
                          <span className="text-gray-400">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => triggerFileInput(item.type.id)}
                            disabled={uploadingId === item.type.id}
                            className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-md ${
                              item.document
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            } ${uploadingId === item.type.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <Upload size={16} />
                            {item.document ? "Replace" : "Upload"}
                          </button>
                          {item.document && (
                            <button
                              onClick={() => handleDelete(item.document.id)}
                              className="text-gray-500 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button
                onClick={closePreview}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewModal.fileType === "image" ? (
                <img
                  src={previewModal.fileUrl}
                  alt="Preview"
                  className="max-w-full max-h-[70vh] mx-auto object-contain"
                />
              ) : previewModal.fileType === "pdf" ? (
                <iframe
                  src={`${previewModal.fileUrl}#view=FitH`}
                  title="PDF Preview"
                  className="w-full h-[70vh]"
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">
                    Preview not available for this file type.
                  </p>
                  <a
                    href={previewModal.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                  >
                    <Download size={18} /> Download File
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              {/* <a
                href={previewModal.fileUrl}
                download
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Download size={16} /> Download
              </a> */}
              <button
                onClick={() => handleWorkerDownload(previewModal.documentId)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Download size={16} /> Download
              </button>{" "}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WorkerDocuments;
