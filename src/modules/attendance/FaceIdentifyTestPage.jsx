import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Camera,
  UserCheck,
  UserX,
  Users,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Clock,
  ScanFace,
  Send,
} from "lucide-react";
import FaceScanner from "./FaceScanner";
import {
  resolveIdentifyResult,
  IDENTIFY_OUTCOMES,
} from "../../common/utils/faceErrors";

const STORAGE_KEY = "faceIdentifyTestPage.config";

const loadStoredConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Mirrors axiosInstance.js's baseURL resolution, minus any trailing slash,
// so the default endpoint below joins cleanly with a single "/".
const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "https://anytimework.in/anytimework/public/api/"
).replace(/\/+$/, "");

const DEFAULT_ENDPOINT = `${API_BASE_URL}/admin/face-test/identify`;

// Identify sends nothing but the image — no auth, no search-pool narrowing.
const defaultConfig = {
  endpoint: DEFAULT_ENDPOINT,
  fieldName: "image",
  extraFields: [],
};

// similarity may come back 0-1 or 0-100 depending on how the service scores —
// show a percentage for the former, the raw score for the latter.
const formatSimilarity = (value) => {
  if (typeof value !== "number") return null;
  return value <= 1 ? `${(value * 100).toFixed(1)}%` : value.toFixed(2);
};

// Bar length for the candidate list, normalised whichever scale is in use.
const similarityFraction = (value) => {
  if (typeof value !== "number") return 0;
  const fraction = value <= 1 ? value : value / 100;
  return Math.max(0, Math.min(1, fraction));
};

const formatNumber = (value, digits = 1) =>
  typeof value === "number" ? value.toFixed(digits) : null;

// Small label/value pair. Values stay in ink tokens — colour lives on the
// marks, never on the text.
const Stat = ({ label, value, hint }) => {
  if (value === null || value === undefined) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
};

// One row of the ranked candidate list: a thin bar (green when it's the
// accepted match, recessive slate otherwise) with the score labelled at the
// tip, so identity never rests on colour alone.
const CandidateRow = ({ candidate, isMatch, threshold }) => {
  const fraction = similarityFraction(candidate.similarity);
  const thresholdFraction =
    typeof threshold === "number" ? similarityFraction(threshold) : null;
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs text-slate-500 tabular-nums">
        id {String(candidate.id)}
      </span>
      <div className="relative flex-1 h-2 rounded-sm bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded-r"
          style={{
            width: `${fraction * 100}%`,
            backgroundColor: isMatch ? "#16a34a" : "#64748b",
          }}
        />
        {thresholdFraction !== null && (
          <div
            className="absolute inset-y-[-3px] w-px bg-slate-400"
            style={{ left: `${thresholdFraction * 100}%` }}
            title={`threshold ${formatSimilarity(threshold)}`}
          />
        )}
      </div>
      <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-700 tabular-nums">
        {formatSimilarity(candidate.similarity)}
      </span>
      <span className="w-14 shrink-0 text-[11px] text-slate-400">
        {isMatch ? "matched" : ""}
      </span>
    </div>
  );
};

const OUTCOME_UI = {
  [IDENTIFY_OUTCOMES.MATCH]: {
    label: "Match",
    icon: UserCheck,
    card: "border-green-200 bg-green-50",
    accent: "text-green-700",
    iconWrap: "bg-green-100 text-green-700",
    badge: "bg-green-50 text-green-700",
  },
  [IDENTIFY_OUTCOMES.AMBIGUOUS]: {
    label: "Ambiguous",
    icon: Users,
    card: "border-amber-200 bg-amber-50",
    accent: "text-amber-800",
    iconWrap: "bg-amber-100 text-amber-700",
    badge: "bg-amber-50 text-amber-700",
  },
  [IDENTIFY_OUTCOMES.NO_MATCH]: {
    label: "No match",
    icon: UserX,
    card: "border-slate-200 bg-slate-50",
    accent: "text-slate-700",
    iconWrap: "bg-slate-200 text-slate-600",
    badge: "bg-slate-100 text-slate-600",
  },
  [IDENTIFY_OUTCOMES.CHECK_FAILED]: {
    label: "Retake photo",
    icon: AlertTriangle,
    card: "border-red-200 bg-red-50",
    accent: "text-red-700",
    iconWrap: "bg-red-100 text-red-700",
    badge: "bg-red-50 text-red-700",
  },
  [IDENTIFY_OUTCOMES.ERROR]: {
    label: "Error",
    icon: XCircle,
    card: "border-red-200 bg-red-50",
    accent: "text-red-700",
    iconWrap: "bg-red-100 text-red-700",
    badge: "bg-red-50 text-red-700",
  },
};

