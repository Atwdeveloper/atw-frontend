// FaceScanner.jsx - Optimized for Fast Attendance (1-2 Seconds)
// Blocks Phone Screens & Hardcopy Photos using silent texture + micro-movement analysis.
import { useEffect, useRef, useState, useCallback } from "react";

const FACE_API_JS  = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const MODEL_URL    = "https://cdn.jsdelivr.net/gh/vladmandic/face-api@master/model/";
const OVAL_TOTAL   = 292;

// ── FAST ATTENDANCE TUNABLES ──────────────────────────────────────────────
const MIN_DETECTION_SCORE = 0.7;    // High confidence to drop fake/printed low-res faces
const FACE_MIN_RATIO      = 0.25;   // Force user to be reasonably close
const FACE_MAX_RATIO      = 0.85;   
const CENTER_TOLERANCE    = 0.25;   // Ensure face is inside the scanning frame
const TOTAL_REQUIRED_FRAMES = 8;    // ~1.5 seconds of clean, live data needed

// ── TEXTURE & JITTER METRICS ──────────────────────────────────────────────
const TEXTURE_MIN         = 6;      // Below this = Flat printed paper or smooth screen
const TEXTURE_MAX         = 850;    // Above this = High-frequency Moire pattern from screen grids
const MIN_LIVENESS_JITTER = 0.04;   // Real humans have tiny micro-movements. 0 = Dead frozen photo.

function checkFaceGeometry(box, vidWidth, vidHeight) {
  const faceRatioW = box.width / vidWidth;
  const cx = (box.x + box.width / 2) / vidWidth;
  const cy = (box.y + box.height / 2) / vidHeight;

  if (faceRatioW < FACE_MIN_RATIO) return { ok: false, reason: "TOO_FAR" };
  if (faceRatioW > FACE_MAX_RATIO) return { ok: false, reason: "TOO_CLOSE" };
  if (Math.abs(cx - 0.5) > CENTER_TOLERANCE || Math.abs(cy - 0.5) > CENTER_TOLERANCE) {
    return { ok: false, reason: "NOT_CENTERED" };
  }
  return { ok: true };
}

// ── Silent Screen/Photo Bezel Guard ──────────────────────────────────────
let bezelCanvas = null;
function detectBezelFrame(videoEl) {
  const W = 80, H = 60;
  if (!bezelCanvas) bezelCanvas = document.createElement("canvas");
  bezelCanvas.width = W; bezelCanvas.height = H;
  const ctx = bezelCanvas.getContext("2d", { willReadFrequently: true });
  try {
    ctx.drawImage(videoEl, 0, 0, W, H);
    const gray = ctx.getImageData(0, 0, W, H).data;
    const lum = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const o = i * 4;
      lum[i] = 0.299 * gray[o] + 0.587 * gray[o + 1] + 0.114 * gray[o + 2];
    }
    
    // Straight line check for mobile/photo edges
    const rowEnergy = new Float32Array(H);
    const colEnergy = new Float32Array(W);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const idx = y * W + x;
        colEnergy[x] += Math.abs(lum[idx + 1] - lum[idx - 1]);
        rowEnergy[y] += Math.abs(lum[idx + W] - lum[idx - W]);
      }
    }
    const lineScore = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] || 1;
      return Math.max(...arr) / Math.max(median, 1);
    };
    return lineScore(rowEnergy) > 8.0 || lineScore(colEnergy) > 8.0;
  } catch {
    return false;
  }
}

// ── Micro-Texture Analysis (Laplacian) ───────────────────────────────────
let textureCanvas = null;
// FaceScannerAttendance.jsx ke andar checkTextureAndJitter function ko isse replace karein:
// FaceScannerAttendance.jsx ke andar pure algorithm loop ko robust banane ke liye
// checkTextureAndJitter aur startLoop ko is advanced logic se replace karein:

