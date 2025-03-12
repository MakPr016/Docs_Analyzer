import os
import shutil
import pdfplumber
import docx
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
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

# Configure Gemini AI API
genai.configure(api_key=GENAI_API_KEY)  # Replace with your API key
model = genai.GenerativeModel("models/gemini-1.5-pro")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Function to extract text from PDFs
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# Function to extract text from DOCX
def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

# Function to process text with Gemini AI
def process_text_with_gemini(text):
    prompt = f"""
    Analyze the following document and extract key points based on its type.
    If it's a medical record, list diagnoses, medications, and recommendations.
    If it's a legal document, highlight possible issues or flaws.

    Document Text:
    {text}

    Provide a structured response.
    """
    
    response = model.generate_content(prompt)
    return response.text if response else "No key points found."

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
