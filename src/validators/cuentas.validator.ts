import { z } from "zod";

export const cuentasSchema = z.object({
    usuarioId: z.number().int(),
    cvu: z.string(),
    alias: z.string(),
    moneda: z.enum(["ARS", "USD", "EUR", "BRL"]),
    saldo: z.string(),
    activa: z.boolean()
});

// para GET /cuentas
export const cuentasFilterSchema = cuentasSchema
    .pick({
        usuarioId: true,
        moneda: true,
        activa: true
    })
    .partial();

// para UPDATE
export const cuentasUpdateSchema = cuentasSchema.partial();
