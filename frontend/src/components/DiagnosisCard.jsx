const URGENCY = {
    high:   { bg: "#FEE2E2", border: "#EF4444", dot: "#EF4444", text: "#991B1B" },
    medium: { bg: "#FEF3C7", border: "#F59E0B", dot: "#F59E0B", text: "#92400E" },
    low:    { bg: "#D1FAE5", border: "#10B981", dot: "#10B981", text: "#065F46" },
  };
  
  export default function DiagnosisCard({ suggestion, index }) {
    const u = URGENCY[suggestion.urgency] || URGENCY.low;
    const conf = Math.round(suggestion.confidence * 100);
  
    return (
      <div style={{
        background: u.bg, border: `1px solid ${u.border}`,
        borderRadius: "10px", padding: "14px", marginBottom: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: u.dot, flexShrink: 0 }} />
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A", flex: 1 }}>
            {index + 1}. {suggestion.condition}
          </span>
          <span style={{
            fontSize: "11px", fontWeight: "700", padding: "2px 8px",
            borderRadius: "12px", background: "rgba(255,255,255,0.7)", color: u.text
          }}>
            {suggestion.urgency.toUpperCase()}
          </span>
        </div>
  
        {/* Confidence bar */}
        <div style={{ height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "3px", marginBottom: "4px" }}>
          <div style={{ height: "6px", width: `${conf}%`, background: u.dot, borderRadius: "3px" }} />
        </div>
        <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "8px" }}>
          Confidence: {conf}% · Triggered by: {suggestion.triggered_by?.join(", ")}
        </div>
  
        <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
          {suggestion.explanation}
        </div>
      </div>
    );
  }