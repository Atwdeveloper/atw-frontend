
import axiosInstance from "../axiosInstance";

export const getWorkersAPI = (params) => {
  return axiosInstance.get("/company/applied-workers", { params });
};

export const signInAPI = (data) => {
  return axiosInstance.post("/company/sign-in", data);
};

export const signOutAPI = (data) => {
  return axiosInstance.post("/company/sign-out", data);
};
export const getActiveCompanyVacanciesAPI = (companyId) => {
  return axiosInstance.get("/activeCompnayVacancy", {
    params: {
      company_id: companyId,
    },
  });
};