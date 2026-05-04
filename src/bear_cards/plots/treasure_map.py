from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..plotting import palette


_TIER_MARKER = {"common": "o", "uncommon": "s", "rare": "^", "unknown": "x"}


def plot_treasure_map_timeline(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["pack_index", "flavour", "card_number"]).copy()
    df["card_number"] = df["card_number"].astype(int)
    df["flavour"] = df["flavour"].astype(str)
    if "rarity_tier" not in df.columns:
        df["rarity_tier"] = "unknown"

    colors = palette(df["flavour"])

    fig, ax = plt.subplots(figsize=cfg.figsize)
    for tier, g in df.groupby("rarity_tier"):
        ax.scatter(
            g["pack_index"],
            g["card_number"],
            s=65,
            alpha=0.9,
            c=g["flavour"].map(colors),
            marker=_TIER_MARKER.get(str(tier), "o"),
            edgecolor="white",
            linewidth=0.6,
            label=str(tier),
        )

    ax.set_title("Treasure Map Timeline (open order)")
    ax.set_xlabel("Packs opened (row order)")
    ax.set_ylabel("Card number")
    ax.legend(title="Rarity tier (shape)", loc="best", frameon=False)
    return fig

