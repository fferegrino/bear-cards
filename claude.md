# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The dashboard is a static page that loads `data/packs.csv` at runtime via `fetch`, so it must be served over HTTP (not opened via `file://`). Any static server works:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

It's also deployable directly to GitHub Pages from `main` / root with no build step — `index.html` is the entry point.

There is no test suite, linter, or formatter configured.

## Architecture

The dashboard is a single static page (`index.html`) plus a small ES-module tree under `dashboard/`. Everything runs in the browser; there is no build step.

```
index.html                  shell — links the stylesheet and loads main.js
dashboard/
  styles.css                all visual styling
  main.js                   entry: loads packs, assigns rarity, renders summary + each chart
  lib/
    deps.js                 single source of truth for the d3 / Plot CDN imports
    config.js               FLAVOUR_COLORS, RARITY_QUANTILES
    decode.js               decodeProductionCode (YY DOY CC L → fields)
    data.js                 loadPacks(path) → enriched pack objects
    rarity.js               assignRarity(packs) — mutates each pack with rarityTier/rarityScore
    scales.js               makeFlavourScale(packs) → Observable Plot color scale
    summary.js              renderSummary(packs, el) — header stats
    card.js                 card(chart, ctx, gridEl) — wraps a chart module in a <section>
  charts/
    01-production-timeline.js
    02-card-distribution-heatmap.js
    03-rarity-curve.js
    04-batch-consistency.js
    05-flavour-card-network.js
    06-duplicate-tracker.js
    07-time-of-production.js
    08-calendar-heatmap.js
```

**Chart module contract:** each file in `dashboard/charts/` has a default export `{ title, desc, wide?, render(ctx) }`. `render` is called with `ctx = { packs, flavourScale }` and must return a DOM node (typically a `Plot.plot(...)` SVG). To add a chart: create a new file under `dashboard/charts/`, then import it and append it to the `charts` array in `dashboard/main.js`. To reorder, comment out, or remove a chart, edit that array.

**Pack shape (`dashboard/lib/data.js`):** `loadPacks` is the single place that decodes `production_code` and attaches the derived columns every chart relies on: `productionDate`, `productionYear`, `productionDoy`, `batchPrefix`, `lineCycle`, `lineLetter`, plus `packIndex` (1-based discovery order, drives the duplicate-tracker curve) and a nullable `cardNumber`. Charts should consume these fields rather than re-parsing `productionCode`.

**Production code format (`dashboard/lib/decode.js`):** Strings like `"26082 15D"` parse as `YY DOY CC L` → 2026, day-of-year 82, cycle 15, line letter D. The regex is strict; malformed codes throw rather than silently producing `Invalid Date`. `baseCentury` defaults to 2000.

**Rarity (`dashboard/lib/rarity.js`):** `assignRarity` mutates each pack with `cardCount`, `rarityTier` (`common`/`uncommon`/`rare`/`unknown`), and numeric `rarityScore` (0/1/2) based on frequency quantiles from `RARITY_QUANTILES` (defaults `[0.2, 0.6]`). Counter-intuitively, **higher count = more common**: `count >= q60` is `common`, `count >= q20` is `uncommon`, below is `rare`. The calendar heatmap relies on `rarityScore` already being present.

**Dependencies (`dashboard/lib/deps.js`):** d3 and Observable Plot are pulled from `cdn.jsdelivr.net` as ES modules. All chart and lib files import them via `./deps.js` so the CDN URL exists in exactly one place.

**Data files:** `data/packs.csv` is the log (one row per opened pack). `data/cards.csv` is the card lookup table (currently unused by the dashboard — reserved for later label enrichment).
