import { z } from "zod";
import { strToReal } from "./util";
import { estadoTransferenciaKeys } from "@/schemas/transferencias.schema";

export const transferenciasSchema = z.object({
    cuentaOrigenId: z.number().int(),
    cuentaDestinoId: z.number().int(),

    monto: strToReal().refine((val) => val > 0, {
        message: "El monto debe ser mayor a 0"
    }),

    estado: z.enum(estadoTransferenciaKeys)
});

// para GET /transferencias (filtros)
export const transferenciasFilterSchema = transferenciasSchema
    .pick({
        cuentaOrigenId: true,
        cuentaDestinoId: true,
        estado: true
    })
    .partial();

// para UPDATE /transferencias
export const transferenciasUpdateSchema = transferenciasSchema.partial();

