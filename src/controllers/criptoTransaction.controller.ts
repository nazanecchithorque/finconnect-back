import { Request, Response } from "express";
import { Forbidden, newPagination } from "bradb";
import { criptoTransactionService } from "../services/criptoTransaction.service"
import {
	criptoTransactionValidator
	} from "../validators/criptoTransaction.validator";
import { ConvertOption, criptoSiglasMap, getCriptoPreciosPorTipo } from "@/lib/criptomonedas";
import { cuentasService } from "@/services/cuentas.service";
import { BadRequestError, NotFoundError } from "@/errors/http.error";
import { criptomonedasService } from "@/services/criptomonedas.service";
import { db } from "@/db";
import { movimientosService } from "@/services/movimientos.service";
import { sentidoMovimiento, tipoOperacion } from "@/schemas/movimientos.schema";
import { userRoles } from "@/schemas/usuarios.schema";
import { cuentasTable } from "@/schemas/cuentas.schema";
import { eq } from "drizzle-orm";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = criptoTransactionValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        const cuentas = await db.select({ id: cuentasTable.id }).from(cuentasTable).where(eq(cuentasTable.usuarioId, res.locals.user.id));
        (baseFilters as Record<string, unknown>).cuentaIds = cuentas.map((c) => c.id);
    }
    const items = await criptoTransactionService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function getOne(req: Request, res: Response) {
    const pk = criptoTransactionValidator.pk.parse(req.params);
    const item = await criptoTransactionService.findOne(pk);
    res.json(item);
}

async function create(req: Request, res: Response) {
    const data = criptoTransactionValidator.insert.parse(req.body);
    const cuenta = await cuentasService.findOne({ id: data.cuentaId });
    if (!cuenta) {
        throw new NotFoundError("Cuenta no encontrada");
    }
    if(cuenta.usuarioId !== parseInt(res.locals.user.id)) {
        throw new Forbidden("No tienes permiso para crear una transacción en esta cuenta");
    }
    const precioUnitario = await getCriptoPreciosPorTipo(cuenta.moneda);
    const cripto = criptoSiglasMap[data.tipoCriptomoneda];
    if (!cripto) {
        throw new NotFoundError("Criptomoneda no encontrada");
    }
    const precio = precioUnitario.find(
        (p) => p.symbol === cripto
    );
    if (!precio) {
        throw new NotFoundError("Precio de criptomoneda no encontrado");
    }
    const cajasCripto = await criptomonedasService.findAll({ usuarioId: res.locals.user.id, tipoCriptomoneda: data.tipoCriptomoneda })
    if(cajasCripto.length == 0){
        throw new NotFoundError("Caja no encontrada");
    }
    const cajaCripto = cajasCripto[0];

    if(data.sentido === "ingreso") {
        await db.transaction(async (tx) => {
            if(parseFloat(cajaCripto.monto) < parseFloat(data.cantidad)){
                throw new BadRequestError("Saldo insuficiente en la caja");
            }
            const criptoTransaction = await criptoTransactionService.create({
                ...data,
                precioUnitario: precio.price.toString(),
                monto: (parseFloat(data.cantidad) * precio.price).toString()
            }, tx);
            await criptomonedasService.update({ usuarioId: res.locals.user.id, tipoCriptomoneda: data.tipoCriptomoneda }, {monto: (parseFloat(cajaCripto.monto) - parseFloat(data.cantidad)).toString()}, tx);
            await cuentasService.update({ id: cuenta.id }, {saldo: (parseFloat(cuenta.saldo) + parseFloat((parseFloat(data.cantidad) * precio.price).toString())).toString()}, tx);
            await movimientosService.create({
                cuentaId: cuenta.id,
                tipoOperacion: tipoOperacion.cripto,
                sentido: sentidoMovimiento.ingreso,
                referenciaId: criptoTransaction.id,
                monto: criptoTransaction.monto,
                descripcion: `Venta de ${data.tipoCriptomoneda}`,
                saldoPosterior: (parseFloat(cuenta.saldo) + parseFloat((parseFloat(data.cantidad) * precio.price).toString())).toString()
            }, tx);
        });
    } else {
        await db.transaction(async (tx) => {
            if(parseFloat(cuenta.saldo) < parseFloat(data.cantidad) * precio.price){
                throw new BadRequestError("Saldo insuficiente en la cuenta");
            }
            const criptoTransaction = await criptoTransactionService.create({
                ...data,
                precioUnitario: precio.price.toString(),
                monto: (parseFloat(data.cantidad) * precio.price).toString()
            }, tx);
            await criptomonedasService.update({ usuarioId: res.locals.user.id, tipoCriptomoneda: data.tipoCriptomoneda }, {monto: (parseFloat(cajaCripto.monto) + parseFloat(data.cantidad)).toString()}, tx);
            await cuentasService.update({ id: cuenta.id }, {saldo: (parseFloat(cuenta.saldo) - parseFloat((parseFloat(data.cantidad) * precio.price).toString())).toString()}, tx);
            await movimientosService.create({
                cuentaId: cuenta.id,
                tipoOperacion: tipoOperacion.cripto,
                sentido: sentidoMovimiento.egreso,
                referenciaId: criptoTransaction.id,
                monto: criptoTransaction.monto,
                descripcion: `Compra de ${data.tipoCriptomoneda}`,
                saldoPosterior: (parseFloat(cuenta.saldo) - parseFloat((parseFloat(data.cantidad) * precio.price).toString())).toString()
            }, tx);
        });
    }
    res.status(204).send();
}

async function update(req: Request, res: Response) {
    const pk = criptoTransactionValidator.pk.parse(req.params);
    const data = criptoTransactionValidator.update.parse(req.body);
    const item = await criptoTransactionService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = criptoTransactionValidator.pk.parse(req.params);
    await criptoTransactionService.delete(pk);
    res.status(204).send();
}

export const criptoTransactionController = {
    getAll,
    getOne,
    create,
    update,
    remove
};