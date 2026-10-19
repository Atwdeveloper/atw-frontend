import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useWorkerProfile } from "../../workerhooks/useWorkerProfile";
import Loader from "../../../../common/components/Loader";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Edit2,
  Home,
  Building,
  Building2,
  Hash,
  CreditCard,
  Fingerprint,
  Award,
  ShieldCheck,
  BanknoteIcon,
  FileText,
  MapPinned,
  BadgeCheck,
  IdCard,
  Lock,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

// Small read-only "label + value" block shared by every card below —
// keeps this file's existing visual language (icon + gray label, value in a
// bg-gray-50 rounded box) rather than introducing a new one.
const InfoField = ({ icon, label, value, trailing }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg">
      <p className="font-medium text-gray-900 truncate">{value || "-"}</p>
      {trailing}
    </div>
  </div>
);

// Top-right edit affordance shared by the two editable cards. Switches that
// card into inline editing — no navigation to another page.
const CardEditButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Edit"
    title="Edit"
    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
  >
    <Edit2 size={16} />
  </button>
);

// Save / Cancel pair shown at the bottom of a card while it's being edited.
const EditActions = ({ onCancel, onSave, saving }) => (
  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
    <button
      type="button"
      onClick={onCancel}
      disabled={saving}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
    >
      <X size={16} />
      Cancel
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {saving ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Check size={16} />
      )}
      Save
    </button>
  </div>
);

