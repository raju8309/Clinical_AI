import os
import json
from anthropic import Anthropic
from app.utils.translator import translate_to_english
from datetime import datetime

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def generate_soap_note(transcript: str, language: str, patient_id: str) -> dict:
    english = translate_to_english(transcript, language)

    prompt = f"""You are a clinical documentation AI.
Doctor-patient conversation:
---
{english}
---
Write a SOAP note. Respond ONLY in this exact JSON format with no extra text:
{{
  "subjective": "what patient reported",
  "objective": "observable facts and vitals if mentioned",
  "assessment": "likely condition summary",
  "plan": "next steps and medications"
}}
If something is not mentioned write "Not documented". Return only the JSON object."""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text.strip()

    # Clean up response
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()

    # Find JSON object in response
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start != -1 and end > start:
        raw = raw[start:end]

    soap = json.loads(raw)
    soap["generated_at"] = datetime.utcnow().isoformat()

    return {
        "patient_id": patient_id,
        "soap_note": soap,
        "raw_transcript": transcript
    }