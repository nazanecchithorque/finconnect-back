import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { criptomonedasTable } from "../schemas/criptomonedas.schema"
import { criptomonedasValidator } from "../validators/criptomonedas.validator";

export const criptomonedasFilterMap: FilterMap<typeof criptomonedasValidator.filter> = {
    usuarioId: (val) => eq(criptomonedasTable.usuarioId, val),
	tipoCriptomoneda: (val) => eq(criptomonedasTable.tipoCriptomoneda, val),
	monto: (val) => eq(criptomonedasTable.monto, val),
	createdAt: (val) => eq(criptomonedasTable.createdAt, val),
	updatedAt: (val) => eq(criptomonedasTable.updatedAt, val),
	deletedAt: (val) => eq(criptomonedasTable.deletedAt, val)
}