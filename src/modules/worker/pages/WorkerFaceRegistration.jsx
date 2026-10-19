import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {
  ScanFace,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import FaceScanner from "../../attendance/FaceScanner";
import { enrollWorkerFaceAPI } from "../../../api/worker/workerAuthAPI";
import { resolveEnrollResult } from "../../../common/utils/faceErrors";

const BENEFITS = [
  {
    icon: Zap,
    title: "Mark attendance in seconds",
    body: "Just look at the camera at your site — no paperwork, no queue.",
  },
  {
    icon: ShieldCheck,
    title: "Only you can use your account",
    body: "Your face stops anyone else marking attendance in your name.",
  },
  {
    icon: Clock,
    title: "Takes about 20 seconds",
    body: "One quick scan now and you're done for good.",
  },
];

// Optional last stop in worker registration (and the target of the dashboard
// reminder for anyone who skipped). Nothing else in the app is gated on it.
const WorkerFaceRegistration = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  const goToDashboard = () => navigate("/worker/dashboard", { replace: true });

  // The account already exists and the worker already has a token by the time
  // they reach this page, so there's nothing for the browser/device Back
  // button to usefully undo — send it to the dashboard instead of whatever
  // signup screen happens to sit behind this one in history.
  useEffect(() => {
    const handlePopState = () => goToDashboard();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async (blob) => {
    setError("");
    try {
      const response = await enrollWorkerFaceAPI(blob);
      const resolved = resolveEnrollResult(response?.data ?? response);

      if (!resolved.success) {
        setError(resolved.message);
        return {
          success: false,
          // Lead with the backend's own wording — it explains cases our
          // generic copy can't, like a face already tied to another account.
          message:
            resolved.serverMessage ||
            resolved.issues.map((issue) => issue.message).join(" ") ||
            resolved.message,
          retryable: resolved.retryable,
        };
      }

      // Keep the cookie in step so the dashboard reminder stops firing.
      try {
        const user = JSON.parse(Cookies.get("user") || "{}");
        Cookies.set(
          "user",
          JSON.stringify({ ...user, is_face_registered: true }),
          { expires: 7, path: "/", sameSite: "strict" },
        );
      } catch {
        /* a malformed cookie shouldn't fail a successful enrolment */
      }

      setShowScanner(false);
      setEnrolled(true);
      await Swal.fire({
        icon: "success",
        title: "Face verified",
        text: "You can now mark attendance just by looking at the camera.",
        timer: 2200,
        showConfirmButton: false,
      });
      goToDashboard();
      return { success: true };
    } catch (err) {
      const resolved = resolveEnrollResult(err);
      setError(resolved.message);
      return {
        success: false,
        message: resolved.issues.map((issue) => issue.message).join(" "),
        retryable: resolved.retryable,
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Verify Your Face
        </h1>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              {enrolled ? <CheckCircle size={30} /> : <ScanFace size={30} />}
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {enrolled ? "You're all set" : "One last optional step"}
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              {enrolled
                ? "Your face is registered. Taking you to your dashboard…"
                : "Register your face so you can mark attendance instantly at work. You can always do this later from your profile."}
            </p>
          </div>

          {!enrolled && (
            <>
              <div className="mt-8 space-y-4">
                {BENEFITS.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {title}
                      </p>
                      <p className="text-sm text-gray-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-6 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowScanner(true);
                  }}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <ScanFace size={18} />
                  Start Face Verification
                </button>
                <button
                  type="button"
                  onClick={goToDashboard}
                  className="w-full py-3 px-4 rounded-lg font-medium text-slate-600 border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-1"
                >
                  Skip for now <ChevronRight size={16} />
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Make sure you're in good light and alone in the frame.
              </p>
            </>
          )}
        </div>
      </div>

      {showScanner && (
        <FaceScanner
          onCapture={handleCapture}
          onClose={() => setShowScanner(false)}
          labels={{
            submitting: "Registering your face…",
            success: "Face registered ✓",
            failure: "We couldn't register that photo. Please try again.",
          }}
        />
      )}
    </div>
  );
};

export default WorkerFaceRegistration;
