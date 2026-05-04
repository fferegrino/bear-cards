from __future__ import annotations

import pandas as pd

from .config import PlotConfig


def card_frequencies(packs: pd.DataFrame) -> pd.DataFrame:
    freq = (
        packs.dropna(subset=["card_number"])
        .groupby("card_number", as_index=False)
        .size()
        .rename(columns={"size": "count"})
        .sort_values(["count", "card_number"], ascending=[False, True])
    )
    freq["rank"] = range(1, len(freq) + 1)
    return freq


def assign_rarity_tiers(packs: pd.DataFrame, cfg: PlotConfig) -> pd.DataFrame:
    """
    Returns a copy of packs with:
    - card_count: frequency of that card in your dataset
    - rarity_tier: common/uncommon/rare by frequency quantiles
    - rarity_score: numeric (common=0, uncommon=1, rare=2) for averaging
    """
    df = packs.copy()
    freq = card_frequencies(df).set_index("card_number")
    df["card_count"] = df["card_number"].map(freq["count"]).astype("Int64")

    # If only a handful of observations exist, keep tiers stable.
    counts = df["card_count"].dropna().astype(int)
    if len(counts) == 0:
        df["rarity_tier"] = "unknown"
        df["rarity_score"] = pd.NA
        return df

    q_common, q_uncommon = cfg.rarity_quantiles
    t_common = counts.quantile(q_common)
    t_uncommon = counts.quantile(q_uncommon)

    def tier(c: object) -> str:
        if pd.isna(c):
            return "unknown"
        c = int(c)
        if c >= t_uncommon:
            return "common"
        if c >= t_common:
            return "uncommon"
        return "rare"

    df["rarity_tier"] = df["card_count"].apply(tier)
    df["rarity_score"] = df["rarity_tier"].map({"common": 0, "uncommon": 1, "rare": 2})
    return df

