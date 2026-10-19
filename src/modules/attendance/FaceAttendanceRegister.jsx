import { useState, useCallback, useEffect, useRef } from "react";
import FaceScanner from "./FaceScanner";
import axiosInstance from "../../api/axiosInstance"; 

export default function FaceAttendanceRegister() {
  const [workers, setWorkers] = useState([]); 
  const [loadingList, setLoadingList] = useState(true); 
  const [selectedWorker, setSelectedWorker] = useState(null); 
  const [scanScreen, setScanScreen] = useState("idle"); 
  const [apiMessage, setApiMessage] = useState("");
  const [countdown, setCountdown] = useState(4); // Dynamic counter for screen tracking

  const refreshTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // 🔊 AUTOMATED HINDI AUDIO LOGIC: Dynamic Identity Mapping with Static Translation
  const triggerVoiceAlert = (status, payload = {}) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any overlapping audio streams
      
      let textMessage = "";
      const workerName = payload.workerName ? payload.workerName.trim() : "वर्कर";
      const companyName = payload.companyName ? payload.companyName.trim() : "कंपनी";

      // Precise bilingual tone matching both labor forces and corporate staff
      if (status === "success") {
        textMessage = `धन्यवाद ${workerName}, ${companyName} में आपका चेहरा सफलतापूर्वक रजिस्टर हो गया है।`;
      } else if (status === "error") {
        textMessage = `चेहरा मैच नहीं हुआ। कृपया स्क्रीन के सामने सीधे होकर दोबारा कोशिश करें।`;
      } else {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textMessage);
      
      utterance.rate = 1.2;     // Clear and perfectly optimized speed for clear understanding
      utterance.pitch = 1.05;    // Enhanced softer/sweeter tone pitch calibration
      utterance.lang = 'hi-IN';  // Strict Indian Accent Localized Channel

      const voices = window.speechSynthesis.getVoices();
      const sweetHindiVoice = voices.find(voice => 
        (voice.lang.includes('hi-IN') || voice.lang.includes('hi_IN')) && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Swara') || voice.name.includes('Female'))
      );

      if (sweetHindiVoice) {
        utterance.voice = sweetHindiVoice;
      } else {
        // Core baseline fallback channel
        utterance.voice = voices.find(v => v.lang.startsWith('hi')) || voices[0];
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Fetch Dynamic Workers List from Laravel Backend Layer
  const fetchWorkers = useCallback(async () => {
    setLoadingList(true);
    try {
      const response = await axiosInstance.get("/company/get-workersembediing");
      const fetchedData = response.data?.data?.data || response.data?.data || [];
      setWorkers(fetchedData);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [fetchWorkers]);

  // Handle Face Capture and Upload (OPTIMIZED: Zero background fetch lag overrides)
  const handleFaceCapture = useCallback(async (imageBlob) => {
    if (!selectedWorker) return;
    
    setScanScreen("loading");
    setApiMessage("");

    try {
      const formData = new FormData();
      formData.append("file", imageBlob, `worker_${selectedWorker.worker_id}.jpg`);

      const response = await axiosInstance.post(
        `/company/registerworkerfaceembedding/${selectedWorker.worker_id}`,
        formData
      );

      const data = response.data;

      if (!data.status) {
        throw new Error(data.message || "Failed to register face array");
      }

      const finalWorkerName = data.worker_first_name || selectedWorker.worker?.first_name || "Staff";
      const finalCompanyName = data.company_name || "Your Company";

      setApiMessage(`धन्यवाद ${finalWorkerName}, ${finalCompanyName} में आपका चेहरा रजिस्टर हो गया है!`);
      setScanScreen("success");
      setCountdown(4); // Extended safety delay window buffer to 4 seconds

      // 🔊 TRIGGER THE SPEECH ENGINE LOGIC INSTANTLY
      triggerVoiceAlert("success", {
        workerName: finalWorkerName,
        companyName: finalCompanyName
      });

      // STEP 1: Upgrading active local dataset smoothly (No manual tracking table flashes)
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) =>
          w.worker_id === selectedWorker.worker_id 
            ? { 
                ...w, 
                is_face_registered: true,
                worker_photo: data.photo_url || w.worker_photo
              } 
            : w
        )
      );

      // STEP 2: Running the 4-second UI sync display loop counter
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // STEP 3: Auto close console panel after complete sentence execution window
      refreshTimerRef.current = setTimeout(() => {
        clearInterval(countdownIntervalRef.current);
        setSelectedWorker(null); // Collapsing the right side screen panel
        setScanScreen("idle");
      }, 4000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong";
      setApiMessage("रजिस्ट्रेशन असफल: कृपया दुबारा प्रयास करें।");
      setScanScreen("error");

      // 🔊 TRIGGER LIVENESS / SPOOFING ERROR CAPTURE VOICE
      triggerVoiceAlert("error");
    }
  }, [selectedWorker]); // Completely removed fetchWorkers dependency layout updates

  const openScanner = (worker) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSelectedWorker(worker);
    setScanScreen("scanning");
  };

  const closeScanner = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSelectedWorker(null);
    setScanScreen("idle");
    setApiMessage("");
  };

  return (
    <div style={styles.container}>
      {/* Left Side: Dynamic Table Grid Directory View */}
      <div style={styles.directorySection}>
        <div style={styles.header}>
          <h2>Worker Face Management</h2>
          <p>Register or re-upload biometrics embeddings for corporate access logs</p>
        </div>

        {loadingList ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <div style={styles.loader}></div>
            <p style={{ color: "#4b5563" }}>Loading synchronized workers records...</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee Profile</th>
                  <th style={styles.th}>Vacancy Designation</th>
                  <th style={styles.th}>Biometric Status</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                      No joined active workers database found.
                    </td>
                  </tr>
                ) : (
                  workers.map((item) => {
                    const workerData = item.worker;
                    const vacancyData = item.vacancy;
                    const isRegistered = item.is_face_registered; 
                    const imageSource = item.worker_photo; 

                    return (
                      <tr key={item.application_id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.workerInfo}>
                            {imageSource ? (
                              <img 
                                src={imageSource} 
                                alt="Worker Profile" 
                                style={{
                                  ...styles.avatarImage,
                                  borderColor: isRegistered ? "#4fb848" : "#f37023"
                                }} 
                                onError={(e) => { 
                                  e.target.style.display = 'none'; 
                                  const fallbackNode = e.target.nextSibling;
                                  if(fallbackNode) fallbackNode.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            
                            <div
                              className="fallback-avatar"
                              style={{
                                ...styles.avatarCircle,
                                display: imageSource ? "none" : "flex",
                                borderColor: isRegistered ? "#4fb848" : "#f37023",
                              }}
                            >
                              {workerData?.first_name ? workerData.first_name.charAt(0) : "W"}
                            </div>

                            <div>
                              <div style={styles.workerName}>
                                {`${workerData?.first_name || ""} ${workerData?.last_name || ""}`}
                              </div>
                              <div style={styles.workerId}>Code: {workerData?.worker_code || "N/A"}</div>
                            </div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <div style={{ fontWeight: "500" }}>{vacancyData?.designation_name || "General Staff"}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>Shift: {vacancyData?.shift_start_time || "09:00"}</div>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              background: isRegistered ? "#e6f4ea" : "#fff3cd",
                              color: isRegistered ? "#4fb848" : "#d97706",
                            }}
                          >
                            ● {isRegistered ? "Registered" : "Pending Face"}
                          </span>
                        </td>

                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <button
                            style={{ 
                              ...styles.actionBtn, 
                              ...(isRegistered ? styles.replaceBtn : styles.registerBtn) 
                            }}
                            onClick={() => openScanner(item)}
                          >
                            {isRegistered ? "Replace Face" : "Register Face"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Side Sidebar: Interactive Controls Panel Console */}
      {selectedWorker && (
        <div style={styles.scannerSidebar}>
          <div style={styles.sidebarHeader}>
            <h3>Face Enrollment</h3>
            <button style={styles.closeBtn} onClick={closeScanner}>✕</button>
          </div>
          
          <div style={styles.focusedWorkerBox}>
            {selectedWorker.worker_photo ? (
              <img src={selectedWorker.worker_photo} alt="Preview" style={styles.sidebarAvatarImg} />
            ) : (
              <div style={styles.sidebarAvatar}>
                {selectedWorker.worker?.first_name ? selectedWorker.worker.first_name.charAt(0) : "W"}
              </div>
            )}
            <h4>{`${selectedWorker.worker?.first_name || ""} ${selectedWorker.worker?.last_name || ""}`}</h4>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Emp ID: {selectedWorker.worker_id} • {selectedWorker.vacancy?.designation_name}
            </p>
          </div>

          <hr style={styles.divider} />

          <div style={styles.scannerConsole}>
            {scanScreen === "scanning" && (
              <FaceScanner onCapture={handleFaceCapture} onClose={closeScanner} />
            )}

            {scanScreen === "loading" && (
              <div style={styles.centerState}>
                <div style={styles.loader}></div>
                <h4 style={{ color: "#1f2937", margin: "10px 0 5px 0" }}>Processing Vectors...</h4>
                <p style={styles.subtext}>Uploading secure biometric mapping to cloud storage</p>
              </div>
            )}

            {scanScreen === "success" && (
              <div style={{ ...styles.centerState, color: "#4fb848" }}>
                <div style={styles.successIcon}>✓</div>
                <h4 style={{ fontSize: 18, fontWeight: "700", margin: "0 0 8px 0" }}>Face Registered Successfully!</h4>
                <p style={{ color: "#4b5563", fontSize: 14, lineHeight: "20px" }}>{apiMessage}</p>
                
                <div style={styles.refreshBadge}>
                  🔄 Closing enrollment console in <b>{countdown}s</b>...
                </div>
              </div>
            )}

            {scanScreen === "error" && (
              <div style={{ ...styles.centerState, color: "#f37023" }}>
                <div style={styles.errorIcon}>✕</div>
                <h4 style={{ fontSize: 17, fontWeight: "700", margin: "0 0 8px 0" }}>Registration Failed</h4>
                <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 15 }}>{apiMessage}</p>
                <button style={styles.doneBtn} onClick={() => setScanScreen("scanning")}>Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", background: "#ffffff", color: "#1f2937", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" },
  directorySection: { flex: 2, padding: "40px", background: "#ffffff" },
  header: { marginBottom: "30px" },
  tableWrapper: { background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "16px 20px", background: "#f1f5f9", color: "#475569", fontWeight: "600", fontSize: 14, borderBottom: "1px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "16px 20px", fontSize: 15, verticalAlign: "middle" },
  workerInfo: { display: "flex", alignItems: "center", gap: 12 },
  avatarImage: { width: 44, height: 44, borderRadius: "50%", border: "2px solid", objectFit: "cover" },
  avatarCircle: { width: 44, height: 44, borderRadius: "50%", border: "2px solid", background: "#f1f5f9", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  workerName: { fontWeight: "600" },
  workerId: { fontSize: 12, color: "#9ca3af" },
  statusBadge: { padding: "4px 12px", borderRadius: 50, fontSize: 12, fontWeight: "600", display: "inline-block" },
  actionBtn: { padding: "8px 16px", borderRadius: 6, border: "none", fontWeight: "600", fontSize: 13, cursor: "pointer" },
  registerBtn: { background: "#0071bc", color: "#ffffff" },
  replaceBtn: { background: "#e2e8f0", color: "#475569" },
  scannerSidebar: { flex: 1, minWidth: "380px", maxWidth: "450px", borderLeft: "1px solid #e2e8f0", background: "#f8fafc", padding: "30px", display: "flex", flexDirection: "column" },
  sidebarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" },
  focusedWorkerBox: { textAlign: "center", padding: "10px 0" },
  sidebarAvatar: { width: 65, height: 65, borderRadius: "50%", background: "#0071bc", color: "#fff", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: "bold" },
  sidebarAvatarImg: { width: 65, height: 65, borderRadius: "50%", objectFit: "cover", border: "2px solid #0071bc", margin: "0 auto", display: "block" },
  divider: { border: 0, borderTop: "1px solid #e2e8f0", margin: "20px 0" },
  scannerConsole: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  centerState: { textAlign: "center", padding: "10px" },
  loader: { width: 40, height: 40, border: "3px solid #cbd5e1", borderTopColor: "#0071bc", borderRadius: "50%", margin: "0 auto 15px auto", animation: "spin 0.8s linear infinite" },
  subtext: { fontSize: 13, color: "#6b7280", display: "block", marginTop: 5 },
  successIcon: { width: 48, height: 48, background: "#4fb848", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 15px auto" },
  errorIcon: { width: 48, height: 48, background: "#f37023", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 15px auto" },
  refreshBadge: { marginTop: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: 8, color: "#166534", fontSize: 13, display: "inline-block" },
  doneBtn: { marginTop: 12, padding: "8px 20px", background: "#1f2937", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "600" }
};