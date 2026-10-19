import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { getAdminDocumentsAPI } from "../../../api/company/companyDocumentAPI";

export const useCompanyAdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileUrl: "",
    fileType: "", // image | pdf | other
  });

  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");

  const companyId = parsedUser?.company?.id || parsedUser?.id;

  // Fetch documents
  const fetchAdminDocuments = useCallback(async () => {
    if (!companyId) return;

    setLoading(true);

    try {
      const response = await getAdminDocumentsAPI({
        company_id: companyId,
        limit: 1000,
      });

      const docs = response?.data?.data || [];

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching admin documents:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load admin documents.",
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAdminDocuments();
  }, [fetchAdminDocuments]);

  // Get file type safely
  const getFileTypeFromUrl = (url) => {
    if (!url) return "other";

    const extension = url.split(".").pop()?.toLowerCase();

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)
    ) {
      return "image";
    }

    if (extension === "pdf") {
      return "pdf";
    }

    return "other";
  };

  // Open preview safely
  const openPreview = (fileUrl) => {
    if (!fileUrl) {
      Swal.fire({
        icon: "warning",
        title: "File not available",
        text: "This document does not have a valid file.",
      });

      return;
    }

    const fileType = getFileTypeFromUrl(fileUrl);

    setPreviewModal({
      isOpen: true,
      fileUrl,
      fileType,
    });
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      fileUrl: "",
      fileType: "",
    });
  };

  return {
    loading,
    documents,
    previewModal,
    openPreview,
    closePreview,
    refresh: fetchAdminDocuments,
  };
};
