from __future__ import annotations

import datetime as dt
import re
from dataclasses import dataclass


_PROD_RE = re.compile(
    r"^(?P<yy>\d{2})(?P<doy>\d{3})\s+(?P<cycle>\d{2})(?P<line>[A-Za-z])$"
)


@dataclass(frozen=True)
class ProductionCode:
    raw: str
    year: int
    day_of_year: int
    production_date: dt.date
    line_cycle: int
    line_letter: str
    batch_prefix: str  # e.g. "26082"


def decode_production_code(code: str, *, base_century: int = 2000) -> ProductionCode:
    """
    Decode codes like "26082 15D":
    - 26 = year (-> 2026)
    - 082 = day-of-year (-> 2026-03-23)
    - 15 = line/batch cycle
    - D  = line/shift identifier
    """
    code = (code or "").strip()
    m = _PROD_RE.match(code)
    if not m:
        raise ValueError(f"Unrecognized production_code format: {code!r}")

    yy = int(m.group("yy"))
    doy = int(m.group("doy"))
    year = base_century + yy
    production_date = (dt.date(year, 1, 1) + dt.timedelta(days=doy - 1))
    line_cycle = int(m.group("cycle"))
    line_letter = m.group("line").upper()
    batch_prefix = f"{yy:02d}{doy:03d}"

    return ProductionCode(
        raw=code,
        year=year,
        day_of_year=doy,
        production_date=production_date,
        line_cycle=line_cycle,
        line_letter=line_letter,
        batch_prefix=batch_prefix,
    )

