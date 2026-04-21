import { useState } from "react";
import LanguagePicker from "../components/LanguagePicker";
import DiagnosisCard from "../components/DiagnosisCard";
import { checkSymptoms } from "../utils/api";

const SAMPLES = {
  en: "I have severe headache and high fever for 2 days. I feel very tired and dizzy.",
  hi: "मुझे 2 दिनों से तेज सिरदर्द और बुखार है। बहुत थकान और चक्कर आ रहे हैं।",
  es: "Tengo dolor de cabeza severo y fiebre alta por 2 días. Me siento muy cansado y mareado.",
};

export default function SymptomChecker({ patientId, language, onLanguageChange }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Patient describes symptoms</span>
          <LanguagePicker selected={language} onChange={onLanguageChange} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={language === "hi" ? "अपने लक्षण यहाँ लिखें..." : language === "es" ? "Describa sus síntomas..." : "Type symptoms here..."}
          style={{
            width: "100%", minHeight: "100px", padding: "12px",
            borderRadius: "8px", border: "1.5px solid #E2E8F0",
            fontSize: "14px", fontFamily: "inherit", resize: "vertical",
            outline: "none", boxSizing: "border-box", lineHeight: "1.6"
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleCheck} disabled={loading} style={{
            padding: "10px 20px", background: "#0F4C81", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "700"
          }}>
            {loading ? "Analyzing..." : "Check Symptoms"}
          </button>
          <button onClick={() => setText(SAMPLES[language])} style={{
            padding: "10px 16px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
          }}>
            Load Sample
          </button>
          <button onClick={() => { setText(""); setResult(null); }} style={{
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
        <>
          <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>Extracted Symptoms</div>
            <div>
              {result.extracted_symptoms?.map((s, i) => (
                <span key={i} style={{ display: "inline-block", padding: "4px 12px", background: "#EFF6FF", color: "#1D4ED8", borderRadius: "20px", fontSize: "12px", fontWeight: "600", margin: "3px" }}>
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

          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "10px", padding: "12px", fontSize: "12px", color: "#9A3412" }}>
            {result.disclaimer}
          </div>
        </>
      )}
    </div>
  );
}