import { useState } from "react";
import LanguagePicker from "../components/LanguagePicker";
import SOAPNote from "../components/SOAPNote";
import { generateNote } from "../utils/api";

const SAMPLE = `Doctor: Good morning, how are you feeling?
Patient: Not great. I have chest pain since yesterday and difficulty breathing.
Doctor: Where is the pain exactly?
Patient: Left side. It feels tight, like pressure. Gets worse when I walk.
Doctor: Any family history of heart problems?
Patient: Yes, my father had a heart attack at 60.
Doctor: We need to run an ECG immediately.`;

export default function NoteWriter({ patientId, language, onLanguageChange }) {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await generateNote(patientId, transcript, language);
      if (data.detail) throw new Error(data.detail);
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Paste doctor-patient conversation</span>
          <LanguagePicker selected={language} onChange={onLanguageChange} />
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste the full conversation here. Works in Hindi, Spanish, or English..."
          style={{
            width: "100%", minHeight: "160px", padding: "12px",
            borderRadius: "8px", border: "1.5px solid #E2E8F0",
            fontSize: "14px", fontFamily: "inherit", resize: "vertical",
            outline: "none", boxSizing: "border-box", lineHeight: "1.6"
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleGenerate} disabled={loading} style={{
            padding: "10px 20px", background: "#0F4C81", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "700"
          }}>
            {loading ? "Generating..." : "Generate SOAP Note"}
          </button>
          <button onClick={() => setTranscript(SAMPLE)} style={{
            padding: "10px 16px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
          }}>
            Load Sample
          </button>
          <button onClick={() => { setTranscript(""); setResult(null); }} style={{
            padding: "10px 16px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
          }}>
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px", color: "#991B1B", fontSize: "13px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <SOAPNote note={result.soap_note} />
        </div>
      )}
    </div>
  );
}