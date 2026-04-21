from sqlalchemy import Column, String, DateTime
from datetime import datetime
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    email      = Column(String, primary_key=True, index=True)
    name       = Column(String)
    password   = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)