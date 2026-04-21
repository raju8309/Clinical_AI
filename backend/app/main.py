from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base

load_dotenv()

from app.models import db_models, user_models
Base.metadata.create_all(bind=engine)

from app.routes import symptoms, notes, patients, auth, voice

app = FastAPI(title="ClinicalAI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/auth",     tags=["Auth"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(notes.router,    prefix="/api/notes",    tags=["Notes"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(voice.router,    prefix="/api/voice",    tags=["Voice"])

@app.get("/")
def root():
    return {"status": "ClinicalAI is running", "database": "PostgreSQL connected"}