import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [keyPoints, setKeyPoints] = useState(null);

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
      setKeyPoints(response.data.key_points);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("File upload failed.");
      setExtractedText("");
      setKeyPoints(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload Medical Report</h2>

      <input type="file" onChange={handleFileChange} className="mb-2 border p-2 rounded w-full" />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Upload
      </button>

      {message && <p className="mt-2 text-gray-700">{message}</p>}

      {extractedText && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold mb-2">Extracted Text</h3>
          <pre className="whitespace-pre-wrap">{extractedText}</pre>
        </div>
      )}

      {keyPoints && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded space-y-4">
          <h3 className="text-xl font-semibold">Medical Report Summary</h3>

          <div>
            <h4 className="font-semibold">👤 Patient Info</h4>
            <p>Name: {keyPoints.patient_info?.name || "N/A"}</p>
            <p>Age: {keyPoints.patient_info?.age || "N/A"}</p>
            <p>Gender: {keyPoints.patient_info?.gender || "N/A"}</p>
            <p>Patient ID: {keyPoints.patient_info?.patient_id || "N/A"}</p>
          </div>

          {keyPoints.diagnoses?.length > 0 && (
            <div>
              <h4 className="font-semibold">🩺 Diagnoses</h4>
              <ul className="list-disc pl-5">
                {keyPoints.diagnoses.map((diag, index) => (
                  <li key={index}>{diag}</li>
                ))}
              </ul>
            </div>
          )}

          {keyPoints.symptoms?.length > 0 && (
            <div>
              <h4 className="font-semibold">🤒 Symptoms</h4>
              <ul className="list-disc pl-5">
                {keyPoints.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
          )}

          {keyPoints.medications?.length > 0 && (
            <div>
              <h4 className="font-semibold">💊 Medications</h4>
              <ul className="list-disc pl-5">
                {keyPoints.medications.map((med, index) => (
                  <li key={index}>
                    <strong>{med.name}</strong>: {med.dosage}, {med.frequency}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {keyPoints.recommendations?.length > 0 && (
            <div>
              <h4 className="font-semibold">📋 Recommendations</h4>
              <ul className="list-disc pl-5">
                {keyPoints.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {keyPoints.lab_results?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">🧪 Lab Results</h4>
              <table className="w-full border text-sm text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-1">Test Name</th>
                    <th className="border px-2 py-1">Result</th>
                    <th className="border px-2 py-1">Normal Range</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {keyPoints.lab_results.map((lab, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{lab.test_name}</td>
                      <td className="border px-2 py-1">{lab.result_value}</td>
                      <td className="border px-2 py-1">
                        {lab.normal_range || "Standard range unavailable"}
                      </td>
                      <td className="border px-2 py-1">{lab.status || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {keyPoints.observations?.length > 0 && (
            <div>
              <h4 className="font-semibold">🧠 Observations</h4>
              <ul className="list-disc pl-5">
                {keyPoints.observations.map((obs, index) => (
                  <li key={index}>{obs}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