// Standalone test route for the 1:N /admin/face-test/identify endpoint — the
// one real attendance scanning will use. Liveness + anti-spoofing run
// client-side in FaceScanner.jsx before a single frame is uploaded; this page
// wraps that with the search-pool config and, crucially, keeps the three
// "no match" outcomes visually distinct (ambiguous vs genuinely-not-enrolled
// vs unusable photo) instead of collapsing them into one dead end.
const FaceIdentifyTestPage = () => {
  const [config, setConfig] = useState(() => {
    const stored = loadStoredConfig() || {};
    return {
      ...defaultConfig,
      ...stored,
      endpoint: stored.endpoint || DEFAULT_ENDPOINT,
    };
  });
  const [showScanner, setShowScanner] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateField = (key, value) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const addExtraField = () =>
    setConfig((prev) => ({
      ...prev,
      extraFields: [...prev.extraFields, { key: "", value: "" }],
    }));

  const updateExtraField = (index, patch) =>
    setConfig((prev) => ({
      ...prev,
      extraFields: prev.extraFields.map((f, i) =>
        i === index ? { ...f, ...patch } : f,
      ),
    }));

  const removeExtraField = (index) =>
    setConfig((prev) => ({
      ...prev,
      extraFields: prev.extraFields.filter((_, i) => i !== index),
    }));

  const recordAttempt = (attempt) =>
    setAttempts((prev) => [attempt, ...prev].slice(0, 20));

  const handleCapture = async (blob) => {
    const cfg = configRef.current;
    const previewUrl = URL.createObjectURL(blob);
    const startedAt = new Date();

    const formData = new FormData();
    formData.append(cfg.fieldName || "image", blob, "face.jpg");
    cfg.extraFields.forEach(({ key, value }) => {
      if (key) formData.append(key, value);
    });

    const headers = { "Content-Type": "multipart/form-data" };

    const finish = (resolved, httpStatus, raw) => {
      recordAttempt({
        id: startedAt.getTime(),
        time: startedAt,
        previewUrl,
        httpStatus,
        raw,
        ...resolved,
      });

      if (resolved.outcome === IDENTIFY_OUTCOMES.MATCH) {
        setShowScanner(false);
        return { success: true };
      }
      // FaceScanner's inline error box takes a single string, so fold the
      // headline, guidance and any photo issues into one message there.
      const detail = resolved.issues.map((issue) => issue.message).join(" ");
      return {
        success: false,
        message: `${resolved.title}. ${detail || resolved.message}`,
        retryable: resolved.retryable,
      };
    };

    try {
      const response = await axios.post(cfg.endpoint, formData, { headers });
      return finish(
        resolveIdentifyResult(response.data),
        response.status,
        response.data,
      );
    } catch (err) {
      return finish(
        resolveIdentifyResult(err),
        err?.response?.status ?? null,
        err?.response?.data ?? { error: err.message },
      );
    }
  };

  const latest = attempts[0];
  const canScan = config.endpoint.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <ScanFace size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Face Identify Tester <span className="text-slate-400">(1:N)</span>
            </h1>
            <p className="text-sm text-slate-500">
              Capture one live, liveness-checked frame and ask the service who
              it is out of everyone enrolled.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Config panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Endpoint Configuration
            </h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Endpoint URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.endpoint}
                onChange={(e) => updateField("endpoint", e.target.value)}
                placeholder={DEFAULT_ENDPOINT}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Image Field Name
              </label>
              <input
                type="text"
                value={config.fieldName}
                onChange={(e) => updateField("fieldName", e.target.value)}
                placeholder="image"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-xs text-gray-400">
                Only the image is sent — no auth, and the whole enrolled set is
                searched.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Extra Form Fields (optional)
                </label>
                <button
                  type="button"
                  onClick={addExtraField}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium"
                >
                  <Plus size={14} /> Add field
                </button>
              </div>
              {config.extraFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) =>
                      updateExtraField(index, { key: e.target.value })
                    }
                    placeholder="key"
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      updateExtraField(index, { value: e.target.value })
                    }
                    placeholder="value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraField(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!canScan}
              onClick={() => setShowScanner(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition ${
                canScan
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <Camera size={18} />
              Scan & Identify
            </button>
            {!canScan && (
              <p className="text-xs text-center text-amber-600">
                Enter an endpoint URL to enable the scanner.
              </p>
            )}
          </div>

          {/* Latest result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Latest Result
            </h2>

            {!latest ? (
              <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
                <Send size={28} className="mb-2" />
                <p className="text-sm">
                  Run a scan to see who the service matched.
                </p>
              </div>
            ) : (
              (() => {
                const ui = OUTCOME_UI[latest.outcome] || OUTCOME_UI.error;
                const OutcomeIcon = ui.icon;
                const similarity = formatSimilarity(latest.similarity);
                const details = latest.details || {
                  worker: null,
                  topMatches: [],
                  quality: null,
                  liveness: null,
                };
                return (
                  <div className="space-y-3">
                    <div
                      className={`flex items-start gap-3 border rounded-xl p-4 ${ui.card}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ui.iconWrap}`}
                      >
                        <OutcomeIcon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold ${ui.accent}`}>
                          {latest.title}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {latest.message}
                        </p>

                        {latest.issues.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {latest.issues.map((issue, i) => (
                              <li
                                key={`${issue.code}-${i}`}
                                className="flex items-start gap-1.5 text-sm text-slate-700"
                              >
                                <XCircle
                                  size={14}
                                  className="text-red-500 mt-0.5 shrink-0"
                                />
                                <span>
                                  {issue.message}{" "}
                                  <span className="text-xs text-gray-400">
                                    ({issue.code})
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Who it matched — the headline answer */}
                    {latest.outcome === IDENTIFY_OUTCOMES.MATCH && (
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                        <img
                          src={latest.previewUrl}
                          alt="Captured face"
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xl font-semibold text-slate-900 truncate">
                            {details.worker?.worker_name || `Worker ${latest.matchedId}`}
                          </p>
                          <p className="text-sm text-slate-500">
                            {details.worker?.worker_code
                              ? `${details.worker.worker_code} · id ${latest.matchedId}`
                              : `id ${latest.matchedId}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* How it got there — the numbers behind the verdict */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Stat label="Similarity" value={similarity} />
                      <Stat
                        label="Runner-up"
                        value={formatSimilarity(details.runnerUpSimilarity)}
                      />
                      <Stat
                        label="Threshold"
                        value={formatSimilarity(details.threshold)}
                      />
                      <Stat
                        label="Margin"
                        value={formatSimilarity(details.margin)}
                      />
                      <Stat
                        label="Candidates"
                        value={
                          details.candidatesConsidered != null
                            ? String(details.candidatesConsidered)
                            : null
                        }
                      />
                      <Stat
                        label="Liveness"
                        value={
                          details.liveness
                            ? details.liveness.is_live === false
                              ? "Not live"
                              : "Live"
                            : null
                        }
                        hint={
                          formatSimilarity(details.liveness?.confidence)
                            ? `confidence ${formatSimilarity(details.liveness.confidence)}`
                            : null
                        }
                      />
                    </div>

                    {/* Ranked candidates — single measure, so no legend; the
                        accepted one is green and also labelled "matched". */}
                    {details.topMatches.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Top matches by similarity
                        </p>
                        <div className="space-y-1.5">
                          {details.topMatches.map((candidate, i) => (
                            <CandidateRow
                              key={`${candidate.id}-${i}`}
                              candidate={candidate}
                              threshold={details.threshold}
                              isMatch={
                                latest.outcome === IDENTIFY_OUTCOMES.MATCH &&
                                String(candidate.id) === String(latest.matchedId)
                              }
                            />
                          ))}
                        </div>
                        {details.threshold != null && (
                          <p className="text-[11px] text-slate-400">
                            Vertical rule marks the accept threshold (
                            {formatSimilarity(details.threshold)}).
                          </p>
                        )}
                      </div>
                    )}

                    {/* Capture quality the service measured */}
                    {details.quality && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Photo quality
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <Stat
                            label="Face width"
                            value={
                              details.quality.face_width_px != null
                                ? `${details.quality.face_width_px} px`
                                : null
                            }
                          />
                          <Stat
                            label="Sharpness"
                            value={formatNumber(details.quality.sharpness)}
                          />
                          <Stat
                            label="Brightness"
                            value={formatNumber(details.quality.brightness)}
                          />
                          <Stat
                            label="Acceptable"
                            value={
                              details.quality.is_acceptable === false
                                ? "No"
                                : details.quality.is_acceptable === true
                                  ? "Yes"
                                  : null
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {latest.outcome !== IDENTIFY_OUTCOMES.MATCH && (
                        <img
                          src={latest.previewUrl}
                          alt="Captured face"
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <span className="text-xs text-gray-400">
                        {latest.httpStatus != null &&
                          `HTTP ${latest.httpStatus} · `}
                        {latest.time.toLocaleTimeString()}
                      </span>
                    </div>

                    <details className="text-sm">
                      <summary className="cursor-pointer text-indigo-600 font-medium">
                        Raw response JSON
                      </summary>
                      <pre className="mt-2 max-h-56 overflow-auto bg-gray-900 text-gray-100 text-xs rounded-lg p-3 whitespace-pre-wrap break-all">
                        {JSON.stringify(latest.raw, null, 2)}
                      </pre>
                    </details>
                  </div>
                );
              })()
            )}
          </div>
        </div>

        {/* History */}
        {attempts.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock size={16} /> Attempt History
            </h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {attempts.slice(1).map((attempt) => {
                const ui = OUTCOME_UI[attempt.outcome] || OUTCOME_UI.error;
                const similarity = formatSimilarity(attempt.similarity);
                return (
                  <div
                    key={attempt.id}
                    className="flex items-center gap-3 border border-gray-100 rounded-lg p-2.5"
                  >
                    <img
                      src={attempt.previewUrl}
                      alt="Captured face"
                      className="w-10 h-10 rounded object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">
                        {attempt.title}
                        {attempt.matchedId != null &&
                          ` — ${attempt.details?.worker?.worker_name || `worker_id ${attempt.matchedId}`}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {attempt.time.toLocaleTimeString()}
                        {similarity && ` · similarity ${similarity}`}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${ui.badge}`}
                    >
                      {ui.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showScanner && (
        <FaceScanner
          onCapture={handleCapture}
          onClose={() => setShowScanner(false)}
          // Recognition, not enrolment: capture as soon as the face is framed.
          challenge={false}
          labels={{
            submitting: "Identifying…",
            success: "Identified ✓",
            failure: "Could not identify this face. Please try again.",
          }}
        />
      )}
    </div>
  );
};

export default FaceIdentifyTestPage;
