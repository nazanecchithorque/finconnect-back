import { ServiceBuilder } from "bradb";
import { transferenciasTable } from "../schemas/transferencias.schema"
import { transferenciasFilterMap } from "../filters/transferencias.filter"
import { db } from "../db";
import { cuentasTable } from "@/schemas/cuentas.schema";
import { eq, desc } from "drizzle-orm";

const builder = new ServiceBuilder(db, transferenciasTable, transferenciasFilterMap);

const select = () =>
    db
        .select({
            id: transferenciasTable.id,
            cuentaOrigenId: transferenciasTable.cuentaOrigenId,
            cuentaDestinoId: transferenciasTable.cuentaDestinoId,
            monto: transferenciasTable.monto,
            estado: transferenciasTable.estado,
            createdAt: transferenciasTable.createdAt,
            updatedAt: transferenciasTable.updatedAt,
            deletedAt: transferenciasTable.deletedAt,
            /** Moneda del monto (misma en origen y destino por reglas de negocio). */
            moneda: cuentasTable.moneda,
        })
        .from(transferenciasTable)
        .leftJoin(
            cuentasTable,
            eq(transferenciasTable.cuentaOrigenId, cuentasTable.id)
        )
        .orderBy(desc(transferenciasTable.createdAt))
        .$dynamic();

export const transferenciasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(select),
    findOne: builder.findOne()
};