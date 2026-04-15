import { Request, Response } from "express";
import { Forbidden, newPagination } from "bradb";
import { accionTransactionService } from "../services/accionTransaction.service";
import { accionTransactionValidator } from "../validators/accionTransaction.validator";
import {
    accionTickerMap,
    getAccionPreciosPorTipo
} from "@/lib/acciones";
import { cuentasService } from "@/services/cuentas.service";
import { BadRequestError, NotFoundError } from "@/errors/http.error";
import { accionesService } from "@/services/acciones.service";
import { db } from "@/db";
import { movimientosService } from "@/services/movimientos.service";
import { sentidoMovimiento, tipoOperacion } from "@/schemas/movimientos.schema";
import { userRoles } from "@/schemas/usuarios.schema";
import { cuentasTable } from "@/schemas/cuentas.schema";
import { eq } from "drizzle-orm";
import type { TipoAccionType } from "@/schemas/acciones.schema";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = accionTransactionValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        const cuentas = await db
            .select({ id: cuentasTable.id })
            .from(cuentasTable)
            .where(eq(cuentasTable.usuarioId, res.locals.user.id));
        (baseFilters as Record<string, unknown>).cuentaIds = cuentas.map(
            (c) => c.id
        );
    }
    const items = await accionTransactionService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total
    });
}

async function getOne(req: Request, res: Response) {
    const pk = accionTransactionValidator.pk.parse(req.params);
    const item = await accionTransactionService.findOne(pk);
    res.json(item);
}

async function create(req: Request, res: Response) {
    const data = accionTransactionValidator.insert.parse(req.body);
    const cuenta = await cuentasService.findOne({ id: data.cuentaId });
    if (!cuenta) {
        throw new NotFoundError("Cuenta no encontrada");
    }
    if (cuenta.usuarioId !== parseInt(res.locals.user.id, 10)) {
        throw new Forbidden(
            "No tienes permiso para crear una transacción en esta cuenta"
        );
    }
    const precios = await getAccionPreciosPorTipo(cuenta.moneda);
    const ticker = accionTickerMap[data.tipoAccion as TipoAccionType];
    if (!ticker) {
        throw new NotFoundError("Acción no encontrada");
    }
    const precio = precios.find((p) => p.symbol === ticker);
    if (!precio) {
        throw new NotFoundError("Precio de acción no encontrado");
    }
    const cajas = await accionesService.findAll({
        usuarioId: res.locals.user.id,
        tipoAccion: data.tipoAccion
    });
    if (cajas.length === 0) {
        throw new NotFoundError("Caja no encontrada");
    }
    const caja = cajas[0];

    if (data.sentido === "ingreso") {
        await db.transaction(async (tx) => {
            if (parseFloat(caja.monto) < parseFloat(data.cantidad)) {
                throw new BadRequestError("Saldo insuficiente en la caja");
            }
            const accionTransaction = await accionTransactionService.create(
                {
                    ...data,
                    precioUnitario: precio.price.toString(),
                    monto: (
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
            await accionesService.update(
                {
                    usuarioId: res.locals.user.id,
                    tipoAccion: data.tipoAccion
                },
                {
                    monto: (
                        parseFloat(caja.monto) - parseFloat(data.cantidad)
                    ).toString()
                },
                tx
            );
            await cuentasService.update(
                { id: cuenta.id },
                {
                    saldo: (
                        parseFloat(cuenta.saldo) +
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
            await movimientosService.create(
                {
                    cuentaId: cuenta.id,
                    tipoOperacion: tipoOperacion.accion,
                    sentido: sentidoMovimiento.ingreso,
                    referenciaId: accionTransaction.id,
                    monto: accionTransaction.monto,
                    descripcion: `Venta de ${data.tipoAccion}`,
                    saldoPosterior: (
                        parseFloat(cuenta.saldo) +
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
        });
    } else {
        await db.transaction(async (tx) => {
            if (
                parseFloat(cuenta.saldo) <
                parseFloat(data.cantidad) * precio.price
            ) {
                throw new BadRequestError("Saldo insuficiente en la cuenta");
            }
            const accionTransaction = await accionTransactionService.create(
                {
                    ...data,
                    precioUnitario: precio.price.toString(),
                    monto: (
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
            await accionesService.update(
                {
                    usuarioId: res.locals.user.id,
                    tipoAccion: data.tipoAccion
                },
                {
                    monto: (
                        parseFloat(caja.monto) + parseFloat(data.cantidad)
                    ).toString()
                },
                tx
            );
            await cuentasService.update(
                { id: cuenta.id },
                {
                    saldo: (
                        parseFloat(cuenta.saldo) -
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
            await movimientosService.create(
                {
                    cuentaId: cuenta.id,
                    tipoOperacion: tipoOperacion.accion,
                    sentido: sentidoMovimiento.egreso,
                    referenciaId: accionTransaction.id,
                    monto: accionTransaction.monto,
                    descripcion: `Compra de ${data.tipoAccion}`,
                    saldoPosterior: (
                        parseFloat(cuenta.saldo) -
                        parseFloat(data.cantidad) * precio.price
                    ).toString()
                },
                tx
            );
        });
    }
    res.status(204).send();
}

async function update(req: Request, res: Response) {
    const pk = accionTransactionValidator.pk.parse(req.params);
    const data = accionTransactionValidator.update.parse(req.body);
    const item = await accionTransactionService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = accionTransactionValidator.pk.parse(req.params);
    await accionTransactionService.delete(pk);
    res.status(204).send();
}

export const accionTransactionController = {
    getAll,
    getOne,
    create,
    update,
    remove
};
