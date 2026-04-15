import { Request, Response, NextFunction } from "express";
import { newPagination } from "bradb";
import { getAccionPreciosPorTipo } from "@/lib/acciones";
import { userRoles } from "@/schemas/usuarios.schema";
import { accionesValidator } from "@/validators/acciones.validator";
import { accionesService } from "@/services/acciones.service";
import { parseConvertQuery } from "@/validators/convertQuery.validator";

async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = accionesValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        (baseFilters as Record<string, unknown>).usuarioId = res.locals.user.id;
    }
    const items = await accionesService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total
    });
}

export const accionesController = {
    getAll,
    async getAccionPrices(req: Request, res: Response, next: NextFunction) {
        try {
            const convert = parseConvertQuery(req.query.convert);
            const precios = await getAccionPreciosPorTipo(convert);
            return res.json(precios);
        } catch (error) {
            next(error);
        }
    }
};
