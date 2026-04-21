const BASE = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`
});

export const checkSymptoms = async (patientId, text, language) => {
  const res = await fetch(`${BASE}/api/symptoms/check`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ patient_id: patientId, text, language }),
  });
  return res.json();
};

export const generateNote = async (patientId, transcript, language) => {
  const res = await fetch(`${BASE}/api/notes/generate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ patient_id: patientId, transcript, language }),
  });
  return res.json();
};

export const getPatient = async (patientId) => {
  const res = await fetch(`${BASE}/api/patients/${patientId}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const getAllPatients = async () => {
  const res = await fetch(`${BASE}/api/patients/`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const loginDoctor = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  return res.json();
};

export const registerDoctor = async (email, name, password) => {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
  return res.json();
};