export default function Spinner({ text = "Loading..." }) {
    return (
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: "12px",
        padding: "40px", flexDirection: "column"
      }}>
        <div style={{
          width: "36px", height: "36px",
          border: "3px solid #E2E8F0",
          borderTop: "3px solid #0F4C81",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>
          {text}
        </span>
      </div>
    );
  }