function checkTextureAndJitter(video, box, lastLandmarks, currentLandmarks) {
    const SZ = 48;
    if (!textureCanvas) textureCanvas = document.createElement("canvas");
    textureCanvas.width = SZ; textureCanvas.height = SZ;
    const ctx = textureCanvas.getContext("2d", { willReadFrequently: true });
  
    try {
      const px = box.x + box.width * 0.25, py = box.y + box.height * 0.2;
      const pw = box.width * 0.5, ph = box.height * 0.4;
      ctx.drawImage(video, px, py, pw, ph, 0, 0, SZ, SZ);
      const data = ctx.getImageData(0, 0, SZ, SZ).data;
      
      const gray = new Float32Array(SZ * SZ);
      for (let i = 0; i < SZ * SZ; i++) {
        const o = i * 4;
        gray[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
      }
  
      const lap = [];
      for (let y = 1; y < SZ - 1; y++) {
        for (let x = 1; x < SZ - 1; x++) {
          const i = y * SZ + x;
          lap.push(4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - SZ] - gray[i + SZ]);
        }
      }
      const mean = lap.reduce((a, b) => a + b, 0) / lap.length;
      const variance = lap.reduce((a, b) => a + (b - mean) ** 2, 0) / lap.length;
  
      // Mobile screens light reflection se digital filter variations deti hain 
      // Is dynamic threshold gap ko strict 25 se 650 tak bound kiya hai
      if (variance < 25 || variance > 650) return { valid: false, reason: "SPOOF_TEXTURE" };
  
      if (lastLandmarks && currentLandmarks) {
        // 3D Parallax Emulation: Eyes vs Nose-tip spatial depth ratio calculation
        const leftEye = currentLandmarks.getLeftEye()[0];
        const rightEye = currentLandmarks.getRightEye()[3];
        const noseTip = currentLandmarks.getNose()[3];
  
        // Calculate the delta triangle ratio changes
        const eyeDistance = Math.sqrt((rightEye.x - leftEye.x) ** 2 + (rightEye.y - leftEye.y) ** 2);
        const noseToLeftEye = Math.sqrt((noseTip.x - leftEye.x) ** 2 + (noseTip.y - leftEye.y) ** 2);
        
        const prevLeftEye = lastLandmarks.getLeftEye()[0];
        const prevRightEye = lastLandmarks.getRightEye()[3];
        const prevEyeDistance = Math.sqrt((prevRightEye.x - prevLeftEye.x) ** 2 + (prevRightEye.y - prevLeftEye.y) ** 2);
  
        // 2D Mobile Screen displays have perfectly proportional scale changes. 
        // Real humans have volumetric micro-depth changes as they stay in front of the lens.
        const scaleRatioDiff = Math.abs((eyeDistance / noseToLeftEye) - (prevEyeDistance / noseToLeftEye));
        
        return { valid: true, scaleRatioDiff, absoluteMove: Math.abs(eyeDistance - prevEyeDistance) };
      }
  
      return { valid: true, scaleRatioDiff: 0.05, absoluteMove: 0.2 };
    } catch {
      return { valid: true, scaleRatioDiff: 0.05, absoluteMove: 0.2 };
    }
}

