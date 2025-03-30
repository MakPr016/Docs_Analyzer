import os
import shutil
import pdfplumber
import json
import docx
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-pro")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def process_text_with_gemini(text):
    prompt = f"""
    Identify the type of the following document (e.g., medical, legal, financial, technical, academic, business, personal, creative, or other).
    
    Then, extract the key points relevant to its type:
    - **Medical**: List diagnoses, medications, and recommendations.
    - **Legal**: Highlight possible issues, clauses, and obligations.
    - **Financial**: Extract key figures, trends, and notable details.
    - **Technical**: Summarize core concepts, key technologies, and observations.
    - **Academic**: Extract the abstract, main findings, and conclusions.
    - **Business**: Highlight insights, recommendations, and action points.
    - **Personal**: Summarize the main message, emotional tone, and key details.
    - **Creative**: Identify the theme, plot, or main artistic elements.
    - **Other**: Provide a general summary with key insights and notable details.

    Document Text:
    {text}

    Provide only a structured JSON response without any formatting tags like ```json or ``` at the end.
    """
    
    response = model.generate_content(prompt)
    
    if response:
        # Clean both the starting and ending ```json tags
        cleaned_response = response.text.strip('```json').strip('```').strip()
        
        try:
            json_response = json.loads(cleaned_response)
            return json_response
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format"}
    
    return {"error": "No key points found."}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        return {"message": "Unsupported file format", "filename": file.filename}

    key_points = process_text_with_gemini(text)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "extracted_text": text,
        "key_points": key_points
    }