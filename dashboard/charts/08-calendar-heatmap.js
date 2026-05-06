import { Plot, d3 } from "../lib/deps.js";

export default {
  title: "Calendar heatmap of production days",
  desc: "Cell color = packs collected from that production day. Number = pack count, decimal = avg rarity score (0 common, 2 rare). Showing the most-represented year.",
  wide: true,
  render: ({ packs }) => {
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

    return Plot.plot({
      height: 240,
      marginLeft: 30,
      marginTop: 30,
      label: null,
      x: { domain: dayLabels, axis: "top", tickSize: 0 },
      y: { domain: [0, 1, 2, 3, 4, 5], axis: null },
      fx: { domain: monthLabels, label: null, tickSize: 0 },
      color: {
        scheme: "ylorrd",
        legend: true,
        label: "Packs from that day",
        domain: [0, maxCount],
      },
      marks: [
        Plot.cell(days, {
          x: "weekday", y: "week", fx: "month",
          fill: "#f1ece2",
          inset: 1,
        }),
        Plot.cell(days.filter(d => d.count > 0), {
          x: "weekday", y: "week", fx: "month",
          fill: "count",
          inset: 1,
          tip: true,
          title: d => `${d3.utcFormat("%a %b %-d, %Y")(d.date)}\nPacks: ${d.count}${d.rarity != null ? `\nAvg rarity: ${d.rarity.toFixed(2)}` : ""}`,
        }),
        Plot.text(days.filter(d => d.count > 0), {
          x: "weekday", y: "week", fx: "month",
          text: d => d.rarity != null ? `${d.count}\n${d.rarity.toFixed(1)}` : `${d.count}`,
          fill: "black",
          fontSize: 8,
          lineHeight: 1.05,
        }),
      ],
    });
  },
};
