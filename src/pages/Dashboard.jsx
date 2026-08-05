import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import AIAvatar from "../components/AIAvatar";

export default function Dashboard() {
  const data = JSON.parse(localStorage.getItem("uploadedData") || "[]");
  const insights = JSON.parse(localStorage.getItem("insights") || "{}");

  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // 🔥 ADVANCED STATS FUNCTION
  const getStats = (data) => {
    if (!data || data.length === 0) return {};

    const keys = Object.keys(data[0]);
    let stats = {};

    keys.forEach((key) => {
      const rawValues = data.map((row) => row[key]);

      const values = rawValues
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));

      const missing = rawValues.filter(
        (v) => v === null || v === undefined || v === ""
      ).length;

      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;

        const sorted = [...values].sort((a, b) => a - b);
        const median =
          sorted.length % 2 === 0
            ? (sorted[sorted.length / 2] +
                sorted[sorted.length / 2 - 1]) /
              2
            : sorted[Math.floor(sorted.length / 2)];

        const variance =
          values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
          values.length;

        const stdDev = Math.sqrt(variance);

        const min = Math.min(...values);
        const max = Math.max(...values);

        const outliers = values.filter(
          (v) => Math.abs((v - mean) / stdDev) > 2
        );

        stats[key] = {
          mean: mean.toFixed(2),
          median: median.toFixed(2),
          stdDev: stdDev.toFixed(2),
          min,
          max,
          missing,
          outliers: outliers.length,
        };
      } else {
        stats[key] = {
          type: "non-numeric",
          missing,
        };
      }
    });

    return stats;
  };

  const stats = getStats(data);

  // 🤖 SMART INSIGHTS
  const generateInsights = (stats) => {
    let insightsArr = [];

    Object.entries(stats).forEach(([col, val]) => {
      if (val.type === "non-numeric") {
        insightsArr.push(`${col} is categorical with ${val.missing} missing values.`);
      } else {
        if (val.outliers > 0) {
          insightsArr.push(`${col} has ${val.outliers} outliers.`);
        }
        if (val.missing > 0) {
          insightsArr.push(`${col} contains ${val.missing} missing values.`);
        }
        if (parseFloat(val.stdDev) > parseFloat(val.mean)) {
          insightsArr.push(`${col} shows high variance.`);
        }
      }
    });

    return insightsArr;
  };

  const smartInsights = generateInsights(stats);

  const runAI = async () => {
    if (!data || data.length === 0) {
      alert("No data available ❌");
      return;
    }

    setLoadingAI(true);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      const result = await res.json();
      setAiResult(result.analysis || "No response ❌");
    } catch (error) {
      console.error(error);
      alert("AI failed ❌");
    }

    setLoadingAI(false);
  };

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2>Upload file first 🚀</h2>
      </div>
    );
  }

  const keys = Object.keys(data[0] || {});

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-6">⚡ DataRefiner Dashboard</h1>

      {/* ACTION BAR */}
      <div className="bg-[#1e293b] p-4 rounded-xl flex flex-wrap gap-3 mb-6">
        <button className="bg-gray-700 px-4 py-2 rounded">Fill Null</button>
        <button className="bg-gray-700 px-4 py-2 rounded">Drop Null</button>
        <button className="bg-gray-700 px-4 py-2 rounded">Normalize</button>
        <button className="bg-yellow-600 px-4 py-2 rounded">Download CSV</button>
        <button className="bg-indigo-600 px-4 py-2 rounded">Download PDF</button>

        <button
          onClick={runAI}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          {loadingAI ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p>Total Rows</p>
          <h2>{insights?.totalRows}</h2>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p>Duplicates Removed</p>
          <h2>{insights?.removedDuplicates}</h2>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p>Nulls Filled</p>
          <h2>{insights?.filledNulls}</h2>
        </div>
      </div>

      {/* 📊 ADVANCED ANALYSIS */}
      <div className="bg-[#1e293b] p-6 rounded-xl mb-6">
        <h2 className="text-lg mb-4">📊 Advanced Statistical Analysis</h2>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats).map(([col, val]) => (
            <div key={col} className="bg-black p-4 rounded">
              <h3 className="text-purple-400">{col}</h3>

              {val.type === "non-numeric" ? (
                <p>Non-numeric | Missing: {val.missing}</p>
              ) : (
                <>
                  <p>Mean: {val.mean}</p>
                  <p>Median: {val.median}</p>
                  <p>Std: {val.stdDev}</p>
                  <p>Min: {val.min}</p>
                  <p>Max: {val.max}</p>
                  <p>Missing: {val.missing}</p>
                  <p>Outliers: {val.outliers}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🤖 SMART INSIGHTS */}
      <div className="bg-[#1e293b] p-4 rounded mb-6">
        <h2 className="text-lg mb-2">🤖 Smart Insights</h2>
        {smartInsights.map((ins, i) => (
          <p key={i}>• {ins}</p>
        ))}
      </div>

      {/* AI */}
      <div className="bg-[#1e293b] p-4 rounded mb-6">
        <h2>AI Assistant</h2>
        {aiResult && <p>{aiResult}</p>}
      </div>

      {/* CHART */}
      <BarChart width={600} height={300} data={data.slice(0, 10)}>
        <XAxis dataKey={keys[0]} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={keys[1]} />
      </BarChart>

      {/* TABLE */}
      <div className="mt-6 overflow-auto">
        <table className="w-full border">
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI AVATAR */}
      <AIAvatar />

    </div>
  );
}