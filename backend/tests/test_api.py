import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["ANTHROPIC_API_KEY"] = "test-key"

from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()


def test_register_doctor():
    response = client.post("/api/auth/register", json={
        "email": "test@clinic.com",
        "name": "Dr. Test",
        "password": "test123"
    })
    assert response.status_code == 200
    assert "message" in response.json()


def test_login_doctor():
    # Register first
    client.post("/api/auth/register", json={
        "email": "login@clinic.com",
        "name": "Dr. Login",
        "password": "test123"
    })

    # Then login
    response = client.post("/api/auth/login", data={
        "username": "login@clinic.com",
        "password": "test123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_protected_route_without_token():
    response = client.get("/api/patients/")
    assert response.status_code == 401


def test_protected_route_with_token():
    # Register and login
    client.post("/api/auth/register", json={
        "email": "protected@clinic.com",
        "name": "Dr. Protected",
        "password": "test123"
    })
    login = client.post("/api/auth/login", data={
        "username": "protected@clinic.com",
        "password": "test123"
    })
    token = login.json()["access_token"]

    # Access protected route
    response = client.get("/api/patients/", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200