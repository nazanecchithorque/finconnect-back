import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { usuariosTable } from "../schemas/usuarios.schema";

const select = createSelectSchema(usuariosTable).omit({
    passwordHash: true,
    createdAt: true,
    deletedAt: true
});
const insert = createInsertSchema(usuariosTable).omit({
    passwordHash: true,
    activo: true,
}).extend({
    password: z.string().min(8),
});
const update = insert.partial();
const filter = createFilterSchema(usuariosTable)

.partial();
const pk = createPkSchema(usuariosTable).pick({
    id: true
});

/** Perfil del usuario autenticado (PATCH /usuarios/me). */
const patchMe = z
    .object({
        nombre: z.string().min(1).max(100).optional(),
        apellido: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
        genero: z.enum(["masculino", "femenino", "otro"]).optional(),
        idioma: z.string().min(2).max(10).optional(),
        temaAplicacion: z.enum(["light", "dark", "system"]).optional(),
        password: z.string().min(8).optional(),
        currentPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.password != null && !data.currentPassword?.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Se requiere la contraseña actual para cambiarla",
                path: ["currentPassword"],
            });
        }
    });

type Usuarios = z.infer<typeof select>;
type UsuariosInsert = z.infer<typeof insert>;
type UsuariosUpdate = z.infer<typeof update>;
type UsuariosFilter = z.infer<typeof filter>;
type UsuariosPk = z.infer<typeof pk>;

export const usuariosValidator = {
    select,
    insert,
    update,
    filter,
    pk,
    patchMe,
};