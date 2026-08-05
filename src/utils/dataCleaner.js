export function cleanData(data, method = "none") {
  if (!data.length) return [];

  let cleaned = [...data];
  const columns = Object.keys(data[0]);

  columns.forEach(col => {
    const values = cleaned
      .map(r => r[col])
      .filter(v => v !== null && v !== "" && !isNaN(v))
      .map(Number);

    if (!values.length) return;

    const mean =
      values.reduce((a, b) => a + b, 0) / values.length;

    // 🔹 FILL NULLS
    if (method === "fill") {
      cleaned = cleaned.map(row => ({
        ...row,
        [col]:
          row[col] === null || row[col] === ""
            ? mean.toFixed(2)
            : row[col]
      }));
    }

    // 🔹 DROP NULL ROWS
    if (method === "drop") {
      cleaned = cleaned.filter(row =>
        Object.values(row).every(v => v !== null && v !== "")
      );
    }

    // 🔹 NORMALIZE (Min-Max)
    if (method === "normalize") {
      const min = Math.min(...values);
      const max = Math.max(...values);

      cleaned = cleaned.map(row => ({
        ...row,
        [col]:
          !isNaN(row[col])
            ? ((row[col] - min) / (max - min)).toFixed(2)
            : row[col]
      }));
    }
  });

  return cleaned;
}