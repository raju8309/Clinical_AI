import { useState } from "react";
import Navbar from "./components/Navbar";
import SymptomChecker from "./pages/SymptomChecker";
import NoteWriter from "./pages/NoteWriter";
import PatientHistory from "./pages/PatientHistory";

const TABS = ["Symptom Checker", "Note Writer", "Patient History"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [language, setLanguage] = useState("en");
  const [patientId, setPatientId] = useState("P001");

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      {/* Patient ID + tabs bar */}
      <div style={{ background: "#1E40AF", padding: "10px 24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12px", color: "#BFDBFE", fontWeight: "500" }}>Patient ID:</span>
        <input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid #3B82F6", background: "#1E40AF", color: "white", fontSize: "12px", width: "80px", outline: "none" }}
        />
        <div style={{ marginLeft: "16px", display: "flex", gap: "4px" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "7px 16px", borderRadius: "8px", border: "none",
              cursor: "pointer", fontSize: "12px", fontWeight: "600",
              background: tab === i ? "white" : "transparent",
              color: tab === i ? "#1E40AF" : "#BFDBFE",
              transition: "all 0.15s"
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 20px" }}>
        {tab === 0 && <SymptomChecker patientId={patientId} language={language} onLanguageChange={setLanguage} />}
        {tab === 1 && <NoteWriter patientId={patientId} language={language} onLanguageChange={setLanguage} />}
        {tab === 2 && <PatientHistory />}
      </div>
    </div>
  );
}