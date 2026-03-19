import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { pagosServiciosTable } from "../schemas/pagos_servicios.schema";
import { pagosServiciosValidator } from "../validators/pagos_servicios.validator";

export const pagosServiciosFilterMap: FilterMap<
    typeof pagosServiciosValidator.filter
> = {
    id: (val) => eq(pagosServiciosTable.id, val),
    facturaId: (val) => eq(pagosServiciosTable.facturaId, val),
    cuentaId: (val) => eq(pagosServiciosTable.cuentaId, val),
    monto: (val) => eq(pagosServiciosTable.monto, val),
    createdAt: (val) => eq(pagosServiciosTable.createdAt, val)
};
