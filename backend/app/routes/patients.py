from fastapi import APIRouter, HTTPException
from app.services.patient_service import get_patient_history, get_all_patients, get_or_create_patient

router = APIRouter()

@router.get("/")
def list_patients():
    return get_all_patients()

@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = get_patient_history(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/register")
def register_patient(patient_id: str, name: str, age: int, language: str = "en"):
    return get_or_create_patient(patient_id, name, age, language)