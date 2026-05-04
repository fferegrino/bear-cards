from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class PlotConfig:
    data_dir: Path = Path("data")
    packs_csv: str = "packs.csv"
    cards_csv: str = "cards.csv"

    out_dir: Path = Path("plots")
    dpi: int = 180

    style: str = "default"
    figsize: tuple[float, float] = (11.0, 6.0)

    rarity_quantiles: tuple[float, float] = (0.2, 0.6)  # common <= q20, uncommon <= q60, else rare

