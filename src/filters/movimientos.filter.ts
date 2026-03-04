import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { movimientosTable } from "../schemas/movimientos.schema"
import { movimientosValidator } from "../validators/movimientos.validator";

export const movimientosFilterMap: FilterMap<typeof movimientosValidator.filter> = {
    id: (val) => eq(movimientosTable.id, val),
	cuentaId: (val) => eq(movimientosTable.cuentaId, val),
	tipoOperacion: (val) => eq(movimientosTable.tipoOperacion, val),
	referenciaId: (val) => eq(movimientosTable.referenciaId, val),
	sentido: (val) => eq(movimientosTable.sentido, val),
	monto: (val) => eq(movimientosTable.monto, val),
	saldoPosterior: (val) => eq(movimientosTable.saldoPosterior, val),
	descripcion: (val) => eq(movimientosTable.descripcion, val),
	createdAt: (val) => eq(movimientosTable.createdAt, val),
	updatedAt: (val) => eq(movimientosTable.updatedAt, val),
	deletedAt: (val) => eq(movimientosTable.deletedAt, val)
}