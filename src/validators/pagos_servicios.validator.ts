import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { pagosServiciosTable } from "../schemas/pagos_servicios.schema";

const select = createSelectSchema(pagosServiciosTable);
const insert = createInsertSchema(pagosServiciosTable).omit({
    createdAt: true
});
const update = insert.partial();
const filter = createFilterSchema(pagosServiciosTable).partial();
const pk = createPkSchema(pagosServiciosTable).pick({
    id: true
});

type PagosServicios = z.infer<typeof select>;
type PagosServiciosInsert = z.infer<typeof insert>;
type PagosServiciosUpdate = z.infer<typeof update>;
type PagosServiciosFilter = z.infer<typeof filter>;
type PagosServiciosPk = z.infer<typeof pk>;

export const pagosServiciosValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
