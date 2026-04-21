const BASE = process.env.REACT_APP_API_URL;

export const checkSymptoms = async (patientId, text, language) => {
  const res = await fetch(`${BASE}/api/symptoms/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, text, language }),
  });
  return res.json();
};

export const generateNote = async (patientId, transcript, language) => {
  const res = await fetch(`${BASE}/api/notes/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, transcript, language }),
  });
  return res.json();
};

export const getPatient = async (patientId) => {
  const res = await fetch(`${BASE}/api/patients/${patientId}`);
  return res.json();
};

export const getAllPatients = async () => {
  const res = await fetch(`${BASE}/api/patients/`);
  return res.json();
};