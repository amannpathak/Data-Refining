import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("csv"); // ✅ your logic
  const [unit, setUnit] = useState("rows");        // ✅ your logic
  const [loading, setLoading] = useState(false);

  // ✅ FIXED (moved inside)
  const [fileSize, setFileSize] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("unit", unit);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      localStorage.setItem("uploadedData", JSON.stringify(result.data));
      localStorage.setItem("insights", JSON.stringify(result.insights));

      alert("Upload Successful ✅");
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#1e293b] p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-semibold mb-6 text-center">
          📂 Upload Dataset
        </h1>

        {/* FILE INPUT */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Select File
          </label>

          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files[0];
              setFile(f);

              if (f) {
                setFileName(f.name);
                setFileSize((f.size / (1024 * 1024)).toFixed(2)); // MB
              }
            }}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg cursor-pointer"
          />

          {file && (
            <p className="text-sm mt-2 text-green-400">
              {fileName} ({fileSize} MB)
            </p>
          )}
        </div>

        {/* TYPE + UNIT */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              File Type
            </label>

            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Unit
            </label>

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg"
            >
              <option value="rows">Rows</option>
              <option value="columns">Columns</option>
              <option value="cells">Cells</option>
            </select>
          </div>

        </div>

        {/* DRAG UI */}
        <div className="border-2 border-dashed border-gray-600 p-6 rounded-xl text-center mb-6">
          <p className="text-gray-400">
            Drag & Drop file here (optional)
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-medium"
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>

      </div>
    </div>
  );
}