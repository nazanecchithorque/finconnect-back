import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { facturasTable } from "../schemas/facturas.schema";

const select = createSelectSchema(facturasTable);
const insert = createInsertSchema(facturasTable).omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true
});
const update = insert.partial();
const filter = createFilterSchema(facturasTable).partial();
const pk = createPkSchema(facturasTable).pick({
    id: true
});

type Facturas = z.infer<typeof select>;
type FacturasInsert = z.infer<typeof insert>;
type FacturasUpdate = z.infer<typeof update>;
type FacturasFilter = z.infer<typeof filter>;
type FacturasPk = z.infer<typeof pk>;

export const facturasValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
