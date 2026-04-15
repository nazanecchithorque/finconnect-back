import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { accionesTable } from "../schemas/acciones.schema";
import { accionesValidator } from "../validators/acciones.validator";

export const accionesFilterMap: FilterMap<typeof accionesValidator.filter> = {
    usuarioId: (val) => eq(accionesTable.usuarioId, val),
    tipoAccion: (val) => eq(accionesTable.tipoAccion, val),
    monto: (val) => eq(accionesTable.monto, val),
    createdAt: (val) => eq(accionesTable.createdAt, val),
    updatedAt: (val) => eq(accionesTable.updatedAt, val),
    deletedAt: (val) => eq(accionesTable.deletedAt, val)
};
