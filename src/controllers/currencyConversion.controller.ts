import { Request, Response } from "express";
import { Forbidden } from "bradb";
import { cuentasService } from "@/services/cuentas.service";
import { currencyConversionService } from "@/services/currencyConversion.service";
import { movimientosService } from "@/services/movimientos.service";
import { currencyConversionValidator } from "@/validators/currencyConversion.validator";
import { getExchangeRates } from "@/lib/frankfurter";
import { db } from "@/db";
import { sentidoMovimiento, tipoOperacion } from "@/schemas/movimientos.schema";
import { BadRequestError, NotFoundError } from "@/errors/http.error";

async function create(req: Request, res: Response) {
    const data = currencyConversionValidator.insert.parse(req.body);
    const usuario = res.locals.user;

    const cuentaOrigen = await cuentasService.findOne({ id: data.cuentaOrigenId });
    if (!cuentaOrigen) {
        throw new NotFoundError("Cuenta origen no encontrada");
    }
    if (!cuentaOrigen.activo) {
        throw new Forbidden("Tu cuenta origen no está activa");
    }
    if (Number(cuentaOrigen.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden("No tenés permisos para usar esta cuenta origen");
    }

    const cuentaDestino = await cuentasService.findOne({
        id: data.cuentaDestinoId,
    });
    if (!cuentaDestino) {
        throw new NotFoundError("Cuenta destino no encontrada");
    }
    if (!cuentaDestino.activo) {
        throw new Forbidden("Tu cuenta destino no está activa");
    }
    if (Number(cuentaDestino.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden("No tenés permisos para usar esta cuenta destino");
    }

    if (cuentaOrigen.id === cuentaDestino.id) {
        throw new BadRequestError("Las cuentas origen y destino deben ser distintas");
    }
    if (cuentaOrigen.moneda === cuentaDestino.moneda) {
        throw new BadRequestError(
            "Para transferencias en la misma moneda usá el endpoint de transferencias"
        );
    }

    const montoOrigen = Number(data.montoOrigen);
    if (montoOrigen <= 0) {
        throw new BadRequestError("El monto debe ser positivo");
    }
    if (Number(cuentaOrigen.saldo) < montoOrigen) {
        throw new Forbidden("Saldo insuficiente en la cuenta origen");
    }

    const rates = await getExchangeRates(
        cuentaOrigen.moneda,
        montoOrigen,
        [cuentaDestino.moneda]
    );
    const montoDestino = rates.rates[cuentaDestino.moneda];
    if (montoDestino == null || montoDestino <= 0) {
        throw new BadRequestError(
            "No se pudo obtener la tasa de cambio para estas monedas"
        );
    }

    const tasaCambio = montoDestino / montoOrigen;

    await db.transaction(async (tx) => {
        const conversion = await currencyConversionService.create(
            {
                cuentaOrigenId: cuentaOrigen.id,
                cuentaDestinoId: cuentaDestino.id,
                montoOrigen: montoOrigen.toString(),
                montoDestino: montoDestino.toString(),
                tasaCambio: tasaCambio.toString(),
            },
            tx
        );

        const nuevoSaldoOrigen = Number(cuentaOrigen.saldo) - montoOrigen;
        const nuevoSaldoDestino = Number(cuentaDestino.saldo) + montoDestino;

        await movimientosService.create(
            {
                cuentaId: cuentaOrigen.id,
                tipoOperacion: tipoOperacion.conversion,
                sentido: sentidoMovimiento.egreso,
                referenciaId: conversion.id,
                monto: montoOrigen.toString(),
                saldoPosterior: nuevoSaldoOrigen.toString(),
                descripcion: `Conversión a ${cuentaDestino.moneda} (${cuentaDestino.alias})`,
            },
            tx
        );

        await movimientosService.create(
            {
                cuentaId: cuentaDestino.id,
                tipoOperacion: tipoOperacion.conversion,
                sentido: sentidoMovimiento.ingreso,
                referenciaId: conversion.id,
                monto: montoDestino.toString(),
                saldoPosterior: nuevoSaldoDestino.toString(),
                descripcion: `Conversión desde ${cuentaOrigen.moneda} (${cuentaOrigen.alias})`,
            },
            tx
        );

        await cuentasService.update(
            { id: cuentaOrigen.id },
            { saldo: nuevoSaldoOrigen.toString() },
            tx
        );
        await cuentasService.update(
            { id: cuentaDestino.id },
            { saldo: nuevoSaldoDestino.toString() },
            tx
        );
    });

    res.status(201).json({
        message: "Conversión realizada correctamente",
        montoOrigen,
        montoDestino,
        tasaCambio,
    });
}

export const currencyConversionController = {
    create,
};
