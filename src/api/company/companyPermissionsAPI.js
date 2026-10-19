import axiosInstance from "../axiosInstance";
import Cookies from "js-cookie";

export const companyPermissionAPI = async () => {
  const userCookie = Cookies.get("user");

  if (!userCookie) {
    throw new Error("User cookie not found");
  }

  const parsedUser = JSON.parse(userCookie);
  // const companyId = parsedUser?.company?.id;
  const companyId = parsedUser?.company?.id || parsedUser?.id;

  if (!companyId) {
    throw new Error("Company ID not found in cookie");
  }

  const response = await axiosInstance.get(
    `/company/companies/my-permissions/${companyId}`
  );

  return response.data;
};
