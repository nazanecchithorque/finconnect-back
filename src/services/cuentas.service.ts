import { ServiceBuilder } from "bradb";
import { cuentasTable } from "../schemas/cuentas.schema"
import { cuentasFilterMap } from "../filters/cuentas.filter"
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usuariosTable } from "@/schemas";

const builder = new ServiceBuilder(db, cuentasTable, cuentasFilterMap);

const select = () => 
    db.select({
        id: cuentasTable.id,
        alias: cuentasTable.alias,
        cvu: cuentasTable.cvu,
        moneda: cuentasTable.moneda,
        saldo: cuentasTable.saldo,
        activo: cuentasTable.activo,
        usuarioId: cuentasTable.usuarioId,
        usuarioNombre: usuariosTable.nombre,
        usuarioApellido: usuariosTable.apellido,
        usuarioEmail: usuariosTable.email,
        usuarioDni: usuariosTable.dni,
        usuarioGenero: usuariosTable.genero,
    })
.from(cuentasTable)
.leftJoin(usuariosTable, eq(cuentasTable.usuarioId, usuariosTable.id))
.$dynamic();
export const cuentasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findAllExtraData: builder.findAll(select),
    findOne: builder.findOne()
};