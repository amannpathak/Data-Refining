import { useState } from "react";

export default function FileUpload() {
  const [fileInfo, setFileInfo] = useState(null);
  const [sizeLimit, setSizeLimit] = useState(100); // MB

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ TYPE CHECK
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
      alert("Only CSV or JSON allowed ❌");
      return;
    }

    // ✅ SIZE CHECK
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > sizeLimit) {
      alert(`File exceeds ${sizeLimit}MB ❌`);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      let parsedData = [];

      try {
        if (file.name.endsWith(".csv")) {
          const text = event.target.result;
          const rows = text.split("\n").map(r => r.split(","));

          const headers = rows[0];
          parsedData = rows.slice(1).map(row => {
            let obj = {};
            headers.forEach((h, i) => {
              obj[h] = row[i] || "";
            });
            return obj;
          });
        } else {
          parsedData = JSON.parse(event.target.result);
        }

        localStorage.setItem("uploadedData", JSON.stringify(parsedData));

        // ✅ STATS CALCULATION
        const total = parsedData.length;

        let nulls = 0;
        let columnStats = {};

        parsedData.forEach(row => {
          Object.entries(row).forEach(([key, val]) => {
            if (val === "" || val == null) nulls++;

            // unbalanced check
            if (!columnStats[key]) columnStats[key] = {};
            columnStats[key][val] = (columnStats[key][val] || 0) + 1;
          });
        });

        // detect imbalance
        let unbalanced = false;
        Object.values(columnStats).forEach(col => {
          const values = Object.values(col);
          const max = Math.max(...values);
          const min = Math.min(...values);
          if (max > min * 2) unbalanced = true;
        });

        const info = {
          name: file.name,
          size: fileSizeMB.toFixed(2),
          total,
          nulls,
          unbalanced
        };

        setFileInfo(info);
      } catch (err) {
        alert("Error reading file ❌");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded">

      <h2 className="text-xl mb-4">📂 Upload Dataset</h2>

      {/* SIZE SELECT */}
      <select
        className="mb-4 text-black p-2"
        onChange={(e) => setSizeLimit(Number(e.target.value))}
      >
        <option value={100}>100 MB</option>
        <option value={1000}>1 GB</option>
      </select>

      {/* FILE INPUT */}
      <input type="file" onChange={handleFile} />

      {/* FILE INFO */}
      {fileInfo && (
        <div className="mt-6 bg-purple-700 p-4 rounded">
          <p>📄 File: {fileInfo.name}</p>
          <p>📦 Size: {fileInfo.size} MB</p>
          <p>📊 Total Rows: {fileInfo.total}</p>
          <p>⚠️ Null Values: {fileInfo.nulls}</p>
          <p>
            📉 Data Balance:{" "}
            {fileInfo.unbalanced ? "Unbalanced ⚠️" : "Balanced ✅"}
          </p>
        </div>
      )}
    </div>
  );
}