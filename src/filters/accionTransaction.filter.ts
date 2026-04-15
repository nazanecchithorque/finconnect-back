import { FilterMap } from "bradb";
import { eq, inArray, sql } from "drizzle-orm";
import { accionTransactionTable } from "../schemas/accionTransaction.schema";
import { accionTransactionValidator } from "../validators/accionTransaction.validator";

export const accionTransactionFilterMap: FilterMap<
    typeof accionTransactionValidator.filter
> = {
    id: (val) => eq(accionTransactionTable.id, val),
    cuentaId: (val) => eq(accionTransactionTable.cuentaId, val),
    cuentaIds: (val) =>
        val.length === 0 ? sql`false` : inArray(accionTransactionTable.cuentaId, val),
    tipoAccion: (val) => eq(accionTransactionTable.tipoAccion, val),
    sentido: (val) => eq(accionTransactionTable.sentido, val),
    cantidad: (val) => eq(accionTransactionTable.cantidad, val),
    precioUnitario: (val) => eq(accionTransactionTable.precioUnitario, val),
    monto: (val) => eq(accionTransactionTable.monto, val),
    createdAt: (val) => eq(accionTransactionTable.createdAt, val),
    updatedAt: (val) => eq(accionTransactionTable.updatedAt, val),
    deletedAt: (val) => eq(accionTransactionTable.deletedAt, val)
};
