import { useState } from "react";
import { loginDoctor, registerDoctor } from "../utils/api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const data = await loginDoctor(email, password);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("doctor_name", data.name);
          onLogin(data.name);
        } else {
          setError("Invalid email or password");
        }
      } else {
        const data = await registerDoctor(email, name, password);
        if (data.message) {
          setMode("login");
          setError("Registered! Please login now.");
        } else {
          setError(data.detail || "Registration failed");
        }
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F0F4F8",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "40px",
        width: "100%", maxWidth: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "52px", height: "52px", background: "#0F4C81",
            borderRadius: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: "800", fontSize: "20px",
            color: "white", margin: "0 auto 12px"
          }}>C+</div>
          <div style={{ fontWeight: "700", fontSize: "20px", color: "#0F172A" }}>ClinicalAI</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Multilingual Patient Assistant</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "24px", background: "#F1F5F9", borderRadius: "8px", padding: "3px" }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px", border: "none", borderRadius: "6px",
              cursor: "pointer", fontSize: "13px", fontWeight: "600",
              background: mode === m ? "white" : "transparent",
              color: mode === m ? "#0F4C81" : "#64748B",
            }}>
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {/* Fields */}
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name e.g. Dr. Raju"
            style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", outline: "none" }}
        />

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "8px", fontSize: "12px", marginBottom: "16px",
            background: error.includes("Registered") ? "#D1FAE5" : "#FEE2E2",
            color: error.includes("Registered") ? "#065F46" : "#991B1B"
          }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "12px", background: "#0F4C81", color: "white",
          border: "none", borderRadius: "8px", cursor: "pointer",
          fontSize: "14px", fontWeight: "700"
        }}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}