import axiosInstance from "../axiosInstance";

export const getAllRoles = async ({ page, limit, search, status },options = {}) => {
  const response = await axiosInstance.get("/admin/list-permission-profiles", {
    params: { page, limit, search, status },signal: options.signal,
  });
  return response.data;
};

export const getAllPermissions = async () => {
  const response = await axiosInstance.get("/admin/admin-permissions");
  return response.data;
};

export const deleteRoleAPI = async (roleId) => {
  const response = await axiosInstance.delete(
    `/admin/admin-role-delete/${roleId}`
  );
  return response.data;
};

export const addRoleAPI = async (payload) => {
  const response = await axiosInstance.post("/admin/admin-role-add", payload);
  return response.data;
};

export const editRoleAPI = async (roleId, payload) => {
  const response = await axiosInstance.post(
    `/admin/admin-role-update/${roleId}`,
    payload
  );
  return response.data;
};

export const getEditRoleAPi = async (roleId) => {
  const response = await axiosInstance.get(
    `/admin/admin-role-detail/${roleId}`
  );
  return response.data;
};
