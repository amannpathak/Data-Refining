export function analyzeData(data) {
  if (!data.length) return {};

  const result = {};
  const cols = Object.keys(data[0]);

  cols.forEach(col => {
    let values = data
      .map(r => r[col])
      .filter(v => v !== null && v !== "" && !isNaN(v))
      .map(Number);

    if (!values.length) return;

    const mean =
      values.reduce((a, b) => a + b, 0) / values.length;

    const sorted = [...values].sort((a, b) => a - b);

    const median =
      sorted.length % 2
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2] +
            sorted[sorted.length / 2 - 1]) /
          2;

    const freq = {};
    values.forEach(v => (freq[v] = (freq[v] || 0) + 1));

    const mode = Object.keys(freq).reduce((a, b) =>
      freq[a] > freq[b] ? a : b
    );

    const variance =
      values.reduce((a, b) => a + (b - mean) ** 2, 0) /
      values.length;

    const sd = Math.sqrt(variance);

    const mse = variance;

    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;

    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;

    const outliers = values.filter(v => v < lower || v > upper);

    const chiSquare = values.length;

    result[col] = {
      mean: mean.toFixed(2),
      median,
      mode,
      sd: sd.toFixed(2),
      mse: mse.toFixed(2),
      chiSquare,
      outliers
    };
  });

  return result;
}