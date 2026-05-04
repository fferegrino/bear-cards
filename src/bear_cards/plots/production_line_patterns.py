from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..plotting import palette


def plot_time_of_production_patterns(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    """
    Uses the letter in "15D" as line/shift.
    - flavour mix per line
    - card diversity per line (unique cards)
    """
    df = packs.dropna(subset=["line_letter"]).copy()
    df["line_letter"] = df["line_letter"].astype(str)

    lines = sorted(df["line_letter"].unique())
    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(cfg.figsize[0], max(cfg.figsize[1], 8)), sharex=True
    )

    # Flavour mix (stacked proportions)
    mix = (
        df.dropna(subset=["flavour"])
        .groupby(["line_letter", "flavour"])
        .size()
        .unstack(fill_value=0)
        .loc[lines]
    )
    mix_pct = mix.div(mix.sum(axis=1).replace(0, 1), axis=0)
    colors = palette(str(c) for c in mix_pct.columns)
    bottom = pd.Series([0.0] * len(lines), index=lines)
    for flv in mix_pct.columns:
        ax1.bar(lines, mix_pct[flv], bottom=bottom, label=str(flv), color=colors[str(flv)])
        bottom = bottom + mix_pct[flv]
    ax1.set_title("Time-of-Production Patterns (line/shift letter)")
    ax1.set_ylabel("Flavour mix (share)")
    ax1.legend(title="Flavour", loc="upper right", frameon=False)

    # Card diversity per line
    div = (
        df.dropna(subset=["card_number"])
        .groupby("line_letter")["card_number"]
        .nunique()
        .reindex(lines)
        .fillna(0)
    )
    ax2.bar(lines, div, color="#444444")
    ax2.set_ylabel("Unique cards (count)")
    ax2.set_xlabel("Line / shift letter (from code)")
    return fig

