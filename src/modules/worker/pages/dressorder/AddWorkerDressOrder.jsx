import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Save,
  User,
  Shirt,
  RotateCcw,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";
import { useWorkerDressOrders } from "../../workerhooks/useWorkerDressOrder";
import useUnsavedChangesWarning from "../../../../common/hooks/useUnsavedChangesWarning";
import { getWorkerProfileAPI } from "../../../../api/worker/workerAPI"; // adjust path

const AddWorkerDressOrder = () => {
  const navigate = useNavigate();
  const { createOrder, loading } = useWorkerDressOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile states
  const [profileLoading, setProfileLoading] = useState(true);
  const [workerName, setWorkerName] = useState("");
  const [workerCode, setWorkerCode] = useState("");

  // Form data – dress_size starts with profile's default size (if any)
  const [formData, setFormData] = useState({
    worker_id: "",
    dress_size: "",
    dress_quantity: 1,
    notes: "",
  });

  // Store initial values for dirty check
  const [initialValues, setInitialValues] = useState(null);

  const [errors, setErrors] = useState({});

  // Fetch worker profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getWorkerProfileAPI();
        // const profile = response.data || response;
        const profile = response.data?.data || response.data || response;

        const fullName =
          `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
        const code = profile.worker_code || profile.worker_id || "";
        const defaultSize = profile.dress_size || ""; // may be empty if not set

        setWorkerName(fullName);
        setWorkerCode(code);

        const newFormData = {
          worker_id: profile.worker_id || "",
          dress_size: defaultSize, // pre-select the default size from profile
          dress_quantity: 1,
          notes: "",
        };

        setFormData(newFormData);
        setInitialValues(newFormData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to cookie if API fails
        const userCookie = Cookies.get("user");
        const worker = userCookie ? JSON.parse(userCookie) : {};
        setWorkerName(
          `${worker.first_name || ""} ${worker.last_name || ""}`.trim(),
        );
        setWorkerCode(worker.worker_code || worker.worker_id || "");

        const fallbackData = {
          worker_id: worker.worker_id || "",
          dress_size: worker.dress_size || "", // use cookie's dress_size if available
          dress_quantity: 1,
          notes: "",
        };
        setFormData(fallbackData);
        setInitialValues(fallbackData);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Check if form is dirty
  const isFormDirty = useMemo(() => {
    if (!initialValues || !formData || isSubmitting) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialValues);
  }, [formData, initialValues, isSubmitting]);

  useUnsavedChangesWarning(
    isFormDirty && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
  );

  // Validate form – only size & quantity needed
  const validateForm = () => {
    const newErrors = {};
    if (!formData.dress_size) {
      newErrors.dress_size = "Please select a size";
    }
    if (!formData.dress_quantity || formData.dress_quantity < 1) {
      newErrors.dress_quantity = "Quantity must be at least 1";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dress_quantity" ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSizeSelect = (size) => {
    if (isSubmitting) return;
    setFormData((prev) => ({ ...prev, dress_size: size }));
    if (errors.dress_size) {
      setErrors((prev) => ({ ...prev, dress_size: undefined }));
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (isSubmitting) return;
    const quantity = Math.max(1, Math.min(2, newQuantity));
    setFormData((prev) => ({ ...prev, dress_quantity: quantity }));
    if (errors.dress_quantity) {
      setErrors((prev) => ({ ...prev, dress_quantity: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload for API
    const payload = {
      worker_id: formData.worker_id,
      ordered_size: formData.dress_size, // API expects ordered_size
      dress_quantity: formData.dress_quantity,
      notes: formData.notes,
    };

    setIsSubmitting(true);
    const result = await createOrder(payload);
    setIsSubmitting(false);

    if (result.success) {
      setInitialValues(formData); // update dirty reference
      navigate("/worker/dress-orders");
    }
  };

  const handleReset = () => {
    if (isSubmitting || !initialValues) return;
    setFormData(initialValues);
    setErrors({});
  };

  // Show loader while profile is loading
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <button
          onClick={() => navigate("/worker/dress-orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>
      </motion.div>

      {/* Unsaved changes warning */}
      {isFormDirty && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              You have unsaved changes
            </span>
          </div>
        </motion.div>
      )}

      {/* Main form */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Dress Order
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Worker Info – disabled, auto-filled */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              {/* Worker Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Worker Name
                  </div>
                </label>
                <input
                  type="text"
                  value={workerName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Worker Name"
                />
              </div>

              {/* Worker Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Worker Code
                  </div>
                </label>
                <input
                  type="text"
                  value={workerCode}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Worker Code"
                />
              </div>
            </div>
          </div>

          {/* Dress Size - Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                Dress Size <span className="text-red-500">*</span>
              </div>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  disabled={isSubmitting}
                  className={`py-3 rounded-lg border text-center transition ${
                    formData.dress_size === size
                      ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                      : "border-gray-300 hover:bg-gray-50"
                  } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.dress_size && (
              <p className="text-red-500 text-sm mt-1">{errors.dress_size}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(formData.dress_quantity - 1)
                }
                disabled={formData.dress_quantity <= 1 || isSubmitting}
                className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-2xl ${
                  isSubmitting || formData.dress_quantity <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                -
              </button>
              <input
                type="number"
                name="dress_quantity"
                min="1"
                max="2"
                value={formData.dress_quantity}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 border rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dress_quantity ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(formData.dress_quantity + 1)
                }
                disabled={formData.dress_quantity >= 2 || isSubmitting}
                className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-2xl ${
                  isSubmitting || formData.dress_quantity >= 2
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                +
              </button>
            </div>
            {errors.dress_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dress_quantity}
              </p>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Min: 1</span>
              <span>Max: 2</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isFormDirty || isSubmitting}
              className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition ${
                !isFormDirty || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition ${
                loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Size guide */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Size Guide</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { size: "S", chest: '36"', length: '28"' },
            { size: "M", chest: '38"', length: '29"' },
            { size: "L", chest: '40"', length: '30"' },
            { size: "XL", chest: '42"', length: '31"' },
            { size: "XXL", chest: '44"', length: '32"' },
          ].map((item) => (
            <div
              key={item.size}
              className={`p-4 rounded-lg border text-center ${
                formData.dress_size === item.size
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {item.size}
              </div>
              <div className="text-sm text-gray-600">Chest: {item.chest}</div>
              <div className="text-sm text-gray-600">Length: {item.length}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddWorkerDressOrder;