// Label + input wrapper matching InfoField's look, for edit mode.
const EditField = ({ icon, label, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    {children}
  </div>
);

const fieldClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

// Thumbnail with a lettered fallback — rounded-square rather than a tight
// circle crop, since these are workplace/skill photos (tools, sites, work
// being done), not centered face avatars, so a circle crop was cutting off
// most of what made the photo recognizable. Kept compact enough for an
// inline dropdown row or chip, but large enough to actually read.
const Thumb = ({ image, name, size = 44 }) => (
  <span
    className="relative shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-semibold text-gray-400 shadow-sm"
    style={{ width: size, height: size, fontSize: Math.max(11, size * 0.4) }}
  >
    {String(name || "?").charAt(0).toUpperCase()}
    {image && (
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    )}
  </span>
);

// Compact click-to-open picker for Industry / Designation / Skills — shows a
// thumbnail per option without the large photo-grid footprint used on the
// registration wizard, since this card has much less room.
const PickerDropdown = ({
  dropdownRef,
  open,
  onToggleOpen,
  placeholder,
  loading,
  items,
  isSelected,
  onPick,
  multi = true,
  disabledReason,
}) => (
  <div ref={dropdownRef} className="relative">
    <button
      type="button"
      onClick={() => !disabledReason && onToggleOpen()}
      disabled={!!disabledReason}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm text-left transition ${
        disabledReason
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
          : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
      }`}
    >
      <span className="truncate">{disabledReason || placeholder}</span>
      <ChevronDown
        size={14}
        className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>

    {open && !disabledReason && (
      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
        {loading ? (
          <div className="px-3 py-3 text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="px-3 py-3 text-sm text-gray-400">
            Nothing available
          </div>
        ) : (
          items.map((item) => {
            const picked = isSelected(item);
            return (
              <label
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50/60 cursor-pointer border-b last:border-b-0 border-gray-100"
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  checked={picked}
                  readOnly
                  onClick={() => onPick(item)}
                  className="shrink-0"
                />
                <Thumb image={item.image} name={item.name} />
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {item.name}
                </span>
                {picked && (
                  <Check size={16} className="text-blue-600 shrink-0" />
                )}
              </label>
            );
          })
        )}
      </div>
    )}
  </div>
);

// Separate "selected" chips shown below a PickerDropdown, each with its own
// thumbnail so the picks stay visually identifiable without re-opening it.
const ChipsRow = ({ items, onRemove, emptyHint }) =>
  items.length === 0 ? (
    emptyHint ? (
      <p className="text-xs text-gray-400 mt-2">{emptyHint}</p>
    ) : null
  ) : (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item) => (
        <span
          key={item.id}
          className="flex items-center gap-2 bg-blue-50 text-blue-700 pl-1.5 pr-3 py-1.5 rounded-xl text-sm font-medium border border-blue-100"
        >
          <Thumb image={item.image} name={item.name} size={36} />
          {item.name}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-blue-400 hover:text-red-500"
            >
              <X size={13} />
            </button>
          )}
        </span>
      ))}
    </div>
  );

// Top-right counterpart to CardEditButton for the Aadhaar card — signals
// "locked" instead of offering an edit action, since this data is
// Aadhaar-sourced and immutable.
const CardLockBadge = () => (
  <span
    title="Locked — sourced from your Aadhaar"
    aria-label="Locked"
    className="p-2 rounded-lg text-gray-400"
  >
    <Lock size={16} />
  </span>
);

const DRESS_SIZES = ["S", "M", "L", "XL", "XXL"];
const MAX_DESIGNATIONS = 3;

const WorkerProfile = () => {
  const {
    formData,
    formLoading,
    industries,
    updateProfileSection,
    fetchDesignationsForIndustry,
    fetchSkillsForDesignationIds,
  } = useWorkerProfile();

  // Which card (if any) is currently in inline-edit mode.
  const [editingSection, setEditingSection] = useState(null); // 'professional' | 'bank' | null
  const [savingSection, setSavingSection] = useState(false);

  // Draft state for Card 2 (Industry & Designation) — only committed to the
  // server (and to `formData`) on Save; Cancel just discards it.
  const [professionalDraft, setProfessionalDraft] = useState({
    industry_id: "",
    designation_ids: [],
    skills: [],
    dress_size: "",
  });
  const [designationOptions, setDesignationOptions] = useState([]);
  const [designationOptionsLoading, setDesignationOptionsLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillOptionsLoading, setSkillOptionsLoading] = useState(false);

  // Open/close state for the three compact thumbnail pickers above.
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const industryDropdownRef = useRef(null);
  const designationDropdownRef = useRef(null);
  const skillDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        industryDropdownRef.current &&
        !industryDropdownRef.current.contains(event.target)
      ) {
        setShowIndustryDropdown(false);
      }
      if (
        designationDropdownRef.current &&
        !designationDropdownRef.current.contains(event.target)
      ) {
        setShowDesignationDropdown(false);
      }
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target)
      ) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Draft state for Card 3 (Bank Details).
  const [bankDraft, setBankDraft] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    pan_number: "",
    uan_number: "",
    esic_number: "",
  });

  // Designation options follow the draft's industry (not the saved one), so
  // they're only fetched while Card 2 is actually being edited.
  useEffect(() => {
    if (editingSection !== "professional") return;
    let cancelled = false;
    setDesignationOptionsLoading(true);
    fetchDesignationsForIndustry(professionalDraft.industry_id).then((list) => {
      if (!cancelled) {
        setDesignationOptions(list);
        setDesignationOptionsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSection, professionalDraft.industry_id]);

  // Skill options follow the draft's designation selection.
  useEffect(() => {
    if (editingSection !== "professional") return;
    let cancelled = false;
    const ids = professionalDraft.designation_ids;
    if (ids.length === 0) {
      setSkillOptions([]);
      return;
    }
    setSkillOptionsLoading(true);
    fetchSkillsForDesignationIds(ids).then((list) => {
      if (!cancelled) {
        setSkillOptions(list);
        setSkillOptionsLoading(false);
        // Drop any drafted skill that no longer belongs to the current
        // designation selection — the server would silently drop it anyway.
        const allowed = new Set(list.map((s) => s.id));
        setProfessionalDraft((prev) => ({
          ...prev,
          skills: prev.skills.filter((s) => allowed.has(s.id)),
        }));
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSection, professionalDraft.designation_ids]);

  const startEditingProfessional = () => {
    setProfessionalDraft({
      industry_id: formData.industry_id || "",
      designation_ids: (formData.designations || []).map((d) => d.id),
      skills: formData.skills || [],
      dress_size: formData.dress_size || "",
    });
    setEditingSection("professional");
  };

  const startEditingBank = () => {
    setBankDraft({
      account_holder_name: formData.account_holder_name || "",
      account_number: formData.account_number || "",
      ifsc_code: formData.ifsc_code || "",
      account_type: formData.account_type || "",
      pan_number: formData.pan_number || "",
      uan_number: formData.uan_number || "",
      esic_number: formData.esic_number || "",
    });
    setEditingSection("bank");
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setDesignationOptions([]);
    setSkillOptions([]);
    setShowIndustryDropdown(false);
    setShowDesignationDropdown(false);
    setShowSkillDropdown(false);
  };

  const toggleDraftDesignation = (id) => {
    setProfessionalDraft((prev) => {
      const picked = prev.designation_ids.includes(id);
      if (!picked && prev.designation_ids.length >= MAX_DESIGNATIONS) return prev;
      return {
        ...prev,
        designation_ids: picked
          ? prev.designation_ids.filter((d) => d !== id)
          : [...prev.designation_ids, id],
      };
    });
  };

  const toggleDraftSkill = (skill) => {
    setProfessionalDraft((prev) => {
      const picked = prev.skills.some((s) => s.id === skill.id);
      return {
        ...prev,
        skills: picked
          ? prev.skills.filter((s) => s.id !== skill.id)
          : [...prev.skills, skill],
      };
    });
  };

  const saveProfessional = async () => {
    if (professionalDraft.designation_ids.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Designation required",
        text: "Please select at least one designation before saving.",
      });
      return;
    }
    setSavingSection(true);
    const result = await updateProfileSection({
      industry_id: professionalDraft.industry_id || null,
      designation_ids: professionalDraft.designation_ids,
      skills: professionalDraft.skills.map((s) => s.id),
      dress_size: professionalDraft.dress_size,
    });
    setSavingSection(false);
    if (result.success) {
      cancelEditing();
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: result.message || "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: result.message,
      });
    }
  };

  const saveBank = async () => {
    setSavingSection(true);
    const result = await updateProfileSection({
      payment_method: "bank",
      ...bankDraft,
    });
    setSavingSection(false);
    if (result.success) {
      cancelEditing();
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: result.message || "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: result.message,
      });
    }
  };

  // Calculate full name
  const fullName =
    `${formData.first_name || ""} ${formData.middle_name || ""} ${formData.last_name || ""}`.trim();

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Generic masking used for phone/PAN/ESIC — keeps the last 4 characters.
  const maskValue = (value) => {
    if (!value) return "";

    return "*".repeat(Math.max(0, value.length - 4)) + value.slice(-4);
  };

  // Aadhaar-specific masking, matching the registration review screen exactly:
  // first 3 digits + 6 asterisks + last 2 digits.
  const maskAadhaar = (value) => {
    if (!value) return "";
    const str = String(value);
    if (str.length <= 5) return str;
    return `${str.slice(0, 3)}${"*".repeat(6)}${str.slice(-2)}`;
  };

  const hasBankDetails = formData.bank_accounts?.length > 0 || formData.account_number;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 w-full sm:px-6 md:px-8 py-0 md:py-4 flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full max-w-7xl"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View your personal and professional information
          </p>
        </div>
      </motion.div>

      {/* Compact hero — photo + name + designation only. Detail chips moved
          into the cards below to avoid duplicating the same data twice. */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 w-full max-w-7xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative shrink-0">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt={fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-md">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
            )}
            {formData.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                <BadgeCheck size={16} />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {fullName || "-"}
            </h2>
            <p className="text-gray-600 font-medium">
              {formData.designation || "Designation not set"}
            </p>
            {formData.work_email && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Mail size={14} />
                <span>{formData.work_email}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Card 1 — Aadhaar / Identity. Read-only, no edit affordance:
          this data is sourced from Aadhaar during registration and is
          immutable, mirroring the registration review step exactly. */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 w-full max-w-7xl"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Fingerprint size={20} className="text-blue-600" />
              Aadhaar Details
            </h3>
            <CardLockBadge />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Securely retrieved from your Aadhaar during registration —
            these details cannot be edited here.
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField
                icon={<User size={14} />}
                label="First Name"
                value={formData.first_name}
              />
              <InfoField
                icon={<User size={14} />}
                label="Last Name"
                value={formData.last_name}
              />
              <InfoField
                icon={<Phone size={14} />}
                label="Mobile Number"
                value={maskValue(formData.mobile_number)}
              />
              <InfoField
                icon={<IdCard size={14} />}
                label="Aadhaar Number"
                value={maskAadhaar(formData.aadhaar_number)}
                trailing={
                  formData.aadhaar_number && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 shrink-0">
                      <ShieldCheck size={14} />
                      Verified
                    </span>
                  )
                }
              />
              <InfoField
                icon={<User size={14} />}
                label="Father's Name"
                value={formData.father_name}
              />
              <InfoField
                icon={<Calendar size={14} />}
                label="Date of Birth"
                value={
                  formData.date_of_birth
                    ? new Date(formData.date_of_birth).toLocaleDateString()
                    : ""
                }
              />
              <InfoField
                icon={<User size={14} />}
                label="Gender"
                value={formData.gender}
              />
            </div>

            {/* Address — folded into the same card, matching the registration
                review screen's layout (State/City/Pincode, then full address). */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Address
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoField
                  icon={<MapPinned size={14} />}
                  label="State"
                  value={formData.state}
                />
                <InfoField
                  icon={<MapPinned size={14} />}
                  label="City"
                  value={formData.city}
                />
                <InfoField
                  icon={<MapPinned size={14} />}
                  label="Pincode"
                  value={formData.zip}
                />
              </div>
              <div className="mt-4">
                <InfoField
                  icon={<Home size={14} />}
                  label="Address"
                  value={formData.residential_address}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 2 — Industry / Designation / Skills. Edit icon switches this
          card into inline editing; Save/Cancel sit at the bottom. */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 w-full max-w-7xl"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-green-50 to-white flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase size={20} className="text-green-600" />
            Industry &amp; Designation
          </h3>
          {editingSection !== "professional" && (
            <CardEditButton onClick={startEditingProfessional} />
          )}
        </div>
        <div className="p-6">
          {editingSection === "professional" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField icon={<Building2 size={14} />} label="Industry (optional)">
                  <PickerDropdown
                    dropdownRef={industryDropdownRef}
                    open={showIndustryDropdown}
                    onToggleOpen={() => setShowIndustryDropdown((o) => !o)}
                    placeholder={
                      industries.find(
                        (i) => String(i.id) === String(professionalDraft.industry_id),
                      )?.name || "Select industry"
                    }
                    items={industries.map((i) => ({
                      id: i.id,
                      name: i.name,
                      image: i.image_url,
                    }))}
                    isSelected={(item) =>
                      String(item.id) === String(professionalDraft.industry_id)
                    }
                    onPick={(item) => {
                      // Switching (or clearing) industry re-scopes which
                      // designations are on offer, so a designation picked
                      // under the old scope shouldn't silently carry over —
                      // clear both it and the dependent skill selection.
                      setProfessionalDraft((prev) => ({
                        ...prev,
                        industry_id:
                          String(prev.industry_id) === String(item.id)
                            ? ""
                            : item.id,
                        designation_ids: [],
                        skills: [],
                      }));
                      setShowIndustryDropdown(false);
                    }}
                    multi={false}
                  />
                </EditField>
                <EditField icon={<User size={14} />} label="Dress Size">
                  <select
                    className={fieldClass}
                    value={professionalDraft.dress_size}
                    onChange={(e) =>
                      setProfessionalDraft((prev) => ({
                        ...prev,
                        dress_size: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select size</option>
                    {DRESS_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </EditField>
              </div>

              <EditField
                icon={<Award size={14} />}
                label={`Designation * (up to ${MAX_DESIGNATIONS})`}
              >
                <PickerDropdown
                  dropdownRef={designationDropdownRef}
                  open={showDesignationDropdown}
                  onToggleOpen={() => setShowDesignationDropdown((o) => !o)}
                  placeholder={
                    professionalDraft.designation_ids.length > 0
                      ? `${professionalDraft.designation_ids.length} selected`
                      : `Select up to ${MAX_DESIGNATIONS} designations`
                  }
                  loading={designationOptionsLoading}
                  items={designationOptions.map((d) => ({
                    id: d.id,
                    name: d.name,
                    image: d.image_url,
                  }))}
                  isSelected={(item) =>
                    professionalDraft.designation_ids.includes(item.id)
                  }
                  onPick={(item) => toggleDraftDesignation(item.id)}
                  multi
                />
                <ChipsRow
                  items={designationOptions
                    .filter((d) =>
                      professionalDraft.designation_ids.includes(d.id),
                    )
                    .map((d) => ({ id: d.id, name: d.name, image: d.image_url }))}
                  onRemove={(item) => toggleDraftDesignation(item.id)}
                  emptyHint="No designations selected yet."
                />
              </EditField>

              <EditField icon={<Award size={14} />} label="Skills">
                <PickerDropdown
                  dropdownRef={skillDropdownRef}
                  open={showSkillDropdown}
                  onToggleOpen={() => setShowSkillDropdown((o) => !o)}
                  placeholder={
                    professionalDraft.skills.length > 0
                      ? `${professionalDraft.skills.length} selected`
                      : "Select your skills"
                  }
                  loading={skillOptionsLoading}
                  items={skillOptions.map((s) => ({
                    id: s.id,
                    name: s.name,
                    image: s.skill_image_url || s.image_url || s.skill_image,
                  }))}
                  isSelected={(item) =>
                    professionalDraft.skills.some((s) => s.id === item.id)
                  }
                  onPick={(item) =>
                    toggleDraftSkill(skillOptions.find((s) => s.id === item.id))
                  }
                  multi
                  disabledReason={
                    professionalDraft.designation_ids.length === 0
                      ? "Select a designation first"
                      : undefined
                  }
                />
                <ChipsRow
                  items={professionalDraft.skills.map((s) => ({
                    id: s.id,
                    name: s.name,
                    image: s.skill_image_url || s.image_url || s.skill_image,
                  }))}
                  onRemove={(item) =>
                    toggleDraftSkill(
                      professionalDraft.skills.find((s) => s.id === item.id),
                    )
                  }
                  emptyHint={
                    professionalDraft.designation_ids.length > 0
                      ? "No skills selected yet."
                      : undefined
                  }
                />
              </EditField>

              <EditActions
                onCancel={cancelEditing}
                onSave={saveProfessional}
                saving={savingSection}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField
                  icon={<Building2 size={14} />}
                  label="Industry"
                  value={formData.industry}
                />
                {formData.dress_size && (
                  <InfoField
                    icon={<User size={14} />}
                    label="Dress Size"
                    value={formData.dress_size}
                  />
                )}
                {formData.work_experience && (
                  <InfoField
                    icon={<Calendar size={14} />}
                    label="Work Experience"
                    value={`${formData.work_experience} years`}
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Award size={14} />
                  <span>Designation</span>
                </div>
                {formData.designations?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.designations.map((designation, idx) => (
                      <span
                        key={designation?.id ?? idx}
                        className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-medium"
                      >
                        <Thumb
                          image={designation?.image_url}
                          name={designation?.name}
                          size={36}
                        />
                        {designation?.name || designation}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                    {formData.designation || "-"}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Award size={18} className="text-green-600" />
                  <span className="font-semibold text-sm">Skills</span>
                </div>
                {formData.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={skill?.id ?? idx}
                        className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-medium"
                      >
                        <Thumb
                          image={
                            skill?.skill_image_url ||
                            skill?.image_url ||
                            skill?.skill_image
                          }
                          name={skill?.name}
                          size={36}
                        />
                        {skill?.name || skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card 3 — Bank Details. Edit icon switches this card into inline
          editing; Save/Cancel sit at the bottom. */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 w-full max-w-7xl"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-emerald-600" />
            Bank Details
          </h3>
          {editingSection !== "bank" && (
            <CardEditButton onClick={startEditingBank} />
          )}
        </div>
        <div className="p-6">
          {editingSection === "bank" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField icon={<User size={14} />} label="Account Holder Name">
                  <input
                    type="text"
                    className={fieldClass}
                    value={bankDraft.account_holder_name}
                    onChange={(e) =>
                      setBankDraft((prev) => ({
                        ...prev,
                        account_holder_name: e.target.value,
                      }))
                    }
                  />
                </EditField>
                <EditField icon={<CreditCard size={14} />} label="Account Type">
                  <select
                    className={fieldClass}
                    value={bankDraft.account_type}
                    onChange={(e) =>
                      setBankDraft((prev) => ({
                        ...prev,
                        account_type: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                </EditField>
                <EditField icon={<CreditCard size={14} />} label="Account Number">
                  <input
                    type="text"
                    className={fieldClass}
                    value={bankDraft.account_number}
                    onChange={(e) =>
                      setBankDraft((prev) => ({
                        ...prev,
                        account_number: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                  />
                </EditField>
                <EditField icon={<Hash size={14} />} label="IFSC Code">
                  <input
                    type="text"
                    className={fieldClass}
                    value={bankDraft.ifsc_code}
                    onChange={(e) =>
                      setBankDraft((prev) => ({
                        ...prev,
                        ifsc_code: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </EditField>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="font-semibold text-sm">
                    Statutory Details
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <EditField icon={<FileText size={14} />} label="PAN Number">
                    <input
                      type="text"
                      maxLength={10}
                      className={fieldClass}
                      value={bankDraft.pan_number}
                      onChange={(e) =>
                        setBankDraft((prev) => ({
                          ...prev,
                          pan_number: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                  </EditField>
                  <EditField icon={<Hash size={14} />} label="UAN Number">
                    <input
                      type="text"
                      maxLength={12}
                      className={fieldClass}
                      value={bankDraft.uan_number}
                      onChange={(e) =>
                        setBankDraft((prev) => ({
                          ...prev,
                          uan_number: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </EditField>
                  <EditField icon={<Hash size={14} />} label="ESIC Number">
                    <input
                      type="text"
                      className={fieldClass}
                      value={bankDraft.esic_number}
                      onChange={(e) =>
                        setBankDraft((prev) => ({
                          ...prev,
                          esic_number: e.target.value,
                        }))
                      }
                    />
                  </EditField>
                </div>
              </div>

              <EditActions
                onCancel={cancelEditing}
                onSave={saveBank}
                saving={savingSection}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <BanknoteIcon size={14} />
                  <span>Payment Method</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    Bank Transfer
                  </span>
                </div>
              </div>

              {hasBankDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Building size={18} className="text-emerald-600" />
                    <span className="font-semibold text-sm">
                      Bank Account Details
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField
                      icon={<CreditCard size={14} />}
                      label="Account Number"
                      value={
                        formData.account_number
                          ? `****${formData.account_number.slice(-4)}`
                          : ""
                      }
                    />
                    <InfoField
                      icon={<Hash size={14} />}
                      label="IFSC Code"
                      value={formData.ifsc_code}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    No bank accounts linked
                  </p>
                  <button
                    type="button"
                    onClick={startEditingBank}
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Add account details
                  </button>
                </div>
              )}

              {/* Statutory details — grouped here to mirror the registration
                  wizard, which collects PAN/UAN/ESIC together on the banking step. */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="font-semibold text-sm">
                    Statutory Details
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoField
                    icon={<FileText size={14} />}
                    label="PAN Number"
                    value={maskValue(formData.pan_number)}
                  />
                  <InfoField
                    icon={<Hash size={14} />}
                    label="UAN Number"
                    value={formData.uan_number || "Not provided"}
                  />
                  <InfoField
                    icon={<Hash size={14} />}
                    label="ESIC Number"
                    value={maskValue(formData.esic_number) || "Not provided"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkerProfile;
