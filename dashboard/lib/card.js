// Renders one chart card into the given grid container.
// `chart` is the default export of a chart module: { title, desc, wide?, render(ctx) }.
// The card observes its own width and re-renders the chart whenever the container
// resizes, so Observable Plot SVGs grow/shrink with the grid cell.
export function card(chart, ctx, gridEl) {
  const root = document.createElement("section");
  root.className = "card" + (chart.wide ? " wide" : "");
  root.innerHTML = `<h2>${chart.title}</h2><p class="desc">${chart.desc ?? ""}</p><div class="chart"></div>`;
  const chartEl = root.querySelector(".chart");
  gridEl.appendChild(root);

  let lastWidth = 0;
  let pending = 0;
  const draw = () => {
    pending = 0;
    const width = Math.floor(chartEl.clientWidth);
    if (!width || width === lastWidth) return;
    lastWidth = width;
    chartEl.replaceChildren();
    try {
      const out = chart.render({ ...ctx, width });
      if (out) chartEl.appendChild(out);
    } catch (e) {
      chartEl.innerHTML = `<div class="err">${e.stack || e.message}</div>`;
      console.error(e);
    }
  };

  const ro = new ResizeObserver(() => {
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(draw);
  });
  ro.observe(chartEl);
}
