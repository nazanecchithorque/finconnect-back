import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { accionTransactionTable } from "../schemas/accionTransaction.schema";

const select = createSelectSchema(accionTransactionTable);
const insert = createInsertSchema(accionTransactionTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    precioUnitario: true,
    monto: true
});
const update = insert.partial();
const filter = createFilterSchema(accionTransactionTable)
    .extend({ cuentaIds: z.array(z.number()).optional() })
    .partial();
const pk = createPkSchema(accionTransactionTable).pick({
    id: true
});

export const accionTransactionValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
