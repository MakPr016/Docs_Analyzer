import React, { useState } from "react";

const tabs = ["Symptoms", "Diagnoses", "Medications", "Observations"];

export default function ResultTabs({ keyPoints }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const renderContent = () => {
    switch (activeTab) {
      case "Symptoms":
        return <ul className="list-disc pl-5">{keyPoints.symptoms?.map((s, i) => <li key={i}>{s}</li>)}</ul>;
      case "Diagnoses":
        return <ul className="list-disc pl-5">{keyPoints.diagnoses?.map((d, i) => <li key={i}>{d}</li>)}</ul>;
      case "Medications":
        return <ul className="list-disc pl-5">{keyPoints.medications?.map((m, i) => <li key={i}><strong>{m.name}</strong>: {m.dosage}, {m.frequency}</li>)}</ul>;
      case "Observations":
        return <ul className="list-disc pl-5">{keyPoints.observations?.map((o, i) => <li key={i}>{o}</li>)}</ul>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm">
        {renderContent()}
      </div>
    </div>
  );
}