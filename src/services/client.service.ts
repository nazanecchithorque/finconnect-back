import { clientTable } from "../schemas/client.schema";
import { clientFilterMap } from "../filters/client.filter";
import { db } from "../db";
import { eq, InferInsertModel } from "drizzle-orm";
import bcrypt from "bcrypt";

import { ServiceBuilder, NotFound } from "bradb";

const builder = new ServiceBuilder(db, clientTable, clientFilterMap);

const baseCreate = builder.create();
export const clientService = {
    create: async (data: InferInsertModel<typeof clientTable>) => {
        data.password = await bcrypt.hash(data.password, 10);
        return baseCreate(data);
    },
    update: builder.update(),
    count: builder.count(),
    delete: builder.softDelete(),
    findAll: builder.findAll(
        db
            .select({
                id: clientTable.id,
                name: clientTable.name,
                email: clientTable.email
            })
            .from(clientTable)
            .$dynamic()
    ),
    findOne: builder.findOne(db.select().from(clientTable).$dynamic()),
    findByEmail: findByEmail
};

async function findByEmail(email: string) {
    const [res] = await db
        .select()
        .from(clientTable)
        .where(eq(clientTable.email, email));

    if (!res) {
        throw new NotFound("no se encontro a un wachin con este email");
    }
    return res;
}
