# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses [`uv`](https://docs.astral.sh/uv/) and Python 3.13.

```bash
uv sync   # install deps from uv.lock
make      # sort data/packs.csv, then regenerate every figure into plots/
```

`make` (default target `run`) chains `src/sort_packs.py` → `src/generate_plots.py`. Run either script directly with `uv run python src/<name>.py` to skip the other half. There is no test suite, linter, or formatter configured.

## Architecture

The pipeline is small and one-directional: CSV → DataFrame enrichment → per-figure plotting function → PNG in `plots/`.

**Entry point:** `src/generate_plots.py` orchestrates the run. It builds a `PlotConfig`, loads packs/cards, enriches with rarity tiers, then calls each `plot_*` function and saves the returned `Figure`. Adding a new figure means: write a `plot_xxx(packs, cfg) -> Figure` module under `src/bear_cards/plots/`, then register `(filename, plot_xxx(packs, cfg))` in the `figs` list. Note `treasure_map.py` exists in `plots/` but is intentionally not wired into the entry point.

**Data shape (`bear_cards/data.py`):** `load_packs` is the single place that decodes `production_code` via `decode.py` and attaches the derived columns every plot relies on: `production_date`, `production_year`, `production_doy`, `batch_prefix`, `line_cycle`, `line_letter`, plus `pack_index` (1-based discovery order, drives the duplicate-tracker curve) and a nullable-int `card_number`. Plot modules should consume these columns rather than re-parsing `production_code`.

**Production code format (`bear_cards/decode.py`):** Strings like `"26082 15D"` parse as `YY DOY CC L` → 2026, day-of-year 82, cycle 15, line letter D. The regex is strict; malformed codes raise `ValueError` rather than producing NaT. `base_century` defaults to 2000.

**Rarity (`bear_cards/rarity.py`):** `assign_rarity_tiers` adds `card_count`, `rarity_tier` (common/uncommon/rare), and numeric `rarity_score` based on frequency quantiles from `PlotConfig.rarity_quantiles` (defaults `(0.2, 0.6)`). Counter-intuitively, **higher count = more common**: `count >= q60` is `common`, `count >= q20` is `uncommon`, below is `rare`. Several plots (e.g. calendar heatmap overlay) rely on `rarity_score` already being present.

**Config (`bear_cards/config.py`):** `PlotConfig` is a frozen dataclass holding paths, dpi, figsize, style, and the rarity quantile thresholds. All plot functions take it as their second argument; do not hard-code paths or styling. `setup_matplotlib(cfg)` must be called once before plotting (sets dpi, grid, spine defaults).

**Data files:** `data/packs.csv` is the log (one row per opened pack, ISO dates). `load_packs` still parses with `pd.to_datetime(..., errors="coerce")` so a stray non-ISO entry coerces to NaT rather than blowing up. `data/cards.csv` is the card lookup table (currently loaded but unused — reserved for later label enrichment).
