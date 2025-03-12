import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [keyPoints, setKeyPoints] = useState(""); // Store AI-generated key points

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
      setKeyPoints(response.data.key_points || "No key points found.");
    } catch (error) {
      setMessage("File upload failed.");
      setExtractedText("");
      setKeyPoints("");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload a Document</h2>
      <input type="file" onChange={handleFileChange} className="mb-2 border p-2 rounded w-full" />
      <button 
        onClick={handleUpload} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-gray-700">{message}</p>}
      {extractedText && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{extractedText}</pre>
        </div>
      )}
      {keyPoints && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Key Points (Gemini AI):</h3>
          <pre className="whitespace-pre-wrap text-green-800">{keyPoints}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
