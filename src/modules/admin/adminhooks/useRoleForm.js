import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addRoleAPI,
  getAllPermissions,
  getEditRoleAPi,
  editRoleAPI,
} from "../../../api/admin/adminRoleAPI";

export const useRoleForm = (isEdit = false) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [permissionsData, setPermissionsData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // status: "active"
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Track initial form state for dirty checking
  const initialFormStateRef = useRef(null);
  const initialPermissionsRef = useRef(null);
  // Track if we're navigating after successful save
  const isSavingRef = useRef(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (isEdit && id && permissionsData.length > 0) {
      fetchRoleData();
    }
  }, [isEdit, id, permissionsData]);

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPermissions();

      setPermissionsData(response.data);

      // Initialize selected permissions object
      const initialSelected = {};
      response.data.forEach((module) => {
        module.actions.forEach((action) => {
          const key = `${module.module}.${action.action}`;
          initialSelected[key] = false;
        });
      });
      setSelectedPermissions(initialSelected);

      // Store initial permissions state for dirty checking (for add mode)
      if (!isEdit && !initialPermissionsRef.current) {
        initialPermissionsRef.current = { ...initialSelected };
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load permissions. Please try again.",
      });
    }
    if (isEdit === false) {
      setIsLoading(false);
    }
  };

  const fetchRoleData = async () => {
    setIsLoading(true);
    try {
      const response = await getEditRoleAPi(id);
      const roleData = response.data;

      if (roleData) {
        const newFormData = {
          title: roleData.profile_name || "",
          description: roleData.description || "",
          status: roleData.status || "active",
        };

        setFormData(newFormData);

        // Store initial form state for dirty checking
        initialFormStateRef.current = { ...newFormData };

        if (roleData.permissions && roleData.permissions.length > 0) {
          const updatedSelected = { ...selectedPermissions };

          roleData.permissions.forEach((permissionModule) => {
            const moduleName = permissionModule.module;

            permissionModule.actions.forEach((action) => {
              const permissionKey = `${moduleName}.${action.action}`;
              updatedSelected[permissionKey] = true;
            });
          });

          setSelectedPermissions(updatedSelected);
          // Store initial permissions state for dirty checking
          initialPermissionsRef.current = { ...updatedSelected };
        }
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load role data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is dirty
  const isFormDirty = () => {
    // Don't check if we're in the process of saving
    if (isSavingRef.current) {
      return false;
    }

    // Check form data
    const isFormDataDirty = initialFormStateRef.current
      ? JSON.stringify(formData) !== JSON.stringify(initialFormStateRef.current)
      : formData.title !== "" ||
        formData.description !== "" ||
        formData.status !== "active";

    // Check permissions
    const isPermissionsDirty = initialPermissionsRef.current
      ? JSON.stringify(selectedPermissions) !==
        JSON.stringify(initialPermissionsRef.current)
      : Object.values(selectedPermissions).some((value) => value === true);

    return isFormDataDirty || isPermissionsDirty;
  };

  // Reset form to initial state
  const resetForm = () => {
    if (isEdit && initialFormStateRef.current) {
      setFormData({ ...initialFormStateRef.current });
      setSelectedPermissions({ ...initialPermissionsRef.current });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "active",
      });

      // Reset all permissions to false
      const resetPermissions = { ...selectedPermissions };
      Object.keys(resetPermissions).forEach((key) => {
        resetPermissions[key] = false;
      });
      setSelectedPermissions(resetPermissions);
    }

    setErrors({});
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permissionKey, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionKey]: checked,
    }));

    setErrors((prev) => ({
      ...prev,
      permissions: null,
    }));
  };

  // Handle module permission selection (select all actions in a module)
  const handleModuleSelect = (module, checked) => {
    const updatedSelected = { ...selectedPermissions };

    module.actions.forEach((action) => {
      const key = `${module.module}.${action.action}`;
      updatedSelected[key] = checked;
    });

    setSelectedPermissions(updatedSelected);
    setErrors((prev) => ({
      ...prev,
      permissions: null,
    }));
  };

  // Get selected permissions in BACKEND format (nested object)
  const getSelectedPermissionsForBackend = () => {
    const backendFormat = {};

    // Get all selected permission keys
    const selectedKeys = Object.keys(selectedPermissions).filter(
      (key) => selectedPermissions[key],
    );

    // Group permissions by module
    selectedKeys.forEach((permissionKey) => {
      const [module, action] = permissionKey.split(".");

      if (!backendFormat[module]) {
        backendFormat[module] = {};
      }

      backendFormat[module][action] = true;
    });

    return backendFormat;
  };

  // For counting and display purposes, keep this function
  const getSelectedPermissionsCount = () => {
    return Object.keys(selectedPermissions).filter(
      (key) => selectedPermissions[key],
    ).length;
  };

  // Get selected permissions for frontend display (array format)
  const getSelectedPermissionsForDisplay = () => {
    return Object.keys(selectedPermissions)
      .filter((key) => selectedPermissions[key])
      .map((key) => {
        // Format for display: "module.label - action.label"
        const [module, action] = key.split(".");
        const moduleData = permissionsData.find((m) => m.module === module);
        if (moduleData) {
          const actionData = moduleData.actions.find(
            (a) => a.action === action,
          );
          return actionData
            ? `${moduleData.module_label} - ${actionData.label}`
            : key;
        }
        return key;
      });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Role title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Role title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const selectedCount = getSelectedPermissionsCount();
    if (selectedCount === 0) {
      newErrors.permissions = "Please select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const permissionsForBackend = getSelectedPermissionsForBackend();

      const submitData = {
        profile_name: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        permissions_json: permissionsForBackend,
      };

      let response;

      if (isEdit) {
        response = await editRoleAPI(id, submitData);
      } else {
        response = await addRoleAPI(submitData);
      }

      if (response.status === 200 || response.status === 201) {
        // Set saving flag to prevent unsaved changes warning
        isSavingRef.current = true;

        // Update initial state refs after successful submission
        initialFormStateRef.current = { ...formData };
        initialPermissionsRef.current = { ...selectedPermissions };

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Role has been ${isEdit ? "updated" : "created"} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // Navigate after success message
          navigate("/admin/roles");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: `Could not ${isEdit ? "update" : "create"} role. Please try again.`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Count selected permissions for a module
  const countModuleSelected = (module) => {
    return module.actions.filter((action) => {
      const key = `${module.module}.${action.action}`;
      return selectedPermissions[key];
    }).length;
  };

  // Check if all permissions in a module are selected
  const isModuleAllSelected = (module) => {
    return module.actions.every((action) => {
      const key = `${module.module}.${action.action}`;
      return selectedPermissions[key];
    });
  };

  // Check if any permission in a module is selected
  const isModuleAnySelected = (module) => {
    return module.actions.some((action) => {
      const key = `${module.module}.${action.action}`;
      return selectedPermissions[key];
    });
  };

  // Select all permissions
  const handleSelectAll = (checked) => {
    const updatedSelected = { ...selectedPermissions };
    Object.keys(updatedSelected).forEach((key) => {
      updatedSelected[key] = checked;
    });
    setSelectedPermissions(updatedSelected);
    setErrors((prev) => ({
      ...prev,
      permissions: null,
    }));
  };

  return {
    formData,
    errors,
    loading,
    isLoading,
    permissionsData,
    selectedPermissions,
    setFormData,
    handleInputChange,
    handlePermissionChange,
    handleModuleSelect,
    handleSubmit,
    getSelectedPermissionsForBackend,
    getSelectedPermissionsForDisplay,
    getSelectedPermissionsCount,
    countModuleSelected,
    isModuleAllSelected,
    isModuleAnySelected,
    handleSelectAll,
    isFormDirty: isFormDirty(), // Return the computed value
    resetForm,
  };
};
