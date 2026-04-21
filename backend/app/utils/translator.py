import os
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

LANGUAGE_NAMES = {
    "hi": "Hindi",
    "es": "Spanish",
    "en": "English",
    "ta": "Tamil",
}

def translate_to_english(text: str, language: str) -> str:
    if language == "en":
        return text

    lang_name = LANGUAGE_NAMES.get(language, language)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Translate this {lang_name} medical text to English. Return ONLY the translation, nothing else.\n\n{text}"
        }]
    )
    return response.content[0].text.strip()