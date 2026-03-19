import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getCriptoPreciosPorTipo, type ConvertOption } from "@/lib/criptomonedas";
import { userRoles } from "@/schemas/usuarios.schema";
import { newPagination } from "bradb";
import { criptomonedasValidator } from "@/validators/criptomonedas.validator";
import { criptomonedasService } from "@/services/criptomonedas.service";

const convertSchema = z
    .enum(["ars", "eur", "usd", "jpy", "brl", "gbp"])
    .transform((val) => val.toUpperCase() as ConvertOption);


    async function getAll(req: Request, res: Response) {
    const pagination = newPagination(req.query);
    const filters = criptomonedasValidator.filter.parse(req.query);
    const baseFilters = { ...filters };
    if (res.locals.user.role === userRoles.finalUser) {
        (baseFilters as Record<string, unknown>).usuarioId = res.locals.user.id;
    }
    const items = await criptomonedasService.findAll(baseFilters, pagination);

    res.json({
        pagination,
        items,
        total: pagination.total // this is going to be removed
    });
}
export const criptomonedasController = {
    getAll,
    async getCriptoPrices(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = req.query.convert;
            const convert = convertSchema.parse(
                (typeof raw === "string" ? raw : "ars").toLowerCase()
            );
            const precios = await getCriptoPreciosPorTipo(convert);
            return res.json(precios);
        } catch (error) {
            next(error);
        }
    }
};
