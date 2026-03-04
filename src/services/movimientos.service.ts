import { movimientos } from "../schemas/movimientos.schema";
import { movimientosFilterMap } from "../filters/movimientos.filter";
import { db } from "../db";
import { ServiceBuilder } from "bradb";

const builder = new ServiceBuilder(db, movimientos, movimientosFilterMap);

export const movimientosService = {
    findAll: builder.findAll(
        db
            .select({
                id: movimientos.id,
                cuentaId: movimientos.cuentaId,
                tipoOperacion: movimientos.tipoOperacion,
                referenciaId: movimientos.referenciaId,
                sentido: movimientos.sentido,
                monto: movimientos.monto,
                saldoPosterior: movimientos.saldoPosterior,
                descripcion: movimientos.descripcion,
                createdAt: movimientos.createdAt
            })
            .from(movimientos)
            .$dynamic()
    ),
    findOne: builder.findOne(
        db
            .select({
                id: movimientos.id,
                cuentaId: movimientos.cuentaId,
                tipoOperacion: movimientos.tipoOperacion,
                referenciaId: movimientos.referenciaId,
                sentido: movimientos.sentido,
                monto: movimientos.monto,
                saldoPosterior: movimientos.saldoPosterior,
                descripcion: movimientos.descripcion,
                createdAt: movimientos.createdAt
            })
            .from(movimientos)
            .$dynamic()
    ),
    count: builder.count()
};

