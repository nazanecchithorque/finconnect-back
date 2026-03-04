import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { cuentas } from "../schemas/cuentas.schema";
import { movimientos, sentidoMovimiento, tipoOperacion } from "../schemas/movimientos.schema";
import { transferencias } from "../schemas/transferencias.schema";
import { transferenciasService } from "../services/transferencias.service";
import {
    transferenciasFilterSchema,
    transferenciasSchema
} from "../validators/transferencias.validator";
import { findAllBuilder, findOneBuilder } from "bradb";
import { BadRequestError, NotFoundError } from "../errors/http.error";
import { eq } from "drizzle-orm";

export const transferenciasController = {
    getAll: findAllBuilder(transferenciasService, transferenciasFilterSchema),
    getById: findOneBuilder(transferenciasService),

    // POST /transferencias
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = transferenciasSchema.parse(req.body);

            const result = await db.transaction(async (tx) => {
                const [origen] = await tx
                    .select()
                    .from(cuentas)
                    .where(eq(cuentas.id, data.cuentaOrigenId));

                if (!origen) {
                    throw new NotFoundError("Cuenta de origen no encontrada");
                }

                const [destino] = await tx
                    .select()
                    .from(cuentas)
                    .where(eq(cuentas.id, data.cuentaDestinoId));

                if (!destino) {
                    throw new NotFoundError("Cuenta de destino no encontrada");
                }

                if (!origen.activo || !destino.activo) {
                    throw new BadRequestError("Ambas cuentas deben estar activas");
                }

                if (origen.moneda !== destino.moneda) {
                    throw new BadRequestError(
                        "Las cuentas deben tener la misma moneda"
                    );
                }

                const saldoOrigen = Number(origen.saldo);
                if (saldoOrigen < data.monto) {
                    throw new BadRequestError(
                        "Saldo insuficiente en la cuenta de origen"
                    );
                }

                const [transferencia] = await tx
                    .insert(transferencias)
                    .values({
                        cuentaOrigenId: data.cuentaOrigenId,
                        cuentaDestinoId: data.cuentaDestinoId,
                        monto: data.monto.toString(),
                        estado: "completada"
                    })
                    .returning();

                const nuevoSaldoOrigen = saldoOrigen - data.monto;
                const nuevoSaldoDestino = Number(destino.saldo) + data.monto;

                await tx.insert(movimientos).values({
                    cuentaId: data.cuentaOrigenId,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.egreso,
                    monto: data.monto.toString(),
                    saldoPosterior: nuevoSaldoOrigen.toString()
                });

                await tx.insert(movimientos).values({
                    cuentaId: data.cuentaDestinoId,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.ingreso,
                    monto: data.monto.toString(),
                    saldoPosterior: nuevoSaldoDestino.toString()
                });

                await tx
                    .update(cuentas)
                    .set({ saldo: nuevoSaldoOrigen.toString() })
                    .where(eq(cuentas.id, data.cuentaOrigenId));

                await tx
                    .update(cuentas)
                    .set({ saldo: nuevoSaldoDestino.toString() })
                    .where(eq(cuentas.id, data.cuentaDestinoId));

                return transferencia;
            });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
};

