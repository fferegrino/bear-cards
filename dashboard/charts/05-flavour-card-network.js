import { Plot, d3 } from "../lib/deps.js";
import { FLAVOUR_COLORS } from "../lib/config.js";

export default {
  title: "Flavour ↔ card network",
  desc: "Edge thickness reflects how often a flavour produced a given card.",
  wide: true,
  render: ({ packs, flavourScale, width }) => {
    const flavList = [...new Set(packs.map(d => d.flavour))].sort();
    const cardList = [...new Set(packs.map(d => d.cardNumber).filter(c => c != null))]
      .sort(d3.ascending);
    const fy = new Map(flavList.map((f, i) => [f, flavList.length === 1 ? 0.5 : i / (flavList.length - 1)]));
    const cy = new Map(cardList.map((c, i) => [c, cardList.length === 1 ? 0.5 : i / (cardList.length - 1)]));
    const edges = d3.rollups(
      packs.filter(d => d.cardNumber != null),
      v => v.length,
      d => d.flavour,
      d => d.cardNumber,
    ).flatMap(([flavour, byCard]) =>
      byCard.map(([cardNumber, count]) => ({
        flavour,
        cardNumber,
        count,
        x1: 0, y1: fy.get(flavour),
        x2: 1, y2: cy.get(cardNumber),
      })),
    );
    const maxW = d3.max(edges, d => d.count) ?? 1;

    const flavNodes = flavList.map(f => ({ flavour: f, side: 0, y: fy.get(f) }));
    const cardNodes = cardList.map(c => ({ cardNumber: c, side: 1, y: cy.get(c) }));

    return Plot.plot({
      width,
      height: Math.max(280, 26 * cardList.length),
      marginLeft: 110,
      marginRight: 60,
      x: { domain: [-0.05, 1.05], axis: null },
      y: { domain: [-0.08, 1.08], axis: null },
      color: { ...flavourScale, legend: true },
      marks: [
        Plot.link(edges, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          stroke: "flavour",
          strokeOpacity: d => 0.18 + 0.6 * (d.count / maxW),
          strokeWidth: d => 0.8 + 3 * (d.count / maxW),
          tip: true,
        }),
        Plot.dot(flavNodes, {
          x: "side", y: "y",
          fill: d => FLAVOUR_COLORS[d.flavour] ?? "#666",
          r: 9, stroke: "white", strokeWidth: 1.5,
        }),
        Plot.text(flavNodes, {
          x: "side", y: "y", text: "flavour",
          dx: -14, textAnchor: "end", fontSize: 12, fontWeight: 500,
        }),
        Plot.dot(cardNodes, {
          x: "side", y: "y", fill: "#333", r: 5, stroke: "white", strokeWidth: 1.2,
        }),
        Plot.text(cardNodes, {
          x: "side", y: "y", text: d => String(d.cardNumber),
          dx: 14, textAnchor: "start", fontSize: 11,
        }),
      ],
    });
  },
};
