import { ServiceBuilder } from "bradb";
import { movimientosTable } from "../schemas/movimientos.schema"
import { movimientosFilterMap } from "../filters/movimientos.filter"
import { db } from "../db";
import { cuentasTable } from "@/schemas/cuentas.schema";
import { usuariosTable } from "@/schemas/usuarios.schema";
import { eq, desc } from "drizzle-orm";

const builder = new ServiceBuilder(db, movimientosTable, movimientosFilterMap);

const select = () =>
    db
        .select({
            id: movimientosTable.id,
            cuentaId: movimientosTable.cuentaId,
            tipoOperacion: movimientosTable.tipoOperacion,
            referenciaId: movimientosTable.referenciaId,
            sentido: movimientosTable.sentido,
            monto: movimientosTable.monto,
            saldoPosterior: movimientosTable.saldoPosterior,
            descripcion: movimientosTable.descripcion,
            createdAt: movimientosTable.createdAt,
            usuarioId: cuentasTable.usuarioId,
            usuarioNombre: usuariosTable.nombre,
            usuarioApellido: usuariosTable.apellido,
            usuarioEmail: usuariosTable.email
        })
        .from(movimientosTable)
        .leftJoin(
            cuentasTable,
            eq(movimientosTable.cuentaId, cuentasTable.id)
        )
        .leftJoin(
            usuariosTable,
            eq(cuentasTable.usuarioId, usuariosTable.id)
        )
        .orderBy(desc(movimientosTable.createdAt))
        .$dynamic();

export const movimientosService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(select),
    findOne: builder.findOne()
};