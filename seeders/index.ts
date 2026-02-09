import { seedUsuarios } from "./usuarios.seed";

async function main() {
    await seedUsuarios();
    process.exit(0);
}

main().catch((error) => {
    console.error("Error ejecutando seeds:", error);
    process.exit(1);
});
