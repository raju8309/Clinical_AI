from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.patient_service import get_patient_history, get_all_patients, get_or_create_patient
from app.database import get_db

router = APIRouter()

@router.get("/")
def list_patients(db: Session = Depends(get_db)):
    return get_all_patients(db)

@router.get("/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = get_patient_history(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/register")
def register_patient(patient_id: str, name: str, age: int, language: str = "en", db: Session = Depends(get_db)):
    return get_or_create_patient(db, patient_id, name, age, language)