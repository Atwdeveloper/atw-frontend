import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  getDressOrdersAPI,
  createDressOrderAPI,
  getDressOrderByIdAPI,
} from "../../../api/worker/workerDressOrderAPI";
import { useDebounce } from "../../../common/hooks/useDebounce";

export const useWorkerDressOrders = (options = { autoFetch: false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
  });

  const debouncedFilters = useDebounce(filters, 500);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getDressOrdersAPI({
        page,
        limit,
        ...debouncedFilters,
      });

      const raw = response?.data;

      let ordersList = [];

      if (Array.isArray(raw?.data?.data)) {
        ordersList = raw.data.data;
      } else if (Array.isArray(raw?.data)) {
        ordersList = raw.data;
      } else if (Array.isArray(raw)) {
        ordersList = raw;
      }

      setOrders(ordersList);

      setTotalPages(raw?.data?.last_page || raw?.last_page || 1);
      setTotalItems(raw?.data?.total || raw?.total || ordersList.length);
    } catch (error) {
      console.error("Error fetching dress orders:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load dress orders.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedFilters]);

  useEffect(() => {
    if (options.autoFetch) {
      fetchOrders();
    }
  }, [fetchOrders, options.autoFetch]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleClear = () => {
    setFilters({
      search: "",
      status: "",
      date_from: "",
      date_to: "",
    });
    setPage(1);
  };

  const getOrderById = async (id) => {
    try {
      setLoading(true);

      const res = await getDressOrderByIdAPI(id);

      const order =
        res?.data?.data?.data || res?.data?.data || res?.data || null;

      setSelectedOrder(order);
    } catch (error) {
      console.error("Error fetching order:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch order details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (payload) => {
    try {
      setLoading(true);

      await createDressOrderAPI(payload);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Dress order created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchOrders();

      return { success: true };
    } catch (error) {
      console.error("Create error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to create dress order.",
      });

      return {
        success: false,
        error: error?.response?.data?.message,
      };
    } finally {
      setLoading(false);
    }
  };
  return {
    orders,
    loading,
    selectedOrder,
    page,
    limit,
    totalPages,
    totalItems,
    filters,
    setPage,
    setLimit,
    setFilters,
    handleSearch,
    handleClear,
    fetchOrders,
    getOrderById,
    createOrder,
    setSelectedOrder,
  };
};
