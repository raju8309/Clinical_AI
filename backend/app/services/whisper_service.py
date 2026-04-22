import os
import tempfile


def transcribe_audio(audio_bytes: bytes, language: str = None) -> dict:
    """
    Input:  raw audio bytes
    Output: transcribed text + detected language
    """
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            with open(tmp_path, "rb") as audio_file:
                params = {
                    "model": "whisper-1",
                    "file": audio_file,
                    "response_format": "json"
                }
                if language and language != "auto" and language != "en":
                    params["language"] = language

                transcript = client.audio.transcriptions.create(**params)

            return {
                "text": transcript.text.strip(),
                "detected_language": language or "en",
                "success": True
            }

        finally:
            os.unlink(tmp_path)

    except Exception as e:
        return {
            "text": "",
            "detected_language": "unknown",
            "success": False,
            "error": str(e)
        }