from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig


def plot_duplicate_tracker(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["pack_index", "card_number"]).copy()
    df["card_number"] = df["card_number"].astype(int)
    df = df.sort_values("pack_index")

    seen: set[int] = set()
    unique_counts: list[int] = []
    x: list[int] = []
    for _, r in df.iterrows():
        x.append(int(r["pack_index"]))
        seen.add(int(r["card_number"]))
        unique_counts.append(len(seen))

    fig, ax = plt.subplots(figsize=cfg.figsize)
    ax.plot(x, unique_counts, linewidth=2.5)
    ax.set_title("Duplicate Tracker (unique cards collected over packs)")
    ax.set_xlabel("Packs opened")
    ax.set_ylabel("Total unique cards collected")
    return fig

