import { useState } from "react";
import { getPatient } from "../utils/api";

export default function PatientHistory() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!patientId.trim()) return;
    setLoading(true);
    setError("");
    setPatient(null);
    try {
      const data = await getPatient(patientId);
      if (data.detail) throw new Error("Patient not found");
      setPatient(data);
    } catch (e) {
      setError("Patient not found. Check the ID.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>Search Patient History</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter Patient ID e.g. P001"
            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E2E8F0", fontSize: "14px", outline: "none" }}
          />
          <button onClick={handleSearch} disabled={loading} style={{
            padding: "10px 20px", background: "#0F4C81", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700"
          }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px", color: "#991B1B", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {patient && (
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{patient.name}</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            ID: {patient.patient_id} · {patient.visits.length} visit(s)
          </div>

          {patient.recurring_symptoms.length > 0 && (
            <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#78350F", marginBottom: "6px" }}>RECURRING SYMPTOMS</div>
              {patient.recurring_symptoms.map((s, i) => (
                <span key={i} style={{ display: "inline-block", padding: "3px 10px", background: "#FDE68A", color: "#78350F", borderRadius: "20px", fontSize: "12px", fontWeight: "600", margin: "2px" }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "10px" }}>Visit History</div>
          {patient.visits.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#94A3B8" }}>No visits recorded yet.</div>
          ) : (
            patient.visits.map((v, i) => (
              <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700" }}>Visit {i + 1}</span>
                  <span style={{ fontSize: "11px", color: "#94A3B8" }}>{new Date(v.date).toLocaleDateString()}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "12px",
                    background: v.urgency === "high" ? "#FEE2E2" : v.urgency === "medium" ? "#FEF3C7" : "#D1FAE5",
                    color: v.urgency === "high" ? "#991B1B" : v.urgency === "medium" ? "#92400E" : "#065F46"
                  }}>
                    {v.urgency?.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {v.symptoms?.map((s, j) => (
                    <span key={j} style={{ padding: "2px 8px", background: "#EFF6FF", color: "#1D4ED8", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}