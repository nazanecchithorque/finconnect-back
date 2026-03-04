import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { transferencias } from "../schemas/transferencias.schema";
import { transferenciasFilterSchema } from "../validators/transferencias.validator";

export const transferenciasFilterMap: FilterMap<
    typeof transferenciasFilterSchema
> = {
    cuentaOrigenId: (value) => eq(transferencias.cuentaOrigenId, value),
    cuentaDestinoId: (value) => eq(transferencias.cuentaDestinoId, value),
    estado: (value) => eq(transferencias.estado, value)
};

