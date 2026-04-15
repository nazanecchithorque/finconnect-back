import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { accionesTable } from "../schemas/acciones.schema";

const select = createSelectSchema(accionesTable);
const insert = createInsertSchema(accionesTable);
const update = insert.partial();
const filter = createFilterSchema(accionesTable).partial();
const pk = createPkSchema(accionesTable).pick({
    usuarioId: true,
    tipoAccion: true
});

export const accionesValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
