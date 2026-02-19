import { z } from "zod";

/*
    Campos que pone el usuario: nombre, apellido, email, password. (VAN EN EL VALIDATOR)

    Campos que pone el back: id, fechaRegistro, deletedAt (NO VAN EN EL VALIDATOR)

    Campos de estado interno: activo (PUEDE IR)
*/

// esquema del usuario ya sea CREATE, UPDATE, FILTER
export const usuariosSchema = z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    email: z.string().email(),
    dni: z.string(),
    genero: z.enum(["masculino", "femenino", "otro"])
});

/* el CREATE esta solo en AUTH
// para el POST /usuarios
export const usuariosCreateSchema = usuariosSchema.extend({
    password: z.string().min(8)
});
*/

// para el GET /usuarios
export const usuariosFilterSchema = usuariosSchema
    .extend({
        activo: z.number().int()
    })
    .partial();

// para el PUT-PATCH /usuarios
export const usuariosUpdateSchema = usuariosSchema.partial(); //todos los campos son opcionales
