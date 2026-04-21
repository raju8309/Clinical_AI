const SECTIONS = [
    { key: "subjective",  label: "S — Subjective",  color: "#EFF6FF" },
    { key: "objective",   label: "O — Objective",   color: "#F0FDF4" },
    { key: "assessment",  label: "A — Assessment",  color: "#FFFBEB" },
    { key: "plan",        label: "P — Plan",         color: "#FDF4FF" },
  ];
  
  export default function SOAPNote({ note }) {
    const copy = () => {
      const text = SECTIONS.map(s => `${s.label}\n${note[s.key]}`).join("\n\n");
      navigator.clipboard.writeText(text);
      alert("Note copied!");
    };
  
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>
            Generated SOAP Note
          </span>
          <button onClick={copy} style={{
            padding: "6px 12px", background: "#F1F5F9", border: "none",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
          }}>
            Copy Note
          </button>
        </div>
  
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {SECTIONS.map(({ key, label, color }) => (
            <div key={key} style={{ background: color, borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", marginBottom: "6px", letterSpacing: "0.06em" }}>
                {label}
              </div>
              <div style={{ fontSize: "13px", color: "#1E293B", lineHeight: "1.7" }}>
                {note[key] || "Not documented"}
              </div>
            </div>
          ))}
        </div>
  
        <div style={{
          background: "#FFF7ED", border: "1px solid #FED7AA",
          borderRadius: "8px", padding: "10px 14px", marginTop: "12px",
          fontSize: "12px", color: "#9A3412"
        }}>
          AI-generated note. Doctor must review before adding to patient records.
        </div>
      </div>
    );
  }