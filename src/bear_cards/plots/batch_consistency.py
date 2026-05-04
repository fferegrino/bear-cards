from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..plotting import palette


def plot_batch_consistency(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["batch_prefix", "card_number"]).copy()
    df["card_number"] = df["card_number"].astype(int)
    df["batch_prefix"] = df["batch_prefix"].astype(str)

    batches = sorted(df["batch_prefix"].unique())
    x_map = {b: i for i, b in enumerate(batches)}

    colors = palette(df["flavour"].astype(str))

    fig, ax = plt.subplots(figsize=(max(cfg.figsize[0], 1.2 * len(batches) + 4), cfg.figsize[1]))
    for flv, g in df.groupby("flavour"):
        ax.scatter(
            g["batch_prefix"].map(x_map),
            g["card_number"],
            s=55,
            alpha=0.85,
            label=str(flv),
            color=colors.get(str(flv)),
            edgecolor="white",
            linewidth=0.6,
        )

    ax.set_title("Batch Consistency Analysis (batch prefix → cards seen)")
    ax.set_xlabel("Batch prefix (first part of code, e.g. 26082)")
    ax.set_ylabel("Card number")
    ax.set_xticks(range(len(batches)))
    ax.set_xticklabels(batches, rotation=45, ha="right")
    ax.legend(title="Flavour", loc="best", frameon=False)
    return fig

