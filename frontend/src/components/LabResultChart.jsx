import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LabResultChart({ results }) {
  if (!results || results.length === 0) return null;
  const data = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Result Value",
        data: results.map((r) => parseFloat(r.result_value || 0)),
        backgroundColor: results.map((r) => {
          if (r.status === "High") return "#f87171";
          if (r.status === "Low") return "#facc15";
          return "#34d399";
        })
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Test Results Visualization</h2>
      <div className="max-w-full">
        <Bar data={data} />
      </div>
    </div>
  );
}