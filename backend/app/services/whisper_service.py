"""
whisper_service.py
------------------
Takes an audio file (any language) → returns transcribed text.
Works with Hindi, Spanish, English — even mixed languages.
"""

import whisper
import tempfile
import os

# Load the base model — good balance of speed and accuracy
# Options: tiny, base, small, medium, large
model = whisper.load_model("base")


def transcribe_audio(audio_bytes: bytes, language: str = None) -> dict:
    """
    Input:  raw audio bytes (from microphone or uploaded file)
    Output: transcribed text + detected language
    """

    # Save audio bytes to a temp file — Whisper needs a file path
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        # Transcribe — if language given, use it. Otherwise auto-detect.
        if language and language != "auto":
            result = model.transcribe(tmp_path, language=language)
        else:
            result = model.transcribe(tmp_path)

        return {
            "text": result["text"].strip(),
            "detected_language": result.get("language", "en"),
            "success": True
        }

    except Exception as e:
        return {
            "text": "",
            "detected_language": "unknown",
            "success": False,
            "error": str(e)
        }

    finally:
        # Always clean up temp file
        os.unlink(tmp_path)