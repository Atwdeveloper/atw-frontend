import { motion } from "framer-motion";
import {
  Eye,
  Download,
  FileText,
  X,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import Loader from "../../../../common/components/Loader";
import { useCompanyAdminDocuments } from "../../companyhooks/useCompanyAdminDocuments";
import React from "react";

const AnyTimeWorkDocuments = () => {
  const {
    loading,
    documents,
    previewModal,
    openPreview,
    closePreview,
  } = useCompanyAdminDocuments();

  // Helper to get file icon (optional, but can be removed if not needed)
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return FileText;
    const extension = fileUrl.split('.').pop().toLowerCase();
    const iconMap = {
      jpg: FileText, jpeg: FileText, png: FileText, gif: FileText, pdf: FileText,
      // You can add more specific icons if desired
    };
    return iconMap[extension] || FileText;
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
            <h1 className="text-3xl font-bold text-gray-800">AnyTime Work Documents</h1>
            <p className="text-gray-600">Documents uploaded by admin for your company</p>
          </div>
        </div>
      </motion.div>

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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-10 text-gray-500">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Preview button */}
                        <button
                          onClick={() => openPreview(doc.file_url)}
                          className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                         >
                          <Eye size={16} />
                          Preview
                        </button>

                        {/* Download button */}
                        <a
                          href={doc.file_url}
                          download
                          className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Preview Modal (same as before) */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button
                onClick={closePreview}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
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

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end">
              <a
                href={previewModal.fileUrl}
                download
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AnyTimeWorkDocuments;