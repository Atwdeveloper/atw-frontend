import { motion } from "framer-motion";
import { ArrowLeft, UserCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import StaffForm from "../../components/staff/CompanyStaffForm";
import { containerVariants, itemVariants } from "../../../../common/utils/motionVariants";

const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HEADER */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* LEFT: Title */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => navigate("/company/staff/listing")}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button> */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Staff</h1>
                <p className="text-gray-600 mt-1">Update staff details</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Icon */}
          {/* <div className="bg-green-100 p-3 rounded-full">
            <UserCheck className="w-8 h-8 text-green-700" />
          </div> */}
        </div>
      </motion.div>

      {/* FORM COMPONENT */}
      <div className="">
        <StaffForm 
          mode="edit"
          staffId={id}
        />
      </div>
    </motion.div>
  );
};

export default EditStaff;