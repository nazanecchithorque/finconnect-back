import { FilterMap } from "bradb";
import { clientTable } from "../schemas/client.schema";
import { eq, ilike } from "drizzle-orm";
import { clientFilterSchema } from "@/validators/client.validator";

export const clientFilterMap: FilterMap<typeof clientFilterSchema> = {
    name: (val) => ilike(clientTable.name, `%${val}%`),
    email: (val) => ilike(clientTable.email, `%${val}%`),
    role: (val) => eq(clientTable.role, val)
};
