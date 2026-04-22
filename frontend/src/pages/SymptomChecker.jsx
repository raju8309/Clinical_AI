import { useState, useRef } from "react";
import LanguagePicker from "../components/LanguagePicker";
import DiagnosisCard from "../components/DiagnosisCard";
import LoadingButton from "../components/LoadingButton";
import ErrorBox from "../components/ErrorBox";
import Spinner from "../components/Spinner";
import { checkSymptoms } from "../utils/api";

const SAMPLES = {
  en: "I have severe headache and high fever for 2 days. I feel very tired and dizzy.",
  hi: "मुझे 2 दिनों से तेज सिरदर्द और बुखार है। बहुत थकान और चक्कर आ रहे हैं।",
  es: "Tengo dolor de cabeza severo y fiebre alta por 2 días. Me siento muy cansado y mareado.",
};

const BASE = process.env.REACT_APP_API_URL;

export default function SymptomChecker({ patientId, language, onLanguageChange }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await checkSymptoms(patientId, text, language);
      if (data.detail) throw new Error(data.detail);
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not analyze symptoms. Please try again.");
    }
    setLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        setTranscribing(true);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");
        formData.append("patient_id", patientId);
        formData.append("language", language);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${BASE}/api/voice/symptoms`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();
          if (data.transcribed_text) setText(data.transcribed_text);
          if (data.suggestions) setResult(data);
        } catch (e) {
          setError("Voice transcription failed. Please try typing instead.");
        }
        setTranscribing(false);
      };
      mediaRecorder.current.start();
      setRecording(true);
    } catch (e) {
      setError("Microphone access denied. Please allow microphone and try again.");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach(t => t.stop());
    setRecording(false);
  };

  return (
    <div className="fade-in">
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "20px", marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Patient describes symptoms</span>
          <LanguagePicker selected={language} onChange={onLanguageChange} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            language === "hi" ? "अपने लक्षण यहाँ लिखें या माइक बटन दबाएं..." :
            language === "es" ? "Escriba síntomas o presione el micrófono..." :
            "Type symptoms or press the mic button to speak..."
          }
          style={{
            width: "100%", minHeight: "100px", padding: "12px",
            borderRadius: "8px", border: "1.5px solid #E2E8F0",
            fontSize: "14px", fontFamily: "inherit", resize: "vertical",
            outline: "none", boxSizing: "border-box", lineHeight: "1.6",
            transition: "border-color 0.2s"
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <LoadingButton
            loading={loading}
            onClick={handleCheck}
            loadingText="Analyzing..."
          >
            Check Symptoms
          </LoadingButton>

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={transcribing}
            style={{
              padding: "10px 16px",
              background: recording ? "#EF4444" : "#10B981",
              color: "white", border: "none", borderRadius: "8px",
              cursor: transcribing ? "not-allowed" : "pointer",
              fontSize: "13px", fontWeight: "700",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            {transcribing ? "Transcribing..." : recording ? "Stop Recording" : "Speak Symptoms"}
          </button>

          {recording && (
            <span style={{
              fontSize: "12px", color: "#EF4444",
              fontWeight: "600", animation: "pulse 1s infinite"
            }}>
              Recording...
            </span>
          )}

          <button onClick={() => setText(SAMPLES[language])} style={{
            padding: "10px 16px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600",
            color: "#475569"
          }}>
            Load Sample
          </button>

          <button onClick={() => { setText(""); setResult(null); setError(""); }} style={{
            padding: "10px 16px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600",
            color: "#475569"
          }}>
            Clear
          </button>
        </div>
      </div>

      {error && <ErrorBox message={error} onRetry={handleCheck} />}
      {loading && <Spinner text="Analyzing symptoms with AI..." />}

      {result && !loading && (
        <div className="fade-in">
          {result.transcribed_text && (
            <div style={{
              background: "#F0FDF4", border: "1px solid #86EFAC",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "16px"
            }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#065F46", marginBottom: "4px" }}>
                TRANSCRIBED FROM VOICE
              </div>
              <div style={{ fontSize: "13px", color: "#065F46" }}>{result.transcribed_text}</div>
            </div>
          )}

          <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>Extracted Symptoms</div>
            <div>
              {result.extracted_symptoms?.map((s, i) => (
                <span key={i} style={{
                  display: "inline-block", padding: "4px 12px",
                  background: "#EFF6FF", color: "#1D4ED8",
                  borderRadius: "20px", fontSize: "12px",
                  fontWeight: "600", margin: "3px"
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>Possible Conditions</div>
            {result.suggestions?.map((s, i) => <DiagnosisCard key={i} suggestion={s} index={i} />)}
          </div>

          {result.follow_up_questions?.length > 0 && (
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>Follow-up Questions</div>
              {result.follow_up_questions.map((q, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: "13px", color: "#334155" }}>
                  Q{i + 1}: {q}
                </div>
              ))}
            </div>
          )}

          <div style={{
            background: "#FFF7ED", border: "1px solid #FED7AA",
            borderRadius: "10px", padding: "12px",
            fontSize: "12px", color: "#9A3412"
          }}>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}