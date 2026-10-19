import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  getDocumentsAPI,
  uploadDocumentAPI,
  deleteDocumentAPI,
  viewCompanyDocumentAPI,
  downloadCompanyDocumentAPI,
} from "../../../api/company/companyDocumentAPI";

export const useCompanyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileUrl: "",
    fileType: "",
    documentId: null,
  });

  const userCookie = Cookies.get("user");
  const parsedUser = JSON.parse(userCookie || "{}");
  const companyId = parsedUser?.company?.id || parsedUser?.id;

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const docsRes = await getDocumentsAPI({
        company_id: companyId,
        limit: 1000,
      });

      const rawData = docsRes?.data; // this is the whole `data` object from response
      // Extract documents array – adjust based on your actual API shape
      let docs = [];
      if (rawData?.documents && Array.isArray(rawData.documents)) {
        docs = rawData.documents;
      } else if (
        rawData?.data?.documents &&
        Array.isArray(rawData.data.documents)
      ) {
        docs = rawData.data.documents;
      } else if (Array.isArray(rawData?.data)) {
        docs = rawData.data;
      } else if (Array.isArray(rawData)) {
        docs = rawData;
      }

      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load documents.",
      });
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleAdminPreview = async (id) => {
    try {
      const response = await viewCompanyDocumentAPI(id);

      const fileUrl = URL.createObjectURL(response.data);

      const contentType = response.headers["content-type"];

      let fileType = "other";

      if (contentType?.includes("image")) {
        fileType = "image";
      } else if (contentType?.includes("pdf")) {
        fileType = "pdf";
      }

      setPreviewModal({
        isOpen: true,
        fileUrl,
        fileType,
        documentId: id,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to preview document.",
      });
    }
  };

  const handleAdminDownload = async (id) => {
    try {
      const response = await downloadCompanyDocumentAPI(id);

      const url = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = `document-${id}`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to download document.",
      });
    }
  };
  const handleUpload = async (typeId, file) => {
    if (!file) return;

    setUploadingId(typeId);
    const formData = new FormData();
    formData.append("company_id", companyId);
    formData.append("documents[0][document_type_id]", typeId);
    formData.append("documents[0][file]", file);

    try {
      const response = await uploadDocumentAPI(formData);
      if (response?.status === 200 || response?.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Document uploaded successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchData();
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (docId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This document will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteDocumentAPI(docId);
      if (response?.status === 200 || response?.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Document has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchData();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not delete document.",
      });
    }
  };

  const getFileTypeFromUrl = (url) => {
    if (!url) return "other";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension))
      return "image";
    if (extension === "pdf") return "pdf";
    return "other";
  };

  // const openPreview = (fileUrl) => {
  //   const fileType = getFileTypeFromUrl(fileUrl);
  //   setPreviewModal({ isOpen: true, fileUrl, fileType });
  // };
  const openPreview = (fileUrl, documentId = null) => {
    const fileType = getFileTypeFromUrl(fileUrl);

    setPreviewModal({
      isOpen: true,
      fileUrl,
      fileType,
      documentId,
    });
  };
  // const closePreview = () => {
  //   setPreviewModal({ isOpen: false, fileUrl: "", fileType: "" });
  // };
  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      fileUrl: "",
      fileType: "",
      documentId: null,
    });
  };
  return {
    loading,
    documents,
    uploadingId,
    previewModal,
    handleUpload,
    handleDelete,
    openPreview,
    closePreview,
    handleAdminPreview,
    handleAdminDownload,
    refresh: fetchData,
  };
};
