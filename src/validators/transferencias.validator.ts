import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { transferenciasTable } from "../schemas/transferencias.schema";

const select = createSelectSchema(transferenciasTable);
const insert = createInsertSchema(transferenciasTable)
.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    estado: true,
});
const update = insert.partial();
const filter = createFilterSchema(transferenciasTable)
    .extend({ cuentaIds: z.array(z.number()).optional() })
    .partial();
const pk = createPkSchema(transferenciasTable).pick({
    id: true
});

type Transferencias = z.infer<typeof select>;
type TransferenciasInsert = z.infer<typeof insert>;
type TransferenciasUpdate = z.infer<typeof update>;
type TransferenciasFilter = z.infer<typeof filter>;
type TransferenciasPk = z.infer<typeof pk>;

export const transferenciasValidator = {
    select,
    insert,
    update,
    filter,
    pk
};