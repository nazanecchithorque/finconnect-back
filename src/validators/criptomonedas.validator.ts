import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { criptomonedasTable } from "../schemas/criptomonedas.schema";

const select = createSelectSchema(criptomonedasTable);
const insert = createInsertSchema(criptomonedasTable);
const update = insert.partial();
const filter = createFilterSchema(criptomonedasTable).partial();
const pk = createPkSchema(criptomonedasTable).pick({
    usuarioId: true,
	tipoCriptomoneda: true
});

type Criptomonedas = z.infer<typeof select>;
type CriptomonedasInsert = z.infer<typeof insert>;
type CriptomonedasUpdate = z.infer<typeof update>;
type CriptomonedasFilter = z.infer<typeof filter>;
type CriptomonedasPk = z.infer<typeof pk>;

export const criptomonedasValidator = {
    select,
    insert,
    update,
    filter,
    pk
};