from __future__ import annotations

import calendar
import datetime as dt

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig


def _month_grid(year: int, month: int) -> tuple[list[list[dt.date | None]], list[str]]:
    cal = calendar.Calendar(firstweekday=0)  # Monday
    weeks = cal.monthdatescalendar(year, month)
    grid: list[list[dt.date | None]] = []
    for w in weeks:
        row: list[dt.date | None] = []
        for d in w:
            row.append(d if d.month == month else None)
        grid.append(row)
    return grid, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def plot_calendar_heatmap(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    """
    Calendar-style heatmap using decoded production_date:
    - color = number of packs from that production day
    - text overlay = avg rarity score (0..2) when available
    """
    df = packs.dropna(subset=["production_date"]).copy()
    df["production_date"] = pd.to_datetime(df["production_date"]).dt.date
    counts = df.groupby("production_date").size()

    rarity = None
    if "rarity_score" in df.columns:
        rarity = df.groupby("production_date")["rarity_score"].mean()

    if counts.empty:
        fig, ax = plt.subplots(figsize=cfg.figsize)
        ax.set_title("Calendar Heatmap (no production_date data)")
        ax.axis("off")
        return fig

    # Choose the most represented production year (keeps plot focused)
    year = pd.Series([d.year for d in counts.index]).mode().iloc[0]
    months = range(1, 13)

    fig, axes = plt.subplots(3, 4, figsize=(max(cfg.figsize[0], 16), max(cfg.figsize[1], 10)))
    vmax = int(counts.max())
    for ax, month in zip(axes.ravel(), months):
        grid, day_labels = _month_grid(int(year), int(month))
        vals = [[(counts.get(d, 0) if d else 0) for d in row] for row in grid]
        im = ax.imshow(vals, aspect="auto", vmin=0, vmax=max(1, vmax))
        ax.set_title(calendar.month_abbr[month])
        ax.set_xticks(range(7))
        ax.set_xticklabels(day_labels, fontsize=8)
        ax.set_yticks([])

        # Overlay rarity score
        if rarity is not None:
            for i, row in enumerate(grid):
                for j, d in enumerate(row):
                    if d is None:
                        continue
                    c = int(counts.get(d, 0))
                    if c == 0:
                        continue
                    r = rarity.get(d)
                    txt = f"{c}\n{r:.1f}" if pd.notna(r) else f"{c}"
                    ax.text(j, i, txt, ha="center", va="center", fontsize=7, color="black")
        else:
            for i, row in enumerate(grid):
                for j, d in enumerate(row):
                    if d is None:
                        continue
                    c = int(counts.get(d, 0))
                    if c:
                        ax.text(j, i, str(c), ha="center", va="center", fontsize=7, color="black")

    fig.suptitle(f"Calendar Heatmap of Production Days ({year})\n(cell: packs count; overlay: avg rarity score when available)")
    cbar = fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.8)
    cbar.set_label("Packs collected from that production day")
    return fig

