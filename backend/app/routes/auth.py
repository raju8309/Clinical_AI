from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user_models import Doctor
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

class RegisterInput(BaseModel):
    email: str
    name: str
    password: str

@router.post("/register")
def register(body: RegisterInput, db: Session = Depends(get_db)):
    existing = db.query(Doctor).filter(Doctor.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    doctor = Doctor(
        email=body.email,
        name=body.name,
        password=hash_password(body.password)
    )
    db.add(doctor)
    db.commit()
    return {"message": f"Doctor {body.name} registered successfully"}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == form.username).first()
    if not doctor or not verify_password(form.password, doctor.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": doctor.email, "name": doctor.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "name": doctor.name,
        "email": doctor.email
    }

@router.get("/me")
def get_me(token_email: str = Depends(get_current_user := __import__('app.auth', fromlist=['get_current_user']).get_current_user)):
    return {"email": token_email}