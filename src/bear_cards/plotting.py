from __future__ import annotations

from pathlib import Path
from typing import Iterable

import matplotlib as mpl
import matplotlib.pyplot as plt

from .config import FLAVOUR_COLORS, PlotConfig


def setup_matplotlib(cfg: PlotConfig) -> None:
    plt.style.use(cfg.style)
    mpl.rcParams.update(
        {
            "figure.dpi": cfg.dpi,
            "savefig.dpi": cfg.dpi,
            "axes.grid": True,
            "grid.alpha": 0.25,
            "axes.spines.top": False,
            "axes.spines.right": False,
        }
    )


def ensure_out_dir(cfg: PlotConfig) -> Path:
    out = Path(cfg.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    return out


def save_fig(cfg: PlotConfig, fig: plt.Figure, filename: str) -> Path:
    out = ensure_out_dir(cfg) / filename
    fig.tight_layout()
    fig.savefig(out, bbox_inches="tight")
    return out


def palette(values: Iterable[str]) -> dict[str, str]:
    vals = sorted({v for v in values if v is not None})
    cmap = plt.get_cmap("tab10")
    return {
        v: FLAVOUR_COLORS.get(v, mpl.colors.to_hex(cmap(i % 10)))
        for i, v in enumerate(vals)
    }

