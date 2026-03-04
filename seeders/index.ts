import { seedUsuarios } from "./usuarios.seed";
import { seedCuentas } from "./cuentas.seed";
import { seedTransferencias } from "./transferencias.seed";
import { db } from "../src/db";
import { getTableName, sql } from "drizzle-orm";
import { reset } from "drizzle-seed";

export async function resetIdentity(table: any) {
    const tableName = getTableName(table)
    await db.execute(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
}

async function main() {

    await seedUsuarios();
    await seedCuentas();
    await seedTransferencias();
    process.exit(0);
}

main().catch((error) => {
    console.error("Error ejecutando seeds:", error);
    process.exit(1);
});
