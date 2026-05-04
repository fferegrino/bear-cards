from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..plotting import palette


def plot_production_timeline_vs_discovery(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["production_date", "card_number"]).copy()
    df["card_number"] = df["card_number"].astype(int)

    colors = palette(df["flavour"].astype(str))

    fig, ax = plt.subplots(figsize=cfg.figsize)
    for flv, g in df.groupby("flavour"):
        ax.scatter(
            g["production_date"],
            g["card_number"],
            s=55,
            alpha=0.85,
            label=str(flv),
            color=colors.get(str(flv)),
            edgecolor="white",
            linewidth=0.6,
        )

    ax.set_title("Production Timeline vs Card Discovery")
    ax.set_xlabel("Production date (decoded from code)")
    ax.set_ylabel("Card number")
    ax.legend(title="Flavour", loc="best", frameon=False)
    return fig

