from datetime import datetime
from collections import Counter
import uuid

_patients: dict = {}

def get_or_create_patient(patient_id: str, name: str = "Unknown", age: int = 0, language: str = "en") -> dict:
    if patient_id not in _patients:
        _patients[patient_id] = {
            "patient_id": patient_id,
            "name": name,
            "age": age,
            "language_preference": language,
            "visits": [],
            "recurring_symptoms": []
        }
    return _patients[patient_id]

def save_visit(patient_id: str, symptoms: list, soap_note: dict, urgency: str) -> dict:
    patient = _patients.get(patient_id) or get_or_create_patient(patient_id)
    visit = {
        "visit_id": str(uuid.uuid4()),
        "date": datetime.utcnow().isoformat(),
        "symptoms": symptoms,
        "soap_note": soap_note,
        "urgency": urgency
    }
    patient["visits"].append(visit)
    all_symptoms = [s for v in patient["visits"] for s in v["symptoms"]]
    counts = Counter(all_symptoms)
    patient["recurring_symptoms"] = [s for s, c in counts.items() if c >= 2]
    return patient

def get_patient_history(patient_id: str):
    return _patients.get(patient_id)

def get_all_patients() -> list:
    return list(_patients.values())