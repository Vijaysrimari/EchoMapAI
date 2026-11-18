import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Mic,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
  Building2,
  Volume2,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { type AnalyticsRange } from "./data/analyticsData";
import { type HotspotRecord, type HotspotSeverity } from "./data/hotspotData";
import "./App.css";

type Severity = "High" | "Moderate" | "Low";
type SoundReport = {
  id: string;
  sound: string;
  location: string;
  level: string;
  severity: Severity;
  time: string;
  x: number;
  y: number;
};

type ReportStatus = "Pending" | "Reviewed";
type ReportRecord = {
  id: string;
  sound: string;
  location: string;
  landmark?: string;
  frequency?: string;
  severity: Severity;
  level: string;
  reportedAt: string;
  status: ReportStatus;
  confidence: string;
  description: string;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Sound Map", icon: Map },
  { label: "Reports", icon: FileText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Hotspots", icon: Activity },
  { label: "Settings", icon: Settings },
];

const hotspots = [
  {
    name: "Construction Zone",
    detail: "Jackhammer activity",
    severity: "High" as Severity,
    level: "84 dB",
  },
  {
    name: "Main Road",
    detail: "Heavy traffic corridor",
    severity: "Moderate" as Severity,
    level: "72 dB",
  },
  {
    name: "Central Area",
    detail: "Mixed urban activity",
    severity: "Low" as Severity,
    level: "65 dB",
  },
];
const initialReports: ReportRecord[] = [
  {
    id: "RPT-001",
    sound: "Jackhammer",
    location: "Construction Zone",
    severity: "High",
    level: "84 dB",
    reportedAt: "Today, 10:20 AM",
    status: "Reviewed",
    confidence: "94%",
    description:
      "Construction-related acoustic activity detected near the monitored construction zone.",
  },
  {
    id: "RPT-002",
    sound: "Heavy Traffic",
    location: "Main Road",
    severity: "Moderate",
    level: "72 dB",
    reportedAt: "Today, 09:45 AM",
    status: "Pending",
    confidence: "89%",
    description:
      "Continuous road traffic pattern detected along the main road corridor.",
  },
  {
    id: "RPT-003",
    sound: "Car Horn",
    location: "Central Area",
    severity: "Low",
    level: "65 dB",
    reportedAt: "Today, 09:15 AM",
    status: "Reviewed",
    confidence: "91%",
    description:
      "Short-duration vehicle horn event captured in the central area.",
  },
  {
    id: "RPT-004",
    sound: "Siren",
    location: "Hospital Road",
    severity: "Moderate",
    level: "78 dB",
    reportedAt: "Today, 08:50 AM",
    status: "Reviewed",
    confidence: "87%",
    description: "Emergency vehicle siren pattern detected near Hospital Road.",
  },
  {
    id: "RPT-005",
    sound: "Drilling",
    location: "Industrial Area",
    severity: "High",
    level: "88 dB",
    reportedAt: "Yesterday, 06:30 PM",
    status: "Pending",
    confidence: "96%",
    description:
      "High-intensity drilling activity detected in the industrial area.",
  },
  {
    id: "RPT-006",
    sound: "Crowd",
    location: "Market Area",
    severity: "Moderate",
    level: "70 dB",
    reportedAt: "Yesterday, 05:10 PM",
    status: "Reviewed",
    confidence: "89%",
    description:
      "A sustained crowd sound profile was detected around the market area.",
  },
  {
    id: "RPT-007",
    sound: "Jackhammer",
    location: "East Construction Site",
    severity: "High",
    level: "86 dB",
    reportedAt: "Yesterday, 03:45 PM",
    status: "Pending",
    confidence: "94%",
    description:
      "Repeated construction impact sounds detected at the east construction site.",
  },
  {
    id: "RPT-008",
    sound: "Heavy Traffic",
    location: "Bus Stand Road",
    severity: "Moderate",
    level: "74 dB",
    reportedAt: "Yesterday, 01:20 PM",
    status: "Reviewed",
    confidence: "91%",
    description: "Elevated traffic noise detected around Bus Stand Road.",
  },
];

const severityClass = (severity: Severity) => severity.toLowerCase();

function App() {
  const [role, setRole] = useState<"citizen" | "government" | null>(() => {
    const stored = window.sessionStorage.getItem("echomap-role");
    const token = window.sessionStorage.getItem("echomap-government-token");
    if (stored === "citizen") return "citizen";
    if (stored === "government" && token) return "government";
    return null;
  });
  const [activePage, setActivePage] = useState("Dashboard");

  function enterRole(nextRole: "citizen" | "government") {
    window.sessionStorage.setItem("echomap-role", nextRole);
    setRole(nextRole);
  }

  function logout() {
    window.sessionStorage.removeItem("echomap-role");
    window.sessionStorage.removeItem("echomap-government-token");
    setRole(null);
    setActivePage("Dashboard");
  }

  if (!role) {
    return (
      <LoginPage
        onLogin={enterRole}
        onGovernmentLogin={(token) => {
          window.sessionStorage.setItem("echomap-government-token", token);
          enterRole("government");
        }}
      />
    );
  }

  if (role === "citizen") {
    return <CitizenPortal onLogout={logout} />;
  }

  return (
    <GovernmentDashboard
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={logout}
    />
  );
}

function GovernmentDashboard({
  activePage,
  setActivePage,
  onLogout,
}: {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}) {
  const [liveReports, setLiveReports] = useState<ReportRecord[]>([]);
  const [liveReportIds, setLiveReportIds] = useState<Set<string>>(new Set());

  async function refreshLiveReports() {
    try {
      const token = window.sessionStorage.getItem("echomap-government-token");
      const response = await fetch("/api/reports", {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = (await response.json()) as {
        status: string;
        reports?: Array<Record<string, string>>;
      };
      if (!response.ok || !payload.reports) return;

      const mapped = payload.reports.map((report) => ({
        id: String(report.id),
        sound: String(report.sound),
        location: String(report.location),
        landmark: String(report.landmark || ""),
        frequency: String(report.frequency || "Daily"),
        severity: String(report.severity) as Severity,
        level: String(report.level),
        reportedAt: String(report.reported_at),
        status: String(report.status) as ReportStatus,
        confidence: String(report.confidence),
        description: String(report.description),
      }));
      setLiveReports(mapped);
      setLiveReportIds(new Set(mapped.map((report) => report.id)));
    } catch {
      // Keep the current government view available if the backend is briefly offline.
    }
  }

  useEffect(() => {
    void refreshLiveReports();
    const interval = window.setInterval(() => void refreshLiveReports(), 3000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />
      <div className="main-shell">
        <Header onLogout={onLogout} />
        {activePage === "Sound Map" ? (
          <SoundMapPage liveReports={liveReports} />
        ) : activePage === "Reports" ? (
          <ReportsPage
            liveReports={liveReports}
            liveReportIds={liveReportIds}
            onRefresh={refreshLiveReports}
          />
        ) : activePage === "Analytics" ? (
          <AnalyticsPage liveReports={liveReports} />
        ) : activePage === "Hotspots" ? (
          <HotspotsPage liveReports={liveReports} />
        ) : activePage === "Settings" ? (
          <SettingsPage />
        ) : (
          <DashboardPage liveReports={liveReports} />
        )}
      </div>
    </div>
  );
}

type PredictionResult = {
  status: string;
  report_id?: string;
  category: string;
  coarse_category: string;
  confidence: number;
  top_predictions: Array<{ category: string; probability: number }>;
  estimated_level_db: number;
  severity: "High" | "Moderate" | "Low";
  filename?: string;
  message?: string;
};

function LoginPage({
  onLogin,
  onGovernmentLogin,
}: {
  onLogin: (role: "citizen" | "government") => void;
  onGovernmentLogin: (token: string) => void;
}) {
  const [governmentOpen, setGovernmentOpen] = useState(false);
  const [governmentEmail, setGovernmentEmail] = useState("");
  const [governmentPassword, setGovernmentPassword] = useState("");
  const [governmentError, setGovernmentError] = useState("");
  const [governmentLoading, setGovernmentLoading] = useState(false);

  async function loginGovernment() {
    setGovernmentError("");
    setGovernmentLoading(true);
    try {
      const response = await fetch("/api/auth/government", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: governmentEmail,
          password: governmentPassword,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        status: string;
        token?: string;
        message?: string;
      } | null;
      if (!response.ok || !payload?.token) {
        throw new Error(payload?.message || "Government login failed.");
      }
      onGovernmentLogin(payload.token);
    } catch (error) {
      setGovernmentError(
        error instanceof Error ? error.message : "Government login failed.",
      );
    } finally {
      setGovernmentLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="EchoMap introduction">
        <div className="login-brand">
          <div className="brand-mark">
            <Activity size={24} />
          </div>
          <div>
            <strong>
              EchoMap <em>AI</em>
            </strong>
            <span>Urban Sound Intelligence</span>
          </div>
        </div>
        <div className="login-visual-copy">
          <p className="login-kicker">COMMUNITY NOISE MONITORING</p>
          <h1>
            Understand the sounds
            <br />
            that shape your city.
          </h1>
          <p>
            Report environmental sound activity and help government teams
            identify and respond to urban noise hotspots.
          </p>
        </div>
        <div className="login-metrics">
          <div>
            <strong>50</strong>
            <span>Sound classes</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Audio prediction</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>Monitoring data</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <p className="section-kicker">ECHOMAP ACCESS</p>
          <h2>Choose your portal</h2>
          <p className="login-panel-copy">
            Sign in to contribute sound reports or manage city monitoring.
          </p>

          <div className="role-grid">
            <article className="role-card">
              <div className="role-icon citizen">
                <UserRound size={24} />
              </div>
              <div>
                <h3>Citizen</h3>
                <p>Record or upload urban sounds for AI classification.</p>
              </div>
              <button
                type="button"
                onClick={() => onLogin("citizen")}
                className="role-button citizen"
              >
                Login as Citizen <ChevronRight size={16} />
              </button>
            </article>

            <article className="role-card">
              <div className="role-icon government">
                <Building2 size={24} />
              </div>
              <div>
                <h3>Government Administration</h3>
                <p>
                  View reports, analytics, sound maps and monitoring hotspots.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGovernmentOpen(true)}
                className="role-button government"
              >
                Login as Government <ChevronRight size={16} />
              </button>
            </article>
          </div>

          <p className="login-note">
            <ShieldCheck size={14} /> Demo access · No credentials stored
          </p>
        </div>
      </section>

      {governmentOpen && (
        <div className="government-login-backdrop" role="presentation">
          <form
            className="government-login-modal"
            onSubmit={(event) => {
              event.preventDefault();
              void loginGovernment();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="government-login-title"
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close government login"
              onClick={() => setGovernmentOpen(false)}
            >
              <X size={18} />
            </button>
            <div className="government-login-icon">
              <ShieldCheck size={24} />
            </div>
            <p className="section-kicker">AUTHORIZED PERSONNEL ONLY</p>
            <h2 id="government-login-title">Government Authority Login</h2>
            <p className="government-login-copy">
              Use the official authority email and secure password.
            </p>
            <label className="government-login-field">
              <span>Government email</span>
              <input
                type="email"
                value={governmentEmail}
                onChange={(event) => setGovernmentEmail(event.target.value)}
                placeholder="authority@echomap.gov"
                autoComplete="username"
                required
              />
            </label>
            <label className="government-login-field">
              <span>Password</span>
              <input
                type="password"
                value={governmentPassword}
                onChange={(event) => setGovernmentPassword(event.target.value)}
                placeholder="Enter secure password"
                autoComplete="current-password"
                required
              />
            </label>
            {governmentError && (
              <div className="government-login-error">{governmentError}</div>
            )}
            <button
              type="submit"
              className="government-login-submit"
              disabled={governmentLoading}
            >
              {governmentLoading ? "Verifying..." : "Secure Government Login"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function CitizenPortal({ onLogout }: { onLogout: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [noiseCategory, setNoiseCategory] = useState("Traffic noise");
  const [manualSeverity, setManualSeverity] = useState("High");
  const [frequency, setFrequency] = useState("Daily");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function analyzeFile(file: File) {
    setError("");
    setResult(null);
    setSubmittedReportId("");
    setIsAnalyzing(true);
    try {
      const form = new FormData();
      form.append("audio", file);
      form.append("location", location.trim() || "Citizen submitted location");
      const response = await fetch("/api/prediction", {
        method: "POST",
        body: form,
      });
      const payload = (await response
        .json()
        .catch(() => null)) as PredictionResult | null;
      if (!payload) {
        throw new Error("The prediction service returned an invalid response.");
      }
      if (!response.ok) {
        throw new Error(payload.message || "The audio could not be analyzed.");
      }
      setResult(payload);
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "Cannot reach the prediction service. Start the backend on port 8000 and refresh the page.",
        );
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to connect to the prediction service.",
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function submitReport() {
    if (!result) return;
    if (!location.trim()) {
      setError("Please enter the exact location where the sound occurred.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the problem you observed.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: noiseCategory,
          coarse_category: result.coarse_category,
          confidence: result.confidence,
          severity: manualSeverity,
          estimated_level_db: result.estimated_level_db,
          top_predictions: result.top_predictions,
          location: location.trim(),
          landmark: landmark.trim(),
          frequency: frequency,
          description: description.trim(),
          filename: result.filename || "",
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        status: string;
        report?: { id: string };
        message?: string;
      } | null;
      if (!response.ok || !payload?.report) {
        throw new Error(
          payload?.message || "The report could not be delivered.",
        );
      }
      setSubmittedReportId(payload.report.id);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit the report.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function startRecording() {
    setError("");
    setResult(null);
    setSubmittedReportId("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const extension = recorder.mimeType.includes("mp4") ? "mp4" : "webm";
        const file = new File([blob], `echomap-recording.${extension}`, {
          type: blob.type,
        });
        setSelectedFile(file);
        void analyzeFile(file);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone access is unavailable. Use Upload Audio instead.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }

  function chooseFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose an audio file smaller than 10 MB.");
      return;
    }
    setSelectedFile(file);
    setError("");
    setResult(null);
    setSubmittedReportId("");
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Location services are not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `Current location · ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
        );
        setError("");
      },
      () => setError("Unable to access your location. Enter it manually."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <main className="citizen-page">
      <header className="citizen-header">
        <div className="login-brand">
          <div className="brand-mark">
            <Activity size={22} />
          </div>
          <div>
            <strong>
              EchoMap <em>AI</em>
            </strong>
            <span>Citizen Sound Portal</span>
          </div>
        </div>
        <button type="button" className="logout-button" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <section className="citizen-content">
        <div className="citizen-hero">
          <div className="citizen-heading">
            <p className="section-kicker">COMMUNITY CONTRIBUTION</p>
            <h1>Report an Urban Sound</h1>
            <p>
              Capture the problem, describe what happened, and send it directly
              to the government team.
            </p>
          </div>
          <div className="citizen-steps" aria-label="Report progress">
            <span className={selectedFile ? "active done" : "active"}>
              1 <b>Capture</b>
            </span>
            <i />
            <span className={result ? "active done" : ""}>
              2 <b>Analyze</b>
            </span>
            <i />
            <span className={submittedReportId ? "active done" : ""}>
              3 <b>Submit</b>
            </span>
          </div>
        </div>

        <div className="noise-report-form">
          <section className="report-form-section">
            <h2>1. Noise information</h2>
            <label className="reference-field">
              <span>Noise category</span>
              <select value={noiseCategory} onChange={(event) => setNoiseCategory(event.target.value)}>
                <option>Traffic noise</option>
                <option>Construction noise</option>
                <option>Industrial noise</option>
                <option>Air/vehicle horn</option>
                <option>Emergency siren</option>
                <option>Music/event noise</option>
                <option>Animal noise</option>
                <option>Other noise</option>
              </select>
            </label>
            <label className="reference-field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the noise problem..."
                aria-label="Noise description"
                rows={3}
              />
            </label>
            <div className="reference-two-column">
              <label className="reference-field">
                <span>Severity</span>
                <select value={manualSeverity} onChange={(event) => setManualSeverity(event.target.value)}>
                  <option>High</option>
                  <option>Moderate</option>
                  <option>Low</option>
                </select>
              </label>
              <label className="reference-field">
                <span>Frequency</span>
                <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                  <option>Daily</option>
                  <option>Nightly</option>
                  <option>Weekly</option>
                  <option>Occasional</option>
                  <option>Continuous</option>
                </select>
              </label>
            </div>
          </section>

          <section className="report-form-section">
            <h2>2. Location</h2>
            <button type="button" className="location-select-button" onClick={useCurrentLocation}>
              <MapPin size={17} />
              <span>
                <strong>Select noise location</strong>
                <small>Use your current location or enter a point</small>
              </span>
            </button>
            <label className="reference-field map-preview">
              <span><Map size={15} /> Interactive map preview</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Enter noise location..."
                aria-label="Noise location"
              />
              <div className="map-preview-grid" aria-hidden="true">
                <div className="map-preview-road road-one" />
                <div className="map-preview-road road-two" />
                {location && <div className="map-preview-pin"><MapPin size={18} /></div>}
              </div>
            </label>
            <label className="reference-field">
              <span>Nearby landmark</span>
              <input
                value={landmark}
                onChange={(event) => setLandmark(event.target.value)}
                placeholder="Enter a nearby landmark..."
                aria-label="Nearby landmark"
              />
            </label>
          </section>
        </div>

        <div className="citizen-grid">
          <section className="capture-panel">
            <h2 className="report-section-title">3. Audio evidence</h2>
            <div className="capture-actions">
              <button
                type="button"
                className={`record-button ${isRecording ? "recording" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic size={26} />
                <span>{isRecording ? "Stop Recording" : "Record Sound"}</span>
              </button>

              <label className="upload-button">
                <Upload size={20} />
                <span>Upload Audio</span>
                <input
                  type="file"
                  accept=".wav,.mp3,.m4a,.mp4,audio/*"
                  onChange={(event) => chooseFile(event.target.files?.[0])}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="selected-file">
                <div className="selected-file-icon">
                  <Volume2 size={18} />
                </div>
                <div>
                  <strong>{selectedFile.name}</strong>
                  <span>
                    {(selectedFile.size / 1024).toFixed(1)} KB · Audio ready
                  </span>
                </div>
              </div>
            )}

            {selectedFile && !isAnalyzing && (
              <button
                type="button"
                className="analyze-button"
                onClick={() => void analyzeFile(selectedFile)}
              >
                Analyze Sound <ChevronRight size={16} />
              </button>
            )}

            {isAnalyzing && (
              <div className="analysis-loading">
                <span />
                Analyzing audio with ESC-50 model...
              </div>
            )}
            {error && <div className="analysis-error">{error}</div>}
          </section>

          <section className="prediction-panel">
            <div className="prediction-heading">
              <div>
                <p>ECHOMAP AI ANALYSIS</p>
                <h2>Sound Analysis</h2>
              </div>
              {result && <CheckCircle2 size={22} />}
            </div>

            {!result ? (
              <div className="prediction-empty">
                <div>
                  <Volume2 size={30} />
                </div>
                <h3>Waiting for audio</h3>
                <p>
                  Upload or record an audio sample to view the detected sound
                  and confidence.
                </p>
              </div>
            ) : (
              <div className="prediction-result">
                <div
                  className={`severity-result ${result.severity.toLowerCase()}`}
                >
                  <span>Primary detection</span>
                  <strong>{result.category.replaceAll("_", " ")}</strong>
                  <p>{result.coarse_category}</p>
                </div>
                {submittedReportId && (
                  <div className="submitted-report-note">
                    <CheckCircle2 size={15} />
                    <span>Delivered to government · {submittedReportId}</span>
                  </div>
                )}
                <div className="confidence-row">
                  <div>
                    <span>Confidence</span>
                    <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="confidence-track">
                    <i
                      style={{
                        width: `${Math.min(100, result.confidence * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="prediction-details">
                  <div>
                    <span>Estimated Level</span>
                    <strong>{result.estimated_level_db} dB</strong>
                  </div>
                  <div>
                    <span>Severity</span>
                    <strong className={result.severity.toLowerCase()}>
                      {result.severity}
                    </strong>
                  </div>
                </div>
                <div className="top-predictions">
                  <h3>Top predictions</h3>
                  {result.top_predictions.map((prediction) => (
                    <div className="prediction-bar" key={prediction.category}>
                      <div>
                        <span>{prediction.category.replaceAll("_", " ")}</span>
                        <strong>
                          {(prediction.probability * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <i>
                        <span
                          style={{ width: `${prediction.probability * 100}%` }}
                        />
                      </i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
        <div className="reference-submit-section">
          <div>
            <h2>4. Submit report</h2>
            <p>Review the details above and send the incident to government authorities.</p>
          </div>
          {submittedReportId ? (
            <div className="report-delivered-card">
              <CheckCircle2 size={22} />
              <div>
                <strong>Report delivered successfully</strong>
                <span>Government monitoring team · {submittedReportId}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="privacy-note">
                <ShieldCheck size={16} />
                Your report information will be handled according to the privacy policy.
              </div>
              <button
                type="button"
                className="submit-report-button"
                onClick={() => void submitReport()}
                disabled={isSubmitting || !result}
              >
                {isSubmitting ? (
                  <span className="button-spinner" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {isSubmitting ? "Submitting report..." : "Submit Noise Report"}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardPage({ liveReports }: { liveReports: ReportRecord[] }) {
  const pendingCount = liveReports.filter(
    (report) => report.status === "Pending",
  ).length;
  const highCount = liveReports.filter(
    (report) => report.severity === "High",
  ).length;
  const moderateCount = liveReports.filter(
    (report) => report.severity === "Moderate",
  ).length;
  const lowCount = liveReports.filter(
    (report) => report.severity === "Low",
  ).length;
  return (
    <main className="dashboard-content">
      <section className="welcome-section">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / OVERVIEW
          </p>
          <h1>Urban Sound Monitoring</h1>
          <p className="welcome-copy">
            {pendingCount > 0
              ? `${pendingCount} citizen report${pendingCount === 1 ? "" : "s"} awaiting review.`
              : "Monitor, analyze and understand urban sound activity."}
          </p>
        </div>
        <button className="outline-button" type="button">
          <SlidersHorizontal size={16} /> Customize view
        </button>
      </section>
      <section className="stats-grid" aria-label="Sound report summary">
        <StatCard
          label="Citizen Reports"
          value={String(liveReports.length)}
          change="Live"
          icon={FileText}
          tone="blue"
        />
        <StatCard
          label="High Severity"
          value={String(highCount)}
          change="Live"
          icon={AlertTriangle}
          tone="red"
        />
        <StatCard
          label="Moderate Severity"
          value={String(moderateCount)}
          change="Live"
          icon={Gauge}
          tone="amber"
        />
        <StatCard
          label="Low Severity"
          value={String(lowCount)}
          change="Live"
          icon={ShieldCheck}
          tone="green"
        />
      </section>
      <section className="content-grid">
        <div className="panel activity-panel">
          <PanelHeading
            title="Recent Citizen Reports"
            subtitle="Latest reports submitted by citizens"
            action="View all reports"
          />
          <RecentActivityTable liveReports={liveReports} />
        </div>
        <ActivityOverview />
      </section>
      <section className="panel hotspots-panel">
        <PanelHeading
          title="High Activity Areas"
          subtitle="Locations requiring monitoring attention"
          action="View sound map"
        />
        <div className="hotspot-grid">
          {hotspots.map((hotspot) => (
            <div className="hotspot-item" key={hotspot.name}>
              <div
                className={`hotspot-icon ${severityClass(hotspot.severity)}`}
              >
                <MapPin size={19} />
              </div>
              <div className="hotspot-copy">
                <strong>{hotspot.name}</strong>
                <span>{hotspot.detail}</span>
              </div>
              <div className="hotspot-value">
                <span
                  className={`severity-pill ${severityClass(hotspot.severity)}`}
                >
                  {hotspot.severity}
                </span>
                <small>{hotspot.level}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Sidebar({
  activePage,
  onNavigate,
  onLogout,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">
          <Activity size={22} />
        </div>
        <div>
          <strong>
            EchoMap <em>AI</em>
          </strong>
          <span>Government Dashboard</span>
        </div>
      </div>
      <div className="sidebar-divider" />
      <p className="nav-label">MAIN MENU</p>
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            className={`nav-item ${label === activePage ? "active" : ""}`}
            onClick={() => onNavigate(label)}
            type="button"
            key={label}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === activePage && (
              <ChevronRight className="nav-chevron" size={15} />
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="footer-icon">
          <ShieldCheck size={17} />
        </div>
        <div>
          <strong>Government</strong>
          <span>Monitoring Portal</span>
        </div>
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="top-header">
      <div className="mobile-menu">
        <Menu size={21} />
      </div>
      <div>
        <h2>Urban Sound Monitoring</h2>
        <p>AI-powered environmental sound intelligence</p>
      </div>
      <div className="header-actions">
        <button
          className="icon-button"
          aria-label="Notifications"
          type="button"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <button
          type="button"
          className="user-profile"
          onClick={onLogout}
          aria-label="Logout government session"
        >
          <div className="avatar">GA</div>
          <div>
            <strong>Government Authority</strong>
            <span>Administrator</span>
          </div>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof FileText;
  tone: string;
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="stat-card-top">
        <span>{label}</span>
        <span className="stat-period">This month</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-change">
        <span className="change-arrow">↑</span> {change}{" "}
        <span>from last month</span>
      </div>
    </article>
  );
}

function PanelHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: string;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="text-button" type="button">
          {action}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function RecentActivityTable({ liveReports }: { liveReports: ReportRecord[] }) {
  const rows =
    liveReports.length > 0
      ? liveReports.slice(0, 5)
      : initialReports.slice(0, 5);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Sound Type</th>
            <th>Location</th>
            <th>Severity</th>
            <th>Estimated Level</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((report) => (
            <tr key={report.id}>
              <td>
                <span className="sound-name">
                  <Volume2 size={15} />
                  {report.sound}
                </span>
              </td>
              <td>{report.location}</td>
              <td>
                <span
                  className={`severity-pill ${severityClass(report.severity)}`}
                >
                  {report.severity}
                </span>
              </td>
              <td className="level-cell">{report.level}</td>
              <td>{report.reportedAt}</td>
              <td>
                <span className={`status ${report.status.toLowerCase()}`}>
                  <span />
                  {report.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityOverview() {
  return (
    <div className="panel overview-panel">
      <PanelHeading
        title="Sound Activity Overview"
        subtitle="Reports captured over the last 7 days"
        action=""
      />
      <div className="chart-placeholder">
        <div className="chart-gridlines">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="chart-bars">
          <i style={{ height: "42%" }} />
          <i style={{ height: "58%" }} />
          <i style={{ height: "49%" }} />
          <i style={{ height: "76%" }} />
          <i style={{ height: "63%" }} />
          <i style={{ height: "91%" }} />
          <i style={{ height: "72%" }} />
        </div>
        <div className="chart-days">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="chart-message">
          <BarChart3 size={22} />
          <span>Sound activity analytics will appear here.</span>
        </div>
      </div>
    </div>
  );
}

function ReportsPage({
  liveReports,
  liveReportIds,
  onRefresh,
}: {
  liveReports: ReportRecord[];
  liveReportIds: Set<string>;
  onRefresh: () => Promise<void>;
}) {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All Severity");
  const [soundType, setSoundType] = useState("All Sound Types");
  const [status, setStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState("Today");
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(
    null,
  );
  useEffect(() => {
    setReports(liveReports.length > 0 ? liveReports : initialReports);
  }, [liveReports]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = `${report.sound} ${report.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSeverity =
      severity === "All Severity" || report.severity === severity;
    const matchesSound =
      soundType === "All Sound Types" || report.sound === soundType;
    const matchesStatus = status === "All Status" || report.status === status;
    return matchesSearch && matchesSeverity && matchesSound && matchesStatus;
  });

  function clearFilters() {
    setSearch("");
    setSeverity("All Severity");
    setSoundType("All Sound Types");
    setStatus("All Status");
    setDateRange("Today");
  }

  async function markReviewed() {
    if (!selectedReport) return;
    if (liveReportIds.has(selectedReport.id)) {
      const token = window.sessionStorage.getItem("echomap-government-token");
      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        setReports((current) =>
          current.map((report) =>
            report.id === selectedReport.id
              ? { ...report, status: "Reviewed" }
              : report,
          ),
        );
        setSelectedReport({ ...selectedReport, status: "Reviewed" });
        await onRefresh();
      }
      return;
    }
    setReports((current) =>
      current.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: "Reviewed" }
          : report,
      ),
    );
    setSelectedReport({ ...selectedReport, status: "Reviewed" });
  }

  const liveHigh = liveReports.filter(
    (report) => report.severity === "High",
  ).length;
  const liveModerate = liveReports.filter(
    (report) => report.severity === "Moderate",
  ).length;
  const liveLow = liveReports.filter(
    (report) => report.severity === "Low",
  ).length;
  return (
    <main className="dashboard-content reports-page">
      <section className="reports-heading">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / REPORT REVIEW
          </p>
          <h1>Sound Reports</h1>
          <p className="welcome-copy">
            Review and monitor environmental sound reports from citizens.
          </p>
        </div>
        <span className="total-reports-label">
          <FileText size={15} />
          {liveReports.length} live citizen reports
        </span>
      </section>
      <section className="stats-grid reports-stats">
        <StatCard
          label="Citizen Reports"
          value={String(liveReports.length)}
          change="Live"
          icon={FileText}
          tone="blue"
        />
        <StatCard
          label="High Severity"
          value={String(liveHigh)}
          change="Live"
          icon={AlertTriangle}
          tone="red"
        />
        <StatCard
          label="Moderate Severity"
          value={String(liveModerate)}
          change="Live"
          icon={Gauge}
          tone="amber"
        />
        <StatCard
          label="Low Severity"
          value={String(liveLow)}
          change="Live"
          icon={ShieldCheck}
          tone="green"
        />
      </section>
      <section className="report-filters panel">
        <div className="filter-heading">
          <div>
            <h2>Filter Reports</h2>
            <p>Refine the report list by sound activity and review status.</p>
          </div>
          <Filter size={18} color="var(--blue)" />
        </div>
        <div className="filter-controls">
          <label className="report-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by sound type or location"
            />
          </label>
          <ReportSelect
            value={severity}
            onChange={setSeverity}
            options={["All Severity", "High", "Moderate", "Low"]}
          />
          <ReportSelect
            value={soundType}
            onChange={setSoundType}
            options={[
              "All Sound Types",
              ...Array.from(new Set(liveReports.map((report) => report.sound))),
            ]}
          />
          <ReportSelect
            value={status}
            onChange={setStatus}
            options={["All Status", "Pending", "Reviewed"]}
          />
          <ReportSelect
            value={dateRange}
            onChange={setDateRange}
            options={["Today", "This Week", "This Month"]}
          />
          <button
            className="clear-filters"
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </section>
      <section className="reports-table-panel panel">
        <div className="reports-table-heading">
          <div>
            <h2>Environmental Sound Reports</h2>
            <p>{filteredReports.length} reports match the current filters</p>
          </div>
          <span className="live-count">
            <span />
            Live citizen data
          </span>
        </div>
        <div className="table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Sound Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Estimated Level</th>
                <th>Reported At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <ReportTableRow
                  key={report.id}
                  report={report}
                  onView={() => setSelectedReport(report)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing {filteredReports.length} live reports</span>
        </div>
      </section>
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onMarkReviewed={markReviewed}
        />
      )}
    </main>
  );
}

function ReportSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      className="report-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function ReportTableRow({
  report,
  onView,
}: {
  report: ReportRecord;
  onView: () => void;
}) {
  return (
    <tr>
      <td className="report-id">{report.id}</td>
      <td>
        <span className="sound-name">
          <Volume2 size={15} />
          {report.sound}
        </span>
      </td>
      <td>{report.location}</td>
      <td>
        <span className={`severity-pill ${severityClass(report.severity)}`}>
          {report.severity}
        </span>
      </td>
      <td className="level-cell">{report.level}</td>
      <td>{report.reportedAt}</td>
      <td>
        <span className={`status ${report.status.toLowerCase()}`}>
          <span />
          {report.status}
        </span>
      </td>
      <td>
        <button className="view-report-button" type="button" onClick={onView}>
          <Eye size={14} />
          View
        </button>
      </td>
    </tr>
  );
}

function ReportDetailsModal({
  report,
  onClose,
  onMarkReviewed,
}: {
  report: ReportRecord;
  onClose: () => void;
  onMarkReviewed: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="report-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close report details"
        >
          <X size={18} />
        </button>
        <p className="section-kicker">REPORT DETAILS</p>
        <h2 id="report-dialog-title">
          {report.id} · {report.sound}
        </h2>
        <p className="modal-description">{report.description}</p>
        <div className="detail-grid">
          <Detail label="Report ID" value={report.id} />
          <Detail label="Sound Type" value={report.sound} />
          <Detail label="Location" value={report.location} />
          <Detail label="Nearby Landmark" value={report.landmark || "Not provided"} />
          <Detail label="Frequency" value={report.frequency || "Daily"} />
          <Detail label="Estimated Sound Level" value={report.level} />
          <Detail
            label="Severity"
            value={report.severity}
            tone={report.severity}
          />
          <Detail label="Reported Time" value={report.reportedAt} />
          <Detail
            label="Status"
            value={report.status}
            tone={report.status === "Pending" ? "Moderate" : "Low"}
          />
          <Detail label="AI Confidence" value={report.confidence} />
        </div>
        <div className="modal-actions">
          <button className="modal-secondary" type="button" onClick={onClose}>
            Close
          </button>
          {report.status === "Pending" && (
            <button
              className="modal-primary"
              type="button"
              onClick={onMarkReviewed}
            >
              <Check size={15} />
              Mark as Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: Severity;
}) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong className={tone ? severityClass(tone) : ""}>{value}</strong>
    </div>
  );
}

function AnalyticsPage({ liveReports }: { liveReports: ReportRecord[] }) {
  const [range, setRange] = useState<AnalyticsRange>("Last 7 Days");
  const ranges: AnalyticsRange[] = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
  ];
  const soundCounts = liveReports.reduce<Record<string, number>>(
    (counts, report) => {
      counts[report.sound] = (counts[report.sound] || 0) + 1;
      return counts;
    },
    {},
  );
  const dominantSound =
    Object.entries(soundCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No reports";
  const levels = liveReports
    .map((report) => Number.parseFloat(report.level))
    .filter(Number.isFinite);
  const averageLevel = levels.length
    ? (levels.reduce((sum, level) => sum + level, 0) / levels.length).toFixed(1)
    : "0.0";
  const highCount = liveReports.filter(
    (report) => report.severity === "High",
  ).length;
  const highRate = liveReports.length
    ? ((highCount / liveReports.length) * 100).toFixed(1)
    : "0.0";
  const liveSoundData = Object.entries(soundCounts).map(
    ([name, count], index) => ({
      name,
      value: liveReports.length
        ? Math.round((count / liveReports.length) * 100)
        : 0,
      color: [
        "#1677FF",
        "#14B8A6",
        "#8B5CF6",
        "#F59E0B",
        "#DC2626",
        "#0EA5E9",
        "#94A3B8",
      ][index % 7],
    }),
  );
  const liveSeverityData = [
    { name: "High", reports: highCount, color: "#DC2626" },
    {
      name: "Moderate",
      reports: liveReports.filter((report) => report.severity === "Moderate")
        .length,
      color: "#F59E0B",
    },
    {
      name: "Low",
      reports: liveReports.filter((report) => report.severity === "Low").length,
      color: "#16A34A",
    },
  ];

  return (
    <main className="dashboard-content analytics-page">
      <section className="analytics-heading">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / INSIGHTS
          </p>
          <h1>Sound Analytics</h1>
          <p className="welcome-copy">
            Live analysis from citizen-submitted sound reports.
          </p>
        </div>
        <div className="analytics-actions">
          <select
            className="range-select"
            value={range}
            onChange={(event) => setRange(event.target.value as AnalyticsRange)}
            aria-label="Analytics date range"
          >
            {ranges.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button className="download-button" type="button">
            <Download size={15} /> Download Report
          </button>
        </div>
      </section>
      <section className="stats-grid analytics-stats">
        <AnalyticsStatCard
          label="Total Reports"
          value={String(liveReports.length)}
          icon={FileText}
          tone="blue"
        />
        <AnalyticsStatCard
          label="Average Estimated Level"
          value={`${averageLevel} dB`}
          icon={Volume2}
          tone="teal"
        />
        <AnalyticsStatCard
          label="High Severity Rate"
          value={`${highRate}%`}
          icon={AlertTriangle}
          tone="red"
        />
        <AnalyticsStatCard
          label="Most Detected Sound"
          value={dominantSound}
          icon={Activity}
          tone="amber"
        />
      </section>
      <section className="analytics-grid">
        <LiveTrendChart range={range} reports={liveReports} />
        <LiveSoundTypeChart data={liveSoundData} />
        <LiveSeverityChart data={liveSeverityData} />
        <LiveHourlyChart reports={liveReports} />
      </section>
      <section className="insights-section">
        <div className="insights-heading">
          <div>
            <h2>Key Insights</h2>
            <p>Generated from the current citizen report database.</p>
          </div>
          <ShieldCheck size={18} color="var(--teal)" />
        </div>
        <div className="insights-grid">
          <InsightCard
            icon="peak"
            title="Peak Activity"
            text={
              liveReports.length
                ? `${liveReports.length} citizen reports are available for live monitoring.`
                : "No citizen reports are available yet."
            }
          />
          <InsightCard
            icon="common"
            title="Common Sound"
            text={`${dominantSound} is the most frequently reported sound.`}
          />
          <InsightCard
            icon="severity"
            title="High Severity Areas"
            text={
              highCount
                ? `${highCount} citizen report${highCount === 1 ? "" : "s"} have high severity.`
                : "No high-severity citizen reports are currently recorded."
            }
          />
        </div>
      </section>
    </main>
  );
}

function AnalyticsStatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof FileText;
  tone: string;
}) {
  return (
    <article className="stat-card analytics-stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <span className="analytics-stat-label">{label}</span>
      <strong className="analytics-stat-value">{value}</strong>
      <span className="analytics-stat-note">Mock period summary</span>
    </article>
  );
}

function ChartPanel({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`panel analytics-panel ${className}`}>
      <div className="analytics-panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="chart-status">LIVE DATA</span>
      </div>
      {children}
    </div>
  );
}

function LiveTrendChart({
  range,
  reports,
}: {
  range: AnalyticsRange;
  reports: ReportRecord[];
}) {
  const data = Array.from({ length: 7 }, (_, index) => {
    const label = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index];
    return {
      label,
      reports: reports.filter((_, reportIndex) => reportIndex % 7 === index)
        .length,
    };
  });
  return (
    <ChartPanel
      title="Citizen Report Trend"
      subtitle={`Current reports · ${range}`}
      className="trend-chart-panel"
    >
      <div className="chart-wrap trend-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e7edf4"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8797aa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#8797aa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e6edf5",
                borderRadius: 7,
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="reports"
              stroke="#1677FF"
              strokeWidth={3}
              dot={{ fill: "#1677FF", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

function LiveSoundTypeChart({
  data,
}: {
  data: Array<{ name: string; value: number; color: string }>;
}) {
  const chartData =
    data.length > 0
      ? data
      : [{ name: "No reports", value: 100, color: "#94A3B8" }];
  return (
    <ChartPanel
      title="Sound Type Distribution"
      subtitle="Share of live citizen detections"
    >
      <div className="donut-layout">
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <strong>100%</strong>
            <span>Total share</span>
          </div>
        </div>
        <div className="donut-legend">
          {chartData.map((item) => (
            <div key={item.name}>
              <span>
                <i style={{ background: item.color }} />
                {item.name}
              </span>
              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </ChartPanel>
  );
}

function LiveSeverityChart({
  data,
}: {
  data: Array<{ name: string; reports: number; color: string }>;
}) {
  return (
    <ChartPanel
      title="Severity Distribution"
      subtitle="Live citizen reports grouped by severity"
    >
      <div className="chart-wrap severity-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 3, right: 20, left: 15, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e7edf4"
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#8797aa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="reports" radius={[0, 5, 5, 0]}>
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

function LiveHourlyChart({ reports }: { reports: ReportRecord[] }) {
  const data = Array.from({ length: 12 }, (_, index) => ({
    label: `${index * 2}:00`,
    reports: reports.filter((report) => {
      const hourMatch = report.reportedAt.match(/(\d{1,2}):(\d{2})\s(AM|PM)/i);
      if (!hourMatch) return false;
      let hour = Number(hourMatch[1]) % 12;
      if (hourMatch[3].toUpperCase() === "PM") hour += 12;
      return hour >= index * 2 && hour < index * 2 + 2;
    }).length,
  }));
  return (
    <ChartPanel
      title="Hourly Citizen Activity"
      subtitle="Live reports by time of day"
      className="hourly-chart-panel"
    >
      <div className="chart-wrap hourly-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e7edf4"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8797aa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#8797aa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="reports"
              stroke="#14B8A6"
              strokeWidth={3}
              dot={{ fill: "#14B8A6", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

function InsightCard({
  icon,
  title,
  text,
}: {
  icon: "peak" | "common" | "severity";
  title: string;
  text: string;
}) {
  const Icon =
    icon === "peak" ? BarChart3 : icon === "common" ? Volume2 : AlertTriangle;
  return (
    <article className={`insight-card ${icon}`}>
      <div className="insight-icon">
        <Icon size={18} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

type ProfileFields = {
  name: string;
  role: string;
  organization: string;
  email: string;
};

function SettingsPage() {
  const initialProfile: ProfileFields = {
    name: "Government Authority",
    role: "Administrator",
    organization: "Urban Environmental Monitoring Department",
    email: "authority@echomap.ai",
  };
  const [profile, setProfile] = useState(initialProfile);
  const [draftProfile, setDraftProfile] = useState(initialProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [confirmation, setConfirmation] = useState<"reset" | "clear" | null>(
    null,
  );
  const [notifications, setNotifications] = useState({
    high: true,
    hotspots: true,
    updates: true,
    daily: false,
  });
  const [preferences, setPreferences] = useState({
    view: "Overview",
    date: "Last 7 Days",
    colors: true,
    autoRefresh: false,
    interval: "5 minutes",
  });
  const [privacy, setPrivacy] = useState({ location: true, identity: false });

  function saveProfile() {
    setProfile(draftProfile);
    setEditingProfile(false);
  }
  function cancelProfile() {
    setDraftProfile(profile);
    setEditingProfile(false);
  }
  function confirmAction() {
    if (confirmation === "reset")
      setPreferences({
        view: "Overview",
        date: "Last 7 Days",
        colors: true,
        autoRefresh: false,
        interval: "5 minutes",
      });
    if (confirmation === "clear") {
      setNotifications({
        high: true,
        hotspots: true,
        updates: true,
        daily: false,
      });
      setPrivacy({ location: true, identity: false });
    }
    setConfirmation(null);
  }

  return (
    <main className="dashboard-content settings-page">
      <section className="settings-heading">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / ADMINISTRATION
          </p>
          <h1>Dashboard Settings</h1>
          <p className="welcome-copy">
            Manage monitoring preferences, notifications, data display, and
            administrator settings.
          </p>
        </div>
      </section>
      <div className="settings-grid">
        <SettingsSection
          title="Administrator Profile"
          icon={<UsersIcon />}
          className="profile-settings"
        >
          <div className="profile-fields">
            {(["name", "role", "organization", "email"] as const).map(
              (field) => (
                <SettingField
                  key={field}
                  label={
                    field === "name"
                      ? "Name"
                      : field === "role"
                        ? "Role"
                        : field === "organization"
                          ? "Organization"
                          : "Email"
                  }
                  value={editingProfile ? draftProfile[field] : profile[field]}
                  editable={editingProfile}
                  onChange={(value) =>
                    setDraftProfile({ ...draftProfile, [field]: value })
                  }
                />
              ),
            )}
          </div>
          {editingProfile ? (
            <div className="settings-actions">
              <button
                className="settings-secondary"
                type="button"
                onClick={cancelProfile}
              >
                Cancel
              </button>
              <button
                className="settings-primary"
                type="button"
                onClick={saveProfile}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              className="settings-primary"
              type="button"
              onClick={() => {
                setDraftProfile(profile);
                setEditingProfile(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </SettingsSection>
        <SettingsSection title="Notifications" icon={<Bell size={18} />}>
          <SettingToggle
            label="High Severity Alerts"
            description="Receive alerts when high-severity sound activity is detected."
            value={notifications.high}
            onChange={(value) =>
              setNotifications({ ...notifications, high: value })
            }
          />
          <SettingToggle
            label="Hotspot Alerts"
            description="Receive notifications when a new sound hotspot is identified."
            value={notifications.hotspots}
            onChange={(value) =>
              setNotifications({ ...notifications, hotspots: value })
            }
          />
          <SettingToggle
            label="Report Updates"
            description="Receive updates when submitted reports are reviewed."
            value={notifications.updates}
            onChange={(value) =>
              setNotifications({ ...notifications, updates: value })
            }
          />
          <SettingToggle
            label="Daily Summary"
            description="Receive a daily summary of urban sound activity."
            value={notifications.daily}
            onChange={(value) =>
              setNotifications({ ...notifications, daily: value })
            }
          />
        </SettingsSection>
        <SettingsSection
          title="Dashboard Preferences"
          icon={<SlidersHorizontal size={18} />}
        >
          <SettingSelect
            label="Default Dashboard View"
            value={preferences.view}
            options={["Overview", "Sound Map", "Analytics"]}
            onChange={(value) =>
              setPreferences({ ...preferences, view: value })
            }
          />
          <SettingSelect
            label="Default Date Range"
            value={preferences.date}
            options={["Today", "Last 7 Days", "Last 30 Days"]}
            onChange={(value) =>
              setPreferences({ ...preferences, date: value })
            }
          />
          <SettingToggle
            label="Show Severity Colors"
            value={preferences.colors}
            onChange={(value) =>
              setPreferences({ ...preferences, colors: value })
            }
          />
          <SettingToggle
            label="Auto Refresh"
            value={preferences.autoRefresh}
            onChange={(value) =>
              setPreferences({ ...preferences, autoRefresh: value })
            }
          />
          <SettingSelect
            label="Auto Refresh Interval"
            value={preferences.interval}
            options={["1 minute", "5 minutes", "15 minutes", "30 minutes"]}
            onChange={(value) =>
              setPreferences({ ...preferences, interval: value })
            }
          />
        </SettingsSection>
        <SettingsSection
          title="Data & Privacy"
          icon={<ShieldCheck size={18} />}
        >
          <p className="settings-description">
            Reports are retained according to the configured monitoring policy.
          </p>
          <SettingToggle
            label="Show Location Data"
            value={privacy.location}
            onChange={(value) => setPrivacy({ ...privacy, location: value })}
          />
          <SettingToggle
            label="Show Citizen Identity"
            value={privacy.identity}
            onChange={(value) => setPrivacy({ ...privacy, identity: value })}
          />
          <p className="settings-note">
            These privacy controls are local UI settings for the demo
            environment.
          </p>
        </SettingsSection>
        <SettingsSection
          title="System Information"
          icon={<Activity size={18} />}
        >
          <SystemRow
            label="Application"
            value="EchoMap AI Government Dashboard"
          />
          <SystemRow label="Version" value="1.0.0" />
          <SystemRow label="Environment" value="Development" />
          <SystemRow label="Data Source" value="Mock Data" />
          <SystemRow
            label="Backend Status"
            value="Not Connected"
            status="offline"
          />
          <SystemRow label="ML Model" value="Not Connected" status="offline" />
          <SystemRow label="Database" value="Not Connected" status="offline" />
        </SettingsSection>
        <SettingsSection
          title="Administrative Actions"
          icon={<AlertTriangle size={18} />}
          className="danger-settings"
        >
          <div className="danger-copy">
            Reset or clear only affects local demo preferences and state.
          </div>
          <div className="danger-actions">
            <button
              className="danger-button"
              type="button"
              onClick={() => setConfirmation("reset")}
            >
              <RotateCcw size={15} />
              Reset Dashboard Preferences
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={() => setConfirmation("clear")}
            >
              <Trash2 size={15} />
              Clear Local Demo Data
            </button>
          </div>
        </SettingsSection>
      </div>
      {confirmation && (
        <ConfirmationModal
          action={confirmation}
          onClose={() => setConfirmation(null)}
          onConfirm={confirmAction}
        />
      )}
    </main>
  );
}

function UsersIcon() {
  return <Activity size={18} />;
}
function SettingsSection({
  title,
  icon,
  className = "",
  children,
}: {
  title: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`panel settings-section ${className}`}>
      <div className="settings-section-heading">
        <div className="settings-section-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>Local dashboard configuration</p>
        </div>
      </div>
      {children}
    </section>
  );
}
function SettingField({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="setting-field">
      <span>{label}</span>
      {editable ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <strong>{value}</strong>
      )}
    </label>
  );
}
function SettingToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="web-setting-row">
      <div>
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </div>
      <button
        className={`web-toggle ${value ? "on" : ""}`}
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  );
}
function SettingSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="setting-select-row">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
function SystemRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "offline";
}) {
  return (
    <div className="system-row">
      <span>{label}</span>
      {status ? (
        <strong className="system-badge offline">{value}</strong>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}
function ConfirmationModal({
  action,
  onClose,
  onConfirm,
}: {
  action: "reset" | "clear";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const title =
    action === "reset"
      ? "Reset Dashboard Preferences?"
      : "Clear Local Demo Data?";
  const message =
    action === "reset"
      ? "This will restore the local dashboard preferences to their defaults."
      : "This will restore local demo settings to their initial state.";
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirmation-modal" role="dialog" aria-modal="true">
        <button
          className="modal-close"
          type="button"
          aria-label="Close confirmation"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="confirmation-icon">
          <AlertTriangle size={22} />
        </div>
        <h2>{title}</h2>
        <p>{message} No backend or permanent data will be changed.</p>
        <div className="modal-actions">
          <button className="modal-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="danger-confirm" type="button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function HotspotsPage({ liveReports }: { liveReports: ReportRecord[] }) {
  const [dateRange, setDateRange] = useState("Today");
  const [severity, setSeverity] = useState("All");
  const [soundType, setSoundType] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotRecord | null>(
    null,
  );
  const grouped = liveReports.reduce<Record<string, ReportRecord[]>>(
    (groups, report) => {
      const location = report.location.trim() || "Citizen submitted location";
      groups[location] = [...(groups[location] || []), report];
      return groups;
    },
    {},
  );
  const liveHotspots: HotspotRecord[] = Object.entries(grouped).map(
    ([area, reports], index) => {
      const highSeverity = reports.filter(
        (report) => report.severity === "High",
      ).length;
      const levels = reports
        .map((report) => Number.parseFloat(report.level))
        .filter(Number.isFinite);
      const average = levels.length
        ? levels.reduce((sum, level) => sum + level, 0) / levels.length
        : 0;
      const dominant =
        Object.entries(
          reports.reduce<Record<string, number>>((counts, report) => {
            counts[report.sound] = (counts[report.sound] || 0) + 1;
            return counts;
          }, {}),
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unspecified";
      const severityValue: HotspotSeverity =
        highSeverity > 0
          ? "High"
          : reports.some((report) => report.severity === "Moderate")
            ? "Moderate"
            : "Low";
      return {
        id: `live-${index}`,
        area,
        reports: reports.length,
        highSeverity,
        dominantSound: dominant,
        averageLevel: `${average.toFixed(1)} dB`,
        severity: severityValue,
        status: reports.some((report) => report.status === "Pending")
          ? "Active"
          : "Monitoring",
        lastReported: reports[0]?.reportedAt || "Recently",
        soundTypes: Array.from(new Set(reports.map((report) => report.sound))),
        x: 18 + ((index * 29) % 64),
        y: 20 + ((index * 37) % 58),
      };
    },
  );
  const visibleHotspots = liveHotspots.filter((hotspot) => {
    const matchesSeverity = severity === "All" || hotspot.severity === severity;
    const normalizedSound =
      hotspot.dominantSound === "Heavy Traffic"
        ? "Traffic"
        : hotspot.dominantSound;
    const matchesSound = soundType === "All" || normalizedSound === soundType;
    return matchesSeverity && matchesSound;
  });

  function refreshData() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 500);
  }

  const activeHotspots = liveHotspots.filter(
    (hotspot) => hotspot.status === "Active",
  ).length;
  const highRiskHotspots = liveHotspots.filter(
    (hotspot) => hotspot.severity === "High",
  ).length;
  const mostAffectedArea =
    [...liveHotspots].sort((a, b) => b.reports - a.reports)[0]?.area ||
    "No reported area";

  return (
    <main className="dashboard-content hotspots-page">
      <section className="hotspots-page-heading">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / AREA INTELLIGENCE
          </p>
          <h1>Sound Hotspots</h1>
          <p className="welcome-copy">
            Live hotspots derived from citizen report locations.
          </p>
        </div>
      </section>
      <section className="hotspot-controls panel">
        <label>
          <span>Date Range</span>
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </label>
        <label>
          <span>Severity</span>
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Moderate</option>
            <option>Low</option>
          </select>
        </label>
        <label>
          <span>Sound Type</span>
          <select
            value={soundType}
            onChange={(event) => setSoundType(event.target.value)}
          >
            <option>All</option>
            <option>Traffic</option>
            <option>Construction</option>
            <option>Horn</option>
            <option>Siren</option>
            <option>Drilling</option>
            <option>Crowd</option>
          </select>
        </label>
        <button className="refresh-button" type="button" onClick={refreshData}>
          <RefreshCw className={refreshing ? "spinning" : ""} size={15} />{" "}
          Refresh Data
        </button>
      </section>
      <section className="stats-grid hotspot-stats">
        <HotspotStat
          label="Active Hotspots"
          value={String(activeHotspots)}
          icon={Activity}
          tone="blue"
        />
        <HotspotStat
          label="High-Risk Hotspots"
          value={String(highRiskHotspots)}
          icon={AlertTriangle}
          tone="red"
        />
        <HotspotStat
          label="Repeated Hotspots"
          value={String(liveHotspots.length)}
          icon={RefreshCw}
          tone="amber"
        />
        <HotspotStat
          label="Most Affected Area"
          value={mostAffectedArea}
          icon={MapPin}
          tone="teal"
        />
      </section>
      <section className="panel hotspot-overview">
        <div className="hotspot-overview-heading">
          <div>
            <h2>Hotspot Overview</h2>
            <p>
              Live citizen report locations · {dateRange}
            </p>
          </div>
          <span className="live-count">
            <span />
            {visibleHotspots.length} areas shown
          </span>
        </div>
        <div className="hotspot-map">
          <div className="map-grid" />
          <div className="map-river" />
          <div className="map-road road-a" />
          <div className="map-road road-b" />
          <div className="map-road road-c" />
          <div className="map-road road-d" />
          <div className="map-road road-e" />
          <div className="map-road road-f" />
          <span className="area-label area-one">NORTH DISTRICT</span>
          <span className="area-label area-two">CENTRAL DISTRICT</span>
          <span className="area-label area-three">HOSPITAL ROAD</span>
          <span className="area-label area-four">INDUSTRIAL AREA</span>
          {visibleHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              aria-label={`View ${hotspot.area} hotspot`}
              className={`hotspot-marker ${hotspot.severity.toLowerCase()}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <span>{hotspot.reports}</span>
            </button>
          ))}
          {selectedHotspot && (
            <HotspotPopup
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspot(null)}
            />
          )}
          <div className="map-zoom">
            <button type="button" aria-label="Zoom in">
              +
            </button>
            <button type="button" aria-label="Zoom out">
              −
            </button>
          </div>
          <div className="map-compass">N</div>
        </div>
        <div className="map-legend">
          <strong>Intensity</strong>
          <span>
            <i className="legend-dot high" />
            High intensity
          </span>
          <span>
            <i className="legend-dot moderate" />
            Moderate intensity
          </span>
          <span>
            <i className="legend-dot low" />
            Low intensity
          </span>
        </div>
      </section>
      <section className="panel hotspot-table-panel">
        <div className="hotspot-overview-heading">
          <div>
            <h2>Top Sound Hotspots</h2>
            <p>Ranked by current report activity</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="hotspot-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Area</th>
                <th>Reports</th>
                <th>High Severity</th>
                <th>Dominant Sound</th>
                <th>Avg. Estimated Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleHotspots.map((hotspot, index) => (
                <tr key={hotspot.id}>
                  <td className="rank-cell">#{index + 1}</td>
                  <td className="area-cell">{hotspot.area}</td>
                  <td>{hotspot.reports}</td>
                  <td>{hotspot.highSeverity}</td>
                  <td>{hotspot.dominantSound}</td>
                  <td className="level-cell">{hotspot.averageLevel}</td>
                  <td>
                    <span
                      className={`status ${hotspot.status === "Active" ? "pending" : "reviewed"}`}
                    >
                      <span />
                      {hotspot.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-report-button"
                      type="button"
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel breakdown-panel">
        <div className="hotspot-overview-heading">
          <div>
            <h2>Hotspot Activity Breakdown</h2>
            <p>Current reports by monitored area</p>
          </div>
          <BarChart3 size={18} color="var(--blue)" />
        </div>
        <div className="breakdown-list">
          {liveHotspots.map((hotspot) => (
            <div className="breakdown-row" key={hotspot.id}>
              <div className="breakdown-label">
                <strong>{hotspot.area}</strong>
                <span>{hotspot.reports} reports</span>
              </div>
              <div className="breakdown-track">
                <i
                  style={{
                    width: `${(hotspot.reports / Math.max(1, ...liveHotspots.map((item) => item.reports))) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function HotspotStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
  tone: string;
}) {
  return (
    <article className="stat-card hotspot-stat">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <span className="analytics-stat-label">{label}</span>
      <strong className="hotspot-stat-value">{value}</strong>
      <span className="analytics-stat-note">Mock period summary</span>
    </article>
  );
}

function HotspotPopup({
  hotspot,
  onClose,
}: {
  hotspot: HotspotRecord;
  onClose: () => void;
}) {
  return (
    <div className="hotspot-popup">
      <button
        className="popup-close"
        type="button"
        onClick={onClose}
        aria-label="Close hotspot details"
      >
        <X size={15} />
      </button>
      <p className="popup-kicker">HOTSPOT DETAILS</p>
      <h3>{hotspot.area}</h3>
      <div className="popup-location">
        <MapPin size={14} />
        {hotspot.status} monitoring area
      </div>
      <div className="hotspot-popup-details">
        <span>
          Total reports<strong>{hotspot.reports}</strong>
        </span>
        <span>
          High severity<strong>{hotspot.highSeverity}</strong>
        </span>
        <span>
          Average level<strong>{hotspot.averageLevel}</strong>
        </span>
        <span>
          Dominant sound<strong>{hotspot.dominantSound}</strong>
        </span>
      </div>
    </div>
  );
}

function SoundMapPage({ liveReports }: { liveReports: ReportRecord[] }) {
  const [selectedReport, setSelectedReport] = useState<SoundReport | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("Today");
  const [timeRange, setTimeRange] = useState("All day");
  const [refreshing, setRefreshing] = useState(false);
  const liveMapReports: SoundReport[] = liveReports.map((report, index) => ({
    id: report.id,
    sound: report.sound,
    location: report.location,
    level: report.level,
    severity: report.severity,
    time: report.reportedAt,
    x: 18 + ((index * 29) % 64),
    y: 18 + ((index * 37) % 64),
  }));
  const filteredReports = liveMapReports.filter((report) =>
    `${report.sound} ${report.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function refreshData() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 500);
  }

  return (
    <main className="dashboard-content map-page">
      <section className="welcome-section map-page-heading">
        <div>
          <p className="section-kicker">
            GOVERNMENT MONITORING PORTAL / GEO ACTIVITY
          </p>
          <h1>Urban Sound Map</h1>
          <p className="welcome-copy">
            Visualize environmental sound activity across monitored areas.
          </p>
        </div>
      </section>
      <section className="map-toolbar panel">
        <label className="search-field">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search location or sound type"
          />
        </label>
        <label className="select-field">
          <CalendarDays size={15} />
          <select
            value={date}
            onChange={(event) => setDate(event.target.value)}
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
          </select>
        </label>
        <label className="select-field">
          <Clock3 size={15} />
          <select
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
          >
            <option>All day</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>
        <button className="refresh-button" type="button" onClick={refreshData}>
          <RefreshCw className={refreshing ? "spinning" : ""} size={15} />{" "}
          Refresh Data
        </button>
      </section>
      <section className="map-layout">
        <div className="map-card panel">
          <div className="map-card-heading">
            <div>
              <h2>Monitored Urban Area</h2>
              <p>
                Live citizen report locations · {date} · {timeRange}
              </p>
            </div>
            <span className="map-status">
              <span />
              {liveReports.length} live reports
            </span>
          </div>
          <div className="city-map">
            <div className="map-grid" />
            <div className="map-river" />
            <div className="map-road road-a" />
            <div className="map-road road-b" />
            <div className="map-road road-c" />
            <div className="map-road road-d" />
            <div className="map-road road-e" />
            <div className="map-road road-f" />
            <span className="area-label area-one">NORTH DISTRICT</span>
            <span className="area-label area-two">CENTRAL AREA</span>
            <span className="area-label area-three">RIVER QUARTER</span>
            <span className="area-label area-four">INDUSTRIAL AREA</span>
            {filteredReports.map((report) => (
              <button
                className={`map-marker ${severityClass(report.severity)}`}
                key={report.id}
                onClick={() => setSelectedReport(report)}
                style={{ left: `${report.x}%`, top: `${report.y}%` }}
                aria-label={`View ${report.sound} report`}
              >
                <span />
              </button>
            ))}
            {selectedReport && (
              <MapPopup
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
              />
            )}
            <div className="map-zoom">
              <button type="button" aria-label="Zoom in">
                +
              </button>
              <button type="button" aria-label="Zoom out">
                −
              </button>
            </div>
            <div className="map-compass">N</div>
          </div>
          <div className="map-legend">
            <strong>Severity</strong>
            <span>
              <i className="legend-dot high" />
              High Severity
            </span>
            <span>
              <i className="legend-dot moderate" />
              Moderate Severity
            </span>
            <span>
              <i className="legend-dot low" />
              Low Severity
            </span>
          </div>
        </div>
        <aside className="map-side-column">
          <MapSummary liveReports={liveReports} />
          <ActiveSoundTypes liveReports={liveReports} />
        </aside>
      </section>
    </main>
  );
}

function MapPopup({
  report,
  onClose,
}: {
  report: SoundReport;
  onClose: () => void;
}) {
  return (
    <div className="map-popup">
      <button
        className="popup-close"
        onClick={onClose}
        type="button"
        aria-label="Close report details"
      >
        <X size={15} />
      </button>
      <p className="popup-kicker">SOUND REPORT</p>
      <h3>{report.sound}</h3>
      <div className="popup-location">
        <MapPin size={14} />
        {report.location}
      </div>
      <div className="popup-details">
        <span>
          Estimated level<strong>{report.level}</strong>
        </span>
        <span>
          Severity
          <strong className={severityClass(report.severity)}>
            {report.severity}
          </strong>
        </span>
        <span>
          Report time<strong>{report.time}</strong>
        </span>
      </div>
    </div>
  );
}

function MapSummary({ liveReports }: { liveReports: ReportRecord[] }) {
  const high = liveReports.filter((report) => report.severity === "High").length
  const moderate = liveReports.filter((report) => report.severity === "Moderate").length
  const low = liveReports.filter((report) => report.severity === "Low").length
  return (
    <div className="panel summary-panel">
      <div className="panel-heading">
        <div>
          <h2>Map Summary</h2>
          <p>Current monitored reports</p>
        </div>
        <Activity size={18} color="var(--blue)" />
      </div>
      <div className="summary-list">
        <SummaryRow label="Total Live Reports" value={String(liveReports.length)} />
        <SummaryRow label="High Severity" value={String(high)} tone="High" />
        <SummaryRow label="Moderate Severity" value={String(moderate)} tone="Moderate" />
        <SummaryRow label="Low Severity" value={String(low)} tone="Low" />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: Severity;
}) {
  return (
    <div className="summary-row">
      <span>
        {tone && <i className={`legend-dot ${severityClass(tone)}`} />}
        {label}
      </span>
      <strong className={tone ? severityClass(tone) : ""}>{value}</strong>
    </div>
  );
}

function ActiveSoundTypes({ liveReports }: { liveReports: ReportRecord[] }) {
  const types = Array.from(new Set(liveReports.map((report) => report.sound))).slice(0, 8)
  return (
    <div className="panel sound-types-panel">
      <div className="panel-heading">
        <div>
          <h2>Active Sound Types</h2>
          <p>Detected in the current view</p>
        </div>
        <Volume2 size={18} color="var(--teal)" />
      </div>
      <div className="sound-type-list">
        {types.length > 0 ? types.map((type) => (
          <span key={type}><Volume2 size={12} />{type}</span>
        )) : <span>No live sound types</span>}
      </div>
    </div>
  );
}

export default App;
