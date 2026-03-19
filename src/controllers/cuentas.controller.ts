import { Request, Response } from "express";
import { newPagination } from "bradb";
import { cuentasService } from "../services/cuentas.service"
import { cuentasValidator } from "../validators/cuentas.validator";
import { NotFoundError } from "@/errors/http.error";
import { userRoles } from "@/schemas/usuarios.schema";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = cuentasValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        (baseFilters as Record<string, unknown>).usuarioId = res.locals.user.id;
    }
    const items = await cuentasService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}

async function searchByAliasOCvu(req: Request, res: Response) {
    const data = cuentasValidator.searchByAliasOrCvueltas.parse(req.query);
    const [item] = await cuentasService.findAllExtraData(
        {
            search: data.search
        }
    );
    if(!item) {
        throw new NotFoundError("Cuenta no encontrada");
    }

    res.json(item);
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
    remove,
    searchByAliasOCvu
};