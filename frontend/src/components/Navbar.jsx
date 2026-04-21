export default function Navbar() {
    return (
      <nav style={{
        background: "#0F4C81", color: "white",
        padding: "14px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", background: "#3B82F6",
            borderRadius: "10px", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: "800", fontSize: "16px"
          }}>C+</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "17px" }}>ClinicalAI</div>
            <div style={{ fontSize: "11px", color: "#93C5FD" }}>
              Multilingual Patient Assistant
            </div>
          </div>
        </div>
        <div style={{ fontSize: "12px", color: "#BFDBFE" }}>
          Free · Open Source · Works for small clinics
        </div>
      </nav>
    );
  }