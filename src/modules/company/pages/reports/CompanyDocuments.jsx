import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Trash2,
  Upload,
  Download,
  X,
  FileAudio,
  FileVideo,
  FileArchive,
  FileSpreadsheet,
  Image,
  File,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import Loader from "../../../../common/components/Loader";
import { useCompanyDocuments } from "../../companyhooks/useCompanyDocuments";
import React from "react";

const CompanyDocuments = () => {
  const navigate = useNavigate();
  const {
    loading,
    documents,
    uploadingId,
    previewModal,
    openPreview,
    handleUpload,
    handleDelete,
    closePreview,
    handleAdminPreview,
    handleAdminDownload,
  } = useCompanyDocuments();

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return File;

    const extension = fileUrl.split(".").pop().toLowerCase();

    const iconMap = {
      // Images
      jpg: Image,
      jpeg: Image,
      png: Image,
      gif: Image,
      svg: Image,
      webp: Image,
      // Documents
      pdf: FileText,
      doc: FileText,
      docx: FileText,
      txt: FileText,
      rtf: FileText,
      // Spreadsheets
      xls: FileSpreadsheet,
      xlsx: FileSpreadsheet,
      csv: FileSpreadsheet,
      // Presentations
      ppt: File,
      pptx: File,
      // Audio
      mp3: FileAudio,
      wav: FileAudio,
      ogg: FileAudio,
      // Video
      mp4: FileVideo,
      avi: FileVideo,
      mov: FileVideo,
      mkv: FileVideo,
      // Archives
      zip: FileArchive,
      rar: FileArchive,
      "7z": FileArchive,
      tar: FileArchive,
      gz: FileArchive,
    };

    return iconMap[extension] || File;
  };

  // Filter expiring documents
  const expiringDocuments = documents.filter(
    (doc) => doc.document_will_expire_soon === 1,
  );

  // Trigger file input for a specific document type
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

  if (loading && !documents.length) {
    return (
      <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800">
                Company Documents (KYC)
              </h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expiring Documents Warning */}
      {expiringDocuments.length > 0 && (
        <div className="mb-6 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm font-medium">
          The following documents will expire soon:{" "}
          <span className="font-semibold">
            {expiringDocuments.map((doc) => doc.document_type).join(", ")}
          </span>
          . Please upload the latest documents.
        </div>
      )}

      {/* Documents List */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        variants={itemVariants}
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
                  Template Document
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {doc.document_type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : doc.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : doc.status === "not_uploaded"
                                ? "bg-gray-100 text-gray-800"
                                : doc.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {doc.status === "approved"
                          ? "Approved"
                          : doc.status === "rejected"
                            ? "Rejected"
                            : doc.status === "not_uploaded"
                              ? "Not Uploaded"
                              : doc.status === "pending"
                                ? "Pending"
                                : "Not Uploaded"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {doc.file_url ? (
                        <button
                          // onClick={() => openPreview(doc.file_url)}
                          onClick={() => handleAdminPreview(doc.document_id)}
                          className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {doc.admin_file_url ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPreview(doc.admin_file_url)}
                            className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <Eye size={16} />
                          </button>

                          <a
                            href={doc.admin_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No admin document
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div className="text-s text-gray-500">
                        {doc.expiry_date || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {doc.show_upload_option === 1 && (
                          <button
                            onClick={() =>
                              triggerFileInput(doc.document_type_id)
                            }
                            disabled={uploadingId === doc.document_type_id}
                            className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            {uploadingId === doc.document_type_id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload
                              </>
                            )}
                          </button>
                        )}

                        {doc.show_upload_option === 1 && (
                          <button
                            onClick={() => handleDelete(doc.document_id)}
                            className="text-gray-500 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      {doc.show_upload_option === 1 && (
                        <span className="text-xs">
                          (pdf, jpg, jpeg, png, webp)
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
      <p className="mt-2 text-red-500 text-xs">
        Please download the template document, fill in the required details,
        sign it, and upload the completed document.
      </p>
      <p className="mt-2 text-red-500 text-xs">
        Please note that once the document is approved by the Admin, it cannot
        be replaced or re-uploaded. Re-upload will be enabled only 8 days before
        the document expiry date.
      </p>
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
                    <Download size={18} />
                    Download File
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() =>
                  previewModal.documentId
                    ? handleAdminDownload(previewModal.documentId)
                    : window.open(previewModal.fileUrl, "_blank")
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
            {/* <div className="p-4 border-t flex justify-end">
              <a
                href={previewModal.fileUrl}
                download
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </a>
            </div> */}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyDocuments;
