from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()  # ← this line loads your .env file

from app.routes import symptoms, notes, patients

app = FastAPI(title="ClinicalAI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(notes.router,    prefix="/api/notes",    tags=["Notes"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])

@app.get("/")
def root():
    return {"status": "ClinicalAI is running"}