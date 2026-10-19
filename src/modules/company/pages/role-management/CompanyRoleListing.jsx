import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Plus,
  Eye,
  Shield,
  Users,
  Calendar,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useCompanyRoleListing } from "../../companyhooks/useCompanyRoleListing";
import ViewRoleModal from "../../components/role-management/ViewRoleModal";
import { useState, useEffect, useRef, useCallback } from "react";

const CompanyRoleListing = () => {
  const navigate = useNavigate();
  // const { hasPermission, loading: permissionsLoading } = useCompanyPermissions();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showRoleTypeDropdown, setShowRoleTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const {
    roles,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    handleSearch,
    handleClear,
    handleDelete,

    getPermissionCount,
  } = useCompanyRoleListing();

  const roleTypeRef = useRef(null);
  const statusRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (statusRef.current && !statusRef.current.contains(event.target)) {
      setShowStatusDropdown(false);
    }
    if (roleTypeRef.current && !roleTypeRef.current.contains(event.target)) {
      setShowRoleTypeDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const openViewModal = (role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedRole(null);
    setIsViewModalOpen(false);
  };

  const handleAddRole = () => {
    navigate("/company/roles/add");
  };

  const handleEditRole = (id) => {
    navigate(`/company/roles/edit/${id}`);
  };

  const handleClearAll = () => {
    setFilters({
      search: "",
      status: "",
    });
    setFiltersVisible(false);
    handleSearch();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="flex-1 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section - Matching StaffListing */}
      <motion.div
        className=" bg-white p-4 border border-gray-200 shadow-sm 
           mb-4 rounded-2xl
        "
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          {/* Left Section: Title and Role Type Filter */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">
                Role Management
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by role name....."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-auto"
            />

            {filters.search && (
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            )}

            <button
              onClick={handleAddRole}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Role</span>
              <span className="sm:hidden">Add</span>
            </button>
            {/* )} */}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-[22px] border border-[#DDDDDD] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Roles List</h2>
          <h2 className="flex items-center justify-between gap-1 text-lg font-medium text-gray-800">
            <p>Total Roles :</p> {roles?.length || 0}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Role Title",
                  "Description",
                  "Permissions",
                  "Users",
                  "Created Date",
                  // "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : roles?.length > 0 ? (
                roles?.map((role, index) => (
                  <motion.tr
                    key={`${role.id}-${index}`}
                    className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openViewModal(role)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {role.profile_name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {role.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="line-clamp-2">
                        {role.description || "No description"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {getPermissionCount(role.permissions)}
                        </span>
                        <span className="text-sm text-gray-600">
                          permissions
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {role.total_users}
                        </span>
                        <span className="text-sm text-gray-600">users</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(role.created_at)}
                      </div>
                    </td>

                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 cursor-auto"
                    >
                      <div className="flex gap-3">
                        {/* {canView && ( */}
                        <button
                          onClick={() => openViewModal(role)}
                          className="text-gray-600 hover:text-green-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {/* )} */}

                        {/* {canEdit && ( */}
                        <button
                          onClick={() => handleEditRole(role.id)}
                          className="text-gray-600 hover:text-blue-600"
                          title="Edit Role"
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* )} */}

                        {/* {canDelete && ( */}
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete Role"
                        >
                          <Trash2 size={18} />
                        </button>
                        {/* )} */}
                        {/* <button
                            // onClick={() => openViewModal(role)}
                            className="text-gray-600 hover:text-amber-600"
                            title="View History"
                          >
                            <History size={18} />
                          </button> */}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Shield className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600">
                        No roles found.
                      </p>
                      <p className="text-sm mt-1 text-gray-400">
                        Create your first role by clicking "Add New Role" above.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {roles?.length > 0 && (
        <motion.div className="flex items-center justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const p = index + 1;

            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition
                    ${
                      page === p
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    }`}
                >
                  {p}
                </button>
              );
            }

            if (p === page - 3 || p === page + 3) {
              return (
                <span key={p} className="px-2">
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition 
              ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* View Role Modal */}
      {/* {canView && ( */}
      <ViewRoleModal
        role={selectedRole}
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
      />
      {/* )} */}
    </motion.div>
  );
};

export default CompanyRoleListing;
