import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  registerWorker,
  updateWorkerProfile,
  getIndustriesAPI,
  getStatesAPI,
  getCitiesByStateAPI,
  sendAadhaarOtpAPI,
  resendAadhaarOtpAPI,
  verifyAadhaarOtpAPI,
  getWorkerDesignationsAPI,
  getWorkerSkillsAPI,
  enrollWorkerFaceAPI,
} from "../../../api/worker/workerAuthAPI";
import Cookies from "js-cookie";
import { useAuthContext } from "../../../common/context/AuthContext";
import { resolveFaceError } from "../../../common/utils/faceErrors";

// Aadhaar returns DOB as dd-mm-yyyy or dd/mm/yyyy and gender as a single
// letter; both are normalised before they reach the form or the register call.
export const normalizeDobToISO = (dob) => {
  if (!dob) return "";
  const s = String(dob).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return "";
};

export const normalizeGender = (g) => {
  if (!g) return "";
  const val = String(g).trim().toLowerCase();
  if (val === "m" || val === "male") return "male";
  if (val === "f" || val === "female") return "female";
  if (val === "o" || val === "other" || val === "t" || val === "transgender")
    return "other";
  return "";
};

// Helper to parse user cookie
const getUserFromCookie = () => {
  try {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch (e) {
    console.error("Failed to parse user cookie", e);
    return null;
  }
};

export const useWorkerSignup = ({ onSuccess } = {}) => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext(); // get refreshAuth at top level

  const [currentStep, setCurrentStep] = useState(1);
  // Review Details → Work Details → Banking. The account itself is created
  // right after Aadhaar verification, before the wizard starts.
  const totalSteps = 3;
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [formData, setFormData] = useState({
    mobile_number: "",
    first_name: "",
    last_name: "",
    work_email: "",

    industry_id: "",
    designation_ids: [],
    skills: [],

    date_of_birth: "",
    gender: "",
    father_name: "",
    aadhar_number: "",

      // NEW: permanent / Aadhaar address (maps to address/state_id/city_id/zip)
    permanent_address_line: "",
    permanent_state_id: "",
    permanent_city_id: "",
    permanent_zip: "",
    permanent_state_name: "",
    permanent_city_name: "",

    account_holder_name: "",
    bank_name: "",
    account_number: "",
    referral_code: "",
    referral_verified: false,
    ifsc_code: "",
    accepted_terms: false,
    accepted_privacy: false,

    // Statutory ids — all optional, filled in whenever the worker has them.
    esic_number: "",
    uan_number: "",
    pan_number: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => Cookies.get("token") || null);

  // Dropdown data
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesMap, setCitiesMap] = useState({});
  const [citiesLoading, setCitiesLoading] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  //Adhar verification state
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarReferenceId, setAadhaarReferenceId] = useState("");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  // The `address_details` object from Aadhaar verification, passed verbatim to
  // /worker/register as `aadhaar_address` — the backend resolves the state and
  // district names into internal ids itself.
  const [aadhaarAddress, setAadhaarAddress] = useState(null);

  //Face registration state — seeded from the cookie so it survives a refresh
  const [faceRegistered, setFaceRegistered] = useState(
    () => Boolean(getUserFromCookie()?.is_face_registered),
  );
  const [faceRegistering, setFaceRegistering] = useState(false);
  const [faceRegisterError, setFaceRegisterError] = useState("");

  // Cookie configuration
  const cookieOptions = {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Helper to ensure array data from API responses
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.data?.data && Array.isArray(data.data.data))
      return data.data.data;
    return [];
  };

  const updateFormData = (newData) =>
    setFormData((prev) => ({ ...prev, ...newData }));
  const clearFieldError = (fieldName) =>
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    clearFieldError(field);
  };

  // Fetch industries
  const fetchIndustries = async () => {
    setIndustriesLoading(true);
    try {
      const res = await getIndustriesAPI();
      setIndustries(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch industries", err);
    } finally {
      setIndustriesLoading(false);
    }
  };

  // Loads every designation when no industry is picked, or just that
  // industry's designations once one is. Re-run whenever the industry
  // selection changes (see the effect below).
  const fetchDesignations = async (industryId) => {
    setDesignationsLoading(true);
    try {
      const res = await getWorkerDesignationsAPI(industryId);
      const list = ensureArray(res);
      setDesignations(list);
      // Drop any already-picked designation that fell outside the new
      // (possibly industry-filtered) list — the skills effect below then
      // re-fetches for whatever designations remain selected.
      const allowed = new Set(list.map((d) => d.id));
      setFormData((prev) => ({
        ...prev,
        designation_ids: (prev.designation_ids || []).filter((id) =>
          allowed.has(id),
        ),
      }));
    } catch (err) {
      console.error("Failed to fetch designations", err);
      setDesignations([]);
    } finally {
      setDesignationsLoading(false);
    }
  };

  // Skills always belong to the currently selected designations, so this runs
  // again on every change to that selection.
  const fetchSkills = async (designationIds) => {
    if (!designationIds || designationIds.length === 0) {
      setSkills([]);
      updateFormData({ skills: [] });
      return;
    }
    setSkillsLoading(true);
    try {
      const res = await getWorkerSkillsAPI(designationIds);
      const list = ensureArray(res);
      setSkills(list);
      // Drop any already-picked skill that no longer belongs to the current
      // designations — the server would silently discard it anyway.
      const allowed = new Set(list.map((s) => s.id));
      setFormData((prev) => ({
        ...prev,
        skills: (prev.skills || []).filter((s) => allowed.has(s.id)),
      }));
    } catch (err) {
      setSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Fetch states
  const fetchStates = async () => {
    setStatesLoading(true);
    try {
      const res = await getStatesAPI();
      setStates(ensureArray(res));
    } catch (err) {
      console.error("Failed to fetch states", err);
    } finally {
      setStatesLoading(false);
    }
  };

  // Fetch cities for a state
  const fetchCities = async (stateId) => {
  if (!stateId) return [];
  if (citiesMap[stateId]) return citiesMap[stateId]; // already cached

  setCitiesLoading((prev) => ({ ...prev, [stateId]: true }));
  try {
    const res = await getCitiesByStateAPI(stateId);
    const cities = ensureArray(res);
    setCitiesMap((prev) => ({ ...prev, [stateId]: cities }));
    return cities; // <-- added
  } catch (err) {
    console.error("Failed to fetch cities", err);
    return [];
  } finally {
    setCitiesLoading((prev) => ({ ...prev, [stateId]: false }));
  }
};

  // Public lookups — safe to load before the worker has an account.
  useEffect(() => {
    fetchIndustries();
    fetchStates();
  }, []);

  // /worker/designations is behind the bearer token, which only exists once
  // the account is created. Calling it earlier 401s, and the axios interceptor
  // turns that into a forced logout + redirect. Re-fetches, filtered, whenever
  // the industry selection changes.
  useEffect(() => {
    if (!token) return;
    fetchDesignations(formData.industry_id || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, formData.industry_id]);
  
useEffect(() => {
  const verifiedMobile = Cookies.get("verified_mobile");
  if (verifiedMobile && !formData.mobile_number) {
    updateFormData({ mobile_number: verifiedMobile });
  }
}, []);
  // Reload skills whenever the designation selection changes.
  useEffect(() => {
    fetchSkills(formData.designation_ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.designation_ids]);

  // Load saved data from "user" cookie on mount
  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (cookieToken) {
      setToken(cookieToken);
    }
    loadDataFromCookie();
  }, []);

  const verifyReferralCode = async () => {
    if (!formData.referral_code) return { success: false };

    try {
      const res = await fetch("/api/verify-referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: formData.referral_code }),
      });

      const data = await res.json();

      if (data.valid) {
        updateFormData({ referral_verified: true });
        return { success: true };
      } else {
        updateFormData({ referral_verified: false });
        return { success: false, message: "Invalid referral code" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Verification failed" };
    }
  };

   
  // Load worker data from "user" cookie and determine step
  const loadDataFromCookie = () => {
    const user = getUserFromCookie();
    if (!user) return;

    const mappedData = {
      mobile_number: user.mobile_number || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      work_email: user.work_email || "",
      industry_id: user.industry_id || "",
      designation_ids: Array.isArray(user.designations)
        ? user.designations.map((d) => d.id)
        : [],
      skills: Array.isArray(user.skills) ? user.skills : [],
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "",
      father_name: user.father_name || "",
      aadhar_number: user.aadhaar_number || "",

        // NEW: permanent address from Aadhaar (maps to worker_personal_details.address/state_id/city_id/zip)
      permanent_address_line: user.address || "",
      permanent_state_id: user.state_id || "",
      permanent_city_id: user.city_id || "",
      permanent_zip: user.zip || "",

      account_holder_name: user.account_holder_name || "",
      bank_name: user.bank_name || "",
      account_number: user.account_number || "",
      ifsc_code: user.ifsc_code || "",
      accepted_terms: user.accepted_terms || false,
      accepted_privacy: user.accepted_privacy || false,

      esic_number: user.esic_number || "",
      uan_number: user.uan_number || "",
      pan_number: user.pan_number || "",
    };

    updateFormData(mappedData);
    if (mappedData.permanent_state_id) {
      fetchCities(mappedData.permanent_state_id);
    }

    // Resume on the furthest step still worth showing: the account already
    // exists by the time the wizard runs, so step 1 is only a review.
    let step = 1;
    if (mappedData.first_name && mappedData.mobile_number) step = 2;
    if (mappedData.designation_ids.length > 0) step = 3;

    setCurrentStep(step);
  };

  // Aadhaar verification
      const sendAadhaarOtp = async (aadharNumber) => {
  setAadhaarLoading(true);
  try {
    const res = await sendAadhaarOtpAPI(aadharNumber);
    if (res.success) {
      setAadhaarReferenceId(String(res.reference_id));
      // Auto-dismissing: the screen advances on its own, so an OK button here
      // is pure friction.
      Swal.fire({
        icon: "success",
        text: "OTP sent successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    }
    return res;
  } catch (err) {
    const data = err.response?.data || {};
    return {
      success: false,
      error_code: data.error_code,
      wait_seconds: data.wait_seconds,
      message: data.message || "Unable to send OTP. Please try again.",
    };
  } finally {
    setAadhaarLoading(false);
  }
};

const resendAadhaarOtp = async (aadhaarNumber) => {
  setAadhaarLoading(true);
  try {
    const res = await resendAadhaarOtpAPI(aadhaarNumber);
    if (res.success) {
      setAadhaarReferenceId(res.reference_id);
      Swal.fire({
        icon: "success",
        text: "OTP resent successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    }
    return res;
  } catch (err) {
    const data = err.response?.data || {};
    return {
      success: false,
      error_code: data.error_code,
      wait_seconds: data.wait_seconds,
      message: data.message || "Unable to resend OTP. Please try again.",
    };
  } finally {
    setAadhaarLoading(false);
  }
};

      const verifyAadhaarOtp = async (otp, aadhaarNumber) => {
        const res = await verifyAadhaarOtpAPI(
            otp,
            aadhaarReferenceId
        );
        if (!res.success) {

    // No dialog here — the OTP screen renders the failure inline, and a modal
    // on top of it just adds a click before they can retype.
    setAadhaarVerified(false);

    return res;
}

        const aadhaar = res.data;
        const names = String(aadhaar?.name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const aadharDigits =
          String(aadhaarNumber || "").replace(/\D/g, "") ||
          String(aadhaar?.aadhaar_number || aadhaar?.aadhar_number || "").replace(/\D/g, "");
        updateFormData({
            first_name: names[0] || "",
            last_name: names.slice(1).join(" "),
            date_of_birth: normalizeDobToISO(aadhaar?.dob),
            gender: normalizeGender(aadhaar?.gender),
            father_name: aadhaar?.father_name || "",
            permanent_address_line: aadhaar?.address || "",
            aadhar_number: aadharDigits,
            permanent_zip: aadhaar?.pincode || "",
            // Shown as-is on the review screen; no client-side id lookup needed
            // now that the backend resolves these names during registration.
            permanent_state_name: aadhaar?.state || "",
            permanent_city_name: aadhaar?.district || "",
        });

        setAadhaarAddress(
          aadhaar?.address_details || {
            house: aadhaar?.house || "",
            street: aadhaar?.street || "",
            landmark: aadhaar?.landmark || "",
            locality: aadhaar?.locality || "",
            vtc: aadhaar?.vtc || "",
            subdistrict: aadhaar?.subdistrict || "",
            district: aadhaar?.district || "",
            state: aadhaar?.state || "",
            country: aadhaar?.country || "India",
            post_office: aadhaar?.post_office || "",
            pincode: aadhaar?.pincode || "",
          },
        );

        setAadhaarVerified(true);
        return res;
    };

   

  // The scanner shows failures inline and offers a retry, so this reports the
  // outcome back rather than interrupting with an error dialog.
  const registerFace = async (imageBlob) => {
    // The backend identifies the worker from the bearer token, so a token is the
    // only precondition — it exists once step 1 has been submitted.
    const currentToken = Cookies.get("token") || token;
    if (!currentToken) {
      const message =
        "Please complete the earlier steps before registering your face.";
      setFaceRegisterError(message);
      return { success: false, message, code: "not_authenticated", retryable: false };
    }

    if (!imageBlob) {
      const message = "Could not capture the photo. Please try again.";
      setFaceRegisterError(message);
      return { success: false, message, code: "unknown", retryable: true };
    }

    setFaceRegistering(true);
    setFaceRegisterError("");
    try {
      const response = await enrollWorkerFaceAPI(imageBlob);
      const data = response?.data || response;

      // A 200 carrying status:false is still a failure.
      if (data?.status === false) {
        const failure = resolveFaceError(data);
        setFaceRegisterError(failure.message);
        return { success: false, ...failure };
      }

      setFaceRegistered(true);

      // Persist so it survives refresh / re-visits to this page
      const existingUser = getUserFromCookie() || {};
      Cookies.set(
        "user",
        JSON.stringify({ ...existingUser, is_face_registered: true }),
        cookieOptions,
      );

      Swal.fire({
        icon: "success",
        title: "Face Registered",
        text: "Your face has been registered successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      return { success: true };
    } catch (err) {
      const failure = resolveFaceError(err);
      setFaceRegisterError(failure.message);
      return { success: false, ...failure };
    } finally {
      setFaceRegistering(false);
    }
  };

  const validateStep1 = () => {
    const errs = {};
    const mobileDigits = formData.mobile_number?.replace(/\D/g, "");
    if (!formData.mobile_number)
      errs.mobile_number = "Mobile number is required";
    else if (mobileDigits.length !== 10 || !/^[6-9]/.test(mobileDigits))
      errs.mobile_number = "Must be 10 digits starting with 6-9";
    if (!formData.first_name?.trim())
      errs.first_name = "First name is required";
    if (!formData.last_name?.trim()) errs.last_name = "Last name is required";
    // if (!formData.work_email?.trim()) errs.work_email = 'Work email is required';
    // else if (!/\S+@\S+\.\S+/.test(formData.work_email))
    //   errs.work_email = "Email is invalid";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Industry is optional (the backend treats it as optional too); at least one
  // designation is what actually unlocks the skills list.
  const validateStep2 = () => {
    const errs = {};
    if (!formData.designation_ids || formData.designation_ids.length === 0)
      errs.designation_ids = "Please select at least one designation";
    if (skills.length > 0 && formData.skills.length === 0)
      errs.skills = "Please select at least one skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
  const errs = {};
  if (formData.account_number?.trim()) {
    const accDigits = formData.account_number.replace(/\D/g, "");
    if (accDigits.length < 9 || accDigits.length > 18)
      errs.account_number = "Account number must be 9-18 digits";
  }

  if (formData.ifsc_code?.trim()) {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase()))
      errs.ifsc_code = "Invalid IFSC code (e.g. SBIN0123456)";
  }

  if (formData.uan_number?.trim()) {
    const uanDigits = formData.uan_number.replace(/\D/g, "");
    if (uanDigits.length !== 12) errs.uan_number = "UAN must be 12 digits";
  }

  if (formData.pan_number?.trim()) {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_number.toUpperCase()))
      errs.pan_number = "Invalid PAN (e.g. ABCDE1234F)";
  }

  if (!formData.accepted_terms)
    errs.accepted_terms = "You must accept the terms";
  if (!formData.accepted_privacy)
    errs.accepted_privacy = "You must accept the privacy policy";

  setErrors(errs);
  return Object.keys(errs).length === 0;
};

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1(); // Review Details
      case 2:
        return validateStep2(); // Work Details
      case 3:
        return validateStep3(); // Banking Details
      default:
        return true;
    }
  };

  // ---------- API submissions ----------
  // Creates the account immediately after Aadhaar verification (or after the
  // worker skips it), which is what mints the bearer token every later step
  // depends on. `overrides` lets the caller pass the freshly-verified Aadhaar
  // payload without waiting for formData's re-render.
  const registerAccount = async (overrides = {}) => {
    setLoading(true);
    try {
      // Everything except mobile_number is optional server-side, so a worker
      // who skipped Aadhaar still gets an account.
      const payload = {
        mobile_number: (
          formData.mobile_number ||
          Cookies.get("verified_mobile") ||
          ""
        ).replace(/\D/g, ""),
        first_name: overrides.first_name ?? formData.first_name,
        last_name: overrides.last_name ?? formData.last_name,
        date_of_birth: overrides.date_of_birth ?? formData.date_of_birth,
        gender: overrides.gender ?? formData.gender,
        father_name: overrides.father_name ?? formData.father_name,
        // Single-a on purpose: this is the persisted column name.
        aadhar_number: overrides.aadhar_number ?? formData.aadhar_number,
        // Double-a on purpose: this is the KYC-shaped object the backend
        // resolves into state_id / city_id.
        ...(overrides.aadhaar_address || aadhaarAddress
          ? { aadhaar_address: overrides.aadhaar_address || aadhaarAddress }
          : {}),
      };

      const response = await registerWorker(payload);
      const data = response.data || response;

      if (data.status && data.status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong",
        });
        return false;
      }

      const authToken = data.token;
      if (!authToken) throw new Error("No token received");

      Cookies.set("token", authToken, cookieOptions);
      Cookies.set("role", "worker", cookieOptions);
      Cookies.remove("verified_mobile");
      setToken(authToken);

      const worker = data.worker || {};
      const existingUser = getUserFromCookie() || {};
      Cookies.set(
        "user",
        JSON.stringify({ ...existingUser, ...worker }),
        cookieOptions,
      );

      await Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Let's set up your work profile.",
        timer: 1800,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentStep = async () => {
  if (!validateCurrentStep()) return false;

  const currentToken = Cookies.get("token") || token;
  if (!currentToken) {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Please start over.",
    });
    navigate("/worker/register");
    return false;
  }

  setLoading(true);
  try {
    let response;

    if (currentStep === 2) {
      // Designations must land first: the backend validates skills against the
      // worker's *saved* designations and silently drops anything else.
      response = await updateWorkerProfile({
        ...(formData.industry_id && {
          industry_id: parseInt(formData.industry_id),
        }),
        designation_ids: formData.designation_ids.map((id) => parseInt(id)),
      });

      if (formData.skills.length > 0) {
        response = await updateWorkerProfile({
          skills: formData.skills.map((s) => s.id),
        });
      }
    } else if (currentStep === 3) {
      response = await updateWorkerProfile({
        account_holder_name: formData.account_holder_name || null,
        bank_name: formData.bank_name || null,
        account_number: formData.account_number
          ? formData.account_number.replace(/\D/g, "")
          : null,
        ifsc_code: formData.ifsc_code ? formData.ifsc_code.toUpperCase() : null,
        accepted_terms: formData.accepted_terms,
        accepted_privacy: formData.accepted_privacy,
        esic_number: formData.esic_number || null,
        uan_number: formData.uan_number
          ? formData.uan_number.replace(/\D/g, "")
          : null,
        pan_number: formData.pan_number
          ? formData.pan_number.toUpperCase()
          : null,
        ...(formData.referral_code && { agent_code: formData.referral_code }),
      });
    }

    const resData = response?.data || response; // unwrap safely

    // Normalize possible shapes: resData.profile_status OR resData.data.profile_status
    const profileStatus =
      resData?.profile_status || resData?.data?.profile_status || resData?.worker?.profile_status;

    // On the FINAL step, treat it as complete even if the backend
    // doesn't explicitly say "completed" — as long as the call succeeded.
    const isFinalStep = currentStep === totalSteps;
    const shouldMarkComplete = profileStatus === "completed" || isFinalStep;

    if (shouldMarkComplete) {
      const currentUser = getUserFromCookie() || {};
      const workerData = resData?.worker || resData?.data?.worker || {};
      const updatedUser = {
        ...currentUser,
        ...workerData,
        profile_status: "completed",
      };
      Cookies.set("user", JSON.stringify(updatedUser), cookieOptions);
      Cookies.set("profile_status", "completed", cookieOptions);

      refreshAuth();
      setProfileCompleted(true);
      if (typeof onSuccess === "function") onSuccess();
      return true;
    }

    if (currentStep < totalSteps) {
      Swal.fire({
        icon: "success",
        title: "Progress Saved",
        text: `Step ${currentStep} completed.`,
        timer: 1000,
        showConfirmButton: false,
      });
    }
    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: `Step ${currentStep} Failed`,
      text: error.response?.data?.message || error.message,
    });
    return false;
  } finally {
    setLoading(false);
  }
};

  const nextStep = async () => {
    // Step 1 is a read-only review of what Aadhaar returned — the account was
    // already created before the wizard started, so there's nothing to submit.
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    const success = await submitCurrentStep();
    if (success && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
    return success;
  };

  // Back can return all the way to Review Details (step 1) — the account
  // already exists by the time the wizard runs, so revisiting it is just a
  // read-only look, not a redo. Going back any further than that would
  // expose the now-stale Aadhaar OTP screens, so the page itself (not this
  // hook) redirects to the dashboard once the worker is on step 1.
  const prevStep = () => {
    if (loading) return;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps && step < currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    loading,
    token,
    industries,
    verifyReferralCode,
    industriesLoading,
    designations,
    designationsLoading,
    sendAadhaarOtp,
    resendAadhaarOtp,
    verifyAadhaarOtp,
    states,
    statesLoading,
    citiesMap,
    citiesLoading,
    profileCompleted,
    skills,
    skillsLoading,
    handleChange,
    fetchCities,
    nextStep,
    prevStep,
    goToStep,
    faceRegistered,
    faceRegistering,
    faceRegisterError,
    registerFace,
    registerAccount,
    aadhaarVerified,
    aadhaarAddress,
    updateFormData,
  };
};
