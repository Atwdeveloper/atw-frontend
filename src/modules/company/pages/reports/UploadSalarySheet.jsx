import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  X,
  Calendar,
  Users,
  IndianRupee,
  Building,
  FileText,
  AlertCircle,
  Download,
  Trash2,
  Clock,
  BarChart3
} from 'lucide-react';
import { useReportsForm } from '../../../hooks/company/useReportsForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { containerVariants, itemVariants } from '../../../../common/utils/motionVariants';

const UploadSalarySheet = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    files,
    loading,
    errors,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  } = useReportsForm('create', null, 'salary-sheet');
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  
  // Months for dropdown
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  
  // Current year and previous 5 years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  // Departments
  const departments = [
    'All Departments',
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'IT',
    'Customer Support',
  ];
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileChange('salary_sheet_file', event.target.files);
      simulateFileProcessing(file);
    }
  };
  
  // Simulate file processing
  const simulateFileProcessing = (file) => {
    setUploadProgress(0);
    setValidationResults(null);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            setValidationResults({
              valid: true,
              totalRecords: 45,
              errors: 2,
              warnings: 3,
              details: [
                { type: 'error', message: 'Missing employee ID for record #12' },
                { type: 'error', message: 'Invalid salary amount for record #23' },
                { type: 'warning', message: 'Duplicate bank account number detected' },
                { type: 'warning', message: 'Overtime hours exceed limit for 5 employees' },
                { type: 'warning', message: 'Missing department for 3 employees' },
              ],
            });
            
            generatePreviewData();
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Generate sample preview data
  const generatePreviewData = () => {
    const sampleData = [
      { id: 1, employeeId: 'EMP001', name: 'John Doe', department: 'Engineering', basicSalary: 50000, allowances: 10000, deductions: 5000, netSalary: 55000 },
      { id: 2, employeeId: 'EMP002', name: 'Jane Smith', department: 'Marketing', basicSalary: 45000, allowances: 8000, deductions: 4000, netSalary: 49000 },
      { id: 3, employeeId: 'EMP003', name: 'Bob Johnson', department: 'Sales', basicSalary: 40000, allowances: 6000, deductions: 3000, netSalary: 43000 },
      { id: 4, employeeId: 'EMP004', name: 'Alice Brown', department: 'HR', basicSalary: 48000, allowances: 9000, deductions: 4500, netSalary: 52500 },
      { id: 5, employeeId: 'EMP005', name: 'Charlie Wilson', department: 'Finance', basicSalary: 52000, allowances: 11000, deductions: 5500, netSalary: 57500 },
    ];
    setPreviewData(sampleData);
    
    const totalSalary = sampleData.reduce((sum, emp) => sum + emp.netSalary, 0);
    handleInputChange('total_salary', totalSalary);
    handleInputChange('employee_count', sampleData.length);
  };
  
  // Handle form submission
  const handleFormSubmit = async () => {
    if (!files.salary_sheet_file) {
      Swal.fire({
        icon: 'error',
        title: 'Missing File',
        text: 'Please select a salary sheet file to upload.',
      });
      return;
    }
    
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Upload Salary Sheet</h1>
            <p className="text-gray-600 mt-2">Upload and process monthly salary sheets for employees</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Salary Sheet Details */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Salary Sheet Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month *
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
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
                  placeholder="e.g., January 2024 Salary Sheet"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add any notes or special instructions about this salary sheet..."
                />
              </div>
            </div>
          </motion.div>
          
          {/* File Upload */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">File Upload</h2>
            
            <div
              onClick={() => document.getElementById('file-input').click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                files.salary_sheet_file 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {files.salary_sheet_file ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{files.salary_sheet_file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(files.salary_sheet_file.size / 1024 / 1024).toFixed(2)} MB
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
                      Supported formats: Excel (.xlsx, .xls), CSV, PDF
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
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
          </motion.div>
          
          {/* Validation Results */}
          {validationResults && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                {validationResults.valid ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <h2 className="text-lg font-semibold text-gray-800">File Validation Results</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{validationResults.totalRecords}</p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{validationResults.errors}</p>
                  <p className="text-sm text-yellow-700">Errors</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{validationResults.warnings}</p>
                  <p className="text-sm text-blue-700">Warnings</p>
                </div>
              </div>
              
              {validationResults.details.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Details:</h3>
                  <div className="space-y-2">
                    {validationResults.details.map((detail, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          detail.type === 'error' 
                            ? 'bg-red-50 border border-red-200' 
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        {detail.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        )}
                        <p className={`text-sm ${
                          detail.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                        }`}>
                          {detail.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Data Preview */}
          {previewData.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Data Preview</h2>
                <span className="text-sm text-gray-500">Showing first 5 records</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.map(row => (
                      <tr key={row.id}>
                        <td className="px-4 py-3">{row.employeeId}</td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {row.department}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatCurrency(row.basicSalary)}</td>
                        <td className="px-4 py-3 font-medium text-blue-600">
                          {formatCurrency(row.netSalary)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-xl font-bold text-gray-800">{previewData.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Basic Salary</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(previewData.reduce((sum, emp) => sum + emp.basicSalary, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Net Salary</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(previewData.reduce((sum, emp) => sum + emp.netSalary, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Right Column - Summary & Actions */}
        <div>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Upload Summary</h2>
            
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{formData.employee_count}</p>
                  <p className="text-sm text-gray-600">Employees</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-800">
                    {months.find(m => m.value === formData.month)?.label.substring(0, 3) || '-'}
                  </p>
                  <p className="text-sm text-gray-600">Month</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Salary Amount</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(formData.total_salary || 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">File Status</p>
                <div className="flex items-center gap-2">
                  {files.salary_sheet_file ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-800">File selected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-800">No file selected</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleFormSubmit}
                  disabled={loading || !files.salary_sheet_file}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Salary Sheet
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => document.getElementById('file-input').click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  Select Different File
                </button>
                
                {files.salary_sheet_file && (
                  <button
                    onClick={() => {
                      handleFileChange('salary_sheet_file', null);
                      setUploadProgress(0);
                      setValidationResults(null);
                      setPreviewData([]);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove File
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
              
              {/* Quick Actions */}
              <div className="pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Template</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Reports</span>
                  </button>
                </div>
              </div>
              
              {/* Help Text */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Note:</span> Ensure all employee data is accurate before uploading. 
                  Once uploaded, the salary sheet will be processed and available for review.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadSalarySheet;