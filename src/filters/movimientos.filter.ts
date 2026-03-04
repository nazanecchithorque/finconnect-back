import { FilterMap } from "bradb";
import { and, eq } from "drizzle-orm";
import { movimientos } from "../schemas/movimientos.schema";
import { movimientosFilterSchema } from "../validators/movimientos.validator";

export const movimientosFilterMap: FilterMap<typeof movimientosFilterSchema> = {
    cuentaId: (value) => eq(movimientos.cuentaId, value),
    tipoOperacion: (value) => eq(movimientos.tipoOperacion, value),
    sentido: (value) => eq(movimientos.sentido, value)
};

