import { Request, Response, NextFunction } from "express";
import { getExchangeRates } from "@/lib/frankfurter";
import { getMonedaPreciosPorTipo } from "@/lib/monedas";
import { parseConvertQuery } from "@/validators/convertQuery.validator";
import { z } from "zod";

const querySchema = z.object({
    from: z.string().min(1, "from es requerido"),
    amount: z
        .string()
        .optional()
        .transform((v) => (v ? parseFloat(v) : 1))
        .refine((v) => !isNaN(v) && v > 0, "amount debe ser un número positivo"),
});

async function convert(req: Request, res: Response) {
    const { from, amount } = querySchema.parse(req.query);
    const result = await getExchangeRates(from, amount);
    res.json(result);
}

async function getMonedaPrices(req: Request, res: Response, next: NextFunction) {
    try {
        const convert = parseConvertQuery(req.query.convert);
        const precios = await getMonedaPreciosPorTipo(convert);
        return res.json(precios);
    } catch (error) {
        next(error);
    }
}

export const currenciesController = {
    convert,
    getMonedaPrices,
};
