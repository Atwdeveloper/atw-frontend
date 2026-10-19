import { useState, useCallback, useEffect, useRef } from "react";
import FaceScanner from "./faceScannerAttendance";
import axiosInstance from "../../api/axiosInstance"; 

export default function FaceAttendanceDashboard() {
  const [screen, setScreen] = useState("idle"); 
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  
  const autoResetTimer = useRef(null);

  // --- Attendance Configuration Form States ---
  const [vacancyId, setVacancyId] = useState(""); 
  const [attendanceType, setAttendanceType] = useState("daily"); 
  const [customTime, setCustomTime] = useState(""); 

  // Backend Synchronized States
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [kioskAction, setKioskAction] = useState("sign_in");

  // 🔊 CENTRAL HINDI SPEECH KIOSK UTILITY
  const triggerVoiceAlert = (status, customMessage = "", workerName = "") => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Prevents sound overlap queues
      
      let textMessage = "";
      const cleanName = workerName ? workerName.trim() : "";

      if (status === "success") {
        textMessage = `धन्यवाद ${cleanName}, आपकी अटेंडेंस सफलतापूर्वक लग गई है।`;
      } else if (status === "error") {
        // Agar response me custom textual hindi error hai (like already signed in), to use hi bol dega
        textMessage = customMessage || `चेहरा मैच नहीं हुआ। कृपया दोबारा प्रयास करें।`;
      } else {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textMessage);
      
      utterance.rate = 1.2;      // Clear and concise pacing rate
      utterance.pitch = 1.05;     // Softer pitch modulation scale
      utterance.lang = 'hi-IN';   // Standard Native Hindi channel configuration

      const voices = window.speechSynthesis.getVoices();
      const sweetHindiVoice = voices.find(voice => 
        (voice.lang.includes('hi-IN') || voice.lang.includes('hi_IN')) && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Swara') || voice.name.includes('Female'))
      );

      if (sweetHindiVoice) {
        utterance.voice = sweetHindiVoice;
      } else {
        utterance.voice = voices.find(v => v.lang.startsWith('hi')) || voices[0];
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Fetch Stats and Logs dynamically
  const fetchAttendanceData = useCallback(async (dateParam) => {
    setLoadingDashboard(true);
    try {
      const response = await axiosInstance.get(`/company/get-workerattendance`, {
        params: { date: dateParam }
      });
      if (response.data?.status) {
        setStats(response.data.data.stats);
        setAttendanceLogs(response.data.data.logs);
      }
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate, fetchAttendanceData]);

  // Handle Face Capture & Form Payload Merge Mapping
  const handleCapture = useCallback(async (imageBlob) => {
    setScreen("loading");
    setErrMsg("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", imageBlob, "attendance_face.jpg");
      
      formData.append("attendance_type", attendanceType);
      if (vacancyId) formData.append("vacancy_id", vacancyId);
      if (customTime) formData.append("custom_time", customTime);
      formData.append("action", kioskAction); // 🆕 send check-in/check-out mode

      const response = await axiosInstance.post("/company/mark-attendance", formData);
      const data = response.data;

      if (!data.status) {
        throw new Error(data.message || "Face verification structure failed.");
      }

      const verifiedWorkerName = data.worker_first_name || "वर्कर";
      

      setMessage(data.message);
      setScreen("success");

      // 🔊 TRIGGER SUCCESS ATTENDANCE AUDIO PROMPT
      triggerVoiceAlert("success", "", verifiedWorkerName);

      // Dynamic Grid Counter Refresh instantly
      fetchAttendanceData(selectedDate);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Face not recognized";
      setErrMsg(errorMsg);
      setScreen("error");

      // 🔊 TRIGGER FAIL OR RE-SIGN IN VALIDATION AUDIO ERROR
      triggerVoiceAlert("error", errorMsg);
    }
  }, [selectedDate, fetchAttendanceData, vacancyId, attendanceType, customTime, kioskAction]);

  useEffect(() => {
    if (screen === "success" || screen === "error") {
      autoResetTimer.current = setTimeout(() => {
        setScreen("scanning");
      }, 3000); // 3 seconds terminal holding layout loop reset window
    }
    return () => {
      if (autoResetTimer.current) clearTimeout(autoResetTimer.current);
    };
  }, [screen]);

  return (
    <div style={styles.page}>
      
      {/* 1. Dashboard Live Counter Statistics Cards */}
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, borderTop: "4px solid #f37023" }}>
          <h3 style={styles.cardTitle}>Total Workers (Database)</h3>
          <p style={{ ...styles.statNum, color: "#1f2937" }}>{stats.total}</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #0071bc" }}>
          <h3 style={styles.cardTitle}>Present ({selectedDate})</h3>
          <p style={{ ...styles.statNum, color: "#0071bc" }}>{stats.present}</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #4fb848" }}>
          <h3 style={styles.cardTitle}>Absent ({selectedDate})</h3>
          <p style={{ ...styles.statNum, color: "#4fb848" }}>{stats.absent}</p>
        </div>
      </div>
       {/* 🆕 2. Check In / Check Out Mode Tabs */}
      {(screen === "idle") && (
        <div style={styles.actionTabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(kioskAction === "sign_in" ? styles.tabButtonActive : {})
            }}
            onClick={() => setKioskAction("sign_in")}
          >
            Check In
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(kioskAction === "sign_out" ? styles.tabButtonActiveOut : {})
            }}
            onClick={() => setKioskAction("sign_out")}
          >
            Check Out
          </button>
        </div>
      )}

      {/* 2. Config Kiosk Setup Control Panel Options Bar */}
      {screen === "idle" && (
        <div style={styles.configBar}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Attendance Type</label>
            <select value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)} style={styles.select}>
              <option value="daily">Daily Flat Base</option>
              <option value="production">Production Item Base</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Vacancy ID (Optional Filter)</label>
            <input type="number" placeholder="e.g. 12" value={vacancyId} onChange={(e) => setVacancyId(e.target.value)} style={styles.textInput} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Custom Sign In Time (Optional)</label>
            <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} style={styles.textInput} />
          </div>
        </div>
      )}

      {/* 3. Main Content Grid Panel Layout */}
      <div style={styles.mainContent}>
        
        {/* Left Column: Active Gate Scanner Terminal */}
        <div style={styles.scannerWrapper}>
          {screen === "idle" && (
            <div style={styles.card}>
              <h2 style={{ color: "#1f2937", marginBottom: 10 }}>Attendance Terminal</h2>
              <p style={{ color: "#6b7280", marginBottom: 25 }}>Configure settings above and launch scanning terminal gate window.</p>
              <button style={styles.button} onClick={() => setScreen("scanning")}>
                Start Gate Kiosk Mode
              </button>
            </div>
          )}

          {screen === "scanning" && (
            <div style={styles.card}>
              <h3 style={{ marginBottom: 15, color: "#0071bc" }}>Looking for Face...</h3>
              <FaceScanner onCapture={handleCapture} onClose={() => setScreen("idle")} />
            </div>
          )}

          {screen === "loading" && (
            <div style={styles.card}>
              <div style={styles.loader}></div>
              <h3 style={{ color: "#1f2937" }}>Comparing Facial Vectors...</h3>
              <p style={{ color: "#6b7280" }}>Analyzing electronic anti-spoof profiles...</p>
            </div>
          )}

          {screen === "success" && (
            <div style={{ ...styles.card, background: "#f0fdf4", border: "1px solid #4fb848" }}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={{ color: "#4fb848" }}>Access Granted</h2>
              <p style={{ ...styles.msgText, color: "#1f2937" }}>{message}</p>
              <p style={styles.autoText}>Camera opening for next worker in 3s...</p>
            </div>
          )}

          {screen === "error" && (
            <div style={{ ...styles.card, background: "#fef2f2", border: "1px solid #f37023" }}>
              <div style={styles.errorIcon}>✗</div>
              <h2 style={{ color: "#f37023" }}>Verification Failed</h2>
              <p style={{ ...styles.msgText, color: "#1f2937" }}>{errMsg}</p>
              <p style={styles.autoText}>Retrying scanning terminal loop in 3s...</p>
              <button style={styles.cancelButton} onClick={() => setScreen("idle")}>
                Stop Terminal
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Audit Log Roll Grid */}
        <div style={styles.logsWrapper}>
          <div style={styles.logHeader}>
            <h3 style={{ color: "#1f2937", margin: 0 }}>Logs History</h3>
            <input type="date" style={styles.dateInput} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>

          <div style={styles.logList}>
            {loadingDashboard ? (
              <div style={{ textAlign: "center", paddingTop: 40 }}><div style={styles.loader}></div></div>
            ) : attendanceLogs.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No biometric data found for {selectedDate}</p>
              </div>
            ) : (
              attendanceLogs.map((log) => (
                <div key={log.id} style={styles.logRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {log.worker_photo ? (
                      <img src={log.worker_photo} alt="profile" style={styles.smallAvatar} />
                    ) : (
                      <div style={styles.smallAvatarCircle}>{log.name?.charAt(0)}</div>
                    )}
                    <div>
                      <div style={{ fontWeight: "600", color: "#1f2937", fontSize: 14 }}>{log.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Code: {log.worker_code || "N/A"} • Time: {log.time}</div>
                    </div>
                  </div>
                  <span style={{
                    ...styles.badge,
                    background: log.status === 'Signed Out' ? '#f1f5f9' : '#e6f4ea',
                    color: log.status === 'Signed Out' ? '#475569' : '#4fb848'
                  }}>{log.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout styling blocks object mapping parameters stay identical
const styles = {
  page: { minHeight: "100vh", background: "#ffffff", color: "#1f2937", fontFamily: "system-ui, sans-serif", padding: "40px 5%", boxSizing: "border-box" },
  statsContainer: { display: "flex", gap: 20, marginBottom: 20, justifyContent: "space-between" },
  statCard: { flex: 1, background: "#f8fafc", padding: "20px 25px", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardTitle: { margin: 0, fontSize: 13, color: "#6b7280", fontWeight: "500" },
  statNum: { fontSize: 34, fontWeight: "700", margin: "8px 0 0 0" },
  configBar: { display: "flex", gap: 20, background: "#f8fafc", padding: 15, borderRadius: 12, marginBottom: 25, flexWrap: "wrap", border: "1px solid #e2e8f0" },
  inputGroup: { flex: 1, minWidth: 150, display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: "600", color: "#475569" },
  select: { padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", outline: "none" },
  textInput: { padding: "7px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", outline: "none" },
  mainContent: { display: "flex", gap: 30, flexWrap: "wrap" },
  scannerWrapper: { flex: 1.3, minWidth: 350 },
  logsWrapper: { flex: 1, background: "#f8fafc", borderRadius: 12, padding: 20, minWidth: 320, maxHeight: 480, display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  logHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 15, marginBottom: 15 },
  dateInput: { background: "#ffffff", border: "1px solid #cbd5e1", color: "#1f2937", padding: "6px 12px", borderRadius: 6, outline: "none", cursor: "pointer" },
  logList: { overflowY: "auto", flex: 1 },
  logRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 6px", borderBottom: "1px solid #f1f5f9" },
  smallAvatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid #cbd5e1" },
  smallAvatarCircle: { width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "600", color: "#475569" },
  badge: { padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: "600" },
  card: { background: "#f8fafc", padding: 40, borderRadius: 12, textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  button: { padding: "12px 30px", border: "none", borderRadius: 6, cursor: "pointer", background: "#0071bc", color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelButton: { padding: "8px 20px", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", background: "#fff", color: "#6b7280", fontSize: 14, marginTop: 15 },
  loader: { width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#0071bc", borderRadius: "50%", margin: "20px auto", animation: "spin 0.8s linear infinite" },
  successIcon: { width: 50, height: 50, background: "#4fb848", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 15px auto" },
  errorIcon: { width: 50, height: 50, background: "#f37023", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 15px auto" },
  msgText: { fontSize: 16, fontWeight: "500", margin: "5px 0" },
  autoText: { fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginTop: 10 },
  emptyState: { color: "#9ca3af", textAlign: "center", paddingTop: 40, fontSize: 14 },
actionTabs: { display: "flex", gap: 10, marginBottom: 20 }, // 🆕
tabButton: { // 🆕
  flex: 1, padding: "10px 20px", borderRadius: 8, border: "1px solid #cbd5e1",
  background: "#fff", color: "#475569", fontWeight: "600", cursor: "pointer", fontSize: 14
},
tabButtonActive: { background: "#0071bc", color: "#fff", border: "1px solid #0071bc" }, // 🆕
tabButtonActiveOut: { background: "#f37023", color: "#fff", border: "1px solid #f37023" }, // 🆕

};