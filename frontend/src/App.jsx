import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import PreviewSection from './components/PreviewSection';
import PatientInfoCard from './components/PatientInfoCard';
import SummarySection from './components/SummarySection';
import ResultTabs from './components/ResultTabs';
import LabResultChart from './components/LabResultChart';

export default function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Medical Report Analysis Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadSection onUpload={setData} onText={setText} />
        {data && <PatientInfoCard patient={data.key_points?.patient_info} />}
      </div>

      {text && <PreviewSection text={text} />}

      {data?.key_points && (
        <>
          <div className="mt-6">
            <SummarySection summary={data.key_points} />
          </div>

          <div className="mt-6">
            <ResultTabs keyPoints={data.key_points} />
          </div>

          <div className="mt-6">
            <LabResultChart results={data.key_points.lab_results || []} />
          </div>
        </>
      )}
    </div>
  );
}
