// Renders one chart card into the given grid container.
// `chart` is the default export of a chart module: { title, desc, wide?, render(ctx) }.
export function card(chart, ctx, gridEl) {
  const root = document.createElement("section");
  root.className = "card" + (chart.wide ? " wide" : "");
  root.innerHTML = `<h2>${chart.title}</h2><p class="desc">${chart.desc ?? ""}</p><div class="chart"></div>`;
  const chartEl = root.querySelector(".chart");
  try {
    const out = chart.render(ctx);
    if (out) chartEl.appendChild(out);
  } catch (e) {
    chartEl.innerHTML = `<div class="err">${e.stack || e.message}</div>`;
    console.error(e);
  }
  gridEl.appendChild(root);
}
