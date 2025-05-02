import React from "react";

export default function PreviewSection({ text }) {
  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Document Preview</h2>
      <p className="text-sm text-gray-500 mb-4">Extracted text from your uploaded document</p>
      <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
        {text}
      </pre>
    </div>
  );
}