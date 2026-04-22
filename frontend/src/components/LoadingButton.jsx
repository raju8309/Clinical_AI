export default function LoadingButton({ loading, onClick, children, loadingText = "Loading...", style = {} }) {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#93C5FD" : "#0F4C81",
          color: "white", border: "none",
          borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
          fontSize: "13px", fontWeight: "700",
          display: "flex", alignItems: "center", gap: "8px",
          transition: "background 0.2s",
          ...style
        }}
      >
        {loading && (
          <div style={{
            width: "14px", height: "14px",
            border: "2px solid rgba(255,255,255,0.4)",
            borderTop: "2px solid white",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            flexShrink: 0
          }} />
        )}
        {loading ? loadingText : children}
      </button>
    );
  }