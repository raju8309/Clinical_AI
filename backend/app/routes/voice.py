"""
voice.py
--------
Two endpoints:
1. POST /api/voice/symptoms  — patient speaks symptoms
2. POST /api/voice/transcript — doctor records conversation
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from app.services.whisper_service import transcribe_audio
from app.services.symptom_service import check_symptoms
from app.services.note_service import generate_soap_note
from app.services.patient_service import save_visit
from app.database import get_db
from app.auth import get_current_user
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/symptoms")
async def voice_symptoms(
    audio: UploadFile = File(...),
    patient_id: str = Form(...),
    language: str = Form(default="auto"),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        audio_bytes = await audio.read()
        transcription = transcribe_audio(audio_bytes, language)

        if not transcription["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Audio transcription failed: {transcription.get('error', 'unknown error')}"
            )

        transcribed_text = transcription["text"]
        detected_lang = transcription["detected_language"]
        result = check_symptoms(transcribed_text, detected_lang, patient_id)

        if result.get("suggestions"):
            top_urgency = result["suggestions"][0].get("urgency", "low")
            save_visit(db, patient_id, result["extracted_symptoms"], None, top_urgency)

        result["transcribed_text"] = transcribed_text
        result["detected_language"] = detected_lang
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcript")
async def voice_transcript(
    audio: UploadFile = File(...),
    patient_id: str = Form(...),
    language: str = Form(default="auto"),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        audio_bytes = await audio.read()
        transcription = transcribe_audio(audio_bytes, language)

        if not transcription["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Audio transcription failed: {transcription.get('error', 'unknown error')}"
            )

        transcribed_text = transcription["text"]
        detected_lang = transcription["detected_language"]
        result = generate_soap_note(transcribed_text, detected_lang, patient_id)
        save_visit(db, patient_id, [], result["soap_note"], "low")
        result["transcribed_text"] = transcribed_text
        result["detected_language"] = detected_lang
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))