from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path

PATH = Path("data/packs.csv")
DATE_COLUMNS = ("acquisition_date", "best_before_date")


def normalize(value: str) -> str:
    if "/" not in value:
        return value
    return datetime.strptime(value, "%d/%m/%Y").strftime("%Y-%m-%d")


def main() -> None:
    with PATH.open(newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    for row in rows:
        for col in DATE_COLUMNS:
            row[col] = normalize(row[col])

    with PATH.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()
