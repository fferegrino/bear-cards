import { Plot } from "../lib/deps.js";

export default {
  title: "Production timeline vs discovery",
  desc: "Each pack plotted by its decoded production date and the card found inside.",
  render: ({ packs, flavourScale }) => Plot.plot({
    height: 320,
    marginLeft: 50,
    grid: true,
    color: { ...flavourScale, legend: true },
    x: { label: "Production date" },
    y: { label: "Card number" },
    marks: [
      Plot.dot(packs.filter(d => d.cardNumber != null), {
        x: "productionDate",
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
