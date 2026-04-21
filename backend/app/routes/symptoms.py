from fastapi import APIRouter, HTTPException
from app.models.schemas import SymptomInput
from app.services.symptom_service import check_symptoms
from app.services.patient_service import save_visit

router = APIRouter()

@router.post("/check")
def check_patient_symptoms(body: SymptomInput):
    try:
        result = check_symptoms(body.text, body.language, body.patient_id)
        if result.get("suggestions"):
            top_urgency = result["suggestions"][0].get("urgency", "low")
            save_visit(body.patient_id, result["extracted_symptoms"], None, top_urgency)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))