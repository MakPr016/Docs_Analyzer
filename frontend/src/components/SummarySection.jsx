import React from "react";

export default function SummarySection({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
      <p className="text-sm text-gray-500 mb-2">AI-generated summary of the medical report</p>
      <div className="text-sm leading-relaxed">
        <p><strong>Assessment:</strong> Suspected respiratory infection with inflammatory response.</p>
        <p className="mt-2"><strong>Recommendations:</strong></p>
        <ul className="list-disc ml-5">
          {summary.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}