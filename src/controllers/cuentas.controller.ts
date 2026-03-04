import { Request, Response } from "express";
import { newPagination } from "bradb";
import { cuentasService } from "../services/cuentas.service"
import { cuentasValidator } from "../validators/cuentas.validator";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = cuentasValidator.filter.parse(req.query);
    const items = await cuentasService.findAll(
        {
            ...filters,
            usuarioId: res.locals.user.id
        }, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function getOne(req: Request, res: Response) {
    const pk = cuentasValidator.pk.parse(req.params);
    const item = await cuentasService.findOne(pk);
    res.json(item);
}

async function update(req: Request, res: Response) {
    const pk = cuentasValidator.pk.parse(req.params);
    const data = cuentasValidator.update.parse(req.body);
    const item = await cuentasService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = cuentasValidator.pk.parse(req.params);
    await cuentasService.delete(pk);
    res.status(204).send();
}

export const cuentasController = {
    getAll,
    getOne,
    update,
    remove
};