import { useState, useCallback, useEffect, useRef } from "react";
import FaceScanner from "./faceScannerAttendance";

const PYTHON_API = "http://127.0.0.1:8000/register-face";

export default function FaceAttendanceDashboard() {
  const [screen, setScreen] = useState("idle"); // idle, scanning, loading, success, error
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Auto-reset timer reference for continuous scanning
  const autoResetTimer = useRef(null);

  // --- Stats & Logs ---
  const [stats, setStats] = useState({
    total: 150,
    present: 42,
    absent: 108,
  });

  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, name: "Adarsh Patel", time: "09:15 AM", status: "Present", date: "2026-07-01" },
    { id: 2, name: "Rahul Sharma", time: "09:30 AM", status: "Present", date: "2026-07-01" },
    { id: 3, name: "Amit Verma", time: "10:02 AM", status: "Present", date: "2026-07-01" },
    { id: 4, name: "Vikram Singh", time: "05:12 PM", status: "Present", date: "2026-06-30" },
  ]);

  // Handle Face Capture & API Call
  const handleCapture = useCallback(async (imageBlob) => {
    setScreen("loading");
    setErrMsg("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", imageBlob, "face.jpg");

      const response = await fetch(PYTHON_API, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "Face not recognized / Registered");
      }

      // Backend dynamic response keys safety handling
      const recognizedName = data.userName || data.name || "Worker";

      setMessage(data.message || `Attendance Marked: ${recognizedName}`);
      setScreen("success");

      // Real-time update inside state UI counters
      setStats((prev) => ({ ...prev, present: prev.present + 1, absent: Math.max(0, prev.absent - 1) }));
      setAttendanceLogs((prev) => [
        {
          id: Date.now(),
          name: recognizedName, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "Present",
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);

    } catch (error) {
      setErrMsg(error.message);
      setScreen("error");
    }
  }, []);

  // Continuous Scan Logic: Success ya Error dynamic threshold reset
  useEffect(() => {
    if (screen === "success" || screen === "error") {
      autoResetTimer.current = setTimeout(() => {
        setScreen("scanning");
      }, 3000); // 3 Seconds Delay to prepare next candidate
    }

    return () => {
      if (autoResetTimer.current) clearTimeout(autoResetTimer.current);
    };
  }, [screen]);

  // Filter logs by date
  const filteredLogs = attendanceLogs.filter((log) => log.date === selectedDate);

  return (
    <div style={styles.page}>
      {/* Header Panel */}
      <header style={styles.header}>
        <h1 style={styles.headerH1}>Smart Face Attendance System</h1>
        <p style={styles.headerP}>Continuous Scan Mode Activated</p>
      </header>

      {/* 1. Dashboard Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #2563eb" }}>
          <h3 style={styles.cardTitle}>Total Employees</h3>
          <p style={styles.statNum}>{stats.total}</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #10b981" }}>
          <h3 style={styles.cardTitle}>Present Today</h3>
          <p style={{ ...styles.statNum, color: "#10b981" }}>{stats.present}</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #ef4444" }}>
          <h3 style={styles.cardTitle}>Absent Today</h3>
          <p style={{ ...styles.statNum, color: "#ef4444" }}>{stats.absent}</p>
        </div>
      </div>

      {/* 2. Main Action Area */}
      <div style={styles.mainContent}>
        {/* Scanner Container Card */}
        <div style={styles.scannerWrapper}>
          {screen === "idle" && (
            <div style={styles.card}>
              <h2>System Ready</h2>
              <p style={{ color: "#9ca3af", marginBottom: 20 }}>Place this screen at the entrance for workers.</p>
              <button style={styles.button} onClick={() => setScreen("scanning")}>
                Start Attendance Session
              </button>
            </div>
          )}

          {screen === "scanning" && (
            <div style={styles.card}>
              <h3 style={{ marginBottom: 15, color: "#38bdf8" }}>Looking for Face...</h3>
              <FaceScanner onCapture={handleCapture} onClose={() => setScreen("idle")} />
            </div>
          )}

          {screen === "loading" && (
            <div style={styles.card}>
              <div style={styles.loader}></div>
              <h3>Verifying Identity...</h3>
              <p style={{ color: "#9ca3af" }}>Please hold still</p>
            </div>
          )}

          {screen === "success" && (
            <div style={{ ...styles.card, border: "2px solid #10b981" }}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={{ color: "#10b981" }}>Welcome!</h2>
              <p style={styles.msgText}>{message}</p>
              <p style={styles.autoText}>Next worker in 3 seconds...</p>
            </div>
          )}

          {screen === "error" && (
            <div style={{ ...styles.card, border: "2px solid #ef4444" }}>
              <div style={styles.errorIcon}>✗</div>
              <h2 style={{ color: "#ef4444" }}>Failed</h2>
              <p style={styles.msgText}>{errMsg}</p>
              <p style={styles.autoText}>Retrying automatically in 3 seconds...</p>
              <button style={{ ...styles.button, background: "#374151", marginTop: 15 }} onClick={() => setScreen("idle")}>
                Stop Session
              </button>
            </div>
          )}
        </div>

        {/* 3. Filter and Logs Section */}
        <div style={styles.logsWrapper}>
          <div style={styles.logHeader}>
            <h3 style={{ margin: 0 }}>Attendance History</h3>
            <input
              type="date"
              style={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div style={styles.logList}>
            {filteredLogs.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", marginTop: 40 }}>No records found for this date.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} style={styles.logRow} className="log-row-hover">
                  <div>
                    <div style={{ fontWeight: "bold" }}>{log.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Time: {log.time}</div>
                  </div>
                  <span style={styles.badge}>{log.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Clean row level native hover fallback without breaking structure */
        .log-row-hover:hover {
          background: #2d3748 !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
    padding: "30px 5%",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  headerH1: {
    margin: 0, 
    fontSize: 28 
  },
  headerP: { 
    color: "#38bdf8", 
    margin: "5px 0 0 0", 
    fontSize: 14, 
    letterSpacing: 1 
  },
  statsContainer: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  statCard: {
    flex: 1,
    background: "#1e293b",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    minWidth: "200px"
  },
  cardTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: "500",
    color: "#9ca3af"
  },
  statNum: {
    fontSize: 32,
    fontWeight: "bold",
    margin: "10px 0 0 0",
  },
  mainContent: {
    display: "flex",
    gap: 30,
    flexWrap: "wrap",
  },
  scannerWrapper: {
    flex: 1.2,
    minWidth: 350,
  },
  logsWrapper: {
    flex: 1,
    background: "#1e293b",
    borderRadius: 10,
    padding: 20,
    minWidth: 320,
    maxHeight: 500,
    display: "flex",
    flexDirection: "column",
  },
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #334155",
    paddingBottom: 15,
    marginBottom: 15,
  },
  dateInput: {
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    outline: "none",
    cursor: "pointer",
  },
  logList: {
    overflowY: "auto",
    flex: 1,
  },
  logRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 10px",
    borderBottom: "1px solid #334155",
    borderRadius: 6,
    transition: "background 0.2s",
    background: "transparent"
  },
  badge: {
    background: "#065f46",
    color: "#34d399",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    background: "#1e293b",
    padding: 40,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
  },
  button: {
    padding: "12px 28px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    width: 50,
    height: 50,
    border: "4px solid #334155",
    borderTopColor: "#38bdf8",
    borderRadius: "50%",
    margin: "20px auto",
    animation: "spin 1s linear infinite",
  },
  successIcon: {
    width: 60,
    height: 60,
    background: "#10b981",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    margin: "0 auto 20px auto",
  },
  errorIcon: {
    width: 60,
    height: 60,
    background: "#ef4444",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    margin: "0 auto 20px auto",
  },
  msgText: { fontSize: 18, margin: "10px 0" },
  autoText: { fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginTop: 15 },
};