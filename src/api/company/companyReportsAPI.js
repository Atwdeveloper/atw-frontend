import axiosInstance from "../axiosInstance";

/**
 * Company Reports API Service
 * Centralized API calls for all company report operations
 */

// ==================== Invoice Reports ====================
export const getInvoicesAPI = async (params = {}) => {
  const response = await axiosInstance.get('/company/invoices', { params });
  return response.data;
};

export const getInvoiceByIdAPI = async (invoiceId) => {
  const response = await axiosInstance.get(`/company/invoices/${invoiceId}`);
  return response.data;
};

export const createInvoiceAPI = async (invoiceData) => {
  const response = await axiosInstance.post('/company/invoices', invoiceData);
  return response.data;
};

export const updateInvoiceAPI = async (invoiceId, invoiceData) => {
  const response = await axiosInstance.put(`/company/invoices/${invoiceId}`, invoiceData);
  return response.data;
};

export const deleteInvoiceAPI = async (invoiceId) => {
  const response = await axiosInstance.delete(`/company/invoices/${invoiceId}`);
  return response.data;
};

export const downloadInvoiceAPI = async (invoiceId) => {
  const response = await axiosInstance.get(`/company/invoices/${invoiceId}/download`, {
    responseType: 'blob',
  });
  return response;
};

// ==================== Salary Sheet Reports ====================
export const getSalarySheetsAPI = async (params = {}) => {
  const response = await axiosInstance.get('/company/salary-sheets', { params });
  return response.data;
};

export const uploadSalarySheetAPI = async (formData) => {
  const response = await axiosInstance.post('/company/salary-sheets/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSalarySheetByIdAPI = async (sheetId) => {
  const response = await axiosInstance.get(`/company/salary-sheets/${sheetId}`);
  return response.data;
};

export const deleteSalarySheetAPI = async (sheetId) => {
  const response = await axiosInstance.delete(`/company/salary-sheets/${sheetId}`);
  return response.data;
};

export const exportSalarySheetAPI = async (params) => {
  const response = await axiosInstance.get('/company/salary-sheets/export', {
    params,
    responseType: 'blob',
  });
  return response;
};

// GST Reports removed

// ==================== Dashboard Statistics ====================
export const getReportStatisticsAPI = async (params = {}) => {
  const response = await axiosInstance.get('/company/reports/statistics', {
    params,
  });
  return response.data;
};

export const getRecentReportsAPI = async (limit = 10) => {
  const response = await axiosInstance.get('/company/reports/recent', {
    params: { limit },
  });
  return response.data;
};
export const getComplianceDocumentsAPI = async (params = {}) => {
  const response = await axiosInstance.get('/company/compliance-documents', { params });
  return response.data;
};