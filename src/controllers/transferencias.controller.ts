import { Request, Response } from "express";
import { newPagination } from "bradb";
import { transferenciasService } from "../services/transferencias.service"
import { transferenciasValidator } from "../validators/transferencias.validator";

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
    const item = await transferenciasService.create(data);
    res.status(201).json(item);
}

async function update(req: Request, res: Response) {
    const pk = transferenciasValidator.pk.parse(req.params);
    const data = transferenciasValidator.update.parse(req.body);
    const item = await transferenciasService.update(pk, data);
    res.status(200).json(item);
}

async function remove(req: Request, res: Response) {
    const pk = transferenciasValidator.pk.parse(req.params);
    await transferenciasService.delete(pk);
    res.status(204).send();
}

export const transferenciasController = {
    getAll,
    getOne,
    create,
    update,
    remove
};