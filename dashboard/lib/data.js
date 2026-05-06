import { d3 } from "./deps.js";
import { decodeProductionCode } from "./decode.js";

export function loadPacks(path) {
  return d3.csv(path, (row, i) => {
    const cardNumber = row.card_number === "" || row.card_number == null ? null : +row.card_number;
    const decoded = decodeProductionCode(row.production_code);
    return {
      packIndex: i + 1,
      flavour: row.flavour,
      acquisitionDate: row.acquisition_date ? new Date(row.acquisition_date) : null,
      bestBeforeDate: row.best_before_date ? new Date(row.best_before_date) : null,
      productionCode: row.production_code,
      productionTime: row.production_time,
      cardNumber,
      productionDate: decoded.productionDate,
      productionYear: decoded.year,
      productionDoy: decoded.doy,
      batchPrefix: decoded.batchPrefix,
      lineCycle: decoded.lineCycle,
      lineLetter: decoded.lineLetter,
    };
  });
}
