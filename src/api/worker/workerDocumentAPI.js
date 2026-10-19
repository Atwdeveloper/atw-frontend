import axiosInstance from "../axiosInstance";

export const getDocumentTypesAPI = (type) => {
  return axiosInstance.get("/documents-types", { params: { type } });
};

// Get uploaded documents list
export const getDocumentsAPI = (params) => {
  return axiosInstance.get("/worker/documents", { params });
};

// Upload a new document
export const uploadDocumentAPI = (formData) => {
  return axiosInstance.post("/worker/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const viewWorkerDocumentAPI = (id) => {
  return axiosInstance.get(`/worker-document/view/${id}`, {
    responseType: "blob",
  });
};

export const downloadWorkerDocumentAPI = (id) => {
  return axiosInstance.get(`/worker-document/download/${id}`, {
    responseType: "blob",
  });
};
// Delete a document
export const deleteDocumentAPI = (id) => {
  return axiosInstance.delete(`/worker/document-delete/${id}`);
};
