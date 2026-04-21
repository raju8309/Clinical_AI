from sqlalchemy.orm import Session
from app.models.db_models import Patient, Visit
from collections import Counter
from datetime import datetime
import uuid


def get_or_create_patient(db: Session, patient_id: str, name: str = "Unknown", age: int = 0, language: str = "en") -> Patient:
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        patient = Patient(
            patient_id=patient_id,
            name=name,
            age=age,
            language=language
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient


def save_visit(db: Session, patient_id: str, symptoms: list, soap_note: dict, urgency: str) -> Visit:
    # Make sure patient exists
    get_or_create_patient(db, patient_id)

    visit = Visit(
        visit_id=str(uuid.uuid4()),
        patient_id=patient_id,
        date=datetime.utcnow(),
        symptoms=symptoms,
        soap_note=soap_note,
        urgency=urgency
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


def get_patient_history(db: Session, patient_id: str) -> dict | None:
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        return None

    visits = db.query(Visit).filter(Visit.patient_id == patient_id).all()

    # Calculate recurring symptoms
    all_symptoms = [s for v in visits for s in (v.symptoms or [])]
    counts = Counter(all_symptoms)
    recurring = [s for s, c in counts.items() if c >= 2]

    return {
        "patient_id": patient.patient_id,
        "name": patient.name,
        "age": patient.age,
        "language_preference": patient.language,
        "visits": [
            {
                "visit_id": v.visit_id,
                "date": v.date.isoformat(),
                "symptoms": v.symptoms or [],
                "soap_note": v.soap_note,
                "urgency": v.urgency
            }
            for v in visits
        ],
        "recurring_symptoms": recurring
    }


def get_all_patients(db: Session) -> list:
    patients = db.query(Patient).all()
    return [
        {
            "patient_id": p.patient_id,
            "name": p.name,
            "age": p.age,
            "language_preference": p.language,
        }
        for p in patients
    ]