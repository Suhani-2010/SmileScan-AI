# 🦷 SmileScan AI - Dental X-Ray Diagnostic Web App

An AI-powered dental diagnostic platform that lets users upload dental X-rays (in DICOM format), detects radiographic findings using object detection, and generates a clinical diagnostic report using an AI language model. Users can also download the structured report as a PDF.

---

## 🚀 Features

- Upload dental X-ray (DICOM) files
- AI-based detection of dental conditions (via Roboflow)
- Clinical report generation (via GPT from OpenRouter)
- Annotated image preview
- Structured, styled diagnostic report:
  - Radiographic Impressions
  - Recommendations
  - Clinical Summary
  - Additional Notes
- Downloadable PDF report
- Clean React-based user interface

---

## 🛠️ Tech Stack

### Backend (FastAPI)
- Python
- FastAPI
- Pydicom
- Roboflow Inference SDK
- OpenRouter GPT-4o-mini (for clinical report)
- ReportLab (PDF generation)
- Pillow, NumPy

### Frontend (React)
- React JS
- HTML, CSS (custom and optionally Tailwind)
- React Markdown
- Axios for API requests

---

## 📁 Folder Structure

\```
.
├── backend
│   ├── dental-env
│   ├── Dockerfile
│   ├── inference_test.py
│   ├── main.py
│   ├── openai_test.py
│   ├── requirements.txt
│   ├── test_roboflow.py
│   ├── uploads
│   └── venv2
├── frontend
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── package.json
├── README.md
├── requirements.txt
└── structure.txt
\```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Create and activate a virtual environment (optional):

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Add `.env` file in `backend/` folder with the following content:

```ini
ROBOFLOW_API_KEY=your_roboflow_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

5. Run FastAPI server:

```bash
uvicorn main:app --reload
```

6. Visit the backend API at: http://localhost:8000

---

### 🎨 Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

4. Visit the frontend app at: http://localhost:3000

---

## ☁️ Deployment

### 🔷 Backend on Render

- Push `backend` folder to GitHub.
- Create a new Web Service on https://render.com.
- Set:
  - Root directory: `backend`
  - Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
  - Python version: 3.10+
- Add environment variables:
  - `ROBOFLOW_API_KEY`
  - `OPENROUTER_API_KEY`
- Deploy.

### 🟢 Frontend on Vercel

- Push `frontend` folder to GitHub.
- Go to https://vercel.com → New Project.
- Import your GitHub repo.
- Set root directory to `frontend`.
- Deploy.

---

## 🧪 How It Works

1. Upload a DICOM file.
2. View annotated image (Roboflow prediction).
3. AI generates structured clinical report using GPT.
4. Download report as PDF.

---


## 🙋‍♀️ Author

**Suhani Agarwal**  
Final Year College Student  
📫 [LinkedIn](https://www.linkedin.com/in/suhanisagarwal) 

---

## 📜 License

This project is licensed under the MIT License.

---


