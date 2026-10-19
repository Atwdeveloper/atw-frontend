import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, Shirt, Package, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  containerVariants,
  itemVariants,
  tableRowVariants,
} from "../../../../common/utils/motionVariants";
import { useWorkerDressOrders } from "../../workerhooks/useWorkerDressOrder";

const WorkerDressOrders = () => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    selectedOrder,
    page,
    totalPages,
    filters,
    setPage,
    setFilters,
    handleSearch,

    setSelectedOrder,
  } = useWorkerDressOrders({ autoFetch: true });

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "new":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ---------- Inline Modal Component ----------
  const DressOrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "bg-yellow-50 text-yellow-700";
        case "processing":
          return "bg-blue-50 text-blue-700";
        case "delivered":
          return "bg-green-50 text-green-700";
        case "cancelled":
          return "bg-red-50 text-red-700";
        default:
          return "bg-gray-50 text-gray-700";
      }
    };

    return (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-4 sm:inset-10 z-50"
        >
          <div className="min-h-full flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden">
              {/* Header */}
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Dress Order Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-semibold text-lg">
                    {order.order_number || `#${order.id}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dress Size</p>
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                      <Shirt size={16} />
                      {order.ordered_size}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Quantity</p>
                    <p className="font-semibold">{order.dress_quantity}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created Date</p>
                    <p>{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Notes</p>
                    <div className="bg-gray-50 rounded-xl p-4">
                      {order.notes}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto min-h-[70vh]"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">My Dress Orders</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/worker/dress-orders/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Dress Order</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </motion.div>

      {/* Expandable filters */}
      {filtersVisible && (
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 mb-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filters.date_from || ""}
              onChange={(e) =>
                setFilters({ ...filters, date_from: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="From Date"
            />

            <input
              type="date"
              value={filters.date_to || ""}
              onChange={(e) =>
                setFilters({ ...filters, date_to: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="To Date"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order No.",
                  "Size",
                  "Quantity",
                  "Status",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium text-gray-600">
                      No dress orders found.
                    </p>
                    <p className="text-sm mt-1 text-gray-400">
                      Click "Add Dress Order" to create one.
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.order_number || `#${order.id}`}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shirt size={12} />
                        {order.ordered_size}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold">
                        {order.dress_quantity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 capitalize rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => openViewModal(order)}
                        className="text-gray-600 hover:text-green-600 transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center space-x-2 mt-6"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const p = idx + 1;
            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm shadow-sm transition ${
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
            className={`px-3 py-2 rounded-xl border shadow-sm text-sm transition ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <DressOrderDetailsModal
            order={selectedOrder}
            onClose={closeViewModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkerDressOrders;
