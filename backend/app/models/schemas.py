from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SymptomInput(BaseModel):
    patient_id: str
    text: str
    language: str = "en"

class DiagnosisSuggestion(BaseModel):
    condition: str
    confidence: float
    triggered_by: List[str]
    urgency: str
    explanation: str

class SymptomResponse(BaseModel):
    patient_id: str
    extracted_symptoms: List[str]
    suggestions: List[DiagnosisSuggestion]
    follow_up_questions: List[str]
    disclaimer: str

class NoteInput(BaseModel):
    patient_id: str
    transcript: str
    language: str = "en"

class SOAPNote(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str
    generated_at: Optional[str] = None

class NoteResponse(BaseModel):
    patient_id: str
    soap_note: SOAPNote
    raw_transcript: str

class Visit(BaseModel):
    visit_id: str
    date: str
    symptoms: List[str]
    soap_note: Optional[SOAPNote]
    urgency: str

class PatientHistory(BaseModel):
    patient_id: str
    name: str
    age: int
    language_preference: str
    visits: List[Visit] = []
    recurring_symptoms: List[str] = []