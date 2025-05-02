import React, { useState } from "react";
import axios from "axios";

export default function UploadSection({ onUpload, onText }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(res.data);
      onText(res.data.extracted_text);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-lg font-semibold mb-2">Upload Medical Report</h2>
      <p className="text-sm text-gray-500 mb-4">Upload a PDF or image file for analysis</p>
      <label className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-xl py-8 px-4">
        <input type="file" className="hidden" onChange={handleFileChange} />
        {loading ? (
          <p>Processing...</p>
        ) : fileName ? (
          <p className="text-gray-700">{fileName}</p>
        ) : (
          <p className="text-gray-400">Click to select a file</p>
        )}
      </label>
    </div>
  );
}