import axiosInstance from "../axiosInstance";

export const adminPermissionAPI = async () => {
  const response = await axiosInstance.get(`/admin/my-permissions`);
  return response.data;
}
