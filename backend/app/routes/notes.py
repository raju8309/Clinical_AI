from fastapi import APIRouter, HTTPException
from app.models.schemas import NoteInput
from app.services.note_service import generate_soap_note
from app.services.patient_service import save_visit

router = APIRouter()

@router.post("/generate")
def generate_note(body: NoteInput):
    try:
        result = generate_soap_note(body.transcript, body.language, body.patient_id)
        save_visit(body.patient_id, [], result["soap_note"], "low")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))