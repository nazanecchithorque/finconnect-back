import { seedUsuarios } from "./usuarios.seed";
import { seedCuentas } from "./cuentas.seed";
import { seedCriptomonedas } from "./criptomonedas.seed";
import { seedAcciones } from "./acciones.seed";
import { seedEmpresasServicio } from "./empresas_servicio.seed";
import { seedFacturas } from "./facturas.seed";
import { seedPagosServicios } from "./pagos_servicios.seed";
import { seedTransferencias } from "./transferencias.seed";
import { seedTarjetas } from "./tarjetas.seed";
import { db } from "../src/db";
import { getTableName } from "drizzle-orm";

export async function resetIdentity(table: any) {
    const tableName = getTableName(table)
    await db.execute(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
}

async function main() {
    await seedUsuarios();
    await seedCuentas();
    await seedCriptomonedas();
    await seedAcciones();
    await seedEmpresasServicio();
    await seedFacturas();
    await seedPagosServicios();
    await seedTransferencias();
    await seedTarjetas();
    process.exit(0);
}

main().catch((error) => {
    console.error("Error ejecutando seeds:", error);
    process.exit(1);
});
