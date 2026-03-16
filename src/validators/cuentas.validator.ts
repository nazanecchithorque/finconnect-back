import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { cuentasTable } from "../schemas/cuentas.schema";

const select = createSelectSchema(cuentasTable);
const insert = createInsertSchema(cuentasTable);
const update = insert.partial();
const filter = createFilterSchema(cuentasTable)
.extend({
    search: z.string(),
})
.partial();
const pk = createPkSchema(cuentasTable).pick({
    id: true
});
const searchByAliasOrCvueltas = z.object({
    search: z.string(),
});

type Cuentas = z.infer<typeof select>;
type CuentasInsert = z.infer<typeof insert>;
type CuentasUpdate = z.infer<typeof update>;
type CuentasFilter = z.infer<typeof filter>;
type CuentasPk = z.infer<typeof pk>;

export const cuentasValidator = {
    select,
    insert,
    update,
    filter,
    searchByAliasOrCvueltas,
    pk
};