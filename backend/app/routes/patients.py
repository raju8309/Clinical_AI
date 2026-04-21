from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.patient_service import get_patient_history, get_all_patients, get_or_create_patient
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
def list_patients(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return get_all_patients(db)

@router.get("/{patient_id}")
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    patient = get_patient_history(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/register")
def register_patient(
    patient_id: str,
    name: str,
    age: int,
    language: str = "en",
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return get_or_create_patient(db, patient_id, name, age, language)