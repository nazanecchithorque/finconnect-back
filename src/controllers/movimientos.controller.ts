import { Request, Response } from "express";
import { newPagination } from "bradb";
import { movimientosService } from "../services/movimientos.service"
import { movimientosValidator } from "../validators/movimientos.validator";
import { userRoles } from "@/schemas/usuarios.schema";

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
    res.json(item);
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