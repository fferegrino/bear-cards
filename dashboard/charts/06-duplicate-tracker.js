import { Plot } from "../lib/deps.js";

export default {
  title: "Duplicate tracker",
  desc: "Cumulative unique cards as packs are opened (the collector curve).",
  render: ({ packs, width }) => {
    const seen = new Set();
    const series = [];
    for (const d of [...packs].sort((a, b) => a.packIndex - b.packIndex)) {
      if (d.cardNumber != null) seen.add(d.cardNumber);
      series.push({ packIndex: d.packIndex, unique: seen.size });
    }
    return Plot.plot({
      width,
      height: 320,
      grid: true,
      x: { label: "Packs opened" },
      y: { label: "Unique cards collected" },
      marks: [
        Plot.line(series, { x: "packIndex", y: "unique", stroke: "#492950", strokeWidth: 2.5 }),
        Plot.dot(series, { x: "packIndex", y: "unique", fill: "#492950", r: 3.5, tip: true }),
      ],
    });
  },
};
