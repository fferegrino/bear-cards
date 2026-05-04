from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..rarity import card_frequencies


def plot_rarity_curve(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    freq = card_frequencies(packs)

    fig, ax = plt.subplots(figsize=cfg.figsize)
    ax.plot(freq["rank"], freq["count"], marker="o", linewidth=2)
    ax.set_title("Rarity Curve of Cards (ranked by frequency)")
    ax.set_xlabel("Card rank (most common → rarest)")
    ax.set_ylabel("Frequency (packs seen)")
    ax.set_yscale("log" if (freq["count"] > 0).any() and freq["count"].max() / max(1, freq["count"].min()) > 50 else "linear")
    return fig

