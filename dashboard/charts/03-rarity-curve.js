import { Plot, d3 } from "../lib/deps.js";

export default {
  title: "Rarity curve",
  desc: "Cards ranked from most common to rarest.",
  render: ({ packs, width }) => {
    const ranked = d3.rollups(
      packs.filter(d => d.cardNumber != null),
      v => v.length,
      d => d.cardNumber,
    )
      .map(([cardNumber, count]) => ({ cardNumber, count }))
      .sort((a, b) => d3.descending(a.count, b.count) || d3.ascending(a.cardNumber, b.cardNumber));
    ranked.forEach((d, i) => (d.rank = i + 1));
    const max = d3.max(ranked, d => d.count) ?? 0;
    const min = d3.min(ranked, d => d.count) ?? 1;
    const useLog = max / Math.max(1, min) > 50;
    return Plot.plot({
      width,
      height: 320,
      grid: true,
      x: { label: "Card rank (most common → rarest)" },
      y: { label: "Frequency (packs seen)", type: useLog ? "log" : "linear" },
      marks: [
        Plot.line(ranked, { x: "rank", y: "count", stroke: "#1f2937", strokeWidth: 2 }),
        Plot.dot(ranked, {
          x: "rank", y: "count", fill: "#1f2937", r: 4, tip: true,
          channels: { card: "cardNumber" },
        }),
      ],
    });
  },
};
