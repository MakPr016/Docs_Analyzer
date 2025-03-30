import { useState } from "react"; 
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [keyPoints, setKeyPoints] = useState(null); // Store JSON key points properly

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setExtractedText(response.data.extracted_text || "No text extracted.");

      if (typeof response.data.key_points === "object") {
        setKeyPoints(response.data.key_points);
      } else {
        console.error("Unexpected format:", response.data.key_points);
        setKeyPoints(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("File upload failed.");
      setExtractedText("");
      setKeyPoints(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload a Document</h2>
      
      {/* File Input */}
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-2 border p-2 rounded w-full" 
      />

      {/* Upload Button */}
      <button 
        onClick={handleUpload} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Upload
      </button>

      {/* Display Messages */}
      {message && <p className="mt-2 text-gray-700">{message}</p>}

      {/* Display Extracted Text */}
      {extractedText && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <pre className="whitespace-pre-wrap">{extractedText}</pre>
        </div>
      )}

      {/* Display Key Points with safe check */}
      {keyPoints && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Key Points (Gemini AI):</h3>
          <ul className="list-disc pl-5">
            <li><strong>Document Type:</strong> {keyPoints?.document_type ?? "Unknown"}</li>
            
            <li className="mt-2">
              <strong>Key Points:</strong>
              <ul className="list-disc pl-5">
                {Object.entries(keyPoints?.key_points ?? {}).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
