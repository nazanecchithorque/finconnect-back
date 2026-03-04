import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { transferenciasTable } from "../schemas/transferencias.schema"
import { transferenciasValidator } from "../validators/transferencias.validator";

export const transferenciasFilterMap: FilterMap<typeof transferenciasValidator.filter> = {
    id: (val) => eq(transferenciasTable.id, val),
	cuentaOrigenId: (val) => eq(transferenciasTable.cuentaOrigenId, val),
	cuentaDestinoId: (val) => eq(transferenciasTable.cuentaDestinoId, val),
	monto: (val) => eq(transferenciasTable.monto, val),
	estado: (val) => eq(transferenciasTable.estado, val),
	createdAt: (val) => eq(transferenciasTable.createdAt, val),
	updatedAt: (val) => eq(transferenciasTable.updatedAt, val),
	deletedAt: (val) => eq(transferenciasTable.deletedAt, val)
}