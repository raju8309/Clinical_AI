const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "es", label: "Español" },
  ];
  
  export default function LanguagePicker({ selected, onChange }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500" }}>
          Language:
        </span>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => onChange(l.code)}
            style={{
              padding: "5px 14px", borderRadius: "20px", border: "none",
              cursor: "pointer", fontSize: "12px", fontWeight: "600",
              background: selected === l.code ? "#0F4C81" : "#F1F5F9",
              color: selected === l.code ? "white" : "#475569",
              transition: "all 0.15s",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }