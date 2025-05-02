import os
import shutil
import pdfplumber
import json
import docx
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

# Configure Gemini API
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-pro")

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

# Extract text from DOCX
def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

# Process text with Gemini (Medical Analysis Prompt)
def process_text_with_gemini(text):
    prompt = f"""
You're a medical document analysis assistant. Your job is to analyze the following report and extract structured information in JSON format.

Document Text:
{text}

Return a JSON response in this format:
{{
  "patient_info": {{
    "name": "",
    "age": "",
    "gender": "",
    "patient_id": ""
  }},
  "diagnoses": [],
  "symptoms": [],
  "medications": [
    {{
      "name": "",
      "dosage": "",
      "frequency": ""
    }}
  ],
  "recommendations": [],
  "lab_results": [
    {{
      "test_name": "",
      "result_value": "",
      "normal_range": "",
      "status": ""
    }}
  ],
  "observations": []
}}

🔍 Instructions:
- If a lab result does not have a "normal_range", fill in the standard medical range for that test if known.
- Make sure to output valid JSON only, no markdown, no explanations.
- All fields must be included. Leave fields blank or as empty lists if not available.
"""

    response = model.generate_content(prompt)

    if response:
        cleaned_response = response.text.strip().strip("```json").strip("```").strip()
        try:
            return json.loads(cleaned_response)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format returned by Gemini"}
    return {"error": "No response from Gemini"}

# File upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text based on file type
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        return {
            "message": "Unsupported file format. Please upload a PDF or DOCX file.",
            "filename": file.filename
        }

    # Process with Gemini AI
    key_points = process_text_with_gemini(text)

    # Log for debugging
    print(json.dumps(key_points, indent=2))

    return {
        "message": "File uploaded and processed successfully",
        "filename": file.filename,
        "extracted_text": text,
        "key_points": key_points
    }
