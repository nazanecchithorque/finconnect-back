import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { criptoTransactionTable } from "../schemas/criptoTransaction.schema";

const select = createSelectSchema(criptoTransactionTable);
const insert = createInsertSchema(criptoTransactionTable)
.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    precioUnitario: true,
    monto: true,
});
const update = insert.partial();
const filter = createFilterSchema(criptoTransactionTable)
    .extend({ cuentaIds: z.array(z.number()).optional() })
    .partial();
const pk = createPkSchema(criptoTransactionTable).pick({
    id: true
});

type CriptoTransaction = z.infer<typeof select>;
type CriptoTransactionInsert = z.infer<typeof insert>;
type CriptoTransactionUpdate = z.infer<typeof update>;
type CriptoTransactionFilter = z.infer<typeof filter>;
type CriptoTransactionPk = z.infer<typeof pk>;

export const criptoTransactionValidator = {
    select,
    insert,
    update,
    filter,
    pk
};