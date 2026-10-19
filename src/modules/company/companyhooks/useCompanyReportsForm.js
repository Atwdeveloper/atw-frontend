import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  createInvoiceAPI,
  updateInvoiceAPI,
  uploadSalarySheetAPI,
} from "../../../api/company/companyReportsAPI";

export const useCompanyReportsForm = (
  mode = "create",
  reportId = null,
  reportType = "invoice",
) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    report_date: new Date().toISOString().split("T")[0],
    period_start: "",
    period_end: "",
    status: "draft",
    tags: [],
    invoice_number: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    items: [],
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
    due_date: "",
    payment_status: "pending",

    employee_count: 0,
    total_salary: 0,
    department: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),

    gst_number: "",
    filing_period: "",
    tax_liability: 0,
    tax_collected: 0,
    input_tax_credit: 0,
    net_tax_payable: 0,
  });

  const [files, setFiles] = useState({
    invoice_file: null,
    salary_sheet_file: null,
    gst_report_file: null,
    supporting_documents: [],
  });

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setFormLoading(true);

        if (mode === "edit" && reportId) {
          await fetchReportData();
        }

        setDefaultValues();
      } catch (error) {
        console.error("Error initializing form:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load form data. Please refresh the page.",
        });
      } finally {
        setFormLoading(false);
      }
    };

    initializeForm();
  }, [mode, reportId, reportType]);

  const setDefaultValues = useCallback(() => {
    const defaults = {
      invoice: {
        invoice_number: `INV-${Date.now()}`,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
      },
      "salary-sheet": {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        department: "all",
      },
      "gst-report": {
        filing_period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
      },
    };

    if (defaults[reportType]) {
      setFormData((prev) => ({
        ...prev,
        ...defaults[reportType],
      }));
    }
  }, [reportType]);

  const fetchReportData = useCallback(async () => {
    try {
      // This would be replaced with actual API call
      const mockData = {
        id: reportId,
        title: `Sample ${reportType.replace("-", " ")}`,
        description: "Sample description",
        report_date: new Date().toISOString().split("T")[0],
        status: "submitted",
      };

      setInitialData(mockData);
      setFormData((prev) => ({
        ...prev,
        ...mockData,
      }));
    } catch (error) {
      console.error("Error fetching report data:", error);
      throw error;
    }
  }, [reportId, reportType]);

  // Handle form field changes
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors],
  );

  // Handle file uploads
  const handleFileChange = useCallback((field, fileList) => {
    setFiles((prev) => ({
      ...prev,
      [field]: field === "supporting_documents" ? fileList : fileList[0],
    }));
  }, []);

  // Handle invoice items
  const handleItemChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };

      // Recalculate amount if quantity or unit_price changes
      if (field === "quantity" || field === "unit_price") {
        const quantity =
          field === "quantity" ? value : newItems[index].quantity;
        const unitPrice =
          field === "unit_price" ? value : newItems[index].unit_price;
        newItems[index].amount = quantity * unitPrice;
      }

      // Recalculate totals
      const subtotal = newItems.reduce(
        (sum, item) => sum + (item.amount || 0),
        0,
      );
      const taxAmount = subtotal * 0.18; // Assuming 18% GST
      const totalAmount = subtotal + taxAmount;

      return {
        ...prev,
        items: newItems,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      };
    });
  }, []);

  // Add new invoice item
  const handleAddItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unit_price: 0, amount: 0 },
      ],
    }));
  }, []);

  // Remove invoice item
  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Common validations
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.report_date) {
      newErrors.report_date = "Report date is required";
    }

    // Type-specific validations
    switch (reportType) {
      case "invoice":
        if (!formData.invoice_number.trim()) {
          newErrors.invoice_number = "Invoice number is required";
        }
        if (!formData.client_name.trim()) {
          newErrors.client_name = "Client name is required";
        }
        if (formData.items.length === 0) {
          newErrors.items = "At least one item is required";
        }
        break;

      case "salary-sheet":
        if (!formData.month || !formData.year) {
          newErrors.period = "Month and year are required";
        }
        if (!files.salary_sheet_file) {
          newErrors.file = "Salary sheet file is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, reportType, files]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix all errors before submitting.",
      });
      return null;
    }

    try {
      setLoading(true);

      let response;
      const formDataToSend = new FormData();

      // Prepare form data based on report type
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === "object") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files to FormData
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          if (Array.isArray(files[key])) {
            files[key].forEach((file) => {
              formDataToSend.append(`${key}[]`, file);
            });
          } else {
            formDataToSend.append(key, files[key]);
          }
        }
      });

      // Make API call based on report type
      switch (reportType) {
        case "invoice":
          if (mode === "edit") {
            response = await updateInvoiceAPI(reportId, formDataToSend);
          } else {
            response = await createInvoiceAPI(formDataToSend);
          }
          break;

        case "salary-sheet":
          response = await uploadSalarySheetAPI(formDataToSend);
          break;

        default:
          throw new Error("Invalid report type");
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: `${mode === "edit" ? "Updated" : "Created"} Successfully!`,
        text: `${reportType.replace("-", " ")} has been ${mode === "edit" ? "updated" : "created"}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} report:`,
        error,
      );

      // Handle API validation errors
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });

        setErrors(formattedErrors);

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: Object.values(formattedErrors)
            .map((err) => `<div class="text-left">• ${err}</div>`)
            .join(""),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to ${mode === "edit" ? "update" : "create"} report. Please try again.`,
        });
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [formData, files, mode, reportId, reportType, validateForm]);

  return {
    // State
    formData,
    files,
    loading,
    formLoading,
    errors,
    initialData,

    // Actions
    handleInputChange,
    handleFileChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    validateForm,
  };
};
