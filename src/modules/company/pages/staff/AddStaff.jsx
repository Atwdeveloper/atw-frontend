import { motion } from "framer-motion";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StaffForm from "../../components/staff/CompanyStaffForm";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

const AddStaff = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* LEFT: Title */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Add New Staff
                </h1>
                <p className="text-gray-600 mt-1">
                  Create a new staff member with basic details
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FORM COMPONENT */}
      <div className="">
        <StaffForm mode="create" />
      </div>
    </motion.div>
  );
};

export default AddStaff;
