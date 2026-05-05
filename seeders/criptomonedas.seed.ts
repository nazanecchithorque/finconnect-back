import { db } from "../src/db";
import { resetIdentity } from ".";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import {
    criptomonedasTable,
    tipoCriptomonedaKeys,
    tipoCriptomoneda,
} from "../src/schemas/criptomonedas.schema";
import { userRoles } from "../src/schemas/usuarios.schema";

type CriptomonedaInsert = InferInsertModel<typeof criptomonedasTable>;

function saldoCriptoSimulado(tipo: (typeof tipoCriptomoneda)[keyof typeof tipoCriptomoneda]): string {
    const r = Math.random;
    switch (tipo) {
        case "bitcoin":
            return (r() * 0.042 + 0.001).toFixed(8);
        case "ethereum":
            return (r() * 1.8 + 0.02).toFixed(6);
        case "usdt":
            return (r() * 4_000 + 120).toFixed(2);
        case "solana":
            return (r() * 42 + 1).toFixed(4);
        case "dogecoin":
            return (r() * 8000 + 100).toFixed(2);
        default:
            return (r() * 200 + 5).toFixed(4);
    }
}

export async function seedCriptomonedas() {
    await resetIdentity(criptomonedasTable);
    const usuariosDb = await db.select().from(usuariosTable);

    const criptomonedasSeed: CriptomonedaInsert[] = [];

    for (const usuario of usuariosDb) {
        if (usuario.role !== userRoles.finalUser) continue;
        for (const tipoCriptomoneda of tipoCriptomonedaKeys) {
            criptomonedasSeed.push({
                usuarioId: usuario.id,
                tipoCriptomoneda,
                monto: saldoCriptoSimulado(tipoCriptomoneda),
            });
        }
    }

    if (criptomonedasSeed.length > 0) {
        await db.insert(criptomonedasTable).values(criptomonedasSeed);
    }
}
