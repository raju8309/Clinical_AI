export default function ErrorBox({ message, onRetry }) {
    return (
      <div style={{
        background: "#FEF2F2", border: "1px solid #FECACA",
        borderRadius: "12px", padding: "16px 20px",
        marginBottom: "16px", display: "flex",
        alignItems: "flex-start", justifyContent: "space-between", gap: "12px"
      }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#991B1B", marginBottom: "4px" }}>
            Something went wrong
          </div>
          <div style={{ fontSize: "12px", color: "#B91C1C", lineHeight: "1.6" }}>
            {message}
          </div>
        </div>
        {onRetry && (
          <button onClick={onRetry} style={{
            padding: "6px 14px", background: "#FEE2E2",
            border: "1px solid #FECACA", borderRadius: "8px",
            cursor: "pointer", fontSize: "12px",
            fontWeight: "600", color: "#991B1B", flexShrink: 0
          }}>
            Retry
          </button>
        )}
      </div>
    );
  }