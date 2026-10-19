import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  IndianRupee,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Clock,
  Building
} from 'lucide-react';
import { useCompanyReportsForm } from '../../companyhooks/useCompanyReportsForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { containerVariants, itemVariants } from '../../../../common/utils/motionVariants';

const CreateInvoice = ({ mode = 'create', invoiceId = null }) => {
  const navigate = useNavigate();

  const {
    formData,
    files,
    loading,
    errors,
    handleInputChange,
    handleFileChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
  } = useCompanyReportsForm(mode, invoiceId, 'invoice');

  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Basic Info', 'Items & Pricing', 'Review & Submit'];

  // Client types
  const clientTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'government', label: 'Government' },
    { value: 'non-profit', label: 'Non-Profit' },
  ];

  // Payment terms
  const paymentTerms = [
    { value: 'net7', label: 'Net 7 Days' },
    { value: 'net15', label: 'Net 15 Days' },
    { value: 'net30', label: 'Net 30 Days' },
    { value: 'due_on_receipt', label: 'Due on Receipt' },
  ];

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  const { subtotal, taxAmount, totalAmount } = calculateTotals();

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Validate step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.invoice_number.trim()) newErrors.invoice_number = 'Invoice number is required';
        if (!formData.client_name.trim()) newErrors.client_name = 'Client name is required';
        if (!formData.client_email.trim()) {
          newErrors.client_email = 'Client email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
          newErrors.client_email = 'Email is invalid';
        }
        break;
      case 1:
        if (formData.items.length === 0) {
          newErrors.items = 'At least one item is required';
        }
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Validation Error',
      //   html: Object.values(newErrors).map(err => `<div class="text-left">• ${err}</div>`).join(''),
      // });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    const result = await handleSubmit();
    if (result) {
      navigate('/company/reports');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full px-4 md:px-8 py-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/company/reports')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit Invoice' : 'Create New Invoice'}
            </h1>
            <p className="text-gray-600 mt-2">Fill in the details to create a new invoice</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                {index < activeStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`ml-2 font-medium ${index <= activeStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${index < activeStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-8">
          {activeStep === 0 && (
            <motion.div initial="hidden"
              animate="visible" variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h2>

              <div className="space-y-6">
                {/* Invoice Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Number *
                      </label>
                      <input
                        type="text"
                        value={formData.invoice_number}
                        onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                        className={`w-full px-4 py-2 border ${errors.invoice_number ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="INV-2024-001"
                        disabled={mode === 'edit'}
                      />
                      {errors.invoice_number && (
                        <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={formData.report_date}
                          onChange={(e) => handleInputChange('report_date', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => handleInputChange('due_date', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.client_name}
                          onChange={(e) => handleInputChange('client_name', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client_name ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter client name"
                        />
                      </div>
                      {errors.client_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Type
                      </label>
                      <select
                        value={formData.client_type || 'company'}
                        onChange={(e) => handleInputChange('client_type', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {clientTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={formData.client_email}
                          onChange={(e) => handleInputChange('client_email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client_email ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="client@example.com"
                        />
                      </div>
                      {errors.client_email && (
                        <p className="mt-1 text-sm text-red-600">{errors.client_email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={formData.client_phone}
                          onChange={(e) => handleInputChange('client_phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          value={formData.client_address}
                          onChange={(e) => handleInputChange('client_address', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="2"
                          placeholder="Enter client address"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Website Development Services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Terms
                      </label>
                      <select
                        value={formData.payment_terms || 'net30'}
                        onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {paymentTerms.map(term => (
                          <option key={term.value} value={term.value}>
                            {term.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Add any additional notes or terms..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div initial="hidden"
              animate="visible" variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Items & Pricing</h2>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Item {index + 1}</h3>
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Item description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price (₹) *
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={item.amount || 0}
                            readOnly
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={item.tax_rate || 18}
                          onChange={(e) => handleItemChange(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {errors.items && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.items}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(subtotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tax (18%)</p>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(taxAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div initial="hidden"
              animate="visible" variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Review & Submit</h2>

              <div className="space-y-6">
                {/* Invoice Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Invoice Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Invoice Number:</span>
                        <span className="font-medium">{formData.invoice_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Client:</span>
                        <span className="font-medium">{formData.client_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Date:</span>
                        <span>{new Date(formData.report_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Due Date:</span>
                        <span>{new Date(formData.due_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${formData.status === 'paid' ? 'bg-green-100 text-green-800' :
                            formData.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Amount Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax (18%):</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-4">Items ({formData.items.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">{item.description}</td>
                            <td className="px-4 py-3">{item.quantity}</td>
                            <td className="px-4 py-3">{formatCurrency(item.unit_price)}</td>
                            <td className="px-4 py-3 font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* File Upload and Notes */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach Files
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange('invoice_file', e.target.files)}
                          multiple
                        />
                      </label>
                      {files.invoice_file && (
                        <span className="text-sm text-gray-600">
                          {files.invoice_file.name} selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Actions</h2>

            <div className="space-y-6">
              {/* Quick Summary */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">{formData.items.length}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(subtotal)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={activeStep === steps.length - 1 ? handleFormSubmit : handleNext}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : activeStep === steps.length - 1 ? (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'edit' ? 'Update Invoice' : 'Create Invoice'}
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>

                {activeStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}

                <button
                  onClick={() => navigate('/company/reports')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>

              {/* Additional Actions */}
              {activeStep === steps.length - 1 && (
                <div className="pt-6 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Preview</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Send className="w-4 h-4" />
                      <span className="text-sm">Send</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Help Text */}
              {activeStep === steps.length - 1 && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    By submitting, you confirm that all information is accurate and complete.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateInvoice;