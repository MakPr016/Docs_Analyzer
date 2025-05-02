import React from "react";

export default function PatientInfoCard({ patient }) {
  if (!patient) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
      <p className="text-sm text-gray-500 mb-4">Basic details about the patient</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <p><strong>Name:</strong> {patient.name || "N/A"}</p>
        <p><strong>Age:</strong> {patient.age || "N/A"}</p>
        <p><strong>Gender:</strong> {patient.gender || "N/A"}</p>
        <p><strong>Date of Birth:</strong> {patient.dob || "N/A"}</p>
        <p className="col-span-2"><strong>Patient ID:</strong> {patient.patient_id || "N/A"}</p>
      </div>
    </div>
  );
}