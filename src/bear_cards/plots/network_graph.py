from __future__ import annotations

import matplotlib.pyplot as plt
import pandas as pd

from ..config import PlotConfig
from ..plotting import palette


def plot_flavour_card_network(packs: pd.DataFrame, cfg: PlotConfig) -> plt.Figure:
    df = packs.dropna(subset=["flavour", "card_number"]).copy()
    df["flavour"] = df["flavour"].astype(str)
    df["card_number"] = df["card_number"].astype(int)

    flavours = sorted(df["flavour"].unique())
    cards = sorted(df["card_number"].unique())

    # Simple bipartite layout (no extra dependencies):
    # flavours on the left (x=0), cards on the right (x=1).
    fy = {f: i for i, f in enumerate(flavours)}
    cy = {c: i for i, c in enumerate(cards)}
    f_colors = palette(flavours)

    fig, ax = plt.subplots(figsize=(max(cfg.figsize[0], 12), max(cfg.figsize[1], 6)))
    ax.set_title("Flavour → Card Network Graph")
    ax.axis("off")

    # Edges
    edges = df.groupby(["flavour", "card_number"]).size().reset_index(name="count")
    max_w = edges["count"].max() if len(edges) else 1
    for _, r in edges.iterrows():
        f, c, w = r["flavour"], int(r["card_number"]), int(r["count"])
        ax.plot(
            [0.0, 1.0],
            [fy[f], cy[c]],
            color=f_colors.get(f, "#999999"),
            alpha=0.15 + 0.55 * (w / max_w),
            linewidth=0.8 + 2.2 * (w / max_w),
        )

    # Nodes + labels
    ax.scatter([0.0] * len(flavours), [fy[f] for f in flavours], s=150, color=[f_colors[f] for f in flavours])
    ax.scatter([1.0] * len(cards), [cy[c] for c in cards], s=110, color="#333333")

    for f in flavours:
        ax.text(-0.03, fy[f], f, ha="right", va="center")
    for c in cards:
        ax.text(1.03, cy[c], str(c), ha="left", va="center")

    ax.set_xlim(-0.2, 1.2)
    ax.set_ylim(-1, max(len(flavours), len(cards)) + 1)
    return fig

