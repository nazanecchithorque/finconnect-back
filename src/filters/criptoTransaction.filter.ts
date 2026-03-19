import { FilterMap } from "bradb";
import { eq, inArray, sql } from "drizzle-orm";
import { criptoTransactionTable } from "../schemas/criptoTransaction.schema"
import {
	criptoTransactionValidator
	} from "../validators/criptoTransaction.validator";

export const criptoTransactionFilterMap: FilterMap<typeof criptoTransactionValidator.filter> = {
    id: (val) => eq(criptoTransactionTable.id, val),
	cuentaId: (val) => eq(criptoTransactionTable.cuentaId, val),
	cuentaIds: (val) => (val.length === 0 ? sql`false` : inArray(criptoTransactionTable.cuentaId, val)),
	tipoCriptomoneda: (val) => eq(criptoTransactionTable.tipoCriptomoneda, val),
	sentido: (val) => eq(criptoTransactionTable.sentido, val),
	cantidad: (val) => eq(criptoTransactionTable.cantidad, val),
	precioUnitario: (val) => eq(criptoTransactionTable.precioUnitario, val),
	monto: (val) => eq(criptoTransactionTable.monto, val),
	createdAt: (val) => eq(criptoTransactionTable.createdAt, val),
	updatedAt: (val) => eq(criptoTransactionTable.updatedAt, val),
	deletedAt: (val) => eq(criptoTransactionTable.deletedAt, val)
}