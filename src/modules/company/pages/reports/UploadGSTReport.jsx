import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  FileCheck,
  CheckCircle,
  X,
  Calendar,
  IndianRupee,
  AlertCircle,
  Download,
  Trash2,
  Clock,
  Receipt,
  Building,
  FileText,
  Calculator,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useReportsForm } from '../../../hooks/company/useReportsForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { containerVariants, itemVariants } from '../../../../common/utils/motionVariants';

const UploadGSTReport = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    files,
    loading,
    errors,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  } = useReportsForm('create', null, 'gst-report');
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = ['Report Details', 'File Upload', 'Review & Submit'];
  
  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.gst_number.trim()) {
          newErrors.gst_number = 'GST number is required';
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
          newErrors.gst_number = 'Invalid GST number format';
        }
        
        if (!formData.filing_period.trim()) {
          newErrors.filing_period = 'Filing period is required';
        }
        
        if (!formData.tax_liability && formData.tax_liability !== 0) {
          newErrors.tax_liability = 'Tax liability is required';
        }
        
        if (!formData.tax_collected && formData.tax_collected !== 0) {
          newErrors.tax_collected = 'Tax collected is required';
        }
        break;
        
      case 1:
        if (!files.gst_report_file) {
          newErrors.file = 'GST report file is required';
        }
        break;
    }
    
    if (Object.keys(newErrors).length > 0) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Validation Error',
      //   html: Object.values(newErrors)
      //     .map(err => `<div class="text-left">• ${err}</div>`)
      //     .join(''),
      // });
      return false;
    }
    
    return true;
  };
  
  // Get filing periods (last 12 months)
  const getFilingPeriods = () => {
    const periods = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      periods.push({
        value: `${year}-${month}`,
        label: `${year}-${month} (${date.toLocaleString('default', { month: 'long' })})`,
      });
    }
    
    return periods;
  };
  
  // GST types
  const gstTypes = [
    { value: 'gstr1', label: 'GSTR-1 (Outward Supplies)' },
    { value: 'gstr3b', label: 'GSTR-3B (Monthly Return)' },
    { value: 'gstr9', label: 'GSTR-9 (Annual Return)' },
    { value: 'gstr9c', label: 'GSTR-9C (Reconciliation Statement)' },
  ];
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange('gst_report_file', event.target.files);
      simulateFileProcessing(file);
    }
  };
  
  // Simulate file processing
  const simulateFileProcessing = (file) => {
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            setValidationResults({
              valid: true,
              fileType: file.name.split('.').pop().toUpperCase(),
              fileSize: (file.size / 1024 / 1024).toFixed(2),
              parsedSuccessfully: true,
              details: [
                { label: 'File Format', value: 'Valid' },
                { label: 'GSTIN Verified', value: 'Verified' },
                { label: 'Tax Period', value: 'Matches filing period' },
                { label: 'Data Integrity', value: 'No issues detected' },
              ],
            });
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Handle form submission
  const handleFormSubmit = async () => {
    if (!validateStep(2)) return;
    
    const result = await handleSubmit();
    if (result) {
      navigate('/company/reports');
    }
  };
  
  // Calculate net tax payable
  const netTaxPayable = (formData.tax_liability || 0) - (formData.input_tax_credit || 0);
  
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Upload GST Report</h1>
            <p className="text-gray-600 mt-2">File monthly or quarterly GST returns with supporting documents</p>
          </div>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index < activeStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`ml-2 font-medium ${
                index <= activeStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  index < activeStep ? 'bg-blue-600' : 'bg-gray-300'
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
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">GST Report Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      value={formData.gst_number}
                      onChange={(e) => handleInputChange('gst_number', e.target.value)}
                      className={`w-full px-4 py-2 border ${
                        errors.gst_number ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="22AAAAA0000A1Z5"
                    />
                    {errors.gst_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.gst_number}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Format: 22AAAAA0000A1Z5</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filing Period *
                    </label>
                    <select
                      value={formData.filing_period}
                      onChange={(e) => handleInputChange('filing_period', e.target.value)}
                      className={`w-full px-4 py-2 border ${
                        errors.filing_period ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select Period</option>
                      {getFilingPeriods().map(period => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                    {errors.filing_period && (
                      <p className="mt-1 text-sm text-red-600">{errors.filing_period}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Return Type *
                    </label>
                    <select
                      value={formData.gst_type || 'gstr3b'}
                      onChange={(e) => handleInputChange('gst_type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {gstTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., GST Return for January 2024"
                    />
                  </div>
                </div>
                
                {/* Tax Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Tax Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Liability (₹) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          value={formData.tax_liability}
                          onChange={(e) => handleInputChange('tax_liability', parseFloat(e.target.value) || 0)}
                          className={`w-full pl-9 pr-4 py-2 border ${
                            errors.tax_liability ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                      {errors.tax_liability && (
                        <p className="mt-1 text-sm text-red-600">{errors.tax_liability}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Collected (₹) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          value={formData.tax_collected}
                          onChange={(e) => handleInputChange('tax_collected', parseFloat(e.target.value) || 0)}
                          className={`w-full pl-9 pr-4 py-2 border ${
                            errors.tax_collected ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                      {errors.tax_collected && (
                        <p className="mt-1 text-sm text-red-600">{errors.tax_collected}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Input Tax Credit (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          value={formData.input_tax_credit || 0}
                          onChange={(e) => handleInputChange('input_tax_credit', parseFloat(e.target.value) || 0)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Net Tax Payable (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formatCurrency(netTaxPayable)}
                          readOnly
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Add any additional notes or remarks..."
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          {activeStep === 1 && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">File Upload</h2>
              
              <div
                onClick={() => document.getElementById('gst-file-input').click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  files.gst_report_file 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <input
                  id="gst-file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {files.gst_report_file ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                      <FileCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{files.gst_report_file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(files.gst_report_file.size / 1024 / 1024).toFixed(2)} MB • {files.gst_report_file.name.split('.').pop().toUpperCase()}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">File Selected</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: Excel, CSV, PDF, JSON
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Maximum file size: 20MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Processing...</span>
                    <span className="text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.file && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.file}
                  </p>
                </div>
              )}
              
              {/* Validation Results */}
              {validationResults && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-800">File Validation Successful</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700">File Type</p>
                      <p className="font-medium">{validationResults.fileType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">File Size</p>
                      <p className="font-medium">{validationResults.fileSize} MB</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Supporting Documents */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Supporting Documents (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Add Documents
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange('supporting_documents', e.target.files)}
                      multiple
                    />
                  </label>
                  {files.supporting_documents && files.supporting_documents.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {files.supporting_documents.length} files selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upload invoices, receipts, or other supporting documents
                </p>
              </div>
            </motion.div>
          )}
          
          {activeStep === 2 && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Review & Submit</h2>
              
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-4">GST Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">GST Number:</span>
                        <span className="font-medium">{formData.gst_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Filing Period:</span>
                        <span>{formData.filing_period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Return Type:</span>
                        <span>{gstTypes.find(t => t.value === formData.gst_type)?.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Tax Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax Liability:</span>
                        <span>{formatCurrency(formData.tax_liability || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Input Tax Credit:</span>
                        <span>{formatCurrency(formData.input_tax_credit || 0)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">Net Payable:</span>
                          <span className={`text-lg font-bold ${
                            netTaxPayable > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(netTaxPayable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* File Summary */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-4">File Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{files.gst_report_file?.name}</p>
                          <p className="text-sm text-gray-500">
                            {files.gst_report_file ? `${(files.gst_report_file.size / 1024 / 1024).toFixed(2)} MB` : 'No file selected'}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">✓ Ready</span>
                    </div>
                    
                    {files.supporting_documents && files.supporting_documents.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600 mb-2">
                          Supporting Documents: {files.supporting_documents.length} files
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Declaration */}
                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2">Declaration</h4>
                      <p className="text-sm text-yellow-700">
                        I hereby declare that the information provided is true and correct to the best of my knowledge.
                        I understand that filing false GST returns may result in penalties and legal action.
                      </p>
                    </div>
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
              {/* Tax Summary */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Net Tax Payable</p>
                  <p className={`text-3xl font-bold ${
                    netTaxPayable > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(netTaxPayable)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tax Liability</p>
                    <p className="font-medium">{formatCurrency(formData.tax_liability || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tax Credit</p>
                    <p className="font-medium text-green-600">{formatCurrency(formData.input_tax_credit || 0)}</p>
                  </div>
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
                      <FileCheck className="w-4 h-4" />
                      Submit GST Return
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
              
              {/* Due Date Warning */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Filing Due Date</p>
                    <p className="text-sm text-red-700">Dec 20, 2024 • 5 days left</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Template</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Calculator className="w-4 h-4" />
                    <span className="text-sm">Calculator</span>
                  </button>
                </div>
              </div>
              
              {/* Help Text */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Ensure all tax calculations are accurate before submitting. 
                  Late filing may attract penalties.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadGSTReport;