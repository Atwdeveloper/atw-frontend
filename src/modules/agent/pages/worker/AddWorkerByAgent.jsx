import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import SingleAddWorkerForm from "../../components/worker/SingleAddWorker";
import { Upload, Download, Info, Check, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const AddWorkerByAgent = () => {
  const [mode, setMode] = useState("single");
  const [bulkFile, setBulkFile] = useState(null);
  const REQUIRED_COLUMNS = [
    "Worker Name",
    "Worker ID",
    "Email",
    "Phone",
    "Department",
    "Designation",
    "Work Location",
  ];

  const validateColumns = (headers) => {
    return REQUIRED_COLUMNS.every((col) => headers.includes(col));
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBulkFile(null); // reset previous selection

    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(extension)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please upload only CSV or Excel files.",
      });
      return;
    }

    // CSV FILE VALIDATION
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields;
          if (!validateColumns(headers)) {
            Swal.fire({
              icon: "error",
              title: "Invalid File Format",
              text: `Required columns missing: ${REQUIRED_COLUMNS.join(", ")}`,
            });
            return;
          }
          setBulkFile(file);
          Swal.fire({
            icon: "success",
            title: "File validated",
            text: "Your CSV file format is correct.",
          });
        },
      });
    }

    // EXCEL FILE VALIDATION
    if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        const headers = worksheet[0]; // first row
        if (!validateColumns(headers)) {
          Swal.fire({
            icon: "error",
            title: "Invalid File Format",
            text: `Required columns missing: ${REQUIRED_COLUMNS.join(", ")}`,
          });
          return;
        }
        setBulkFile(file);
        Swal.fire({
          icon: "success",
          title: "File validated",
          text: "Your Excel file format is correct.",
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleBulkUpload = () => {
    if (!bulkFile) {
      Swal.fire({
        icon: "error",
        title: "No file selected",
        text: "Please select a file to upload.",
      });
      return;
    }
    // Implement bulk upload logic here
    // alert(`File ready to upload: ${bulkFile.name}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 w-full overflow-y-auto"
    >
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        Add New Worker
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Fill in the details below to create a new worker account or upload
        multiple workers at once.
      </p>

      {mode === "single" && <SingleAddWorkerForm />}

      {mode === "bulk" && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-[22px] shadow-sm border border-gray-200 p-8 mt-6"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Bulk Upload Workers
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Upload a CSV or Excel file to add multiple workers at once.
              Download our template to ensure proper formatting.
            </p>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 hover:border-blue-400 transition-colors duration-200 bg-gray-50/50">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              {bulkFile ? bulkFile.name : "Choose file"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {bulkFile
                ? "File selected successfully"
                : "CSV or Excel files only"}
            </p>
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors inline-block">
              Browse Files
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleBulkUpload}
              disabled={!bulkFile}
            >
              <Upload className="w-4 h-4" />
              {bulkFile ? `Upload ${bulkFile.name}` : "Upload File"}
            </button>

            <button
              onClick={() => {
                // Create and download sample template
                const sampleData = [
                  REQUIRED_COLUMNS,
                  [
                    "John Doe",
                    "WRK001",
                    "john.doe@example.com",
                    "9876543210",
                    "Engineering",
                    "Software Engineer",
                    "Mumbai",
                  ],
                  [
                    "Jane Smith",
                    "WRK002",
                    "jane.smith@example.com",
                    "9876543211",
                    "HR",
                    "HR Manager",
                    "Delhi",
                  ],
                ];

                const ws = XLSX.utils.aoa_to_sheet(sampleData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Workers");
                XLSX.writeFile(wb, "worker-upload-template.xlsx");
              }}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              File Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="space-y-2">
                <p className="font-medium">Required Columns:</p>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Worker Name
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Worker ID
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Email
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Phone
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Additional Fields:</p>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Department
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Designation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Work Location
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Password
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Status */}
          {bulkFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    File Ready for Upload
                  </p>
                  <p className="text-sm text-green-600">
                    {bulkFile.name} ({(bulkFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddWorkerByAgent;
