import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { currencyConversionTable } from "../schemas/currencyConversion.schema";
import { currencyConversionValidator } from "../validators/currencyConversion.validator";

export const currencyConversionFilterMap: FilterMap<
    typeof currencyConversionValidator.filter
> = {
    id: (val) => eq(currencyConversionTable.id, val),
    cuentaOrigenId: (val) => eq(currencyConversionTable.cuentaOrigenId, val),
    cuentaDestinoId: (val) => eq(currencyConversionTable.cuentaDestinoId, val),
    montoOrigen: (val) => eq(currencyConversionTable.montoOrigen, val),
    montoDestino: (val) => eq(currencyConversionTable.montoDestino, val),
    tasaCambio: (val) => eq(currencyConversionTable.tasaCambio, val),
    createdAt: (val) => eq(currencyConversionTable.createdAt, val),
};
