import { z } from "zod";
import { strToReal } from "./util";
import { sentidoMovimientoKeys, tipoOperacionKeys } from "@/schemas/movimientos.schema";

export const movimientosSchema = z.object({
    cuentaId: z.number().int(),

    tipoOperacion: z.enum(tipoOperacionKeys),

    referenciaId: z.number().int().optional(),

    sentido: z.enum(sentidoMovimientoKeys),

    monto: strToReal().refine((val) => val > 0, {
        message: "El monto debe ser mayor a 0"
    }),

    descripcion: z.string().max(255).optional()
});

// para GET /movimientos (filtros)
export const movimientosFilterSchema = movimientosSchema
    .pick({
        cuentaId: true,
        tipoOperacion: true,
        sentido: true
    })
    .partial();

// para UPDATE /movimientos
export const movimientosUpdateSchema = movimientosSchema.partial();

