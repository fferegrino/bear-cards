import { loadPacks } from "./lib/data.js";
import { assignRarity } from "./lib/rarity.js";
import { makeFlavourScale } from "./lib/scales.js";
import { renderSummary } from "./lib/summary.js";
import { card } from "./lib/card.js";

import productionTimeline from "./charts/01-production-timeline.js";
import cardDistributionHeatmap from "./charts/02-card-distribution-heatmap.js";
import rarityCurve from "./charts/03-rarity-curve.js";
import batchConsistency from "./charts/04-batch-consistency.js";
import flavourCardNetwork from "./charts/05-flavour-card-network.js";
import duplicateTracker from "./charts/06-duplicate-tracker.js";
import timeOfProduction from "./charts/07-time-of-production.js";
import calendarHeatmap from "./charts/08-calendar-heatmap.js";

// Render order on the page. Reorder, comment out, or add to this list to change the dashboard.
const charts = [
  productionTimeline,
  cardDistributionHeatmap,
  rarityCurve,
  batchConsistency,
  flavourCardNetwork,
  duplicateTracker,
  timeOfProduction,
  calendarHeatmap,
];

const totalCardCount = 60;
const packs = await loadPacks("data/packs.csv");
assignRarity(packs);

const { scale: flavourScale } = makeFlavourScale(packs);

renderSummary(packs, totalCardCount, document.getElementById("summary"));

const grid = document.getElementById("grid");
const ctx = { packs, flavourScale, totalCardCount };
for (const chart of charts) {
  card(chart, ctx, grid);
}
