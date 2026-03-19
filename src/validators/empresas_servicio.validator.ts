import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { empresasServicioTable } from "../schemas/empresas_servicio.schema";

const select = createSelectSchema(empresasServicioTable);
const insert = createInsertSchema(empresasServicioTable).omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true
});
const update = insert.partial();
const filter = createFilterSchema(empresasServicioTable).partial();
const pk = createPkSchema(empresasServicioTable).pick({
    id: true
});

type EmpresasServicio = z.infer<typeof select>;
type EmpresasServicioInsert = z.infer<typeof insert>;
type EmpresasServicioUpdate = z.infer<typeof update>;
type EmpresasServicioFilter = z.infer<typeof filter>;
type EmpresasServicioPk = z.infer<typeof pk>;

export const empresasServicioValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
