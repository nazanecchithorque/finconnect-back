import { cuentas } from "../schemas/cuentas.schema";
import { cuentasFilterMap } from "../filters/cuentas.filter";
import { db } from "../db";
import { ServiceBuilder } from "bradb";

const builder = new ServiceBuilder(db, cuentas, cuentasFilterMap);

export const cuentasService = {
    findAll: builder.findAll(
        db
            .select({
                id: cuentas.id,
                usuarioId: cuentas.usuarioId,
                cvu: cuentas.cvu,
                alias: cuentas.alias,
                moneda: cuentas.moneda,
                saldo: cuentas.saldo,
                activa: cuentas.activa,
                createdAt: cuentas.createdAt
            })
            .from(cuentas)
            .$dynamic()
    ),
    findOne: builder.findOne(
        db
            .select({
                id: cuentas.id,
                usuarioId: cuentas.usuarioId,
                cvu: cuentas.cvu,
                alias: cuentas.alias,
                moneda: cuentas.moneda,
                saldo: cuentas.saldo,
                activa: cuentas.activa,
                createdAt: cuentas.createdAt
            })
            .from(cuentas)
            .$dynamic()
    ),
    count: builder.count(),
    delete: builder.softDelete(),
    update: builder.update()
};
