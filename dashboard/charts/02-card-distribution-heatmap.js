import { Plot, d3 } from "../lib/deps.js";

export default {
  title: "Card distribution heatmap",
  desc: "How many times each card has appeared in each flavour.",
  render: ({ packs }) => {
    const cells = d3.rollups(
      packs.filter(d => d.cardNumber != null),
      v => v.length,
      d => d.flavour,
      d => d.cardNumber,
    ).flatMap(([flavour, byCard]) =>
      byCard.map(([cardNumber, count]) => ({ flavour, cardNumber: +cardNumber, count })),
    );
    return Plot.plot({
      height: 220,
      marginLeft: 110,
      x: { label: "Card number", tickRotate: -90, type: "band" },
      y: { label: null },
      color: { scheme: "blues", legend: true, label: "Count" },
      marks: [
        Plot.cell(cells, { x: "cardNumber", y: "flavour", fill: "count", inset: 1, tip: true }),
        Plot.text(cells, {
          x: "cardNumber", y: "flavour", text: "count",
          fill: d => d.count >= 2 ? "white" : "#333",
          fontSize: 10,
        }),
      ],
    });
  },
};
