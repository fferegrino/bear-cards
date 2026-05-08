import { Plot, d3 } from "../lib/deps.js";

export default {
  title: "Calendar heatmap of production days",
  desc: "Cell color = packs collected from that production day. Number = pack count, decimal = avg rarity score (0 common, 2 rare). Showing the most-represented year.",
  wide: true,
  render: ({ packs, width }) => {
    if (!packs.length) return document.createTextNode("No production date data.");

    const yearCounts = d3.rollup(packs, v => v.length, d => d.productionDate.getUTCFullYear());
    const year = [...yearCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

    const stats = d3.rollup(
      packs.filter(d => d.productionDate.getUTCFullYear() === year),
      v => ({ count: v.length, rarity: d3.mean(v, x => x.rarityScore) }),
      d => d3.utcDay(d.productionDate).getTime(),
    );

    const monthLabels = d3.range(12).map(m => d3.utcFormat("%b")(new Date(Date.UTC(year, m, 1))));
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const days = [];
    let cursor = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    while (cursor < end) {
      const t = cursor.getTime();
      const s = stats.get(t);
      const wd = (cursor.getUTCDay() + 6) % 7; // Mon=0..Sun=6
      const m = cursor.getUTCMonth();
      const firstWd = (new Date(Date.UTC(year, m, 1)).getUTCDay() + 6) % 7;
      const week = Math.floor((cursor.getUTCDate() - 1 + firstWd) / 7);
      days.push({
        date: new Date(t),
        month: monthLabels[m],
        weekday: dayLabels[wd],
        week,
        count: s?.count ?? 0,
        rarity: s?.rarity ?? null,
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const maxCount = d3.max(days, d => d.count) || 1;

    // Two stacked rows of 6 months each — keeps cells roughly square at full
    // grid width instead of the squat 13px-wide × 35px-tall rectangles you
    // get from cramming all 12 months into a single horizontal strip.
    const renderHalf = (months, withLegend) => {
      const subset = days.filter(d => months.includes(d.month));
      return Plot.plot({
        width,
        height: 200,
        marginLeft: 30,
        marginTop: 30,
        label: null,
        x: { domain: dayLabels, axis: "top", tickSize: 0 },
        y: { domain: [0, 1, 2, 3, 4, 5], axis: null },
        fx: { domain: months, label: null, tickSize: 0 },
        color: {
          scheme: "ylorrd",
          legend: withLegend,
          label: "Packs from that day",
          domain: [0, maxCount],
        },
        marks: [
          Plot.cell(subset, {
            x: "weekday", y: "week", fx: "month",
            fill: "#f1ece2",
            inset: 1,
          }),
          Plot.cell(subset.filter(d => d.count > 0), {
            x: "weekday", y: "week", fx: "month",
            fill: "count",
            inset: 1,
            tip: true,
            title: d => `${d3.utcFormat("%a %b %-d, %Y")(d.date)}\nPacks: ${d.count}${d.rarity != null ? `\nAvg rarity: ${d.rarity.toFixed(2)}` : ""}`,
          }),
          Plot.text(subset.filter(d => d.count > 0), {
            x: "weekday", y: "week", fx: "month",
            text: d => d.rarity != null ? `${d.count}\n${d.rarity.toFixed(1)}` : `${d.count}`,
            fill: "black",
            fontSize: 9,
            lineHeight: 1.05,
          }),
        ],
      });
    };

    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "8px";
    wrapper.appendChild(renderHalf(monthLabels.slice(0, 6), true));
    wrapper.appendChild(renderHalf(monthLabels.slice(6, 12), false));
    return wrapper;
  },
};
