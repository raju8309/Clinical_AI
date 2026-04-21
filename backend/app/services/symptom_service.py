import os, json
from anthropic import Anthropic
from app.utils.translator import translate_to_english

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

URGENT = ["chest pain","difficulty breathing","unconscious","severe bleeding"]
MEDIUM = ["high fever","persistent cough","vomiting","dizziness","severe headache"]

def get_urgency(condition: str, symptoms: list) -> str:
    text = (condition + " ".join(symptoms)).lower()
    if any(k in text for k in URGENT): return "high"
    if any(k in text for k in MEDIUM): return "medium"
    return "low"

def check_symptoms(text: str, language: str, patient_id: str) -> dict:
    english_text = translate_to_english(text, language)

    prompt = f"""
You are a clinical assistant AI.
Patient symptoms: "{english_text}"

Respond ONLY in this JSON format, nothing else:
{{
  "extracted_symptoms": ["symptom1", "symptom2"],
  "suggestions": [
    {{
      "condition": "Condition Name",
      "confidence": 0.85,
      "triggered_by": ["symptom1"],
      "explanation": "Simple reason why"
    }}
  ],
  "follow_up_questions": ["question1?", "question2?"]
}}
Give top 3 conditions. confidence between 0.0 and 1.0. Only JSON.
"""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"): raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)
    for s in result["suggestions"]:
        s["urgency"] = get_urgency(s["condition"], result["extracted_symptoms"])
    result["patient_id"] = patient_id
    result["disclaimer"] = "AI suggestion only. Doctor must confirm."
    return result