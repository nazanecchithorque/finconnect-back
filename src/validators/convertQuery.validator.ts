import { z } from "zod";
import type { ConvertOption } from "@/lib/criptomonedas";

/** Query `convert` compartido por cotizaciones (cripto, fiat, acciones). */
export const convertQuerySchema = z
    .enum(["ars", "eur", "usd", "jpy", "brl", "gbp"])
    .transform((val) => val.toUpperCase() as ConvertOption);

export function parseConvertQuery(raw: unknown): ConvertOption {
    return convertQuerySchema.parse(
        (typeof raw === "string" ? raw : "ars").toLowerCase()
    );
}
