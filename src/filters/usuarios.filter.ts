import { FilterMap } from "bradb";
import { ilike, eq } from "drizzle-orm";
import { usuarios } from "../schemas/usuarios.schema";
import { usuariosFilterSchema } from "../validators/usuarios.validator";

export const usuariosFilterMap: FilterMap<typeof usuariosFilterSchema> = {
    email: (value) => ilike(usuarios.email, `%${value}%`),
    nombre: (value) => ilike(usuarios.nombre, `%${value}%`),
    apellido: (value) => ilike(usuarios.nombre, `%${value}%`),
    activo: (value) => eq(usuarios.activo, value)
};
