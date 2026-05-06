import { Plot } from "../lib/deps.js";

export default {
  title: "Batch consistency",
  desc: "Which cards turned up in each production batch (the YYDDD prefix).",
  render: ({ packs, flavourScale }) => Plot.plot({
    height: 320,
    grid: true,
    color: { ...flavourScale, legend: true },
    x: { label: "Batch prefix", tickRotate: -45, type: "band" },
    y: { label: "Card number" },
    marks: [
      Plot.dot(packs.filter(d => d.cardNumber != null), {
        x: d => +d.batchPrefix,
        y: "cardNumber",
        fill: "flavour",
        stroke: "white",
        strokeWidth: 0.8,
        r: 7,
        tip: true,
      }),
    ],
  }),
};
