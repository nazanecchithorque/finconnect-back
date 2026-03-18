import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { usuariosTable } from "../schemas/usuarios.schema";
import { strToNumber } from "./util";

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
    pk
};