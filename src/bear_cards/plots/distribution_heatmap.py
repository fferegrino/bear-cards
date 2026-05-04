from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig


def plot_card_distribution_heatmap(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["flavour", "card_number"]).copy()
    df["card_number"] = df["card_number"].astype(int)
    df["flavour"] = df["flavour"].astype(str)

    pivot = (
        df.groupby(["flavour", "card_number"])
        .size()
        .unstack(fill_value=0)
        .sort_index()
    )

    fig, ax = plt.subplots(figsize=cfg.figsize)
    im = ax.imshow(pivot.values, aspect="auto", interpolation="nearest")
    ax.set_title("Card Distribution Heatmap (flavour × card)")
    ax.set_xlabel("Card number")
    ax.set_ylabel("Flavour")

    ax.set_yticks(range(len(pivot.index)))
    ax.set_yticklabels(pivot.index)

    ax.set_xticks(range(len(pivot.columns)))
    ax.set_xticklabels([str(c) for c in pivot.columns], rotation=90)

    cbar = fig.colorbar(im, ax=ax)
    cbar.set_label("Count")
    return fig

