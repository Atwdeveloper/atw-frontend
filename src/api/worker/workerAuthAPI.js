import axiosInstance from "../axiosInstance";

export const workerLoginAPI = async (mobile_number) => {
  const response = await axiosInstance.post("/worker/login", {
    mobile_number,
  });

  return response.data;
};

export const verifyWorkerOtpAPI = async (mobile_number, otp) => {
  const response = await axiosInstance.post("/worker/verifyOtp", {
    mobile_number,
    otp,
  });
  return response.data;
};

export const resendWorkerOtpAPI = async (mobile_number) => {
  const response = await axiosInstance.post("/worker/resend-otp", {
    mobile_number,
  });
  return response.data;
};

export const sendAadhaarOtpAPI = async (aadhaar_number) => {
  const response = await axiosInstance.post(
    "/worker/sendAadhaarOtp",
    {
      aadhaar_number,
    }
  );
  return response.data;
};

export const verifyAadhaarOtpAPI = async (
  otp,
  reference_id
) => {
  try {
    const response = await axiosInstance.post(
    "/worker/verifyAadhaarOtp",
    {
      otp,
      reference_id,
    }
  );
  return response.data;
  } catch (error) {
    return (
            error.response?.data || {
                success: false,
                message: "Verification failed",
            }
        );
  }
};

export const resendAadhaarOtpAPI = async (aadhaarNumber) => {
  const response = await axiosInstance.post(
    "/worker/aadhaar/resend-otp",
    {
      aadhaar_number: aadhaarNumber,
    }
  );
  return response.data;
};

export const registerWorker = async (data) => {
  const response = await axiosInstance.post("/worker/register", data);
  return response.data;
};

// export const getWorkerProfileData = async () => {
//   const response = await axiosInstance.get("/worker/worker-profile");
//   return response.data;
// };

export const updateWorkerProfile = async (data) => {
  const response = await axiosInstance.post("/worker/worker-Profile", data);
  return response.data;
};

export const getDepartmentsAPI = async () => {
  const response = await axiosInstance.get("/get-departments");
  return response.data;
};

export const getDesignationsAPI = (industryId) => {
  return axiosInstance.get(`/designations-by-industry/${industryId}`);
};
// Get industries
export const getIndustriesAPI = async () => {
  const response = await axiosInstance.get("/get-industries");
  return response.data;
};

// Get states
export const getStatesAPI = async () => {
  const response = await axiosInstance.get("/get-states");
  return response.data;
};
export const getCitiesByStateAPI = async (state_id) => {
  const response = await axiosInstance.post("/get-cities", {
    state_id,
  });

  return response.data;
};

//Get Skills
export const getSkillsByDesignationAPI = async (designationId) => {
  const response = await axiosInstance.get(
    `/skills-by-designation/${designationId}`,
    {
      params: { status: 1 },
    },
  );
  return response.data;
};

// Self-registration designation picker. `industryId` is an optional filter —
// omit it (or pass a falsy value) to list every designation.
export const getWorkerDesignationsAPI = async (industryId) => {
  const response = await axiosInstance.get("/worker/designations", {
    params: industryId ? { industry_id: industryId } : undefined,
  });
  return response.data;
};

// Skills are always scoped to the currently selected designations, so this is
// re-called every time that selection changes.
export const getWorkerSkillsAPI = async (designationIds = []) => {
  const params = new URLSearchParams();
  designationIds.forEach((id) => params.append("designation_ids[]", id));
  const response = await axiosInstance.get("/worker/skills", { params });
  return response.data;
};
export const workerLogoutAPI = () => {
  return axiosInstance.get("/worker/logout");
};

// The worker is identified by the bearer token, never by an id in the body —
// otherwise anyone could enrol a face against someone else's account.
const faceFormData = (imageBlob) => {
  const formData = new FormData();
  formData.append("image", imageBlob, "face.jpg");
  return formData;
};

export const registerWorkerFaceAPI = (imageBlob) => {
  return axiosInstance.post("/worker/register-face", faceFormData(imageBlob), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Phase-2 enrolment endpoint. Optional and skippable — nothing else in the
// app is gated on it; `getWorkerFaceStatusAPI` drives the reminder for
// workers who skipped.
export const enrollWorkerFaceAPI = (imageBlob) => {
  return axiosInstance.post("/worker/face/enroll", faceFormData(imageBlob), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getWorkerFaceStatusAPI = async () => {
  const response = await axiosInstance.get("/worker/face/status");
  return response.data;
};

export const verifyWorkerFaceAPI = (imageBlob) => {
  return axiosInstance.post("/worker/verify-face", faceFormData(imageBlob), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteWorkerFaceAPI = () => {
  return axiosInstance.delete("/worker/face");
};