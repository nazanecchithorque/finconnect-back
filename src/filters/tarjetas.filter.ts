import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { tarjetasTable } from "../schemas/tarjetas.schema";
import { tarjetasValidator } from "../validators/tarjetas.validator";

export const tarjetasFilterMap: FilterMap<typeof tarjetasValidator.filter> = {
    id: (val) => eq(tarjetasTable.id, val),
    cuentaId: (val) => eq(tarjetasTable.cuentaId, val),
    marca: (val) => eq(tarjetasTable.marca, val),
    estado: (val) => eq(tarjetasTable.estado, val),
    activo: (val) => eq(tarjetasTable.activo, val),
    createdAt: (val) => eq(tarjetasTable.createdAt, val),
    updatedAt: (val) => eq(tarjetasTable.updatedAt, val),
    deletedAt: (val) => eq(tarjetasTable.deletedAt, val)
};

