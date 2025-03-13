# DOCUMENT_ANALYZER

## Backend Setup Guide

This guide will help you set up and run the backend for the **Document Analyzer** project using FastAPI and Gemini AI.

---

## Prerequisites

Make sure you have the following installed:
- Python 3.9 or later
- pip (Python package manager)
- virtualenv (optional but recommended)

---

## Step 1: Create and Activate a Virtual Environment

Run the following commands to create and activate a virtual environment:

```sh
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

---

## Step 2: Install Dependencies

Run the following command to install the required packages:

```sh
pip install -r requirements.txt
```

If `requirements.txt` is not available, install the dependencies manually:

```sh
pip install fastapi uvicorn pdfplumber python-docx python-dotenv google-generativeai
```

---

## Step 3: Set Up Environment Variables

Create a `.env` file in the root directory and add your Gemini AI API key:

```
GENAI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

---

## Step 4: Run the FastAPI Server

Use the following command to start the server:

```sh
uvicorn main:app --reload
```

By default, the server will run on `http://127.0.0.1:8000`.

---

## Step 5: API Endpoints

### Upload a Document

- **Endpoint:** `POST /upload`
- **Description:** Uploads a `.pdf` or `.docx` file, extracts text, and processes it using Gemini AI.
- **Response:**
  ```json
  {
      "message": "File uploaded successfully",
      "filename": "document.pdf",
      "extracted_text": "...",
      "key_points": "<h2>Extracted Key Points</h2>..."
  }
  ```

---

## Step 6: Testing the API

Once the server is running, open your browser or use Postman to test the API at:

```
http://127.0.0.1:8000/docs
```

This will open the Swagger UI, where you can upload a document and see the extracted key points.

---

## Step 7: Deactivating the Virtual Environment

After you're done, deactivate the virtual environment:

```sh
deactivate
```

---

## Troubleshooting

- If you face issues with missing dependencies, try reinstalling them:
  ```sh
  pip install --upgrade pip
  pip install -r requirements.txt
  ```
- Ensure your `.env` file contains the correct API key.
- If `uvicorn` is not found, install it using:
  ```sh
  pip install uvicorn
  
