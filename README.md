# 🦷 SmileScan AI – Dental X-Ray Diagnostic Assistant

This full-stack web app helps dentists and researchers analyze dental X-rays using AI. Upload a DICOM image, detect conditions like cavities and periapical lesions, and receive an AI-generated diagnostic report.

---

## 🚀 Tech Stack

- **Frontend:** React 
- **Backend:** FastAPI + Pillow + ReportLab
- **AI/ML:** Roboflow + OpenRouter (GPT-4o-mini)

---

## 🛠️ Getting Started

### 📦 Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install
npm start