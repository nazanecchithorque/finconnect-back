import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { tarjetasTable } from "../schemas/tarjetas.schema";

const select = createSelectSchema(tarjetasTable);
const insert = createInsertSchema(tarjetasTable).omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    tipo: true,
    estado: true,
    fechaEmision: true,
    fechaVencimiento: true,
    ultimos4: true,
    marca: true
});
const update = insert.partial();
const filter = createFilterSchema(tarjetasTable).partial();
const pk = createPkSchema(tarjetasTable).pick({
    id: true
});

type Tarjetas = z.infer<typeof select>;
type TarjetasInsert = z.infer<typeof insert>;
type TarjetasUpdate = z.infer<typeof update>;
type TarjetasFilter = z.infer<typeof filter>;
type TarjetasPk = z.infer<typeof pk>;

export const tarjetasValidator = {
    select,
    insert,
    update,
    filter,
    pk
};
