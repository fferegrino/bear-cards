import { d3 } from "./deps.js";
import { RARITY_QUANTILES } from "./config.js";

// Counter-intuitively, higher count = more common.
// count >= q60 -> common (score 0)
// count >= q20 -> uncommon (score 1)
// otherwise   -> rare (score 2)
export function assignRarity(packs, [qLow, qHigh] = RARITY_QUANTILES) {
  const counts = d3.rollup(
    packs.filter(d => d.cardNumber != null),
    v => v.length,
    d => d.cardNumber,
  );
  const sorted = [...counts.values()].sort(d3.ascending);
  const tCommon = d3.quantileSorted(sorted, qLow);
  const tUncommon = d3.quantileSorted(sorted, qHigh);

  for (const d of packs) {
    const c = counts.get(d.cardNumber);
    d.cardCount = c ?? null;
    if (c == null) {
      d.rarityTier = "unknown";
      d.rarityScore = null;
    } else if (c >= tUncommon) {
      d.rarityTier = "common";
      d.rarityScore = 0;
    } else if (c >= tCommon) {
      d.rarityTier = "uncommon";
      d.rarityScore = 1;
    } else {
      d.rarityTier = "rare";
      d.rarityScore = 2;
    }
  }
}
