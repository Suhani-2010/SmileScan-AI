from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import pydicom
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import base64
import os
from dotenv import load_dotenv
import requests
import tempfile
from fastapi.responses import Response
from fastapi import Body
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
import io
import datetime
import re 


# Load environment variables from .env
load_dotenv()

app = FastAPI()

from fastapi import Request
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
import datetime

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.colors import black, white, HexColor
from io import BytesIO
import datetime

app = FastAPI()

@app.post("/download-pdf/")
async def generate_pdf_report(request: Request):
    form = await request.form()

    # Extract form data
    name = form.get("name", "")
    age = form.get("age", "")
    gender = form.get("gender", "")
    exam_date = form.get("exam_date", "")
    impression = form.get("impression", "")
    recommendations = form.get("recommendations", "")
    annotated_file: UploadFile = form.get("annotated_image")

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    x_margin = 50
    y = height - 300  # Start body text lower to avoid header and patient box

    line_height = 16

    def wrap_text(text, max_chars=95):
        lines = []
        for paragraph in text.split("\n"):
            words = paragraph.strip().split()
            line = ""
            for word in words:
                if len(line + " " + word) <= max_chars:
                    line += " " + word
                else:
                    lines.append(line.strip())
                    line = word
            if line:
                lines.append(line.strip())
        return lines

    def draw_wrapped_text(text, x, y_start, max_width, canvas_obj, font_size=11, line_height=14):
        y = y_start
        canvas_obj.setFont("Helvetica", font_size)
        lines = []
        for paragraph in text.split("\n"):
            line = ""
            for word in paragraph.split():
                if canvas_obj.stringWidth(line + " " + word, "Helvetica", font_size) < max_width:
                    line += " " + word
                else:
                    lines.append(line.strip())
                    line = word
            if line:
                lines.append(line.strip())
        for line in lines:
            canvas_obj.drawString(x, y, line)
            y -= line_height
        return y

    def colored_section_title(text, x, y, canvas_obj, color=HexColor("#38bdf8")):
        canvas_obj.setFont("Helvetica-Bold", 12)
        canvas_obj.setFillColor(color)
        canvas_obj.drawString(x, y, text)
        canvas_obj.setFillColor(white)
        return y - 20

    # === Header ===
    p.setFillColor(HexColor("#0f172a"))
    p.rect(0, height - 90, width, 80, fill=1, stroke=0)

    p.setFillColor(HexColor("#38bdf8"))
    p.setFont("Helvetica-Bold", 22)
    p.drawCentredString(width / 2, height - 50, " SmileScan AI - Diagnostic Report")

    p.setFont("Helvetica", 11)
    p.setFillColor(HexColor("#94a3b8"))
    p.drawCentredString(width / 2, height - 68, "Advanced AI-Powered Dental Radiology")

    # === Patient Info Box ===
    left_x = x_margin
    y_left = height - 110

    p.setFont("Helvetica", 11)
    p.setFillColor(black)

    patient_info = f"""
Name: {name}
Age: {age}
Gender: {gender}
Date of Examination: {exam_date}
"""
    y_left = draw_wrapped_text(patient_info.strip(), left_x, y_left, 230, p)

    # === Draw Annotated Image ===
        # === Draw Annotated Image (center-aligned) ===
    if annotated_file:
        image_data = await annotated_file.read()
        try:
            image = Image.open(io.BytesIO(image_data))
            image_reader = ImageReader(image)

            img_width = 280
            img_height = 280
            img_x = (width - img_width) / 2  # Centered horizontally
            img_y = height - 460  # Lowered to avoid overlapping patient info

            p.drawImage(image_reader, img_x, img_y, width=img_width, height=img_height, preserveAspectRatio=True)

            y = img_y - 40  # Move text content below image
        except Exception as e:
            print(f"Error loading annotated image: {e}")



    # === Radiographic Impression Section ===
    y = colored_section_title("Radiographic Impression:", x_margin, y, p)
    p.setFont("Helvetica", 11)
    p.setFillColor(HexColor("#000000"))
    for line in wrap_text(impression, 95):
        p.drawString(x_margin, y, line)
        y -= line_height

    y -= 20

    # === Recommendations Section ===
    y = colored_section_title("Recommendations:", x_margin, y, p)
    p.setFont("Helvetica", 11)
    p.setFillColor(HexColor("#000000"))
    for line in wrap_text(recommendations, 95):
        p.drawString(x_margin, y, line)
        y -= line_height

    
    # === Finalize PDF ===
    p.showPage()
    p.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=diagnostic_report.pdf"
    })


# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Roboflow API setup
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_API_URL = "https://serverless.roboflow.com"


# ... [imports and other config stay the same] ...
import requests
import os

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_text_from_openrouter(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model":  "openai/gpt-4o-mini",  # or "claude-instant-v1" etc.
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 700
    }
    response = requests.post(OPENROUTER_API_URL, headers=headers, json=data)
    if response.status_code == 200:
        resp_json = response.json()
        return resp_json["choices"][0]["message"]["content"].strip()
    else:
        return f"OpenRouter API error {response.status_code}: {response.text}"



def build_prompt_from_predictions(predictions):
    if not predictions:
        return "There were no findings detected on the dental X-ray. Please confirm if further examination is needed."

    findings = ""
    for i, pred in enumerate(predictions, 1):
        label = pred.get("class", "unknown").replace("_", " ")
        conf = pred.get("confidence", 0)
        x, y = pred.get("x", "?"), pred.get("y", "?")

        # Estimate rough location
        try:
            y_val = float(y)
            x_val = float(x)
            location = "upper" if y_val < 512 else "lower"
            location += " left" if x_val < 512 else " right"
        except Exception:
            location = "unknown area"

        findings += f"{i}. {label.title()} at {location} ({conf*100:.1f}% confidence)\n"

    prompt = (
        "You're a dental radiologist. Based on the following findings, generate a professional diagnostic report "
        "with two clear sections:\n\n"
        "1. Radiographic Impression\n"
        "2. Recommendations\n\n"
        f"Findings:\n{findings}\n\n"
        "Keep it short,clinical and use dental terminology."
    )
    return prompt


   

def draw_bounding_boxes(image: Image.Image, predictions: list) -> Image.Image:
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except Exception:
        font = ImageFont.load_default()

    for pred in predictions:
        x = pred.get("x", 0)
        y = pred.get("y", 0)
        w = pred.get("width", 0)
        h = pred.get("height", 0)
        label = pred.get("class", "unknown")
        conf = pred.get("confidence", 0)

        left = x - w / 2
        top = y - h / 2
        right = x + w / 2
        bottom = y + h / 2

        draw.rectangle([left, top, right, bottom], outline="red", width=3)

        text = f"{label} ({conf*100:.1f}%)"
        bbox = draw.textbbox((left, top), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        draw.rectangle([left, top - text_height, left + text_width, top], fill="red")
        draw.text((left, top - text_height), text, fill="white", font=font)

    return image

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    ds = pydicom.dcmread(BytesIO(contents))

    # Convert DICOM to image
    pixel_array = ds.pixel_array
    normalized = (pixel_array - pixel_array.min()) / (pixel_array.max() - pixel_array.min())
    image_array = (normalized * 255).astype(np.uint8)
    image = Image.fromarray(image_array).convert("RGB")

    # Save temp file to send to Roboflow
    with tempfile.NamedTemporaryFile(suffix=".png") as temp_file:
        image.save(temp_file.name)
        try:
            # Using Roboflow inference HTTP API
            from inference_sdk import InferenceHTTPClient

            rf_client = InferenceHTTPClient(
                api_url=ROBOFLOW_API_URL,
                api_key=ROBOFLOW_API_KEY
            )
            result = rf_client.infer(temp_file.name, model_id="adr/6")
            predictions = result.get("predictions", [])
        except Exception as e:
            print("Roboflow error:", e)
            predictions = []

    # Draw bounding boxes on image
    image_with_boxes = draw_bounding_boxes(image, predictions)

    # Convert image with boxes to base64 to send to frontend
    buffered = BytesIO()
    image_with_boxes.save(buffered, format="PNG")
    image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Build prompt and generate report using Hugging Face API
    prompt = build_prompt_from_predictions(predictions)
    
    report = generate_text_from_openrouter(prompt)
# Strip any unwanted signature section
    if "Signature:" in report:
        report = report.split("Signature:")[0].strip()

# Clean extra newlines and spaces
   

# Suppose 'report' is your raw text from the API
    report = report.strip()

# Replace 3 or more newlines (with optional spaces) with exactly two newlines
    report = re.sub(r'\n\s*\n\s*\n+', '\n\n', report)

# Remove trailing spaces on each line and also remove lines that are only spaces or empty
    lines = [line.strip() for line in report.splitlines() if line.strip() != ""]

# Join lines with a single newline (no extra blank lines)
    clean_report = "\n".join(lines)

    return {
    "image": image_base64,
    "predictions": predictions,
    "report": clean_report
}


