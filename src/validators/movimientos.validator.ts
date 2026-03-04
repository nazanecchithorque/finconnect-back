import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { movimientosTable } from "../schemas/movimientos.schema";

const select = createSelectSchema(movimientosTable);
const insert = createInsertSchema(movimientosTable);
const update = insert.partial();
const filter = createFilterSchema(movimientosTable).partial();
const pk = createPkSchema(movimientosTable).pick({
    id: true
});

type Movimientos = z.infer<typeof select>;
type MovimientosInsert = z.infer<typeof insert>;
type MovimientosUpdate = z.infer<typeof update>;
type MovimientosFilter = z.infer<typeof filter>;
type MovimientosPk = z.infer<typeof pk>;

export const movimientosValidator = {
    select,
    insert,
    update,
    filter,
    pk
};