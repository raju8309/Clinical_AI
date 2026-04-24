# ClinicalAI

**Multilingual Patient Assistant for Small Clinics**

A full-stack AI-powered clinical assistant that helps doctors with symptom checking, SOAP note generation, and patient history tracking. Built to democratize access to AI healthcare tools for small clinics priced out of enterprise solutions like Google MedLM and Microsoft DAX.

---

## Live Demo

| | URL |
|---|---|
| Frontend | https://clinical-ai-1.onrender.com |
| Backend API | https://clinical-ai-bozh.onrender.com |
| API Docs | https://clinical-ai-bozh.onrender.com/docs |
| GitHub | https://github.com/raju8309/Clinical_AI |

**Demo Credentials**

- Email: `doctor@clinic.com`
- Password: `doctor123`

---

## Features

- **Symptom Checker** — AI-powered diagnosis with confidence scores and explanations
- **SOAP Note Writer** — Auto-generates structured clinical notes from doctor-patient conversations
- **Multilingual** — Supports English, Hindi, and Spanish
- **Voice Input** — Speak symptoms using OpenAI Whisper API transcription
- **Patient History** — Cross-visit tracking and visit history
- **PDF Export** — Download SOAP notes as PDF
- **JWT Authentication** — Secure doctor login and registration

---

## Architecture

```
Frontend (React)       Backend (FastAPI)        ML Model
──────────────────     ──────────────────       ──────────────────
React 18               Python 3.11              Logistic Regression
Render Static Site     FastAPI                  Scikit-learn
jsPDF                  SQLAlchemy               4920 samples
                       PostgreSQL               41 diseases
                       JWT Auth                 131 symptoms
                       Anthropic Claude         100% CV accuracy
                       OpenAI Whisper API
                       Docker
                       Render Web Service
```

---

## AI Stack

| Component | Technology |
|---|---|
| Symptom Analysis | Anthropic Claude Sonnet 4.6 |
| SOAP Note Generation | Anthropic Claude Sonnet 4.6 |
| Voice Transcription | OpenAI Whisper API |
| Disease Classification | Logistic Regression (scikit-learn) |
| Multilingual Support | Claude + Whisper multilingual models |

---

## Tech Stack

**Backend**

- Python 3.11, FastAPI, SQLAlchemy
- PostgreSQL, JWT (python-jose), bcrypt
- Anthropic SDK, OpenAI SDK
- Docker, Render

**Frontend**

- React 18, jsPDF
- Render Static Site

**ML**

- Scikit-learn, Pandas, NumPy
- Kaggle Disease-Symptom Dataset (4920 samples)
- MLflow (experiment tracking)

**DevOps**

- GitHub Actions CI/CD
- Docker + Render
- Automated pytest on every push

---

## CI/CD Pipeline

```
git push to main
        |
        v
GitHub Actions triggers
        |
        v
Run pytest (5 tests)
Build React frontend
        |
        v
If all pass
        |
        v
Auto deploy to Render
Backend + Frontend live
```

---

## ML Model

Trained on the Kaggle Disease-Symptom dataset:

- 4,920 samples across 41 diseases
- 131 symptom features
- 100% cross-validated accuracy
- Model: Logistic Regression with TF-IDF features

---

## Local Setup

**Prerequisites**

- Python 3.11
- Node.js 18+
- PostgreSQL

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

**Environment Variables**

```
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://user:pass@localhost:5432/clinicalai
SECRET_KEY=your_secret_key
```

---

## Tests

```bash
cd backend
pytest tests/ -v
```

5 tests covering:

- API health check
- Doctor registration
- Doctor login
- Protected route without token
- Protected route with valid token

---

## Differentiators vs Enterprise Tools

| Feature | Google MedLM | Microsoft DAX | ClinicalAI |
|---|---|---|---|
| Price | $$$$ | $$$$ | Free / Open |
| Multilingual | Limited | Limited | EN / HI / ES |
| Explainable AI | No | No | Yes |
| Self-hostable | No | No | Yes |
| Small clinic focus | No | No | Yes |

---

## Author

**Raju Kotturi**

- MS Information Technology — UNH Manchester
- GitHub: [@raju8309](https://github.com/raju8309)

---

## Disclaimer

ClinicalAI is a research and portfolio project. AI-generated diagnoses and notes should always be reviewed by a licensed medical professional before clinical use.