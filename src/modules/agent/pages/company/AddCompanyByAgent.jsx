import React, { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "../../../../common/utils/motionVariants";
import SingleAddCompanyForm from "../../components/company/SingleAddCompany"; // your existing single add form component

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const AddCompany = () => {
  const [mode, setMode] = useState("single");
  const [bulkFile, setBulkFile] = useState(null);
  const REQUIRED_COLUMNS = [
    "Company Name",
    "Company Email",
    "Contact Number",
    "Contact Person Name",
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
        Add New Company
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Fill in the details below to create a new company account.
      </p>

      {/* Tabs */}
      <motion.div className="bg-white  rounded-2xl border border-slate-200  shadow-lg overflow-hidden">
        <div className="flex border-b border-slate-200 "></div>
      </motion.div>

      {mode === "single" && <SingleAddCompanyForm />}
    </motion.div>
  );
};

export default AddCompany;
