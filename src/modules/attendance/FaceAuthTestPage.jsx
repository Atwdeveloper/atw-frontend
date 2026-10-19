import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import FaceScanner from "./FaceScanner";
import { resolveEnrollResult } from "../../common/utils/faceErrors";

const STORAGE_KEY = "faceAuthTestPage.config";

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

const DEFAULT_ENDPOINT = `${API_BASE_URL}/admin/face-test/enroll`;

// /admin/face-test/enroll takes no auth and needs worker_id alongside the
// image, so that's pre-populated as the one extra field testers need to fill.
const defaultConfig = {
  endpoint: DEFAULT_ENDPOINT,
  fieldName: "image",
  extraFields: [{ key: "worker_id", value: "" }],
};

// Standalone, unauthenticated test route for validating a Laravel/atwface
// face-auth endpoint end-to-end — liveness + anti-spoofing are already fully
// implemented client-side in FaceScanner.jsx (blink/head-turn challenges,
// bezel/flicker/texture spoof checks); this page just wraps it with a
// configurable "send the captured image here" harness plus a response viewer,
// so a new endpoint can be tried without touching any code.
const FaceAuthTestPage = () => {
  const [config, setConfig] = useState(() => {
    const stored = loadStoredConfig() || {};
    return {
      ...defaultConfig,
      ...stored,
      // A blank endpoint saved from an earlier session shouldn't shadow the
      // known default; an explicitly-set custom endpoint still wins.
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

  const recordAttempt = (attempt) => {
    setAttempts((prev) => [attempt, ...prev].slice(0, 20));
  };

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

    try {
      const response = await axios.post(cfg.endpoint, formData, { headers });
      const body = response.data;
      const resolved = resolveEnrollResult(body);

      recordAttempt({
        id: startedAt.getTime(),
        time: startedAt,
        previewUrl,
        endpoint: cfg.endpoint,
        httpStatus: response.status,
        ok: resolved.success,
        issues: resolved.issues,
        message: resolved.message,
        serverMessage: resolved.serverMessage,
        raw: body,
      });

      if (!resolved.success) {
        return {
          success: false,
          // FaceScanner's inline error box shows one message — combine every
          // issue so nothing gets silently dropped there.
          message: resolved.issues.map((issue) => issue.message).join(" "),
          retryable: resolved.retryable,
        };
      }
      setShowScanner(false);
      return { success: true };
    } catch (err) {
      const resolved = resolveEnrollResult(err);
      recordAttempt({
        id: startedAt.getTime(),
        time: startedAt,
        previewUrl,
        endpoint: cfg.endpoint,
        httpStatus: err?.response?.status ?? null,
        ok: false,
        issues: resolved.issues,
        message: resolved.message,
        serverMessage: resolved.serverMessage,
        raw: err?.response?.data ?? { error: err.message },
      });
      return {
        success: false,
        message: resolved.issues.map((issue) => issue.message).join(" "),
        retryable: resolved.retryable,
      };
    }
  };

  const latest = attempts[0];
  const missingWorkerId = config.extraFields.some(
    (f) => f.key.trim() === "worker_id" && !f.value.trim(),
  );
  const canScan = config.endpoint.trim().length > 0 && !missingWorkerId;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Face Auth API Tester
            </h1>
            <p className="text-sm text-slate-500">
              Capture a live, liveness-checked, anti-spoof-verified face and
              send it straight to any endpoint you're testing.
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
                placeholder="https://your-laravel-domain.com/api/worker/verify-face"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400">
                Full absolute URL. The captured photo is POSTed here as
                multipart/form-data.
              </p>
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400">
                No authentication is sent — this endpoint doesn't require it.
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
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
                >
                  <Plus size={14} /> Add field
                </button>
              </div>
              {config.extraFields.length === 0 && (
                <p className="text-xs text-gray-400">
                  Add key/value pairs the endpoint needs alongside the image
                  (e.g. worker_id).
                </p>
              )}
              {config.extraFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) =>
                      updateExtraField(index, { key: e.target.value })
                    }
                    placeholder="key"
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      updateExtraField(index, { value: e.target.value })
                    }
                    placeholder="value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <Camera size={18} />
              Start Face Scan
            </button>
            {!canScan && (
              <p className="text-xs text-center text-amber-600">
                {config.endpoint.trim().length === 0
                  ? "Enter an endpoint URL to enable the scanner."
                  : "Enter a worker_id to enable the scanner."}
              </p>
            )}
          </div>

          {/* Latest response */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Latest Response
            </h2>

            {!latest ? (
              <div className="flex flex-col items-center justify-center text-center py-14 text-gray-400">
                <Send size={28} className="mb-2" />
                <p className="text-sm">
                  Run a scan to see the request result here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={latest.previewUrl}
                    alt="Captured face"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        latest.ok
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {latest.ok ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {latest.ok ? "Success" : "Failed"}
                      {latest.httpStatus != null && ` · HTTP ${latest.httpStatus}`}
                    </div>
                    {/* Lead with the backend's own wording, then list the
                        per-reason detail underneath it. */}
                    <p
                      className={`text-sm mt-1 ${
                        latest.serverMessage
                          ? "font-medium text-slate-800"
                          : "text-slate-700"
                      }`}
                    >
                      {latest.serverMessage || latest.message}
                    </p>
                    {!latest.ok && latest.issues?.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
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
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 font-medium">
                    Raw response JSON
                  </summary>
                  <pre className="mt-2 max-h-56 overflow-auto bg-gray-900 text-gray-100 text-xs rounded-lg p-3 whitespace-pre-wrap break-all">
                    {JSON.stringify(latest.raw, null, 2)}
                  </pre>
                </details>
              </div>
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
              {attempts.slice(1).map((attempt) => (
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
                      {attempt.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {attempt.time.toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      attempt.ok
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {attempt.ok ? "OK" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showScanner && (
        <FaceScanner
          onCapture={handleCapture}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default FaceAuthTestPage;
