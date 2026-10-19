import axiosInstance from "../axiosInstance";

export const getAllRoles = async ({ page, limit, search, status },options = {}) => {
  const response = await axiosInstance.get("/company/permission-profiles", {
    params: { page, limit, search, status },signal: options.signal,
  });
  return response.data;
};

export const getAllPermissions = async () => {
  const response = await axiosInstance.get("/company/permission-profiles/permissions");
  return response.data;
};

export const deleteRoleAPI = async (roleId) => {
  const response = await axiosInstance.delete(
    `/company/permission-profiles/${roleId}`
  );
  return response.data;
};

export const addRoleAPI = async (payload) => {
  const response = await axiosInstance.post("/company/permission-profiles", payload);
  return response.data;
};

export const editRoleAPI = async (roleId, payload) => {
  const response = await axiosInstance.put(
    `/company/permission-profiles/${roleId}`,
    payload
  );
  return response.data;
};

export const getEditRoleAPi = async (roleId) => {
  const response = await axiosInstance.get(
    `/company/permission-profiles/${roleId}`
  );
  return response.data;
};
