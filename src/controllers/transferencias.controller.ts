import { Request, Response } from "express";
import { Forbidden, newPagination, NotFound } from "bradb";
import { transferenciasService } from "../services/transferencias.service"
import { transferenciasValidator } from "../validators/transferencias.validator";
import { estadoTransferencia } from "@/schemas/transferencias.schema";
import { db } from "@/db";
import { cuentasService } from "@/services/cuentas.service";
import { movimientosService } from "@/services/movimientos.service";
import { sentidoMovimiento, tipoOperacion } from "@/schemas/movimientos.schema";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = transferenciasValidator.filter.parse(req.query);
    const items = await transferenciasService.findAll(filters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function getOne(req: Request, res: Response) {
    const pk = transferenciasValidator.pk.parse(req.params);
    const item = await transferenciasService.findOne(pk);
    res.json(item);
}

async function create(req: Request, res: Response) {
    const data = transferenciasValidator.insert.parse(req.body);
    const usuario = res.locals.user;
    const cuentaOrigen = await cuentasService.findOne({ id: data.cuentaOrigenId });
    if(!cuentaOrigen.activo) {
        throw new Forbidden("Tu cuenta no esta activa");
    }
    console.log(cuentaOrigen.usuarioId, usuario.id);
    if(Number(cuentaOrigen.usuarioId) !== Number(usuario.id)) {
        throw new Forbidden("No tenes permisos para crear transferencias en esta cuenta");
    }
    const cuentaDestino = await cuentasService.findOne({ id: data.cuentaDestinoId });
    if(!cuentaDestino.activo) {
        throw new Forbidden("La cuenta destino no esta activa");
    }
    if(Number(cuentaDestino.usuarioId) === Number(usuario.id)) {
        throw new Forbidden("No podes transferir a tu misma cuenta");
    }
    if(cuentaDestino.moneda !== cuentaOrigen.moneda) {
        throw new Forbidden("No podes transferir a una cuenta de diferente moneda");
    }
    if(cuentaDestino.saldo < data.monto) {
        throw new Forbidden("No tenes suficiente saldo en tu cuenta");
    }
    db.transaction(async (tx) => {
        const transferencia = await transferenciasService.create({
            ...data,
            estado: estadoTransferencia.completada
        }, tx);
        await movimientosService.create({
            cuentaId: cuentaOrigen.id,
            tipoOperacion: tipoOperacion.transferencia,
            sentido: sentidoMovimiento.egreso,
            referenciaId: transferencia.id,
            monto: data.monto,
            descripcion: `Transferencia a ${cuentaDestino.alias}`,
            saldoPosterior: (Number(cuentaOrigen.saldo) - Number(data.monto)).toString()
        }, tx);
        await movimientosService.create({
            cuentaId: cuentaDestino.id,
            tipoOperacion: tipoOperacion.transferencia,
            sentido: sentidoMovimiento.ingreso,
            referenciaId: transferencia.id,
            monto: data.monto,
            descripcion: `Transferencia desde ${cuentaOrigen.alias}`,
            saldoPosterior: (Number(cuentaDestino.saldo) + Number(data.monto)).toString()
        }, tx);
        res.status(201).json(transferencia);
    });
}

async function update(req: Request, res: Response) {
    const pk = transferenciasValidator.pk.parse(req.params);
    const data = transferenciasValidator.update.parse(req.body);
    const item = await transferenciasService.update(pk, data);
    res.status(200).json(item);
}

export const transferenciasController = {
    getAll,
    getOne,
    create,
    update,
};