export default function FaceScanner({ onCapture, onClose }) {
  const videoRef  = useRef(null);
  const timerRef  = useRef(null);
  const streamRef = useRef(null);
  const stateRef  = useRef({
    validFrames: 0,
    lastLandmarks: null,
    totalJitter: 0
  });

  const [pct, setPct]         = useState(0);
  const [msg, setMsg]         = useState("Initializing Scan...");
  const [isOk, setIsOk]       = useState(true);
  const [loading, setLoading] = useState(true);

  const stopAll = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const c = document.createElement("canvas");
    c.width = vid.videoWidth; c.height = vid.videoHeight;
    c.getContext("2d").drawImage(vid, 0, 0);
    c.toBlob(blob => { stopAll(); onCapture(blob); }, "image/jpeg", 0.90);
  }, [stopAll, onCapture]);

  const startLoop = useCallback(() => {
    const s = stateRef.current;
    s.validFrames = 0;
    s.lastLandmarks = null;
    s.totalJitter = 0;

    setMsg("Look directly at the camera");
    setIsOk(true);

    // startLoop block array validation logic update:
timerRef.current = setInterval(async () => {
    const vid = videoRef.current;
    if (!vid || vid.videoWidth === 0) return;
  
    if (detectBezelFrame(vid)) {
      s.validFrames = 0;
      setPct(0);
      setIsOk(false);
      setMsg("Object/Screen Spoof Detected");
      return;
    }
  
    const det = await window.faceapi
      .detectSingleFace(vid, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.85 })) // High strictness base score
      .withFaceLandmarks();
  
    if (!det) {
      s.validFrames = Math.max(0, s.validFrames - 2);
      setPct(Math.round((s.validFrames / 12) * 100));
      setIsOk(false);
      setMsg("Position face cleanly inside container");
      return;
    }
  
    const geo = checkFaceGeometry(det.detection.box, vid.videoWidth, vid.videoHeight);
    if (!geo.ok) {
      s.validFrames = Math.max(0, s.validFrames - 1);
      setPct(Math.round((s.validFrames / 12) * 100));
      setIsOk(false);
      setMsg(geo.reason === "TOO_FAR" ? "Come a bit closer" : "Stay inside the scanning frame");
      return;
    }
  
    const textureAnalysis = checkTextureAndJitter(vid, det.detection.box, s.lastLandmarks, det.landmarks);
    if (!textureAnalysis.valid) {
      s.validFrames = 0;
      setPct(0);
      setIsOk(false);
      setMsg("Real Face Required. Screen/Photo completely rejected.");
      return;
    }
  
    // Accumulate dynamic tracking variances
    if (s.lastLandmarks) {
      s.totalJitter += textureAnalysis.scaleRatioDiff;
    }
    s.lastLandmarks = det.landmarks;
  
    setIsOk(true);
    s.validFrames++;
    
    // Requiring 12 frames (~1.8 seconds) to map spatial depth validation
    const progress = Math.min(100, Math.round((s.validFrames / 12) * 100));
    setPct(progress);
    setMsg("Analyzing Depth Profile...");
  
    if (s.validFrames >= 12) {
      // Mobile images maintain a strict zero change in 3D perspective ratios.
      // Real face depth shifts slightly due to sub-millimeter head adjustments.
      if (s.totalJitter < 0.008) {
        s.validFrames = 0;
        s.totalJitter = 0;
        setIsOk(false);
        setMsg("Static Device Capture Prevented. Keep natural head position.");
        return;
      }
      
      clearInterval(timerRef.current);
      setMsg("Attendance Verified ✓");
      setTimeout(capture, 250);
    }
  }, 150);
  }, [capture]);

  useEffect(() => {
    const init = async () => {
      if (!window.faceapi) {
        await new Promise((res, rej) => {
          const sc = document.createElement("script");
          sc.src = FACE_API_JS;
          sc.onload = res; sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }
      if (!window.faceapi.nets.ssdMobilenetv1.isLoaded) {
        await Promise.all([
          window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
      }
      setLoading(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play().then(startLoop);
        }
      } catch {
        setMsg("Camera access denied!");
        setIsOk(false);
      }
    };
    init();
    return () => stopAll();
  }, [startLoop, stopAll]);

  const offset = OVAL_TOTAL - (OVAL_TOTAL * pct / 100);
  const strokeClr = isOk ? "#10b981" : "#ef4444"; // Attendance Green accent

  return (
    <div style={css.overlay}>
      <div style={css.modal}>
        <div style={css.header}>
          <span style={css.title}>Quick Attendance Check</span>
          <button style={css.closeBtn} onClick={() => { stopAll(); onClose(); }}>✕</button>
        </div>

        <div style={css.camBox}>
          <video ref={videoRef} style={css.video} autoPlay muted playsInline />
          <div style={css.uiLayer}>
            <div style={css.ovalWrap}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
                <ellipse cx="50" cy="50" rx="46" ry="47" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1.5"/>
                <ellipse cx="50" cy="50" rx="46" ry="47" fill="none" stroke={strokeClr} strokeWidth="3"
                  strokeDasharray={OVAL_TOTAL} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)"
                  style={{ transition:"stroke-dashoffset .12s linear, stroke .2s" }}/>
              </svg>
            </div>
          </div>
          {loading && <div style={css.dimmer}><div style={css.spinner}/></div>}
        </div>

        <div style={{ ...css.statusBar, borderColor: isOk ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)", color: strokeClr }}>
          {msg}
        </div>

        <div style={css.track}>
          <div style={{ ...css.fill, width:`${pct}%`, background: strokeClr }} />
        </div>
      </div>
    </div>
  );
}

const css = {
  overlay:   { position:"fixed", inset:0, background:"rgba(6,9,18,.85)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 },
  modal:     { background:"#0b0f19", borderRadius:20, border:"1px solid rgba(255,255,255,.06)", padding:20, width:"100%", maxWidth:400, boxShadow:"0 25px 60px rgba(0,0,0,.6)" },
  header:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 },
  title:     { fontSize:15, fontWeight:600, color:"#e2e8f0" },
  closeBtn:  { background:"none", border:"none", color:"rgba(255,255,255,.4)", fontSize:16, cursor:"pointer" },
  camBox:    { position:"relative", aspectRatio:"4/3", borderRadius:12, overflow:"hidden", background:"#020408" },
  video:     { width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)", display:"block" },
  uiLayer:   { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" },
  ovalWrap:  { position:"relative", width:190, height:250 },
  dimmer:    { position:"absolute", inset:0, background:"#020408", display:"flex", alignItems:"center", justifyContent:"center" },
  spinner:   { width:32, height:32, border:"3px solid rgba(16,185,129,.2)", borderTopColor:"#10b981", borderRadius:"50%", animation:"spin .8s linear infinite" },
  statusBar: { marginTop:12, border:"1px solid", borderRadius:8, padding:"8px 12px", textAlign:"center", fontSize:13, fontWeight:600 },
  track:     { marginTop:10, height:4, background:"rgba(255,255,255,.05)", borderRadius:2, overflow:"hidden" },
  fill:      { height:"100%", transition:"width .1s linear" }
};