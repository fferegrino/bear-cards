from __future__ import annotations

from pathlib import Path

import pandas as pd

from .config import PlotConfig
from .decode import decode_production_code


def load_packs(cfg: PlotConfig) -> pd.DataFrame:
    path = Path(cfg.data_dir) / cfg.packs_csv
    df = pd.read_csv(path)

    # Preserve discovery order for "treasure map" / collector curve
    df["pack_index"] = range(1, len(df) + 1)

    for c in ("acquisition_date", "best_before_date"):
        if c in df.columns:
            df[c] = pd.to_datetime(df[c], errors="coerce").dt.date

    # Decode production_code -> production_date / batch / line fields
    decoded = df["production_code"].apply(decode_production_code)
    df["production_date"] = decoded.apply(lambda x: x.production_date)
    df["production_year"] = decoded.apply(lambda x: x.year)
    df["production_doy"] = decoded.apply(lambda x: x.day_of_year)
    df["batch_prefix"] = decoded.apply(lambda x: x.batch_prefix)
    df["line_cycle"] = decoded.apply(lambda x: x.line_cycle)
    df["line_letter"] = decoded.apply(lambda x: x.line_letter)

    # Normalize card_number
    df["card_number"] = pd.to_numeric(df["card_number"], errors="coerce").astype("Int64")

    return df


def load_cards(cfg: PlotConfig) -> pd.DataFrame:
    path = Path(cfg.data_dir) / cfg.cards_csv
    if not path.exists():
        return pd.DataFrame(columns=["card_number", "name", "code"])
    df = pd.read_csv(path)
    df["card_number"] = pd.to_numeric(df["card_number"], errors="coerce").astype("Int64")
    return df

