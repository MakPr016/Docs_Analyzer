import os
import shutil
import pdfplumber
import docx
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

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
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text.strip()

# Function to extract text from DOCX
def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

# Function to process text with Gemini AI
def process_text_with_gemini(text):
    prompt = f"""
    Analyze the following document and extract key information. 
    Format the output as a well-structured HTML page using:
    - Headings (`<h2>`)
    - Bold labels (`<b>`)
    - Bullet points (`<ul><li>`)

    Document Text:
    {text}

    Ensure the output is clean HTML without unnecessary code formatting, markdown syntax, or additional styling.
    """
    
    response = model.generate_content(prompt)

    # Clean any unwanted triple quotes or markdown formatting
    html_content = response.text.replace("```html", "").replace("```", "").strip()

    return html_content

@app.post("/upload", response_class=HTMLResponse)
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
        return HTMLResponse(content="<h3>Unsupported file format</h3>", status_code=400)

    key_points = process_text_with_gemini(text)

    # Remove any extra <html> or <body> tags to avoid nesting issues
    clean_html = key_points.replace("<!DOCTYPE html>", "").replace("<html>", "").replace("</html>", "").strip()

    return HTMLResponse(content=clean_html)
