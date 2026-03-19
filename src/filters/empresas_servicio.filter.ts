import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { empresasServicioTable } from "../schemas/empresas_servicio.schema";
import { empresasServicioValidator } from "../validators/empresas_servicio.validator";

export const empresasServicioFilterMap: FilterMap<
    typeof empresasServicioValidator.filter
> = {
    id: (val) => eq(empresasServicioTable.id, val),
    nombre: (val) => eq(empresasServicioTable.nombre, val),
    categoria: (val) => eq(empresasServicioTable.categoria, val),
    createdAt: (val) => eq(empresasServicioTable.createdAt, val),
    updatedAt: (val) => eq(empresasServicioTable.updatedAt, val),
    deletedAt: (val) => eq(empresasServicioTable.deletedAt, val)
};
