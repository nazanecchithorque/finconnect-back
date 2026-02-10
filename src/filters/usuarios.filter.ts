import { FilterMap } from "bradb";
import { ilike, eq } from "drizzle-orm";
import { usuarios } from "../schemas/usuarios.schema";
import { usuariosFilterSchema } from "../validators/usuarios.validator";

/*
    Campos que filtra el usuario: nombre, apellido, email, activo.

    Los filtros hacen una búsqueda por coincidencia parcial (ilike) en nombre, apellido y email.
    El filtro 'activo' buscará exactamente igual al número proporcionado.
    No se filtra por password ni por datos internos como fechaRegistro o deletedAt.
*/

export const usuariosFilterMap: FilterMap<typeof usuariosFilterSchema> = {
    email: (value) => ilike(usuarios.email, `%${value}%`),
    nombre: (value) => ilike(usuarios.nombre, `%${value}%`),
    apellido: (value) => ilike(usuarios.nombre, `%${value}%`),
    activo: (value) => eq(usuarios.activo, value)
};
