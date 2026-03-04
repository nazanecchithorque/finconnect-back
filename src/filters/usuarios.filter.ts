import { FilterMap } from "bradb";
import { eq } from "drizzle-orm";
import { usuariosTable } from "../schemas/usuarios.schema"
import { usuariosValidator } from "../validators/usuarios.validator";

export const usuariosFilterMap: FilterMap<typeof usuariosValidator.filter> = {
    id: (val) => eq(usuariosTable.id, val),
	nombre: (val) => eq(usuariosTable.nombre, val),
	apellido: (val) => eq(usuariosTable.apellido, val),
	email: (val) => eq(usuariosTable.email, val),
	dni: (val) => eq(usuariosTable.dni, val),
	genero: (val) => eq(usuariosTable.genero, val),
	passwordHash: (val) => eq(usuariosTable.passwordHash, val),
	activo: (val) => eq(usuariosTable.activo, val),
	createdAt: (val) => eq(usuariosTable.createdAt, val),
	deletedAt: (val) => eq(usuariosTable.deletedAt, val)
}