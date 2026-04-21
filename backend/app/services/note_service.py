import os, json
from anthropic import Anthropic
from app.utils.translator import translate_to_english
from datetime import datetime

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_soap_note(transcript: str, language: str, patient_id: str) -> dict:
    english = translate_to_english(transcript, language)

    prompt = f"""
You are a clinical documentation AI.
Doctor-patient conversation:
---
{english}
---
Write a SOAP note. Respond ONLY in this JSON:
{{
  "subjective": "what patient reported",
  "objective": "observable facts and vitals",
  "assessment": "likely condition summary",
  "plan": "next steps and medications"
}}
If something not mentioned write "Not documented". Only JSON.
"""
    response = client.messages.create(
        model=" claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"): raw = raw[4:]
    raw = raw.strip()

    soap = json.loads(raw)
    soap["generated_at"] = datetime.utcnow().isoformat()

    return {
        "patient_id": patient_id,
        "soap_note": soap,
        "raw_transcript": transcript
    }