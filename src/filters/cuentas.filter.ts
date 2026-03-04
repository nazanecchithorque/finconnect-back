import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { cuentasTable } from "../schemas/cuentas.schema"
import { cuentasValidator } from "../validators/cuentas.validator";

export const cuentasFilterMap: FilterMap<typeof cuentasValidator.filter> = {
    id: (val) => eq(cuentasTable.id, val),
	usuarioId: (val) => eq(cuentasTable.usuarioId, val),
	cvu: (val) => eq(cuentasTable.cvu, val),
	alias: (val) => eq(cuentasTable.alias, val),
	moneda: (val) => eq(cuentasTable.moneda, val),
	saldo: (val) => eq(cuentasTable.saldo, val),
	activo: (val) => eq(cuentasTable.activo, val),
	deletedAt: (val) => eq(cuentasTable.deletedAt, val),
	createdAt: (val) => eq(cuentasTable.createdAt, val)
}