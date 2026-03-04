import { transferencias } from "../schemas/transferencias.schema";
import { transferenciasFilterMap } from "../filters/transferencias.filter";
import { db } from "../db";
import { ServiceBuilder } from "bradb";

const builder = new ServiceBuilder(db, transferencias, transferenciasFilterMap);

export const transferenciasService = {
    findAll: builder.findAll(
        db
            .select({
                id: transferencias.id,
                cuentaOrigenId: transferencias.cuentaOrigenId,
                cuentaDestinoId: transferencias.cuentaDestinoId,
                monto: transferencias.monto,
                estado: transferencias.estado,
                createdAt: transferencias.createdAt
            })
            .from(transferencias)
            .$dynamic()
    ),
    findOne: builder.findOne(
        db
            .select({
                id: transferencias.id,
                cuentaOrigenId: transferencias.cuentaOrigenId,
                cuentaDestinoId: transferencias.cuentaDestinoId,
                monto: transferencias.monto,
                estado: transferencias.estado,
                createdAt: transferencias.createdAt
            })
            .from(transferencias)
            .$dynamic()
    ),
    count: builder.count()
};

