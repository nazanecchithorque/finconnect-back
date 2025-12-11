import { reset } from "drizzle-seed";
import { clientTable } from "../src/schemas/client.schema";
import { productTable } from "../src/schemas/product.schema";
import { seedClients } from "./client.seeder";
import { seedProducts } from "./products.seeder";
import { db } from "../src/db";
import { getTableName } from "drizzle-orm";

async function main() {
    await reset(db, { clientTable });
    await reset(db, { productTable });

    await resetIdentity(getTableName(clientTable));
    await resetIdentity(getTableName(productTable));

    await seedClients();
    await seedProducts();
}

export async function resetIdentity(tableName: string) {
    await db.execute(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
}

main().then(() => console.log("seed"));
