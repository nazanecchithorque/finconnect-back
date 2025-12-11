import { db } from "../src/db";
import { clientTable, clientRoles } from "../src/schemas/client.schema";
import { InferInsertModel } from "drizzle-orm";

export const clients: InferInsertModel<typeof clientTable>[] = [
    {
        name: "admin",
        email: "admin@gmail.com",
        password: "$2b$10$JsDdphcbVfXzAqn3k4ZCPeTLkp2kTF4001dzLfQONZjYEsNEpDIe.", // admin123
        role: clientRoles.admin,
    },
    {
        name: "freeuser",
        email: "free@gmail.com",
        password: "$2b$10$owWycWAgMJ.wmjMrJSgS6O6dhTXmDCFF//jXQlcfkQ3Y1KE0DrWmC", // enduser123
        role: clientRoles.free,
    },
    {
        name: "premiumuser",
        email: "premium@gmail.com",
        password: "$2b$10$owWycWAgMJ.wmjMrJSgS6O6dhTXmDCFF//jXQlcfkQ3Y1KE0DrWmC", // enduser123
        role: clientRoles.premium,
    },
]; 

export const seedClients = async () => {
    console.log("Seeding clients...");
    await db.insert(clientTable).values(clients);
    console.log("clients seeded successfully!");
};
