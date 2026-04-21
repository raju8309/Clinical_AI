from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.schemas import NoteInput
from app.services.note_service import generate_soap_note
from app.services.patient_service import save_visit
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

@router.post("/generate")
def generate_note(
    body: NoteInput,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        result = generate_soap_note(body.transcript, body.language, body.patient_id)
        save_visit(db, body.patient_id, [], result["soap_note"], "low")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))