import { FLAVOUR_COLORS } from "./config.js";

export function makeFlavourScale(packs) {
  const flavours = [...new Set(packs.map(d => d.flavour))].sort();
  return {
    flavours,
    scale: {
      domain: flavours,
      range: flavours.map(f => FLAVOUR_COLORS[f] ?? "#666"),
    },
  };
}
