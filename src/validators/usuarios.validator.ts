import { z } from "zod";

export const usuariosCreateSchema = z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    email: z.string().email(),
    passwordHash: z.string().min(8)
});

export const usuariosUpdateSchema = usuariosCreateSchema.partial();

/**
 * ESTE ES OBLIGATORIO PARA BRAD
 */
export const usuariosFilterSchema = z.object({
    email: z.string().optional(),
    activo: z.number().optional()
});
