from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    patient_id   = Column(String, primary_key=True, index=True)
    name         = Column(String, default="Unknown")
    age          = Column(Integer, default=0)
    language     = Column(String, default="en")
    created_at   = Column(DateTime, default=datetime.utcnow)

    visits = relationship("Visit", back_populates="patient")


class Visit(Base):
    __tablename__ = "visits"

    visit_id   = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"))
    date       = Column(DateTime, default=datetime.utcnow)
    symptoms   = Column(JSON, default=list)
    soap_note  = Column(JSON, nullable=True)
    urgency    = Column(String, default="low")

    patient = relationship("Patient", back_populates="visits")