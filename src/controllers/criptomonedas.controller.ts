import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getCriptoPreciosPorTipo, type ConvertOption } from "@/lib/criptomonedas";

const convertSchema = z
    .enum(["ars", "eur", "usd", "jpy", "brl", "gbp"])
    .transform((val) => val.toUpperCase() as ConvertOption);

export const criptomonedasController = {
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
