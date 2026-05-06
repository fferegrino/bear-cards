import { Plot, d3 } from "../lib/deps.js";

export default {
  title: "Time-of-production patterns (line / shift)",
  desc: "Top: flavour mix for each production line letter. Bottom: how many distinct cards appeared on each line.",
  wide: true,
  render: ({ packs, flavourScale }) => {
    const lines = [...new Set(packs.map(d => d.lineLetter))].filter(Boolean).sort();
    const mixData = d3.rollups(
      packs.filter(d => d.flavour && d.lineLetter),
      v => v.length,
      d => d.lineLetter,
      d => d.flavour,
    ).flatMap(([line, byFlav]) => byFlav.map(([flavour, count]) => ({ line, flavour, count })));

    const divData = lines.map(line => ({
      line,
      unique: new Set(
        packs
          .filter(d => d.lineLetter === line && d.cardNumber != null)
          .map(d => d.cardNumber),
      ).size,
    }));

    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "8px";
    wrapper.appendChild(Plot.plot({
      height: 220,
      marginLeft: 60,
      x: { label: null, domain: lines },
      y: { label: "Flavour share", tickFormat: "%", domain: [0, 1] },
      color: { ...flavourScale, legend: true },
      marks: [
        Plot.barY(
          mixData,
          Plot.stackY(
            { offset: "normalize" },
            { x: "line", y: "count", fill: "flavour", order: "appearance", tip: true },
          ),
        ),
      ],
    }));
    wrapper.appendChild(Plot.plot({
      height: 200,
      marginLeft: 60,
      x: { label: "Line / shift letter", domain: lines },
      y: { label: "Unique cards", grid: true },
      marks: [
        Plot.barY(divData, { x: "line", y: "unique", fill: "#444", tip: true }),
        Plot.text(divData, {
          x: "line", y: "unique", text: "unique",
          dy: -8, fill: "#444", fontWeight: 500,
        }),
      ],
    }));
    return wrapper;
  },
};
