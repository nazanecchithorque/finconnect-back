import { seedUsuarios } from "./usuarios.seed";
import { seedCuentas } from "./cuentas.seed";
import { seedTransferencias } from "./transferencias.seed";

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
