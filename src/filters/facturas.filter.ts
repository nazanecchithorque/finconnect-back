import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { facturasTable } from "../schemas/facturas.schema";
import { facturasValidator } from "../validators/facturas.validator";

export const facturasFilterMap: FilterMap<typeof facturasValidator.filter> = {
    id: (val) => eq(facturasTable.id, val),
    usuarioId: (val) => eq(facturasTable.usuarioId, val),
    empresaId: (val) => eq(facturasTable.empresaId, val),
    monto: (val) => eq(facturasTable.monto, val),
    vencimiento: (val) => eq(facturasTable.vencimiento, val),
    estado: (val) => eq(facturasTable.estado, val),
    createdAt: (val) => eq(facturasTable.createdAt, val),
    updatedAt: (val) => eq(facturasTable.updatedAt, val),
    deletedAt: (val) => eq(facturasTable.deletedAt, val)
};
