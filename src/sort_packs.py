from __future__ import annotations

import csv
import datetime as dt
from pathlib import Path

from bear_cards.decode import decode_production_code

PATH = Path("data/packs.csv")


def sort_key(row: dict[str, str]) -> tuple:
    return (
        dt.date.fromisoformat(row["acquisition_date"]),
        decode_production_code(row["production_code"]).production_date,
        row["flavour"],
        int(row["card_number"]),
    )


def main() -> None:
    with PATH.open(newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    rows.sort(key=sort_key)

    with PATH.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()
