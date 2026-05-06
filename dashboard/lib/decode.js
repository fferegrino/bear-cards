const PROD_RE = /^(\d{2})(\d{3})\s+(\d{2})([A-Za-z])$/;

export function decodeProductionCode(code, baseCentury = 2000) {
  const m = PROD_RE.exec((code || "").trim());
  if (!m) throw new Error(`Unrecognized production_code format: ${code}`);
  const yy = +m[1], doy = +m[2], cycle = +m[3], letter = m[4].toUpperCase();
  const year = baseCentury + yy;
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(date.getUTCDate() + doy - 1);
  return {
    year,
    doy,
    productionDate: date,
    batchPrefix: `${String(yy).padStart(2, "0")}${String(doy).padStart(3, "0")}`,
    lineCycle: cycle,
    lineLetter: letter,
  };
}
