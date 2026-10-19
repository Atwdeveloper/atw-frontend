import { useState, useEffect, useContext, createContext } from 'react';
import {companyPermissionAPI} from '../../api/company/companyPermissionsAPI';

const PermissionContext = createContext();

export const useCompanyPermissions = () => {
  return useContext(PermissionContext);
};

export const CompanyPermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const response = await companyPermissionAPI();
      const permissionsObject = transformPermissions(response.data);
      setPermissions(permissionsObject);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setPermissions({});
    } finally {
      setLoading(false);
    }
  };

  // Helper function to transform API response
  const transformPermissions = (permissionsArray) => {
    const transformed = {};
    
    permissionsArray.forEach(item => {
      // Extract just the action names from the actions array
      const actionNames = item.actions.map(action => action.action);
      transformed[item.module] = actionNames;
    });
    
    return transformed;
  };

  const hasPermission = (module, action) => {
    // If no permissions loaded yet, assume false for safety
    if (!permissions || Object.keys(permissions).length === 0) {
      return false;
    }
    
    // Safely check if the module exists and includes the action
    const modulePermissions = permissions[module];
    if (!modulePermissions) {
      return false;
    }
    
    // Check if the action is in the module's permissions
    return modulePermissions.includes(action);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, loading, refresh: fetchPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};