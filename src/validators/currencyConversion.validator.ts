import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createFilterSchema, createPkSchema } from "bradb";
import { z } from "zod";
import { currencyConversionTable } from "../schemas/currencyConversion.schema";

const select = createSelectSchema(currencyConversionTable);
const insert = createInsertSchema(currencyConversionTable).omit({
    id: true,
    montoDestino: true,
    tasaCambio: true,
    createdAt: true,
});
const update = insert.partial();
const filter = createFilterSchema(currencyConversionTable).partial();
const pk = createPkSchema(currencyConversionTable).pick({ id: true });

export const currencyConversionValidator = {
    select,
    insert,
    update,
    filter,
    pk,
};
