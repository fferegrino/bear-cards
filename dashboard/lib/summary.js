import { d3 } from "./deps.js";

export function renderSummary(packs, totalCardCount, summaryEl) {
  const flavours = new Set(packs.map(d => d.flavour));
  const uniqueCards = new Set(packs.map(d => d.cardNumber).filter(c => c != null)).size;
  const dateExtent = d3.extent(packs, d => d.productionDate);

  const stats = [
    ["Packs opened", packs.length],
    ["Unique cards", `${uniqueCards} / ${totalCardCount}`],
    ["Flavours", flavours.size],
    ["Production span", dateExtent[0] && dateExtent[1]
      ? `${d3.utcFormat("%b %-d")(dateExtent[0])} – ${d3.utcFormat("%b %-d, %Y")(dateExtent[1])}`
      : "—"],
  ];

  for (const [label, value] of stats) {
    const el = document.createElement("div");
    el.className = "stat";
    el.innerHTML = `<span class="label">${label}</span><span class="value">${value}</span>`;
    summaryEl.appendChild(el);
  }
}
