import { Request, Response } from "express";
import { Forbidden, newPagination, NotFound } from "bradb";
import { movimientosService } from "../services/movimientos.service"
import { movimientosValidator } from "../validators/movimientos.validator";
import { userRoles } from "@/schemas/usuarios.schema";
import { cuentasService } from "@/services/cuentas.service";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = movimientosValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        (baseFilters as Record<string, unknown>).usuarioId = res.locals.user.id;
    }
    const items = await movimientosService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function getOne(req: Request, res: Response) {
    const pk = movimientosValidator.pk.parse(req.params);
    const item = await movimientosService.findOne(pk);
    if (!item) {
        throw new NotFound("Movimiento no encontrado");
    }
    const cuenta = await cuentasService.findOne({ id: item.cuentaId });
    if (!cuenta) {
        throw new NotFound("Movimiento no encontrado");
    }
    if (res.locals.user.role === userRoles.finalUser) {
        if (Number(cuenta.usuarioId) !== Number(res.locals.user.id)) {
            throw new Forbidden("No tenés permiso para ver este movimiento");
        }
    }
    res.json({
        ...item,
        moneda: cuenta.moneda,
        cuentaAlias: cuenta.alias,
    });
}


async function create(req: Request, res: Response) {
    const data = movimientosValidator.insert.parse(req.body);
    const item = await movimientosService.create(data);
    res.status(201).json(item);
}

async function update(req: Request, res: Response) {
    const pk = movimientosValidator.pk.parse(req.params);
    const data = movimientosValidator.update.parse(req.body);
    const item = await movimientosService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = movimientosValidator.pk.parse(req.params);
    await movimientosService.delete(pk);
    res.status(204).send();
}

export const movimientosController = {
    getAll,
    getOne,
    create,
    update,
    remove
};